export const provider = {
  initials: "WV",
  name: "Ward 20 Van Service",
  detail: "Service provider account",
  officialRate: 100,
  todayLabel: "Saturday, 31 October",
  lastCheckIn: "2 minutes ago",
  openComplaints: 6,
  dueToday: 2,
};

export type RouteProgress = {
  collector: string;
  route: number;
  collected: number;
  total: number;
  lastCheckIn: string;
  issues: string;
};

/** Route 2 (Rahim Uddin) is replaced at runtime by the collector's live check-ins from S8/S9. */
export const routes: RouteProgress[] = [
  { collector: "Rahim Uddin", route: 2, collected: 18, total: 42, lastCheckIn: "8:42 am", issues: "1 not ready" },
  { collector: "Karim Mia", route: 1, collected: 30, total: 40, lastCheckIn: "8:50 am", issues: "None" },
  { collector: "Jahid Hasan", route: 3, collected: 34, total: 38, lastCheckIn: "8:47 am", issues: "1 closed" },
  { collector: "Sumon Ali", route: 4, collected: 36, total: 44, lastCheckIn: "8:39 am", issues: "None" },
];

export type UnpaidFlat = { id: string; flat: string; building: string; monthsDue: number };

/** Flats with an unpaid October fee (37 × Tk 100). The first four are the ones drawn in the design. */
export const unpaidFlats: UnpaidFlat[] = [
  { id: "h12r3-6a", flat: "6A", building: "House 12, Road 3", monthsDue: 1 },
  { id: "h14r3-2c", flat: "2C", building: "House 14, Road 3", monthsDue: 2 },
  { id: "h9r1-5b", flat: "5B", building: "House 9, Road 1", monthsDue: 1 },
  { id: "h2r4-1a", flat: "1A", building: "House 2, Road 4", monthsDue: 1 },
  ...Array.from({ length: 33 }, (_, i) => {
    const road = 1 + (i % 6);
    const house = 3 + ((i * 7) % 24);
    const flat = `${1 + (i % 6)}${"ABCD"[i % 4]}`;
    return { id: `gen-${i}`, flat, building: `House ${house}, Road ${road}`, monthsDue: i % 9 === 4 ? 2 : 1 };
  }),
];

/** Buildings and flats for the "Record a payment" form. */
export const paymentDirectory: { building: string; flats: { flat: string; resident: string }[] }[] = [
  {
    building: "House 12, Road 3",
    flats: [
      { flat: "4B", resident: "Farhana Akter" },
      { flat: "6A", resident: "Mizanur Rahman" },
      { flat: "2A", resident: "Shirin Sultana" },
      { flat: "3C", resident: "Tanvir Hossain" },
    ],
  },
  {
    building: "House 14, Road 3",
    flats: [
      { flat: "2C", resident: "Nasrin Jahan" },
      { flat: "5A", resident: "Rafiq Islam" },
    ],
  },
  {
    building: "House 9, Road 1",
    flats: [
      { flat: "5B", resident: "Kamrul Hasan" },
      { flat: "1B", resident: "Ayesha Siddiqua" },
    ],
  },
  {
    building: "House 2, Road 4",
    flats: [
      { flat: "1A", resident: "Abdur Rob" },
      { flat: "3B", resident: "Lipi Akter" },
    ],
  },
];

export const paymentMethods = ["Cash", "bKash", "Nagad", "Bank transfer"] as const;
