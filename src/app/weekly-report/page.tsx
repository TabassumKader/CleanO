import type { Metadata } from "next";
import { WeeklyReport } from "@/app/officer/weekly-report/WeeklyReport";
import { PageMain } from "@/components/layout";
import { SessionHeader } from "@/components/SessionHeader";

export const metadata: Metadata = { title: "Weekly report: Zone 1" };

/** Public view of the weekly zone report, linked from the ward dashboard (S1). */
export default function PublicWeeklyReportPage() {
  return (
    <>
      <SessionHeader publicOnly publicActive="Ward dashboards" />
      <PageMain>
        <WeeklyReport />
      </PageMain>
    </>
  );
}
