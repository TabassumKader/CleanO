import type { Metadata } from "next";
import { WeeklyReport } from "@/app/officer/weekly-report/WeeklyReport";
import { OfficerShell } from "../OfficerShell";

export const metadata: Metadata = { title: "Weekly report: Zone 1" };

/** S12 · Weekly zone report (officer view). */
export default function WeeklyReportPage() {
  return (
    <OfficerShell active="Weekly reports">
      <WeeklyReport />
    </OfficerShell>
  );
}
