import type { Metadata } from "next";
import { OfficerShell } from "../OfficerShell";
import { ComplaintQueue, type QueueTab } from "./ComplaintQueue";

export const metadata: Metadata = { title: "Complaints" };

const tabs: QueueTab[] = ["all", "overdue", "awaiting", "escalated", "resolved"];

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// Reads query parameters, so the page renders per request instead of being prerendered.
export const instant = false;

/** S11 · Complaint queue and detail. */
export default async function ComplaintsPage({ searchParams }: PageProps<"/officer/complaints">) {
  const params = await searchParams;
  const tab = one(params.tab);
  const ward = Number(one(params.ward));

  return (
    <OfficerShell active="Complaints">
      <ComplaintQueue
        initialQuery={one(params.q) ?? ""}
        initialTab={tabs.includes(tab as QueueTab) ? (tab as QueueTab) : "all"}
        initialWard={Number.isFinite(ward) && ward > 0 ? ward : undefined}
        initialId={one(params.id)}
      />
    </OfficerShell>
  );
}
