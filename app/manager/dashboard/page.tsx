import { Progress } from "antd";

const mockWeeklyClockIns = [
  { day: "Mon", count: 8 },
  { day: "Tue", count: 9 },
  { day: "Wed", count: 7 },
  { day: "Thu", count: 9 },
  { day: "Fri", count: 6 },
  { day: "Sat", count: 4 },
  { day: "Sun", count: 3 },
];

const mockStaffHours = [
  { name: "Amara O.", hours: 38 },
  { name: "Priya S.", hours: 35 },
  { name: "Daniel K.", hours: 32 },
  { name: "Jane R.", hours: 29 },
  { name: "Marcus T.", hours: 21 },
];

const mockOnShiftNow = [
  { name: "Amara O.", since: "8:02 AM" },
  { name: "Priya S.", since: "7:48 AM" },
];

const maxClockIns = Math.max(...mockWeeklyClockIns.map((d) => d.count));
const maxStaffHours = Math.max(...mockStaffHours.map((s) => s.hours));

export default function ManagerDashboard() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top bar */}
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

      <main className="max-w-6xl mx-auto px-6 pb-16">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard label="Avg. hours / day" value="6h 42m" sublabel="last 7 days" />
          <StatCard label="Clocked in now" value={String(mockOnShiftNow.length)} sublabel="of 6 staff" />
          <StatCard label="Clock-ins today" value="8" sublabel="+2 vs yesterday" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Clock-ins per day */}
          <div className="bg-white rounded-2xl border border-brand-border p-6">
            <h2 className="font-jost text-base font-semibold text-brand-heading mb-6">
              Clock-ins per day
            </h2>
            <div className="flex items-end justify-between gap-3 h-40">
              {mockWeeklyClockIns.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-brand-primary"
                    style={{ height: `${(d.count / maxClockIns) * 100}%` }}
                  />
                  <span className="text-xs text-brand-muted font-inter">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total hours per staff */}
          <div className="bg-white rounded-2xl border border-brand-border p-6">
            <h2 className="font-jost text-base font-semibold text-brand-heading mb-6">
              Total hours per staff &middot; last 7 days
            </h2>
            <div className="flex flex-col gap-4">
              {mockStaffHours.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm font-inter mb-1">
                    <span className="text-brand-text">{s.name}</span>
                    <span className="text-brand-muted">{s.hours}h</span>
                  </div>
                  <Progress
                    percent={(s.hours / maxStaffHours) * 100}
                    showInfo={false}
                    strokeColor="#00AFAA"
                    trailColor="#EAF3F3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* On shift now teaser */}
        <div className="bg-white rounded-2xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-jost text-base font-semibold text-brand-heading">
              On shift right now
            </h2>
            <a href="/manager/staff" className="text-sm text-brand-primary font-inter font-medium">
              View all staff &rarr;
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {mockOnShiftNow.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="relative flex items-center justify-center w-2.5 h-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping bg-brand-primary" />
                    <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-brand-primary" />
                  </span>
                  <span className="text-sm font-inter text-brand-text">{p.name}</span>
                </div>
                <span className="text-xs text-brand-muted font-inter">since {p.since}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6">
      <p className="text-xs uppercase tracking-[0.15em] text-brand-muted font-semibold mb-3">
        {label}
      </p>
      <p className="font-jost text-3xl font-semibold text-brand-heading mb-1">{value}</p>
      <p className="text-xs text-brand-muted font-inter">{sublabel}</p>
    </div>
  );
}