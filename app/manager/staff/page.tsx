"use client";

import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import Header from "../Header";
import { useAppUser } from "@/contexts/UserContext";

const onShiftColumns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Clocked in since", dataIndex: "since", key: "since" },
  { title: "Note", dataIndex: "note", key: "note", ellipsis: true },
];

type StaffMember = {
  id: number;
  name: string;
  role: string;
  shifts: {
    id: number;
    clockInTime: string;
    clockInLatitude: number;
    clockInLongitude: number;
    clockOutTime: string | null;
    clockOutLatitude: number | null;
    clockOutLongitude: number | null;
    clockInNote: string | null;
  }[];
};

export default function ManagerStaffPage() {
  const { appUser } = useAppUser();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  useEffect(() => {
    if (!appUser) return;

    (async () => {
      
      const organizationId = appUser.organizationId;

      const staffResponse = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query($organizationId: Int!) {
              usersByOrganization(organizationId: $organizationId) {
                id
                name
                role
                shifts {
                  id
                  clockInTime
                  clockInLatitude
                  clockInLongitude
                  clockOutTime
                  clockOutLatitude
                  clockOutLongitude
                  clockInNote
                }
              }
            }
          `,
          variables: { organizationId },
        }),
      });

      const staffResult = await staffResponse.json();

      if (staffResult.errors) {
        console.log(staffResult.errors);
        setLoading(false);
        return;
      }

      setStaff(staffResult.data.usersByOrganization ?? []);
      setLoading(false);
    })();
  }, [appUser]);

  const [timestamp] = useState(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return { oneWeekAgo };
  });

  const onShiftData = staff
    .map((person) => {
      const openShift = person.shifts.find((s) => !s.clockOutTime);

      if (!openShift) return null;
      
      return {
        key: person.id,
        name: person.name,
        since: new Date(Number(openShift.clockInTime)).toLocaleTimeString(),
        note: openShift.clockInNote || "—",
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const allStaffData = staff.map((person) => {
    const openShift = person.shifts.find((s) => !s.clockOutTime);

    const hoursThisWeek = person.shifts.reduce((total, shift) => {
      const clockIn = Number(shift.clockInTime);
      if (clockIn < timestamp.oneWeekAgo) return total;
      const clockOut = shift.clockOutTime ? Number(shift.clockOutTime) : Date.now();
      return total + (clockOut - clockIn) / (1000 * 60 * 60);
    }, 0);

    return {
      key: person.id,
      name: person.name,
      role: person.role === "CARE_WORKER" ? "Care Worker" : "Manager",
      status: openShift ? "on-shift" : "off-shift",
      hoursThisWeek: Math.round(hoursThisWeek),
    };
  });

  const allStaffColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "on-shift" ? "success" : "default"}>
          {status === "on-shift" ? "On shift" : "Off shift"}
        </Tag>
      ),
    },
    { title: "Hours this week", dataIndex: "hoursThisWeek", key: "hoursThisWeek", render: (h: number) => `${h}h` },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: { key: number }) => (
        <button
          onClick={() =>
            setExpandedKeys((prev) =>
              prev.includes(record.key) ? prev.filter((k) => k !== record.key) : [...prev, record.key]
            )
          }
          className="text-brand-primary font-inter font-medium text-sm"
        >
          {expandedKeys.includes(record.key) ? "Hide history" : "View history →"}
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="font-inter text-brand-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />

      <main className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl border border-brand-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping bg-brand-primary" />
              <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-brand-primary" />
            </span>
            <h2 className="font-jost text-base font-semibold text-brand-heading">
              Clocked in now
            </h2>
          </div>
          <Table
            columns={onShiftColumns}
            dataSource={onShiftData}
            pagination={false}
            className="font-inter"
            locale={{ emptyText: "No one is clocked in right now." }}
          />
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6">
          <h2 className="font-jost text-base font-semibold text-brand-heading mb-5">
            All staff
          </h2>
          <Table
            columns={allStaffColumns}
            dataSource={allStaffData}
            pagination={false}
            className="font-inter"
            locale={{ emptyText: "No care workers have joined yet." }}
            expandable={{
              expandedRowKeys: expandedKeys,
              onExpandedRowsChange: (keys) => setExpandedKeys(keys as number[]),
              showExpandColumn: false,
              expandedRowRender: (record) => {
                const person = staff.find((p) => p.id === record.key);
                if (!person) return null;

                if (person.shifts.length === 0) {
                  return <p className="text-sm text-brand-muted font-inter px-2">No shifts logged yet.</p>;
                }

                return (
                  <Table
                    size="small"
                    pagination={false}
                    columns={[
                      { title: "Clocked in", dataIndex: "clockIn", key: "clockIn" },
                      { title: "Clocked in at", dataIndex: "clockInLoc", key: "clockInLoc" },
                      { title: "Clocked out", dataIndex: "clockOut", key: "clockOut" },
                      { title: "Clocked out at", dataIndex: "clockOutLoc", key: "clockOutLoc" },
                      { title: "Note", dataIndex: "note", key: "note" },
                    ]}
                    dataSource={person.shifts.map((s) => ({
                      key: s.id,
                      clockIn: new Date(Number(s.clockInTime)).toLocaleString(),
                      clockInLoc: `${s.clockInLatitude.toFixed(4)}, ${s.clockInLongitude.toFixed(4)}`,
                      clockOut: s.clockOutTime ? new Date(Number(s.clockOutTime)).toLocaleString() : "—",
                      clockOutLoc:
                        s.clockOutLatitude != null
                          ? `${s.clockOutLatitude.toFixed(4)}, ${s.clockOutLongitude!.toFixed(4)}`
                          : "—",
                      note: s.clockInNote || "—",
                    }))}
                  />
                );
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}