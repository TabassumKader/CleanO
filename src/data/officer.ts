import type { TagScheme } from "@/components/sds";
import type { ProblemType } from "./reports";

export const officer = {
  initials: "ZO",
  name: "Zonal Executive Officer",
  detail: "Zone 1 · DSCC",
  zone: "Zone 1",
};

/* Zone KPIs for the period select on S10. */
export const zoneKpis = {
  "7": {
    range: "24–30 Oct 2026",
    reliability: 84,
    trend: "+2 points on the previous week",
    medianFee: 150,
    confirmingDaily: 61,
  },
  "30": {
    range: "1–30 Oct 2026",
    reliability: 83,
    trend: "+1 point on September",
    medianFee: 150,
    confirmingDaily: 58,
  },
} as const;

export const registeredBuildings = 2190;

export type WardHealth = "critical" | "needs-attention" | "on-track";

export const wardHealth: Record<WardHealth, { label: string; scheme: TagScheme }> = {
  critical: { label: "Critical", scheme: "danger" },
  "needs-attention": { label: "Needs attention", scheme: "warning" },
  "on-track": { label: "On track", scheme: "positive" },
};

export type ZoneWard = {
  ward: number;
  provider: string;
  reliability: { "7": number; "30": number };
  medianFee: number;
  health: WardHealth;
};

export const zoneWards: ZoneWard[] = [
  { ward: 18, provider: "City Clean Van", reliability: { "7": 78, "30": 80 }, medianFee: 180, health: "critical" },
  { ward: 19, provider: "Ward 19 Van Service", reliability: { "7": 88, "30": 87 }, medianFee: 120, health: "on-track" },
  { ward: 20, provider: "Ward 20 Van Service", reliability: { "7": 86, "30": 86 }, medianFee: 150, health: "needs-attention" },
  { ward: 21, provider: "Green Lane Service", reliability: { "7": 81, "30": 79 }, medianFee: 150, health: "needs-attention" },
  { ward: 22, provider: "Ward 22 Van Service", reliability: { "7": 90, "30": 89 }, medianFee: 100, health: "on-track" },
  { ward: 23, provider: "Riverside Collection", reliability: { "7": 83, "30": 82 }, medianFee: 130, health: "needs-attention" },
];

/** Bar colour for a reliability figure: green from 85%, yellow from 80%, red below. */
export function reliabilityTone(value: number): "positive" | "warning" | "danger" {
  if (value >= 85) return "positive";
  if (value >= 80) return "warning";
  return "danger";
}

export function providerForWard(ward: number) {
  return zoneWards.find((w) => w.ward === ward)?.provider ?? "Unknown provider";
}

/* Complaint queue (S10 "Needs action", S11). */

export type ComplaintStatus = "new" | "with-provider" | "replied" | "escalated" | "overdue" | "resolved";

export const complaintStatus: Record<ComplaintStatus, { label: string; scheme: TagScheme }> = {
  new: { label: "New", scheme: "brand" },
  "with-provider": { label: "With provider", scheme: "neutral" },
  replied: { label: "Provider replied", scheme: "neutral" },
  escalated: { label: "Escalated", scheme: "warning" },
  overdue: { label: "Overdue", scheme: "danger" },
  resolved: { label: "Resolved", scheme: "positive" },
};

export type ComplaintStep = { title: string; detail: string; state: "done" | "current" | "upcoming" };

export type Complaint = {
  id: string;
  type: ProblemType;
  ward: number;
  building: string;
  ageHours: number;
  status: ComplaintStatus;
  reported: string;
  reporter: string;
  amount?: { charged: number; rate: number };
  photo?: string;
  steps: ComplaintStep[];
};

/** "6 hours", "1 day", "4 days" */
export function formatAge(hours: number) {
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"}`;
}

/* "Today" in the sample data is Saturday 31 Oct 2026, 4 pm. */
const NOW = Date.UTC(2026, 9, 31, 16, 0);

function reportedAt(ageHours: number) {
  const date = new Date(NOW - ageHours * 3600_000);
  const day = date.getUTCDate();
  const month = date.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  const hour = date.getUTCHours();
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  const time = `${hour % 12 || 12}:${minute} ${hour < 12 ? "am" : "pm"}`;
  return { long: `${day} ${month} 2026, ${time}`, short: `${day} ${month}, ${time}` };
}

