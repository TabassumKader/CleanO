export type RouteStatus = "collected" | "problem" | "pending";

export type RouteBuilding = {
  id: string;
  /** Code printed under the building's QR sticker, e.g. 20-3-12 (ward-road-house). */
  code: string;
  road: number;
  house: number;
  flats: number;
  caretaker: string;
  lastCollected: string;
  status: RouteStatus;
  time?: string;
  note?: string;
};

const bnDigits = "০১২৩৪৫৬৭৮৯";

/** Convert ASCII digits to Bangla digits. */
export function toBn(value: string | number) {
  return String(value).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

/** Convert Bangla digits back to ASCII digits. */
export function fromBn(value: string) {
  return value.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
}

export function buildingNameBn(b: Pick<RouteBuilding, "house" | "road">) {
  return `বাড়ি ${toBn(b.house)}, রোড ${toBn(b.road)}`;
}

export function buildingNameEn(b: Pick<RouteBuilding, "house" | "road">) {
  return `House ${b.house}, Road ${b.road}`;
}

export const routeStatusLabel: Record<RouteStatus, string> = {
  collected: "সংগৃহীত",
  problem: "সমস্যা",
  pending: "বাকি",
};

export const collector = {
  name: "Rahim Uddin",
  initials: "RU",
  ward: 20,
  route: 2,
  dateBn: "শনিবার, ৩১ অক্টোবর",
};

const caretakers = ["আব্দুল করিম", "জসিম উদ্দিন", "নাসির আহমেদ", "সেলিনা বেগম", "মোঃ হানিফ", "রুমানা আক্তার"];

const visited: [road: number, house: number][] = [
  [1, 3], [1, 5], [1, 7],
  [2, 2], [2, 4], [2, 6], [2, 8], [2, 10], [2, 12], [2, 14], [2, 16],
  [3, 2], [3, 4], [3, 6], [3, 8], [3, 10], [3, 12], [3, 14],
];

const pending: [road: number, house: number][] = [
  [4, 2], [4, 5], [4, 7], [4, 9], [4, 11], [4, 13], [4, 15], [4, 17],
  [5, 1], [5, 3], [5, 6], [5, 8], [5, 10], [5, 12], [5, 14], [5, 16],
  [6, 2], [6, 4], [6, 7], [6, 9], [6, 11], [6, 13], [6, 15],
];

function minutesToTime(total: number) {
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function make(road: number, house: number, index: number): Omit<RouteBuilding, "status"> {
  return {
    id: `r${road}-h${house}`,
    code: `20-${road}-${house}`,
    road,
    house,
    flats: [8, 6, 10, 4, 12, 6, 8, 9][index % 8],
    caretaker: road === 3 && house === 12 ? "আব্দুল করিম" : caretakers[index % caretakers.length],
    lastCollected: `গতকাল, ${toBn(minutesToTime(7 * 60 + 6 + index * 5))}`,
  };
}

const flatsOverride: Record<string, number> = { "r3-h12": 8, "r3-h14": 6, "r3-h16": 10, "r4-h2": 4, "r4-h5": 12 };

/** Today's route in visiting order: 18 collected, 1 problem, 23 still to visit. */
export const route: RouteBuilding[] = [
  ...visited.map(([road, house], i) => {
    const time = road === 3 && house === 12 ? "8:42" : road === 3 && house === 14 ? "8:47" : minutesToTime(7 * 60 + 5 + i * 6);
    return { ...make(road, house, i), status: "collected" as const, time: toBn(time) };
  }),
  { ...make(3, 16, visited.length), status: "problem" as const, time: toBn("8:53"), note: "বর্জ্য প্রস্তুত ছিল না" },
  ...pending.map(([road, house], i) => ({ ...make(road, house, visited.length + 1 + i), status: "pending" as const })),
].map((b) => ({
  ...b,
  flats: flatsOverride[b.id] ?? b.flats,
  lastCollected: b.time ? `গতকাল, ${b.time}` : b.lastCollected,
}));

export function findBuilding(idOrCode: string) {
  const q = fromBn(idOrCode).trim().toLowerCase().replace(/\s+/g, "");
  return route.find((b) => b.id === q || b.code === q || `${b.road}-${b.house}` === q || `20-${b.road}-${b.house}` === q);
}
