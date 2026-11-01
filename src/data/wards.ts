import type { PickupStatus } from "./types";

export type Ward = {
  id: string;
  name: string;
  corporation: "DSCC" | "DNCC";
  areas: string[];
  officialFee: number;
  typicalFeePaid: number;
  feeReports: number;
  complaintsResolved: number;
  complaintsTotal: number;
  provider: { name: string; service: string };
  /** Pickup record for October, one entry per day. */
  october: PickupStatus[];
};

function month(missed: number[], pending: number[], days = 30): PickupStatus[] {
  return Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    if (missed.includes(day)) return "missed";
    if (pending.includes(day)) return "pending";
    return "collected";
  });
}

export const wards: Ward[] = [
  {
    id: "20",
    name: "Ward 20",
    corporation: "DSCC",
    areas: ["Dhanmondi", "Kalabagan", "Road 3"],
    officialFee: 100,
    typicalFeePaid: 150,
    feeReports: 41,
    complaintsResolved: 18,
    complaintsTotal: 24,
    provider: { name: "Ward 20 Van Service", service: "Door-to-door collection, daily 7–11 am" },
    october: month([5, 12, 28], [26]),
  },
  {
    id: "14",
    name: "Ward 14",
    corporation: "DSCC",
    areas: ["Lalbagh", "Azimpur"],
    officialFee: 100,
    typicalFeePaid: 100,
    feeReports: 33,
    complaintsResolved: 11,
    complaintsTotal: 12,
    provider: { name: "Azimpur Clean Team", service: "Door-to-door collection, daily 6–10 am" },
    october: month([9], [17, 30]),
  },
  {
    id: "17",
    name: "Ward 17",
    corporation: "DSCC",
    areas: ["Hazaribagh", "Jigatola"],
    officialFee: 100,
    typicalFeePaid: 200,
    feeReports: 27,
    complaintsResolved: 9,
    complaintsTotal: 21,
    provider: { name: "Green Lane Services", service: "Door-to-door collection, every other day" },
    october: month([2, 3, 8, 14, 15, 22, 27], [11, 19]),
  },
];

export function findWard(query: string | undefined): Ward | undefined {
  if (!query) return wards[0];
  const q = query.trim().toLowerCase();
  if (!q) return wards[0];
  return wards.find(
    (ward) =>
      ward.id === q.replace(/^ward\s*/, "") ||
      ward.name.toLowerCase().includes(q) ||
      ward.areas.some((area) => area.toLowerCase().includes(q)),
  );
}

export function wardStats(ward: Ward) {
  const collected = ward.october.filter((day) => day === "collected").length;
  const reliability = Math.floor((collected / ward.october.length) * 100);
  const overcharge = Math.round(((ward.typicalFeePaid - ward.officialFee) / ward.officialFee) * 100);
  return { collected, days: ward.october.length, reliability, overcharge };
}
