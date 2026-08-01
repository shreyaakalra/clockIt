"use client";

import { useEffect, useState } from "react";
import Header from "../Header";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { useAppUser } from "@/contexts/UserContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type StaffMember = {
  id: number;
  name: string;
  shifts: {
    id: number;
    clockInTime: string;
    clockOutTime: string | null;
  }[];
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ManagerDashboard() {
  const { appUser } = useAppUser();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    if (!appUser) return;

    const getShifts = async () => {
      const orgResponse = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query($email: String!) {
              getUserInformationByEmail(email: $email) {
                organizationId
              }
            }
          `,
          variables: { email: appUser.email },
        }),
      });

      const orgResult = await orgResponse.json();

      if (orgResult.errors) {
        console.log(orgResult.errors);
        setLoading(false);
        return;
      }

      const organizationId =
        orgResult.data.getUserInformationByEmail.organizationId;

      const staffResponse = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query($organizationId: Int!) {
              usersByOrganization(organizationId: $organizationId) {
                id
                name
                shifts {
                  id
                  clockInTime
                  clockOutTime
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
    };

    getShifts();
  }, [appUser]);

  const [timeRange] = useState(() => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

    return { now, oneWeekAgo, startOfToday, startOfYesterday };
  });

  console.log(staff);

  const allShifts = staff.flatMap((person) =>
    person.shifts.map((s) => ({ ...s, name: person.name })),
  );

  //console.log(allShifts);

  const staffHours = staff
    .map((person) => {
      const hours = person.shifts.reduce((total, shift) => {
        const clockIn = Number(shift.clockInTime);
        if (clockIn < timeRange.oneWeekAgo) return total;
        const clockOut = shift.clockOutTime
          ? Number(shift.clockOutTime)
          : timeRange.now;
        return total + (clockOut - clockIn) / (60 * 60 * 1000);
      }, 0);

      return { name: person.name, hours: Math.round(hours) };
    })
    .filter((s) => s.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  // console.log(staffHours);

  const totalHoursThisWeek = staffHours.reduce((sum, s) => sum + s.hours, 0);

  const avgHoursPerDay = totalHoursThisWeek / 7;

  const avgHoursLabel = `${Math.floor(avgHoursPerDay)}h ${Math.round((avgHoursPerDay % 1) * 60)}m`;

  const onShiftNow = staff
    .map((person) => {
      const openShift = person.shifts.find((s) => !s.clockOutTime);
      if (!openShift) return null;
      return {
        name: person.name,
        since: new Date(Number(openShift.clockInTime)).toLocaleTimeString(),
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const clockInsToday = allShifts.filter(
    (s) => Number(s.clockInTime) >= timeRange.startOfToday,
  ).length;

  const weeklyClockIns = Array.from({ length: 7 }).map((_, i) => {
    const dayStart = timeRange.startOfToday - (6 - i) * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = allShifts.filter((s) => {
      const t = Number(s.clockInTime);
      return t >= dayStart && t < dayEnd;
    }).length;
    return { day: DAY_LABELS[new Date(dayStart).getDay()], count };
  });

  const maxStaffHours = Math.max(1, ...staffHours.map((s) => s.hours));

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard
            label="Avg. hours / day"
            value={avgHoursLabel}
            sublabel="last 7 days"
          />
          <StatCard
            label="Clocked in now"
            value={String(onShiftNow.length)}
            sublabel={`of ${staff.length} staff`}
          />
          <StatCard label="Clock-ins today" value={String(clockInsToday)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-brand-border p-6">
            <h2 className="font-jost text-base font-semibold text-brand-heading mb-6">
              Clock-ins per day
            </h2>
            <div className="h-40">
              <Bar
                data={{
                  labels: weeklyClockIns.map((d) => d.day),
                  datasets: [
                    {
                      data: weeklyClockIns.map((d) => d.count),
                      backgroundColor: "#00AFAA",
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                        font: { family: "var(--font-inter)" },
                      },
                      grid: { color: "#EAF3F3" },
                    },
                    x: {
                      ticks: { font: { family: "var(--font-inter)" } },
                      grid: { display: false },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border p-6">
            <h2 className="font-jost text-base font-semibold text-brand-heading mb-6">
              Total hours per staff &middot; last 7 days
            </h2>
            {staffHours.length === 0 ? (
              <p className="text-sm text-brand-muted font-inter">
                No shifts logged yet this week.
              </p>
            ) : (
              <div style={{ height: `${staffHours.length * 44 + 20}px` }}>
                <Bar
                  data={{
                    labels: staffHours.map((s) => s.name),
                    datasets: [
                      {
                        data: staffHours.map((s) => s.hours),
                        backgroundColor: "#00AFAA",
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        ticks: { font: { family: "var(--font-inter)" } },
                        grid: { color: "#EAF3F3" },
                      },
                      y: {
                        ticks: { font: { family: "var(--font-inter)" } },
                        grid: { display: false },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-jost text-base font-semibold text-brand-heading">
              On shift right now
            </h2>
            <a
              href="/manager/staff"
              className="text-sm text-brand-primary font-inter font-medium"
            >
              View all staff &rarr;
            </a>
          </div>
          {onShiftNow.length === 0 ? (
            <p className="text-sm text-brand-muted font-inter">
              No one is clocked in right now.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {onShiftNow.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between py-2 border-b border-brand-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="relative flex items-center justify-center w-2.5 h-2.5">
                      <span className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping bg-brand-primary" />
                      <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-brand-primary" />
                    </span>
                    <span className="text-sm font-inter text-brand-text">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-xs text-brand-muted font-inter">
                    since {p.since}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6">
      <p className="text-xs uppercase tracking-[0.15em] text-brand-muted font-semibold mb-3">
        {label}
      </p>
      <p className="font-jost text-3xl font-semibold text-brand-heading mb-1">
        {value}
      </p>
      <p className="text-xs text-brand-muted font-inter">{sublabel}</p>
    </div>
  );
}
