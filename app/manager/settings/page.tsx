"use client";

import { useState } from "react";
import { Button } from "antd";

const mockInviteCode = "RIVER-7F2K";

type perimeterType = {
    id: number,
    name: string,
    lat: number,
    lng: number,
    radius: number
}

const mockPerimeters: perimeterType[] = [];

export default function ManagerSettingsPage() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [radius, setRadius] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockInviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAddPerimeter = (e: React.FormEvent) => {
    e.preventDefault();
    // wire to addPerimeter mutation here
    console.log({ name, radius });
  };

  const getGeoLocation = () => {
    if(!navigator.geolocation){
        console.log('Cannot GeoLocate on this browser.')
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        },
        (error) => {
            console.log("Couldn't get Location", error.message);
        }
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg">

      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto gap-2">

            <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-primary">
                <span className="w-3 h-3 rounded-full bg-white block" />
                </span>
                <span className="font-jost font-semibold text-xl tracking-tight text-brand-heading">
                clock it
                </span>
            </div>

            <nav className="flex items-center sm:gap-16 md:gap-16 gap-2 font-inter text-sm">
                <a href="/manager/dashboard" className="text-brand-muted underline underline-offset-4">Dashboard</a>
                <a href="/manager/staff" className="text-brand-muted underline underline-offset-4">Staff</a>
                <a href="/manager/settings" className="text-brand-heading font-medium underline underline-offset-4">Settings</a>
            </nav>

            <div>
                <a href="/auth/logout" className="text-sm text-brand-muted">
                    <button
                    className="border border-brand-heading h-10 w-24 md:mr-8 rounded font-inter font-semibold bg-brand-primary text-amber-50 hover:bg-brand-bg hover:text-brand-primary hover:border-brand-primary "
                >
                        Sign out
                    </button>
                </a>
            </div>

      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16 flex flex-col gap-6 mt-10">
        <div className="bg-white rounded-2xl border border-brand-border p-6">
            <span className="font-bold text-2xl text-brand-primary">Riverside House</span>
            <h2 className="font-jost text-base font-semibold text-brand-heading mb-2 mt-4">
                Invite code
            </h2>
          <p className="text-sm text-brand-muted font-inter mb-5">
            Share this with your team so they can join Riverside House.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg tracking-wider text-brand-heading bg-brand-pale rounded-lg px-4 py-2">
              {mockInviteCode}
            </span>
            <Button onClick={handleCopy} className="font-inter">
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Perimeters */}
        <div className="bg-white rounded-2xl border border-brand-border p-6">
          <h2 className="font-jost text-base font-semibold text-brand-heading mb-5">
            Clock-in perimeters
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            {mockPerimeters.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-brand-border rounded-xl px-4 py-3"
              >
                <div>
                  <p className="font-inter font-medium text-brand-text text-sm">{p.name}</p>
                  <p className="text-xs text-brand-muted font-inter">
                    {p.lat}, {p.lng} &middot; {p.radius} km radius
                  </p>
                </div>
                <button className="text-xs text-brand-muted underline underline-offset-4">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddPerimeter} className="border-t border-brand-border pt-6">

            <p className="font-inter font-medium text-brand-heading text-sm mb-4">
              Add a new perimeter
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

              <div className="flex flex-col gap-1">
                <label className="text-xs text-brand-muted font-inter">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Main entrance"
                  className="rounded-lg border border-brand-border px-3 py-2 text-sm font-inter text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-brand-muted font-inter">Radius (km)</label>
                <input
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  placeholder="e.g. 0.5"
                  className="rounded-lg border border-brand-border px-3 py-2 text-sm font-inter text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 mb-4">
              <label className="text-xs text-brand-muted font-inter">Location</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-lg border border-brand-border bg-brand-pale/40 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-brand-muted font-inter">Latitude</p>
                  <p className="text-sm font-inter text-brand-text">{latitude}</p>
                </div>
                <div className="flex-1 rounded-lg border border-brand-border bg-brand-pale/40 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-brand-muted font-inter">Longitude</p>
                  <p className="text-sm font-inter text-brand-text">{longitude}</p>
                </div>
                <button
                  type="button"
                  onClick={getGeoLocation}
                  className="shrink-0 rounded-lg border border-brand-primary px-4 py-2 text-sm font-inter font-medium bg-brand-primary text-white hover:bg-brand-bg hover:text-brand-primary transition-colors"
                >
                  Use current location
                </button>
              </div>
            </div>

            <Button
              htmlType="submit"
              type="primary"
              className="bg-brand-primary border-brand-primary font-inter font-medium"
            >
              Add perimeter
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}