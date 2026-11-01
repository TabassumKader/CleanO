import type { ReactNode } from "react";
import { Activity, CreditCard, Home, MapPin, MessageSquare, Settings } from "react-feather";
import { DashboardShell } from "@/components/DashboardShell";
import { provider } from "@/data/provider";

const items = [
  { label: "Today", href: "/provider", icon: <Activity size={24} /> },
  { label: "Buildings", href: "/provider#unpaid", icon: <Home size={24} /> },
  { label: "Fees & receipts", href: "/provider#payment", icon: <CreditCard size={24} /> },
  { label: "Routes", href: "/provider#routes", icon: <MapPin size={24} /> },
  { label: "Complaints", href: "/provider#complaints", icon: <MessageSquare size={24} /> },
  { label: "Settings", href: "/provider/settings", icon: <Settings size={24} /> },
];

export function ProviderShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <DashboardShell items={items} active={active} user={provider}>
      {children}
    </DashboardShell>
  );
}
