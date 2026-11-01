import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, ChevronRight, FileText } from "react-feather";
import { AutoSubmitSelect } from "@/components/AutoSubmitSelect";
import d from "@/components/dashboard.module.css";
import { DataTable } from "@/components/DataTable";
import { Button, Card, IconButton, ProgressBar, Search, Tag } from "@/components/sds";
import {
  complaintStatus,
  complaintsForWard,
  findComplaint,
  formatAge,
  openComplaints,
  registeredBuildings,
  reliabilityTone,
  wardHealth,
  zoneKpis,
  zoneWards,
  type ZoneWard,
} from "@/data/officer";
import { OfficerShell } from "./OfficerShell";
import s from "./officer.module.css";

export const metadata: Metadata = { title: "Zone 1 overview" };

const OFFICIAL_RATE = 100;
const NEEDS_ACTION = ["SC-1038", "SC-1036", "SC-1042"];

// Reads query parameters, so the page renders per request instead of being prerendered.
export const instant = false;

/** S10 · Zonal officer overview. */
export default async function OfficerOverview({ searchParams }: PageProps<"/officer">) {
  const { period: periodParam } = await searchParams;
  const period = periodParam === "30" ? "30" : "7";
  const kpi = zoneKpis[period];
  const overdue = openComplaints.filter((c) => c.status === "overdue").length;
  const needsAction = NEEDS_ACTION.map((id) => findComplaint(id)!);

  return (
    <OfficerShell active="Overview">
      <div className={s.header}>
        <div className={s.headerText}>
          <h1 className="t-heading">Zone 1 overview</h1>
          <p className="t-small c-secondary">
            Household waste collection · {kpi.range} · sample data for illustration
          </p>
        </div>
        <Search
          className={s.search}
          placeholder="Search ward, building or ID"
          action="/officer/complaints"
        />
        <form action="/officer" className={s.period}>
          <AutoSubmitSelect
            id="period"
            name="period"
            aria-label="Time period"
            defaultValue={period}
            options={[
              { value: "7", label: "Last 7 days" },
              { value: "30", label: "Last 30 days" },
            ]}
          />
        </form>
        <IconButton label="Overdue complaints" variant="neutral" href="/officer/complaints?tab=overdue">
          <Bell size={20} />
        </IconButton>
      </div>

      <section className={d.stats} aria-label="Zone summary">
        <Card gap={8}>
          <p className="t-small c-secondary">Pickup reliability</p>
          <div className={d.statValue}>
            <p className="t-number">{kpi.reliability}%</p>
            <Tag scheme="positive">Improving</Tag>
          </div>
          <p className="t-caption c-secondary">{kpi.trend}</p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Open complaints</p>
          <div className={d.statValue}>
            <p className="t-number">{openComplaints.length}</p>
            <Tag scheme="danger">{overdue} overdue</Tag>
          </div>
          <p className="t-caption c-secondary">{overdue} with no action for 72 hours</p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Median fee reported</p>
          <div className={d.statValue}>
            <p className="t-number">Tk {kpi.medianFee}</p>
            {kpi.medianFee > OFFICIAL_RATE && <Tag scheme="warning">Above rate</Tag>}
          </div>
          <p className="t-caption c-secondary">Official rate: Tk {OFFICIAL_RATE}</p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Buildings confirming daily</p>
          <p className="t-number">{kpi.confirmingDaily}%</p>
          <p className="t-caption c-secondary">
            Of {registeredBuildings.toLocaleString("en-US")} registered buildings
          </p>
        </Card>
      </section>

      <div className={d.split}>
        <section id="wards" className={d.splitMain}>
          <div className={d.sectionHeader}>
            <h2 className={`t-body-strong ${d.grow}`}>Wards in Zone 1</h2>
            <Button variant="subtle" size="small" href="/wards" iconEnd={<ChevronRight size={16} />}>
              View all wards
            </Button>
          </div>
          <DataTable<ZoneWard>
            caption="Wards in Zone 1"
            rows={zoneWards}
            rowKey={(w) => String(w.ward)}
            columns={[
              {
                key: "ward",
                header: "Ward",
                width: 66,
                render: (w) => <Link href={`/wards?q=${w.ward}`}>{w.ward}</Link>,
              },
              { key: "provider", header: "Service provider", render: (w) => w.provider },
              {
                key: "reliability",
                header: "Reliability",
                width: 146,
                render: (w) => (
                  <span className={s.reliability}>
                    <span className={s.bar}>
                      <ProgressBar
                        value={w.reliability[period]}
                        tone={reliabilityTone(w.reliability[period])}
                        label={`Ward ${w.ward} reliability`}
                      />
                    </span>
                    <strong className="t-small-strong">{w.reliability[period]}%</strong>
                  </span>
                ),
              },
              {
                key: "complaints",
                header: "Complaints",
                width: 106,
                render: (w) => (
                  <Link href={`/officer/complaints?ward=${w.ward}`}>{complaintsForWard(w.ward)}</Link>
                ),
              },
              { key: "fee", header: "Median fee", width: 96, render: (w) => `Tk ${w.medianFee}` },
              {
                key: "status",
                header: "Status",
                width: 156,
                render: (w) => <Tag scheme={wardHealth[w.health].scheme}>{wardHealth[w.health].label}</Tag>,
              },
            ]}
          />
        </section>

        <aside className={s.side}>
          <h2 className="t-body-strong">Needs action</h2>
          {needsAction.map((c) => (
            <Link key={c.id} href={`/officer/complaints?id=${c.id}`} className={s.actionCard}>
              <span className={d.row}>
                <Tag scheme={complaintStatus[c.status].scheme}>{complaintStatus[c.status].label}</Tag>
                <span className={`t-caption c-secondary ${d.grow}`} style={{ textAlign: "right" }}>
                  {c.id}
                </span>
              </span>
              <span className="t-small-strong">
                {c.id === "SC-1038" ? "Missed pickup for 3 days" : c.type}
              </span>
              <span className="t-caption c-secondary">
                Ward {c.ward} · {c.building} · {formatAge(c.ageHours)} old
              </span>
            </Link>
          ))}
          <Button variant="neutral" block href="/officer/complaints" iconEnd={<ArrowRight size={16} />}>
            Open complaint queue
          </Button>
        </aside>
      </div>

      <Card gap={12}>
        <div className={s.reportBanner}>
          <FileText size={32} />
          <div className={d.stack} style={{ gap: 4 }}>
            <p className="t-body-strong">Weekly report for 24–30 Oct is ready</p>
            <p className="t-small c-secondary">
              Built from pickup confirmations, receipts and complaints. Zonal officers send it to
              the administrator every 7 days.
            </p>
          </div>
          <Button href="/officer/weekly-report" iconStart={<FileText size={16} />}>
            Generate weekly report
          </Button>
        </div>
      </Card>
    </OfficerShell>
  );
}
