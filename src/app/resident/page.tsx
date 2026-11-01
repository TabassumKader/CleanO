import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FileText, Flag, Info, Truck } from "react-feather";
import d from "@/components/dashboard.module.css";
import { DataTable } from "@/components/DataTable";
import { ResidentHeader } from "@/components/headers";
import { PageHeader, PageMain, StatusDot, StatusLegend, pickupStatusLabel } from "@/components/layout";
import { Button, Card, Divider, Notification, Tag } from "@/components/sds";
import { reportStatusTag, reports, type Report } from "@/data/reports";
import { resident } from "@/data/resident";
import { findWard, wardStats } from "@/data/wards";
import s from "./resident.module.css";

export const metadata: Metadata = { title: "Resident dashboard" };

/** S3 · Resident dashboard. */
export default function ResidentDashboard() {
  const ward = findWard(resident.wardId)!;
  const stats = wardStats(ward);
  const myReports = reports.filter((report) => report.reporter === resident.name);
  const openReport = myReports.find((report) => report.status !== "resolved");
  const todayTag = pickupStatusLabel[resident.today.status];

  return (
    <>
      <ResidentHeader active="Dashboard" />
      <PageMain>
        <PageHeader
          title={`Good morning, ${resident.firstName}`}
          subtitle={`${resident.flat} · ${resident.building} · ${resident.wardLabel}`}
          actions={
            <Button href="/report" iconStart={<Flag size={16} />}>
              Report a problem
            </Button>
          }
        />

        <div className={`${d.split} ${d.splitStretch}`}>
          <Card gap={12} className={d.grow}>
            <div className={d.row}>
              <Truck size={24} />
              <h2 className={`t-body-strong ${d.grow}`}>Today&apos;s pickup</h2>
              <Tag scheme={resident.today.status === "collected" ? "positive" : "danger"}>{todayTag}</Tag>
            </div>
            <p className="t-small c-secondary">
              Collected at {resident.today.time} · {resident.today.source}
            </p>
            <Divider />
            <ol className={s.week}>
              {resident.week.map(({ day, status }) => (
                <li key={day} className={s.weekDay}>
                  <span className="t-caption c-secondary">{day}</span>
                  <StatusDot status={status} size={12} label={`${day}: ${pickupStatusLabel[status]}`} />
                </li>
              ))}
            </ol>
            <div className={d.row}>
              <div className={d.grow}>
                <StatusLegend />
              </div>
              <Button variant="subtle" size="small" href="/resident/pickups" iconEnd={<ChevronRight size={16} />}>
                See all pickups
              </Button>
            </div>
          </Card>

          <Card gap={12} className={d.splitSide}>
            <div className={d.row}>
              <h2 className={`t-body-strong ${d.grow}`}>{resident.fee.month} fee</h2>
              <Tag scheme="positive">Paid</Tag>
            </div>
            <div className={s.feeRow}>
              <p className="t-number">Tk {resident.fee.amount}</p>
              <p className="t-small c-secondary">Official rate: Tk {resident.fee.officialRate}</p>
            </div>
            <p className="t-caption c-secondary">
              Paid on {resident.fee.paidOn} to {resident.fee.paidTo}
            </p>
            <Button
              variant="neutral"
              block
              href={`/receipts/${resident.fee.receiptId}`}
              iconStart={<FileText size={16} />}
            >
              View e-receipt
            </Button>
          </Card>
        </div>

        <div className={d.split}>
          <section className={d.splitMain}>
            <div className={d.sectionHeader}>
              <h2 className={`t-body-strong ${d.grow}`}>My reports</h2>
              <Button
                variant="subtle"
                size="small"
                href="/reports"
                iconEnd={<ChevronRight size={16} />}
              >
                See all
              </Button>
            </div>
            <DataTable<Report>
              caption="My reports"
              rows={myReports}
              rowKey={(report) => report.id}
              columns={[
                {
                  key: "id",
                  header: "ID",
                  width: 106,
                  render: (report) => <Link href={`/reports/${report.id}`}>{report.id}</Link>,
                },
                { key: "problem", header: "Problem", render: (report) => report.problem },
                { key: "submitted", header: "Submitted", width: 146, render: (report) => report.submitted },
                {
                  key: "status",
                  header: "Status",
                  width: 174,
                  render: (report) => (
                    <Tag scheme={reportStatusTag[report.status].scheme}>
                      {reportStatusTag[report.status].label}
                    </Tag>
                  ),
                },
              ]}
            />
          </section>

          <div className={d.splitSide}>
            {openReport && (
              <Link href={`/reports/${openReport.id}`}>
                <Notification icon={<Info size={20} />} title={`Report ${openReport.id} is under review`}>
                  The provider did not reply within 48 hours, so it was sent to the zonal office on 31
                  Oct.
                </Notification>
              </Link>
            )}
            <Card gap={12}>
              <h2 className="t-body-strong">
                {ward.name} at a glance
              </h2>
              <div className={`${d.keyValue} t-small`}>
                <span className="c-secondary">Pickup reliability</span>
                <strong className="t-small-strong">{stats.reliability}%</strong>
              </div>
              <div className={`${d.keyValue} t-small`}>
                <span className="c-secondary">Typical fee paid</span>
                <strong className="t-small-strong">Tk {ward.typicalFeePaid}</strong>
              </div>
              <div className={`${d.keyValue} t-small`}>
                <span className="c-secondary">Complaints resolved</span>
                <strong className="t-small-strong">
                  {ward.complaintsResolved} of {ward.complaintsTotal}
                </strong>
              </div>
              <Button variant="neutral" block href={`/wards?q=${ward.id}`}>
                View ward dashboard
              </Button>
            </Card>
          </div>
        </div>
      </PageMain>
    </>
  );
}
