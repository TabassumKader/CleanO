import type { PickupStatus } from "./types";

export const resident = {
  name: "Farhana Akter",
  firstName: "Farhana",
  initials: "FA",
  mobile: "01712-345678",
  flat: "Flat 4B",
  building: "House 12, Road 3",
  wardId: "20",
  wardLabel: "Ward 20, DSCC",
  today: {
    status: "collected" as PickupStatus,
    time: "8:42 am",
    source: "recorded by the collector's QR scan",
  },
  week: [
    { day: "Sat", status: "collected" },
    { day: "Sun", status: "collected" },
    { day: "Mon", status: "pending" },
    { day: "Tue", status: "collected" },
    { day: "Wed", status: "missed" },
    { day: "Thu", status: "collected" },
    { day: "Fri", status: "collected" },
  ] satisfies { day: string; status: PickupStatus }[],
  fee: {
    month: "October",
    amount: 100,
    officialRate: 100,
    paidOn: "5 Oct 2026",
    paidTo: "Ward 20 Van Service",
    receiptId: "RC-2610-0412",
  },
};