function stepsFor(status: ComplaintStatus, ageHours: number): ComplaintStep[] {
  const at = (h: number) => reportedAt(Math.max(0, h)).short;
  const submitted = { title: "Submitted by resident", detail: at(ageHours), state: "done" as const };
  const sent = { title: "Sent to provider", detail: at(ageHours - 0.02), state: "done" as const };
  switch (status) {
    case "new":
      return [{ ...submitted }, { title: "Waiting to be sent to provider", detail: "Sent automatically within 1 hour", state: "current" }];
    case "with-provider":
      return [submitted, { ...sent, state: "current", detail: `${sent.detail} · 48 hours to respond` }];
    case "replied":
      return [submitted, sent, { title: "Provider replied", detail: at(ageHours - 20), state: "current" }];
    case "escalated":
      return [submitted, sent, { title: "Escalated: no provider reply in 48 hours", detail: at(ageHours - 48), state: "current" }];
    case "overdue":
      return [
        submitted,
        sent,
        { title: "Escalated: no provider reply in 48 hours", detail: at(ageHours - 48), state: "done" },
        { title: "Overdue: no action for 72 hours", detail: at(ageHours - 72), state: "current" },
      ];
    case "resolved":
      return [submitted, sent, { title: "Resolved", detail: at(ageHours - 30), state: "done" }];
  }
}

function complaint(
  id: string,
  type: ProblemType,
  ward: number,
  building: string,
  ageHours: number,
  status: ComplaintStatus,
  extra: Partial<Complaint> = {},
): Complaint {
  return {
    id,
    type,
    ward,
    building,
    ageHours,
    status,
    reported: reportedAt(ageHours).long,
    reporter: "Resident",
    steps: stepsFor(status, ageHours),
    ...extra,
  };
}

/* The complaints drawn in the design. */
const designed: Complaint[] = [
  {
    ...complaint("SC-1042", "Charged above official fee", 20, "House 12, Road 3", 54, "escalated", {
      reporter: "Anonymous resident",
      amount: { charged: 150, rate: 100 },
      photo: "receipt_photo.jpg",
    }),
    reported: "29 Oct 2026, 10:14 am",
    steps: [
      { title: "Submitted by resident", detail: "29 Oct, 10:14 am", state: "done" },
      { title: "Sent to provider", detail: "29 Oct, 10:15 am", state: "done" },
      { title: "Escalated: no provider reply in 48 hours", detail: "31 Oct, 10:15 am", state: "current" },
    ],
  },
  complaint("SC-1038", "Missed pickup", 18, "House 7, Road 2", 100, "overdue", { photo: "bags_at_gate.jpg" }),
  complaint("SC-1036", "No receipt given", 21, "House 3, Lane 5", 98, "overdue", { reporter: "Anonymous resident" }),
  complaint("SC-1045", "Missed pickup", 20, "House 9, Road 1", 30, "with-provider"),
  complaint("SC-1047", "Waste left on road", 22, "Road 6 corner", 26, "with-provider", { photo: "road6_corner.jpg" }),
  complaint("SC-1049", "Charged above official fee", 19, "House 21, Road 8", 6, "new", {
    amount: { charged: 200, rate: 100 },
  }),
  complaint("SC-1031", "Missed pickup", 23, "House 4, Road 2", 150, "resolved"),
  complaint("SC-1029", "No receipt given", 18, "House 11, Road 5", 170, "resolved"),
];

/* The rest of Zone 1's queue, generated so the totals match the design:
 * 37 open (9 overdue, 14 awaiting provider, 8 escalated, 6 replied) and 22 resolved this week,
 * with open complaints per ward 18:9, 19:4, 20:6, 21:7, 22:3, 23:8. */
