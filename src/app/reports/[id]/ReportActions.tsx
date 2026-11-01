"use client";

import { useState } from "react";
import { CheckCircle, Info } from "react-feather";
import { Button, Notification, TextareaField } from "@/components/sds";
import s from "./report-status.module.css";

type Mode = "idle" | "adding" | "added" | "confirm-withdraw" | "withdrawn";

export function ReportActions({ reportId, closed }: { reportId: string; closed: boolean }) {
  const [mode, setMode] = useState<Mode>("idle");
  const [note, setNote] = useState("");

  if (closed) {
    return (
      <Button variant="neutral" block href="/report">
        Report a new problem
      </Button>
    );
  }

  if (mode === "withdrawn") {
    return (
      <Notification icon={<Info size={20} />} title="Report withdrawn">
        {reportId} is closed and will no longer be reviewed.
      </Notification>
    );
  }

  return (
    <div className={s.actions}>
      {mode === "added" && (
        <Notification icon={<CheckCircle size={20} />} title="Information added">
          The zonal office will see your note with the report.
        </Notification>
      )}

      {mode === "adding" ? (
        <>
          <TextareaField
            id="more-info"
            label="Add more information"
            rows={3}
            placeholder="For example: the collector came back and asked again on 30 Oct."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className={s.buttons}>
            <Button disabled={!note.trim()} onClick={() => setMode("added")}>
              Save
            </Button>
            <Button variant="subtle" onClick={() => setMode("idle")}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <Button variant="neutral" block onClick={() => setMode("adding")}>
          Add more information
        </Button>
      )}

      {mode === "confirm-withdraw" ? (
        <>
          <p className="t-small">Withdraw {reportId}? The zonal office will stop reviewing it.</p>
          <div className={s.buttons}>
            <Button variant="danger" onClick={() => setMode("withdrawn")}>
              Withdraw
            </Button>
            <Button variant="subtle" onClick={() => setMode("idle")}>
              Keep report
            </Button>
          </div>
        </>
      ) : (
        mode !== "adding" && (
          <Button variant="subtle" block onClick={() => setMode("confirm-withdraw")}>
            Withdraw report
          </Button>
        )
      )}
    </div>
  );
}
