export type AppNotification = { title: string; detail: string; time: string; href: string };

export const residentNotifications: AppNotification[] = [
  {
    title: "Report SC-1042 escalated",
    detail: "Sent to the Zone 1 office after 48 hours without a provider reply.",
    time: "31 Oct, 10:15 am",
    href: "/reports/SC-1042",
  },
  {
    title: "Today's pickup confirmed",
    detail: "Collected at 8:42 am, recorded by the collector's QR scan.",
    time: "31 Oct, 8:42 am",
    href: "/resident/pickups",
  },
  {
    title: "October e-receipt issued",
    detail: "Tk 100 paid to Ward 20 Van Service.",
    time: "5 Oct, 9:05 am",
    href: "/receipts/RC-2610-0412",
  },
];

export const caretakerNotifications: AppNotification[] = [
  {
    title: "Confirm today's pickup",
    detail: "Did the van collect waste on Saturday 31 October?",
    time: "31 Oct, 9:00 am",
    href: "/caretaker/pickups",
  },
  {
    title: "Missed pickup reported",
    detail: "3 residents reported no collection on Wed 28 Oct.",
    time: "28 Oct, 6:30 pm",
    href: "/caretaker/pickups#log",
  },
  {
    title: "Pickup on Mon 26 Oct not confirmed",
    detail: "No one confirmed the pickup that day.",
    time: "27 Oct, 9:00 am",
    href: "/caretaker/pickups#log",
  },
];