const wardSlots = [18, 21, 23, 20, 18, 23, 21, 19, 18, 23, 20, 21, 18, 23, 22, 18, 21, 23, 20, 19, 18, 23, 21, 18, 20, 23, 21, 19, 18, 23, 22];
const statusSlots: ComplaintStatus[] = [
  ...Array<ComplaintStatus>(7).fill("overdue"),
  ...Array<ComplaintStatus>(7).fill("escalated"),
  ...Array<ComplaintStatus>(9).fill("with-provider"),
  ...Array<ComplaintStatus>(2).fill("new"),
  ...Array<ComplaintStatus>(6).fill("replied"),
];
const types: ProblemType[] = ["Missed pickup", "Charged above official fee", "No receipt given", "Waste left on road", "Missed pickup", "Other"];
const ageRange: Record<ComplaintStatus, [number, number]> = {
  overdue: [80, 140],
  escalated: [50, 70],
  "with-provider": [8, 46],
  new: [1, 5],
  replied: [24, 60],
  resolved: [30, 160],
};

function generated(index: number, status: ComplaintStatus, ward: number, idNumber: number): Complaint {
  const [min, max] = ageRange[status];
  const age = min + ((index * 37) % (max - min + 1));
  const type = types[(index * 5 + ward) % types.length];
  const building = index % 7 === 3 ? `Road ${1 + (index % 9)} corner` : `House ${2 + ((index * 3) % 28)}, Road ${1 + (index % 9)}`;
  return complaint(`SC-${idNumber}`, type, ward, building, age, status, {
    reporter: index % 3 === 0 ? "Anonymous resident" : "Resident",
    amount: type === "Charged above official fee" ? { charged: 150 + (index % 3) * 50, rate: 100 } : undefined,
    photo: index % 4 === 0 ? `evidence_${idNumber}.jpg` : undefined,
  });
}

const takenIds = new Set(designed.map((c) => Number(c.id.slice(3))));
function* freeIds(start: number) {
  for (let id = start; ; id++) if (!takenIds.has(id)) yield id;
}

const openIds = freeIds(1000);
const generatedOpen = statusSlots.map((status, i) => generated(i, status, wardSlots[i], openIds.next().value!));

/* Resolved this week per ward (with SC-1029 in 18 and SC-1031 in 23): 18:3, 19:5, 20:4, 21:3, 22:4, 23:3. */
const resolvedWardSlots = [19, 20, 22, 18, 21, 23, 19, 20, 22, 18, 21, 23, 19, 20, 22, 21, 19, 20, 22, 19];
const resolvedIds = freeIds(960);
const generatedResolved = resolvedWardSlots.map((ward, i) =>
  generated(i + 40, "resolved", ward, resolvedIds.next().value!),
);

export const complaints: Complaint[] = [...designed, ...generatedOpen, ...generatedResolved];

export const openComplaints = complaints.filter((c) => c.status !== "resolved");

export function complaintsForWard(ward: number) {
  return openComplaints.filter((c) => c.ward === ward).length;
}

export function resolvedForWard(ward: number) {
  return complaints.filter((c) => c.ward === ward && c.status === "resolved").length;
}

/* Weekly report, 24–30 Oct (S12). */
export const weeklyReport = {
  range: "24–30 Oct 2026",
  pickupsConfirmed: 84,
  dailyAverageBuildings: 1846,
  missedLastWeek: 126,
  receiptsWithinRate: 58,
  recordedPayments: 1204,
  complaintsReceived: 31,
  medianDaysToResolve: 2.5,
  targetReliability: 90,
  daily: [
    { day: "Sat", value: 82 },
    { day: "Sun", value: 85 },
    { day: "Mon", value: 88 },
    { day: "Tue", value: 80 },
    { day: "Wed", value: 86 },
    { day: "Thu", value: 84 },
    { day: "Fri", value: 83 },
  ],
  byType: [
    { type: "Missed pickup", share: 41 },
    { type: "Charged above official rate", share: 33 },
    { type: "No receipt given", share: 17 },
    { type: "Waste left on road", share: 9 },
  ],
  wards: {
    18: { missedReports: 31, receiptsWithinRate: 41 },
    19: { missedReports: 12, receiptsWithinRate: 72 },
    20: { missedReports: 17, receiptsWithinRate: 55 },
    21: { missedReports: 22, receiptsWithinRate: 52 },
    22: { missedReports: 9, receiptsWithinRate: 81 },
    23: { missedReports: 21, receiptsWithinRate: 49 },
  } as Record<number, { missedReports: number; receiptsWithinRate: number }>,
};

export function findComplaint(id: string) {
  return complaints.find((c) => c.id.toLowerCase() === id.toLowerCase());
}
