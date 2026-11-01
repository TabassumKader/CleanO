import type { Metadata } from "next";
import { PageHeader } from "@/components/layout";
import { SettingsForm } from "@/components/SettingsForm";
import { OfficerShell } from "../OfficerShell";

export const metadata: Metadata = { title: "Settings" };

export default function OfficerSettingsPage() {
  return (
    <OfficerShell active="Settings">
      <PageHeader title="Settings" subtitle="Zonal Executive Officer · Zone 1 · DSCC" />
      <SettingsForm
        profile={{ name: "Zonal Executive Officer", organisation: "Dhaka South City Corporation, Zone 1", mobile: "01711-000111" }}
        toggles={[
          {
            id: "overdue",
            label: "Overdue complaints",
            description: "SMS when a complaint has had no action for 72 hours.",
            on: true,
          },
          {
            id: "escalated",
            label: "Escalations",
            description: "SMS when a provider misses the 48-hour reply window.",
            on: true,
          },
          {
            id: "weekly",
            label: "Weekly report ready",
            description: "Reminder every Saturday to send the 7-day report to the administrator.",
            on: true,
          },
          {
            id: "fees",
            label: "Fees above the official rate",
            description: "Daily summary of payments recorded above Tk 100.",
            on: false,
          },
        ]}
      />
    </OfficerShell>
  );
}
