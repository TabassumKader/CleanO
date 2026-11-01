export type Receipt = {
  id: string;
  month: string;
  amount: number;
  officialRate: number;
  flat: string;
  ward: string;
  provider: string;
  collectedBy: string;
  paidOn: string;
  method: string;
};

const common = {
  officialRate: 100,
  flat: "4B, House 12, Road 3",
  ward: "20, DSCC",
  provider: "Ward 20 Van Service",
  collectedBy: "Rahim Uddin",
  method: "Cash, recorded by the provider",
};

export const receipts: Receipt[] = [
  { ...common, id: "RC-2610-0412", month: "October 2026", amount: 100, paidOn: "5 Oct 2026, 9:05 am" },
  { ...common, id: "RC-2609-0388", month: "September 2026", amount: 150, paidOn: "15 Sep 2026, 11:00 am" },
  { ...common, id: "RC-2608-0365", month: "August 2026", amount: 100, paidOn: "4 Aug 2026, 8:50 am" },
  {
    ...common,
    id: "RC-2607-0341",
    month: "July 2026",
    amount: 100,
    paidOn: "6 Jul 2026, 9:20 am",
    method: "bKash, recorded by the provider",
  },
];

export function findReceipt(id: string) {
  return receipts.find((receipt) => receipt.id.toLowerCase() === id.toLowerCase());
}
