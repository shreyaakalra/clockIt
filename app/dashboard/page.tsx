"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { Button, Table, Tag } from "antd";
import { useEffect, useState } from "react";

const columns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Clock in", dataIndex: "clockIn", key: "clockIn" },
  { title: "Clock out", dataIndex: "clockOut", key: "clockOut" },
  { title: "Duration", dataIndex: "duration", key: "duration" },
  { title: "Note", dataIndex: "note", key: "note", ellipsis: true },
];

type ShiftRow = {
  key: number;
  date: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  note: string;
};

type ShiftType = {
  id: number,
  clockInTime: string,
  clockOutTime: string,
  clockInNote: string
}

export default function CareWorkerDashboard() {
  const { user } = useUser();

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [openShiftId, setOpenShiftId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [perimeterId, setPerimeterId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [errorExists, setErrorExists] = useState(false);
  const [shifts, setShifts] = useState<ShiftRow[]>([]);

  const getGeoLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (err) => reject(err)
      );
    });
  };

  const formatShifts = (rawShifts: ShiftType[]): ShiftRow[] => {
    return rawShifts.map((shift, index) => {
      const clockInDate = new Date(Number(shift.clockInTime));
      const clockOutDate = shift.clockOutTime ? new Date(Number(shift.clockOutTime)) : null;

      let duration = "In progress";
      if (clockOutDate) {
        const mins = Math.round((clockOutDate.getTime() - clockInDate.getTime()) / 60000);
        duration = `${Math.floor(mins / 60)}h ${mins % 60}m`;
      }

      return {
        key: shift.id ?? index,
        date: clockInDate.toLocaleDateString(),
        clockIn: clockInDate.toLocaleTimeString(),
        clockOut: clockOutDate ? clockOutDate.toLocaleTimeString() : "—",
        duration,
        note: shift.clockInNote || "—",
      };
    });
  };

  // Checks perimeter status only — used on load
  const runPerimeterCheck = async (targetPerimeterId: number) => {
    try {
      const coords = await getGeoLocation();
      const checkResponse = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query($perimeterId: Int!, $latitude: Float!, $longitude: Float!) {
              checkPerimeter(perimeterId: $perimeterId, latitude: $latitude, longitude: $longitude)
            }
          `,
          variables: { perimeterId: targetPerimeterId, latitude: coords.lat, longitude: coords.lng },
        }),
      });
      const checkResult = await checkResponse.json();

      if (checkResult.errors || checkResult.data.checkPerimeter === false) {
        setError("You're outside the allowed perimeter to clock in.");
        setErrorExists(true);
      } else {
        setError("");
        setErrorExists(false);
      }
    } catch {
      setError("Couldn't get your location.");
      setErrorExists(true);
    }
  };

  // Single source of truth: re-fetch user + shift state from the server
  const loadUserAndShifts = async () => {
    if (!user) return;

    const userResponse = await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query($email: String!) {
            getUserInformationByEmail(email: $email) {
              id
              perimeterId
              shifts {
                id
                clockInTime
                clockOutTime
                clockInNote
              }
            }
          }
        `,
        variables: { email: user.email },
      }),
    });

    const userResult = await userResponse.json();
    if (userResult.errors) {
      console.log(userResult.errors);
      return;
    }

    const userData = userResult.data.getUserInformationByEmail;
    const shiftsData = userData.shifts ?? [];

    setUserId(userData.id);
    setPerimeterId(userData.perimeterId);
    setShifts(formatShifts(shiftsData));

    const openShift = shiftsData.find((s: ShiftType) => !s.clockOutTime);
    setIsClockedIn(!!openShift);
    setOpenShiftId(openShift ? openShift.id : null);

    // Only worth checking the perimeter proactively if not already clocked in
    if (!openShift && userData.perimeterId) {
      await runPerimeterCheck(userData.perimeterId);
    } else {
      setError("");
      setErrorExists(false);
    }
  };

  useEffect(() => {
    if(!user) return;
    (async () => {
      await loadUserAndShifts();
      setLoading(false);
    })();
  }, [user]);

  const handleClockAction = async () => {
    if (!user || !userId) return;

    let coords;
    try {
      coords = await getGeoLocation();
    } catch {
      setError("Couldn't get your location.");
      setErrorExists(true);
      return;
    }

    if (!isClockedIn) {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation($userId: Int!, $perimeterId: Int!, $clockInLatitude: Float!, $clockInLongitude: Float!, $clockInNote: String) {
              clockIn(userId: $userId, perimeterId: $perimeterId, clockInLatitude: $clockInLatitude, clockInLongitude: $clockInLongitude, clockInNote: $clockInNote) {
                id
              }
            }
          `,
          variables: {
            userId,
            perimeterId,
            clockInLatitude: coords.lat,
            clockInLongitude: coords.lng,
            clockInNote: note || null,
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setError(result.errors[0]?.message ?? "Couldn't clock in.");
        setErrorExists(true);
        return;
      }
    } else {
      if (!openShiftId) return;

      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation($shiftId: Int!, $clockOutLatitude: Float!, $clockOutLongitude: Float!, $clockOutNote: String) {
              clockOut(shiftId: $shiftId, clockOutLatitude: $clockOutLatitude, clockOutLongitude: $clockOutLongitude, clockOutNote: $clockOutNote) {
                id
              }
            }
          `,
          variables: {
            shiftId: openShiftId,
            clockOutLatitude: coords.lat,
            clockOutLongitude: coords.lng,
            clockOutNote: note || null,
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setError(result.errors[0]?.message ?? "Couldn't clock out.");
        setErrorExists(true);
        return;
      }
    }

    setNote("");
    await loadUserAndShifts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="font-inter text-brand-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="flex items-center justify-between px-8 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-primary">
            <span className="w-3 h-3 rounded-full bg-white block" />
          </span>
          <span className="font-jost font-semibold text-xl tracking-tight text-brand-heading">
            clock it
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-text font-inter">{user?.name ?? ""}</span>
          <a href="/auth/logout" className="text-sm text-brand-muted underline underline-offset-4">
            Sign out
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl border border-brand-border p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-jost text-2xl md:text-3xl font-semibold text-brand-heading">
                {isClockedIn ? "You're on shift" : "You're not clocked in"}
              </h1>
              {errorExists && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
            <Tag className="font-inter" color={!errorExists ? "success" : "default"}>
              {!errorExists ? "Within perimeter" : "Not on site"}
            </Tag>
          </div>

          <textarea
            placeholder={isClockedIn ? "Add a note before you clock out" : "Add a note before you clock in"}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border-2 h-20 w-full mb-5 p-3 rounded-2xl font-inter"
          />

          <Button
            type="primary"
            size="large"
            block
            danger={isClockedIn}
            className={`font-inter font-medium ${!isClockedIn ? "bg-brand-primary border-brand-primary" : ""}`}
            disabled={!isClockedIn && errorExists}
            onClick={handleClockAction}
          >
            {isClockedIn ? "Clock out" : "Clock in"}
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-8">
          <h2 className="font-jost text-lg font-semibold text-brand-heading mb-5">
            Your recent shifts
          </h2>
          <Table columns={columns} dataSource={shifts} pagination={false} className="font-inter" />
        </div>
      </main>
    </div>
  );
}