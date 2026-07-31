import { Button, Table, Tag } from "antd";

const mockShifts = [];

const columns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Clock in", dataIndex: "clockIn", key: "clockIn" },
  { title: "Clock out", dataIndex: "clockOut", key: "clockOut" },
  { title: "Duration", dataIndex: "duration", key: "duration" },
  { title: "Note", dataIndex: "note", key: "note", ellipsis: true },
];

export default function CareWorkerDashboard() {
  
  const isClockedIn = false;

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
              color={isClockedIn ? "success" : "default"}
            >
              {isClockedIn ? "Within perimeter" : "Not on site"}
            </Tag>
          </div>

          <textarea
            placeholder={isClockedIn ? "Add a note before you clock out " : "Add a note before you clock in "}
            className="border-2 h-20 w-100 mb-5 items-center p-5 rounded-2xl font-inter "
          />

          <Button
            type="primary"
            size="large"
            block
            danger={isClockedIn}
            className={`font-inter font-medium ${!isClockedIn ? "bg-brand-primary border-brand-primary" : ""}`}
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