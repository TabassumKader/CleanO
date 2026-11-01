import type { CSSProperties } from "react";
import d from "@/components/dashboard.module.css";
import { DataTable } from "@/components/DataTable";
import { StatusLegend, pickupStatusLabel, pickupStatusScheme } from "@/components/layout";
import { MonthGrid } from "@/components/MonthGrid";
import { Card, ProgressBar, Tag } from "@/components/sds";
import type { PickupLogEntry } from "@/data/caretaker";
import type { PickupStatus } from "@/data/types";

/** "October so far": share collected, counts by status, and the day-by-day grid. */
export function MonthSummaryCard({
  days,
  month,
  className,
  style,
}: {
  days: PickupStatus[];
  month: string;
  className?: string;
  style?: CSSProperties;
}) {
  const count = (status: PickupStatus) => days.filter((day) => day === status).length;
  const collected = count("collected");
  const percent = Math.floor((collected / days.length) * 100);

  return (
    <Card className={className} style={{ gap: 14, ...style }}>
      <div className={`${d.row} t-body-strong`}>
        <h2 className={`t-body-strong ${d.grow}`}>{month} so far</h2>
        <p>{percent}% collected</p>
      </div>
      <ProgressBar value={percent} label={`Share of ${month} days collected`} />
      <p className="t-caption c-secondary">
        {collected} of {days.length} days collected · {count("missed")} missed · {count("pending")} not
        confirmed
      </p>
      <MonthGrid days={days} month={month} />
      <StatusLegend />
    </Card>
  );
}

/** Day-by-day record: status, time and who confirmed it. */
export function PickupLogTable({ rows, caption = "Recent days" }: { rows: PickupLogEntry[]; caption?: string }) {
  return (
    <DataTable<PickupLogEntry>
      caption={caption}
      rows={rows}
      rowKey={(row) => row.date}
      columns={[
        { key: "date", header: "Date", width: 166, render: (row) => row.date },
        {
          key: "status",
          header: "Status",
          width: 176,
          render: (row) => <Tag scheme={pickupStatusScheme[row.status]}>{pickupStatusLabel[row.status]}</Tag>,
        },
        { key: "time", header: "Time", width: 126, render: (row) => row.time },
        { key: "by", header: "Confirmed by", render: (row) => row.confirmedBy },
        { key: "note", header: "Note", width: 316, render: (row) => row.note },
      ]}
    />
  );
}
