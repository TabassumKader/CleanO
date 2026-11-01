import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ChevronRight, Flag, Truck } from "react-feather";
import d from "@/components/dashboard.module.css";
import { DataTable } from "@/components/DataTable";
import { CaretakerHeader } from "@/components/headers";
import { KeyValue, PageHeader, PageMain } from "@/components/layout";
import { Button, Card, ProgressBar, Tag } from "@/components/sds";
import { caretaker } from "@/data/caretaker";
import { collector } from "@/data/collector";
import { reportStatusTag, reports, type Report } from "@/data/reports";
import { resident } from "@/data/resident";
import { findWard } from "@/data/wards";

export const metadata: Metadata = { title: "Caretaker dashboard" };

/** Caretaker home: what needs doing today, then the building's month and its open reports. */
export default function CaretakerDashboard() {
  const ward = findWard("20")!;
  const days = caretaker.october;
  const collected = days.filter((day) => day === "collected").length;
  const missed = days.filter((day) => day === "missed").length;
  const percent = Math.floor((collected / days.length) * 100);
  const buildingReports = reports.filter((report) => report.building === caretaker.building);

  return (
    <>
      <CaretakerHeader active="Dashboard" />
      <PageMain>
        <PageHeader
          title={`Good morning, ${caretaker.name.split(" ")[0]}`}
          subtitle={`Building caretaker · ${caretaker.building} · ${caretaker.flats} flats · ${caretaker.wardLabel}`}
          actions={
            <Button href="/caretaker/pickups" iconStart={<CheckCircle size={16} />}>
              Confirm today&apos;s pickup
            </Button>
          }
        />

        <div className={`${d.split} ${d.splitStretch}`}>
          <Card gap={12} className={d.grow}>
            <div className={d.row}>
              <Truck size={24} />
              <h2 className={`t-body-strong ${d.grow}`}>Today&apos;s pickup</h2>
              <Tag>Not confirmed by you</Tag>
            </div>
            <p className="t-small c-secondary">
              The collector&apos;s QR scan was recorded at {resident.today.time}. Confirm whether the van
              really came, so residents and the ward dashboard can rely on it.
            </p>
            <div>
              <Button href="/caretaker/pickups" variant="neutral" iconEnd={<ChevronRight size={16} />}>
                Open the pickup log
              </Button>
            </div>
          </Card>

          <Card gap={12} className={d.splitSide}>
            <div className={d.row}>
              <h2 className={`t-body-strong ${d.grow}`}>October so far</h2>
              <span className="t-body-strong">{percent}%</span>
            </div>
            <ProgressBar value={percent} label="Share of October days collected" />
            <p className="t-caption c-secondary">
              {collected} of {days.length} days collected · {missed} missed
            </p>
            <Link href="/caretaker/pickups#log" className="t-small" style={{ textDecoration: "underline" }}>
              See every day
            </Link>
          </Card>
        </div>

        <div className={d.split}>
          <section className={d.splitMain}>
            <div className={d.sectionHeader}>
              <h2 className={`t-body-strong ${d.grow}`}>Reports from this building</h2>
              <Button variant="subtle" size="small" href="/reports" iconEnd={<ChevronRight size={16} />}>
                See all
              </Button>
            </div>
            <DataTable<Report>
              caption="Reports from this building"
              rows={buildingReports}
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
                    <Tag scheme={reportStatusTag[report.status].scheme}>{reportStatusTag[report.status].label}</Tag>
                  ),
                },
              ]}
            />
          </section>

          <Card gap={12} className={d.splitSide}>
            <h2 className="t-body-strong">Your building</h2>
            <KeyValue labelWidth={140} label="Flats" value={caretaker.flats} />
            <KeyValue labelWidth={140} label="Collector" value={`Rahim Uddin · Route ${collector.route}`} />
            <KeyValue labelWidth={140} label="Provider" value={ward.provider.name} />
            <KeyValue labelWidth={140} label="Official fee" value={`Tk ${ward.officialFee} a month`} />
            <Button variant="neutral" block href="/report" iconStart={<Flag size={16} />}>
              Report a problem
            </Button>
          </Card>
        </div>
      </PageMain>
    </>
  );
}
