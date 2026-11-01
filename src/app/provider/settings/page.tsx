import type { Metadata } from "next";
import { PageHeader } from "@/components/layout";
import { SettingsForm } from "@/components/SettingsForm";
import { ProviderShell } from "../ProviderShell";

export const metadata: Metadata = { title: "Settings" };

export default function ProviderSettingsPage() {
  return (
    <ProviderShell active="Settings">
      <PageHeader title="Settings" subtitle="Ward 20 Van Service · service provider account" />
      <SettingsForm
        profile={{ name: "Ward 20 Van Service", organisation: "Licensed by DSCC for Ward 20", mobile: "01819-202020" }}
        toggles={[
          {
            id: "complaints",
            label: "New complaints",
            description: "SMS as soon as a resident reports a problem. You have 48 hours to reply.",
            on: true,
          },
          {
            id: "missed",
            label: "Missed pickups",
            description: "Alert when a caretaker or resident marks a pickup as missed.",
            on: true,
          },
          {
            id: "dues",
            label: "Monthly dues summary",
            description: "List of unpaid flats on the 10th of each month.",
            on: false,
          },
        ]}
      />
    </ProviderShell>
  );
}
