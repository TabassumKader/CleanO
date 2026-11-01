import type { TagScheme } from "@/components/sds";
import type { ReportStatus } from "./types";

export type ReportStep = {
  title: string;
  detail: string;
  state: "done" | "current" | "upcoming";
};

export type Report = {
  id: string;
  problem: ProblemType;
  submitted: string;
  status: ReportStatus;
  wardId: string;
  wardLabel: string;
  zone: string;
  building: string;
  description: string;
  anonymous: boolean;
  reporter?: string;
  amountCharged?: number;
  officialRate?: number;
  photo?: string;
  providerResponse?: string;
  officerNote?: string;
  steps: ReportStep[];
};

export const reportStatusTag: Record<ReportStatus, { label: string; scheme: TagScheme }> = {
  submitted: { label: "Submitted", scheme: "neutral" },
  "under-review": { label: "Under review", scheme: "warning" },
  escalated: { label: "Escalated", scheme: "warning" },
  resolved: { label: "Resolved", scheme: "positive" },
  overdue: { label: "Overdue", scheme: "danger" },
};

export const problemTypes = [
  "Missed pickup",
  "Charged above official fee",
  "No receipt given",
  "Waste left on road",
  "Other",
] as const;

export type ProblemType = (typeof problemTypes)[number];

export const reports: Report[] = [
  {
    id: "SC-1042",
    problem: "Charged above official fee",
    submitted: "29 Oct 2026",
    status: "under-review",
    wardId: "20",
    wardLabel: "20, DSCC",
    zone: "Zone 1",
    building: "House 12, Road 3",
    description: "The collector asked for Tk 150 for October. The receipt shows Tk 100.",
    anonymous: true,
    reporter: "Farhana Akter",
    amountCharged: 150,
    officialRate: 100,
    photo: "receipt_photo.jpg",
    steps: [
      { title: "Report submitted", detail: "29 Oct 2026, 10:14 am", state: "done" },
      {
        title: "Sent to Ward 20 Van Service",
        detail: "29 Oct 2026, 10:15 am · 48 hours to respond",
        state: "done",
      },
      {
        title: "Escalated to the Zone 1 office",
        detail: "31 Oct 2026, 10:15 am · the provider did not respond in time",
        state: "current",
      },
      { title: "Resolved", detail: "Waiting for action from the zonal office", state: "upcoming" },
    ],
  },
  {
    id: "SC-0987",
    problem: "Missed pickup",
    submitted: "3 Oct 2026",
    status: "resolved",
    wardId: "20",
    wardLabel: "20, DSCC",
    zone: "Zone 1",
    building: "House 12, Road 3",
    description: "No collection on Wednesday and Thursday. Bags are piling up at the gate.",
    anonymous: false,
    reporter: "Farhana Akter",
    photo: "gate_bags.jpg",
    providerResponse:
      "Sorry for the delay. Our van broke down on 1–2 Oct. We made an extra pickup on 4 Oct.",
    steps: [
      { title: "Report submitted", detail: "3 Oct 2026, 7:40 pm", state: "done" },
      {
        title: "Sent to Ward 20 Van Service",
        detail: "3 Oct 2026, 7:41 pm · 48 hours to respond",
        state: "done",
      },
      { title: "Provider responded", detail: "4 Oct 2026, 8:05 am", state: "done" },
      { title: "Resolved", detail: "4 Oct 2026, 10:30 am · confirmed by you", state: "done" },
    ],
  },
  {
    id: "SC-0911",
    problem: "No receipt given",
    submitted: "14 Sep 2026",
    status: "resolved",
    wardId: "20",
    wardLabel: "20, DSCC",
    zone: "Zone 1",
    building: "House 12, Road 3",
    description: "Paid the September fee in cash and did not get a receipt.",
    anonymous: false,
    reporter: "Farhana Akter",
    providerResponse: "Payment recorded and e-receipt RC-2609-0388 issued.",
    steps: [
      { title: "Report submitted", detail: "14 Sep 2026, 6:10 pm", state: "done" },
      {
        title: "Sent to Ward 20 Van Service",
        detail: "14 Sep 2026, 6:11 pm · 48 hours to respond",
        state: "done",
      },
      { title: "Resolved", detail: "15 Sep 2026, 11:00 am · e-receipt issued", state: "done" },
    ],
  },
];

export function findReport(id: string) {
  return reports.find((report) => report.id.toLowerCase() === id.toLowerCase());
}
