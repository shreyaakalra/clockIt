"use client";

import { useState } from "react";
import ModeCard from "@/components/ModeCard";
import CreateOrgForm from "@/components/CreateOrgForm";
import JoinOrgForm from "@/components/JoinOrgForm";

type Mode = "create" | "join";

export default function Onboarding() {
  const [mode, setMode] = useState<Mode>("create");

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      <header className="flex items-center gap-2 px-8 py-6 max-w-7xl mx-auto w-full">
        <span className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-primary">
          <span className="w-3 h-3 rounded-full bg-white block" />
        </span>
        <span className="font-jost font-semibold text-xl tracking-tight text-brand-heading">
          clock it
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-xl">
          
          <p className="uppercase text-sm tracking-[0.2em] mb-3 text-brand-primary font-inter font-semibold text-center">
            One last step
          </p>
          
          <h1 className="font-jost text-brand-heading text-3xl md:text-4xl font-semibold tracking-tight mb-10 text-center">
            Set up your workspace
          </h1>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <ModeCard
              active={mode === "create"}
              onClick={() => setMode("create")}
              title="Start an organization"
              body="You're setting up clock-it for your team for the first time."
            />
            <ModeCard
              active={mode === "join"}
              onClick={() => setMode("join")}
              title="Join a team"
              body="Someone gave you an invite code to join their organization."
            />
          </div>

          
          <div className="bg-white rounded-2xl border border-brand-border p-8">
            {mode === "create" ? <CreateOrgForm /> : <JoinOrgForm />}
          </div>

        </div>
      </main>
    </div>
  );
}




