import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Flag } from "react-feather";
import { DataTable } from "@/components/DataTable";
import { PageHeader, PageMain } from "@/components/layout";
import { Button, Card, Tag } from "@/components/sds";
import { SessionHeader } from "@/components/SessionHeader";
import { reportStatusTag, reports, type Report } from "@/data/reports";
import { currentRole } from "@/lib/serverSession";

export const metadata: Metadata = { title: "My reports" };

/** Reports list (not a separate screen in the design: it backs the "Reports" nav item and "See all"). */
export default function ReportsPage() {
  return (
    <>
      <SessionHeader active="Reports" publicActive="Report a problem" />
      <PageMain>
        <Suspense fallback={<p className="t-small c-secondary">Loading reports…</p>}>
          <ReportsList />
        </Suspense>
      </PageMain>
    </>
  );
}

async function ReportsList() {
  const role = await currentRole();

  if (role !== "resident" && role !== "caretaker") {
    return (
      <>
        <PageHeader title="Reports" />
        <Card gap={12} style={{ maxWidth: 560 }}>
          <p className="t-body-strong">Log in to follow your reports</p>
          <p className="t-small c-secondary">
            Residents and caretakers can see the reports they sent and every reply. You can still
            report a problem anonymously without an account.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button href="/login">Log in</Button>
            <Button variant="neutral" href="/report?anonymous=1" iconStart={<Flag size={16} />}>
              Report anonymously
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={role === "resident" ? "My reports" : "Reports for House 12, Road 3"}
        subtitle="Reports go to the service provider first, then to the zonal office if there is no reply within 48 hours"
        actions={
          <Button href="/report" iconStart={<Flag size={16} />}>
            Report a problem
          </Button>
        }
      />
      <DataTable<Report>
        caption="Reports"
        rows={reports}
        rowKey={(report) => report.id}
        columns={[
          {
            key: "id",
            header: "ID",
            width: 106,
            render: (report) => <Link href={`/reports/${report.id}`}>{report.id}</Link>,
          },
          { key: "problem", header: "Problem", render: (report) => report.problem },
          { key: "building", header: "Building", width: 176, render: (report) => report.building },
          { key: "submitted", header: "Submitted", width: 146, render: (report) => report.submitted },
          {
            key: "status",
            header: "Status",
            width: 174,
            render: (report) => (
              <Tag scheme={reportStatusTag[report.status].scheme}>{reportStatusTag[report.status].label}</Tag>
            ),
          },
        ]}
      />
    </>
  );
}
