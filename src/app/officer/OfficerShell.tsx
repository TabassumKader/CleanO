import type { ReactNode } from "react";
import { FileText, Grid, MapPin, MessageSquare, Settings, Truck } from "react-feather";
import { DashboardShell } from "@/components/DashboardShell";
import { officer } from "@/data/officer";

const items = [
  { label: "Overview", href: "/officer", icon: <Grid size={24} /> },
  { label: "Complaints", href: "/officer/complaints", icon: <MessageSquare size={24} /> },
  { label: "Wards", href: "/officer#wards", icon: <MapPin size={24} /> },
  { label: "Providers", href: "/officer#wards", icon: <Truck size={24} /> },
  { label: "Weekly reports", href: "/officer/weekly-report", icon: <FileText size={24} /> },
  { label: "Settings", href: "/officer/settings", icon: <Settings size={24} /> },
];

export function OfficerShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <DashboardShell items={items} active={active} user={officer}>
      {children}
    </DashboardShell>
  );
}
