import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Image as ImageIcon } from "react-feather";
import d from "@/components/dashboard.module.css";
import { KeyValue, PageHeader, PageMain } from "@/components/layout";
import { Timeline } from "@/components/Timeline";
import { SessionHeader } from "@/components/SessionHeader";
import { Card, Divider, Tag } from "@/components/sds";
import { findReport, reportStatusTag, reports } from "@/data/reports";
import { ReportActions } from "./ReportActions";
import s from "./report-status.module.css";

export function generateStaticParams() {
  return reports.map((report) => ({ id: report.id }));
}

export async function generateMetadata({ params }: PageProps<"/reports/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Report ${id}` };
}

/** S6 · Report status tracking. */
export default function ReportStatusPage({ params }: PageProps<"/reports/[id]">) {
  return (
    <>
      <SessionHeader active="Reports" />
      <PageMain>
        <Suspense fallback={<p className="t-small c-secondary">Loading report…</p>}>
          <ReportDetails params={params} />
        </Suspense>
      </PageMain>
    </>
  );
}

/** Reads the URL id inside Suspense so the header and layout can render before it resolves. */
async function ReportDetails({ params }: Pick<PageProps<"/reports/[id]">, "params">) {
  const { id } = await params;
  const report = findReport(id);
  if (!report) notFound();

  const status = reportStatusTag[report.status];
  const subtitle = [report.problem, `submitted ${report.submitted}`, report.anonymous && "anonymous"]
    .filter(Boolean)
    .join(" · ");
  const officeStep = report.steps.find((step) => step.title.startsWith("Escalated"));

  return (
    <>
      <PageHeader
        title={`Report ${report.id}`}
        subtitle={subtitle}
        actions={<Tag scheme={status.scheme}>{status.label}</Tag>}
      />
      <div className={d.split}>
        <Card padding={24} className={d.grow} style={{ gap: 14 }}>
          <h2 className="t-body-strong">Progress</h2>
          <Timeline steps={report.steps} />
          <Divider />
          <h2 className="t-body-strong">Provider response</h2>
          <p className="t-small c-secondary">{report.providerResponse ?? "No response yet."}</p>
          {(officeStep || report.officerNote) && (
            <>
              <Divider />
              <h2 className="t-body-strong">Zonal office note</h2>
              <p className="t-small c-secondary">
                {report.officerNote ??
                  "No note yet. You will be notified by SMS when the office takes action."}
              </p>
            </>
          )}
        </Card>

        <Card gap={12} className={d.splitSide}>
          <h2 className="t-body-strong">Report details</h2>
          <KeyValue labelWidth={120} label="Problem" value={report.problem} />
          {report.amountCharged !== undefined && (
            <KeyValue labelWidth={120} label="Amount charged" value={`Tk ${report.amountCharged}`} />
          )}
          {report.officialRate !== undefined && (
            <KeyValue labelWidth={120} label="Official rate" value={`Tk ${report.officialRate}`} />
          )}
          <KeyValue labelWidth={120} label="Building" value={report.building} />
          <KeyValue labelWidth={120} label="Ward" value={report.wardLabel} />
          {report.photo && (
            <div className={s.photo}>
              <ImageIcon size={32} color="var(--sds-color-icon-default-secondary)" />
              <span className="t-caption c-secondary">{report.photo}</span>
            </div>
          )}
          <ReportActions reportId={report.id} closed={report.status === "resolved"} />
        </Card>
      </div>
    </>
  );
}
