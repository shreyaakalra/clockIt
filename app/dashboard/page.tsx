"use client"

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

export default function CareWorkerDashboard() {
  
  const [isClockedIn, setIsClockedIn] = useState(false);
  const {user} = useUser();

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [errorExists, setErrorExists] = useState(false);
  const [shifts, setShifts] = useState([]);

  const mockShifts = shifts;

  const getGeoLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if(!navigator.geolocation){
        console.log('Cannot GeoLocate on this browser.')
        reject("No geolocation");
        return;
      }

      navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            resolve({ lat: position.coords.latitude, lng: position.coords.longitude }); 
          },
          (error) => {
              console.log("Couldn't get Location", error.message);
              reject(error);
          }
      )
    });
  }

  const addShift = async() => {

    if(!user) return;

    const userResponse = await fetch('/api/graphql', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query: `
            query($email: String!){
              getUserInformationByEmail(email: $email){
                id
                name
                role
                organizationId
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
          variables: {email: user.email}
        })
      });

      const userResult = await userResponse.json();

      if(userResult.errors){
        console.log(userResult.errors);
        return;
      }

    const userData = userResult.data.getUserInformationByEmail;

    const shiftResponse = await fetch('/api/graphql', {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
          query: `
            mutation($userId: Int!, $perimeterId: Int!, $clockInLatitude: Float!, $clockInLongitude: Float!, $clockInNote: String!){
              clockIn(userId: $userId, perimeterId: $perimeterId, clockInLatitude: $clockInLatitude, clockInLongitude: $clockInLongitude, clockInNote: $clockInNote){
                clockInTime
              }
            }
          `,
          variables: {
            userId: userData.id,
            perimeterId: userData.perimeterId,
            clockInLatitude: latitude,
            clockInLongitude: longitude,
            clockInNote: note
          }
        })
      });

      const shiftResult = await shiftResponse.json();
      setIsClockedIn(true);

      const formattedShifts = userData.shifts.map((shift, index) => ({
        key: shift.id || index, 
        date: new Date(Number(shift.clockInTime)).toLocaleDateString(),
        clockIn: new Date(Number(shift.clockInTime)).toLocaleTimeString(),
        clockOut: shift.clockOutTime ? new Date(Number(shift.clockOutTime)).toLocaleTimeString() : "-",
        duration: "...", 
        note: shift.clockInNote
      }));

      setShifts(formattedShifts);

  }

  useEffect(() => {

    async function checkingOnSite(){

      if(!user) return;
      
      const userResponse = await fetch('/api/graphql', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query: `
            query($email: String!){
              getUserInformationByEmail(email: $email){
                id
                name
                role
                organizationId
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
          variables: {email: user.email}
        })
      });

      const userResult = await userResponse.json();

      if(userResult.errors){
        console.log(userResult.errors);
        return;
      }

      const userData = userResult.data.getUserInformationByEmail;

      const coords = await getGeoLocation();

      const shiftResponse = await fetch('/api/graphql', {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
          query: `
            mutation($userId: Int!, $perimeterId: Int!, $clockInLatitude: Float!, $clockInLongitude: Float!, $clockInNote: String!){
              checkPerimeter(userId: $userId, perimeterId: $perimeterId, clockInLatitude: $clockInLatitude, clockInLongitude: $clockInLongitude, clockInNote: $clockInNote)
            }
          `,
          variables: {
            userId: userData.id,
            perimeterId: userData.perimeterId,
            clockInLatitude: coords.lat,
            clockInLongitude: coords.lng,
            clockInNote: note
          }
        })
      });

      const shiftResult = await shiftResponse.json();

      if(shiftResult.errors){
        console.log(shiftResult.errors);
        setError(shiftResult.errors[0]?.message);
        setErrorExists(true);
        return;
      }

      setError("");
      setErrorExists(false);

      const shiftData = shiftResult.data.clockIn;

      return true;
    }

    checkingOnSite();

  }, [user])

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
          <span className="text-sm text-brand-text font-inter">Amara O.</span>
          <a href="/auth/logout" className="text-sm text-brand-muted underline underline-offset-4">
            Sign out
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        
        <div className="bg-white rounded-2xl border border-brand-border p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-brand-muted font-semibold mb-2">
                Riverside House
              </p>
              <h1 className="font-jost text-2xl md:text-3xl font-semibold text-brand-heading">
                {isClockedIn ? "You're on shift" : "You're not clocked in"}
              </h1>
              {isClockedIn && (
                <p className="text-sm text-brand-text mt-1">Since 8:02 AM &middot; 4h 12m so far</p>
              )}
            </div>
            <Tag
              className="font-inter"
              color={!errorExists ? "success" : "default"}
            >
              {!errorExists ? "Within perimeter" : "Not on site"}
            </Tag>
          </div>

          <textarea
            placeholder={isClockedIn ? "Add a note before you clock out " : "Add a note before you clock in "}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border-2 h-20 w-100 mb-5 items-center p-5 rounded-2xl font-inter "
          />

          <Button
            type="primary"
            size="large"
            block
            danger={isClockedIn}
            className={`font-inter font-medium ${!isClockedIn ? "bg-brand-primary border-brand-primary" : ""} `}
            disabled={errorExists}    
            onClick={addShift}      
          >
            {isClockedIn ? "Clock out" : "Clock in"}
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-8">
          <h2 className="font-jost text-lg font-semibold text-brand-heading mb-5">
            Your recent shifts
          </h2>
          <Table
            columns={columns}
            dataSource={mockShifts}
            pagination={false}
            className="font-inter"
          />
        </div>
      </main>
    </div>
  );
}