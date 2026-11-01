import type { PickupStatus } from "./types";
import { wards } from "./wards";

export type PickupLogEntry = {
  date: string;
  status: PickupStatus;
  time: string;
  confirmedBy: string;
  note: string;
};

export const caretaker = {
  name: "Abdul Karim",
  initials: "AK",
  building: "House 12, Road 3",
  flats: 8,
  wardLabel: "Ward 20, DSCC",
  today: { label: "Today, Saturday 31 October", short: "Sat 31 Oct", day: 31 },
  /** Days 1–30 of October; today's answer is added on the page. */
  october: wards[0].october,
  recent: [
    { date: "Fri 30 Oct", status: "collected", time: "8:42 am", confirmedBy: "Caretaker (Abdul Karim)", note: "—" },
    { date: "Thu 29 Oct", status: "collected", time: "9:15 am", confirmedBy: "Resident, Flat 4B", note: "—" },
    { date: "Wed 28 Oct", status: "missed", time: "—", confirmedBy: "3 residents reported", note: "Van did not come" },
    { date: "Tue 27 Oct", status: "collected", time: "8:30 am", confirmedBy: "Collector QR scan", note: "—" },
    { date: "Mon 26 Oct", status: "pending", time: "—", confirmedBy: "No confirmation received", note: "Reminder sent to caretaker" },
  ] satisfies PickupLogEntry[] as PickupLogEntry[],
};
