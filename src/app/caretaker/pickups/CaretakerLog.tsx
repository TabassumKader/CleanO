"use client";

import { useState } from "react";
import { CheckCircle, Download, XCircle } from "react-feather";
import d from "@/components/dashboard.module.css";
import { PageHeader, pickupStatusLabel, pickupStatusScheme } from "@/components/layout";
import { MonthSummaryCard, PickupLogTable } from "@/components/PickupHistory";
import { Button, Card, Tag } from "@/components/sds";
import { caretaker, type PickupLogEntry } from "@/data/caretaker";
import type { PickupStatus } from "@/data/types";
import s from "./caretaker.module.css";

function nowLabel() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();
}

function downloadCsv(rows: PickupLogEntry[]) {
  const header = ["Date", "Status", "Time", "Confirmed by", "Note"];
  const lines = [header, ...rows.map((r) => [r.date, pickupStatusLabel[r.status], r.time, r.confirmedBy, r.note])]
    .map((cells) => cells.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([lines], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "pickup-log-house-12-road-3.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function CaretakerLog() {
  const [answer, setAnswer] = useState<{ status: PickupStatus; time: string } | null>(null);

  const days = answer ? [...caretaker.october, answer.status] : caretaker.october;

  const recent: PickupLogEntry[] = answer
    ? [
        {
          date: caretaker.today.short,
          status: answer.status,
          time: answer.status === "collected" ? answer.time : "—",
          confirmedBy: `Caretaker (${caretaker.name})`,
          note: answer.status === "missed" ? "Van did not come" : "—",
        },
        ...caretaker.recent,
      ]
    : caretaker.recent;

  return (
    <>
      <PageHeader
        title={`Pickup log: ${caretaker.building}`}
        subtitle={`Building caretaker · ${caretaker.flats} flats · ${caretaker.wardLabel}`}
        actions={
          <Button variant="neutral" iconStart={<Download size={16} />} onClick={() => downloadCsv(recent)}>
            Download log
          </Button>
        }
      />

      <div className={`${d.split} ${d.splitStretch}`}>
        <Card gap={12} className={s.today}>
          <p className="t-small c-secondary">{caretaker.today.label}</p>
          {answer ? (
            <>
              <p className="t-body-strong">Thanks, today&apos;s pickup is recorded.</p>
              <div className={d.row}>
                <Tag scheme={pickupStatusScheme[answer.status]}>{pickupStatusLabel[answer.status]}</Tag>
                <span className="t-small c-secondary">Confirmed at {answer.time}</span>
              </div>
              <Button variant="neutral" block onClick={() => setAnswer(null)}>
                Change answer
              </Button>
            </>
          ) : (
            <>
              <p className="t-body-strong">Did the van collect waste today?</p>
              <Button
                block
                iconStart={<CheckCircle size={16} />}
                onClick={() => setAnswer({ status: "collected", time: nowLabel() })}
              >
                Yes, collected
              </Button>
              <Button
                variant="neutral"
                block
                iconStart={<XCircle size={16} />}
                onClick={() => setAnswer({ status: "missed", time: nowLabel() })}
              >
                No, it was missed
              </Button>
            </>
          )}
          <p className="t-caption c-secondary">
            Your answer is shared with residents of this building and counted on the public ward
            dashboard.
          </p>
        </Card>

        <MonthSummaryCard days={days} month="October" className={d.grow} />
      </div>

      <h2 id="log" className="t-body-strong">
        Recent days
      </h2>
      <PickupLogTable rows={recent} />
    </>
  );
}
