import { Info } from "react-feather";
import d from "@/components/dashboard.module.css";
import { DataTable } from "@/components/DataTable";
import { Card, Notification, ProgressBar, Tag } from "@/components/sds";
import {
  complaintsForWard,
  registeredBuildings,
  resolvedForWard,
  reliabilityTone,
  wardHealth,
  weeklyReport as r,
  zoneWards,
  type ZoneWard,
} from "@/data/officer";
import s from "../officer.module.css";
import { PrintActions } from "./PrintActions";
import w from "./weekly.module.css";

/** Bars are 1.5px per percentage point, as in the design (82% → 123px). */
const BAR_SCALE = 1.5;

/** S12 · Weekly zone report body, shown to officers in their dashboard and to the public. */
export function WeeklyReport() {
  const totalMissed = Object.values(r.wards).reduce((sum, ward) => sum + ward.missedReports, 0);
  const totalResolved = zoneWards.reduce((sum, ward) => sum + resolvedForWard(ward.ward), 0);
  const fewer = r.missedLastWeek - totalMissed;

  return (
    <>
      <div className={s.header}>
        <div className={s.headerText}>
          <h1 className="t-heading">Weekly report: Zone 1</h1>
          <p className="t-small c-secondary">
            {r.range} · generated automatically · sample data for illustration
          </p>
        </div>
        <PrintActions />
      </div>

      <section className={d.stats} aria-label="Week summary">
        <Card gap={8}>
          <p className="t-small c-secondary">Pickups confirmed</p>
          <p className="t-number">{r.pickupsConfirmed}%</p>
          <p className="t-caption c-secondary">
            Daily average: {r.dailyAverageBuildings.toLocaleString("en-US")} of{" "}
            {registeredBuildings.toLocaleString("en-US")} buildings
          </p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Missed pickups reported</p>
          <p className="t-number">{totalMissed}</p>
          <p className="t-caption c-secondary">
            {Math.abs(fewer)} {fewer >= 0 ? "fewer" : "more"} than the previous week
          </p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Receipts within official rate</p>
          <div className={d.statValue}>
            <p className="t-number">{r.receiptsWithinRate}%</p>
            <Tag scheme="warning">Below target</Tag>
          </div>
          <p className="t-caption c-secondary">
            Of {r.recordedPayments.toLocaleString("en-US")} recorded payments
          </p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Complaints resolved</p>
          <p className="t-number">
            {totalResolved}/{r.complaintsReceived}
          </p>
          <p className="t-caption c-secondary">Median time to resolve: {r.medianDaysToResolve} days</p>
        </Card>
      </section>

      <div className={d.split}>
        <Card gap={12} className={d.grow}>
          <div className={d.row}>
            <h2 className={`t-body-strong ${d.grow}`}>Daily pickup reliability</h2>
            <Tag>Target {r.targetReliability}%</Tag>
          </div>
          <figure className={w.chart} aria-label="Share of buildings with a confirmed pickup, by day">
            {r.daily.map((bar) => (
              <div key={bar.day} className={w.bar}>
                <span className="t-caption-strong c-secondary">{bar.value}%</span>
                <span
                  className={w.barFill}
                  style={{ height: bar.value * BAR_SCALE }}
                  role="img"
                  aria-label={`${bar.day}: ${bar.value}%`}
                />
                <span className="t-caption c-secondary">{bar.day}</span>
              </div>
            ))}
          </figure>
        </Card>

        <Card gap={16} className={w.byType}>
          <h2 className="t-body-strong">Complaints by type</h2>
          {r.byType.map((item) => (
            <div key={item.type} className={w.hbar}>
              <div className={`${d.row} t-small`}>
                <span className={d.grow}>{item.type}</span>
                <strong className="t-small-strong">{item.share}%</strong>
              </div>
              <ProgressBar
                value={item.share}
                tone={item.type.startsWith("Charged") ? "warning" : "brand"}
                label={`${item.type}: ${item.share}% of complaints`}
              />
            </div>
          ))}
        </Card>
      </div>

      <DataTable<ZoneWard>
        caption="Ward breakdown"
        rows={zoneWards}
        rowKey={(ward) => String(ward.ward)}
        columns={[
          { key: "ward", header: "Ward", width: 96, render: (ward) => ward.ward },
          {
            key: "reliability",
            header: "Pickup reliability",
            width: 216,
            render: (ward) => (
              <span className={s.reliability}>
                <span className={s.bar}>
                  <ProgressBar
                    value={ward.reliability["7"]}
                    tone={reliabilityTone(ward.reliability["7"])}
                    label={`Ward ${ward.ward} reliability`}
                  />
                </span>
                <strong className="t-small-strong">{ward.reliability["7"]}%</strong>
              </span>
            ),
          },
          { key: "missed", header: "Missed reports", width: 156, render: (ward) => r.wards[ward.ward].missedReports },
          {
            key: "receipts",
            header: "Receipts within rate",
            width: 196,
            render: (ward) => `${r.wards[ward.ward].receiptsWithinRate}%`,
          },
          {
            key: "complaints",
            header: "Complaints open / resolved",
            render: (ward) => `${complaintsForWard(ward.ward)} / ${resolvedForWard(ward.ward)}`,
          },
          {
            key: "status",
            header: "Status",
            width: 176,
            render: (ward) => <Tag scheme={wardHealth[ward.health].scheme}>{wardHealth[ward.health].label}</Tag>,
          },
        ]}
      />

      <Notification icon={<Info size={20} />} title="How these figures are produced">
        Figures come from caretaker and collector confirmations, recorded payments and resident
        reports. They are self-reported and are not independently audited.
      </Notification>
    </>
  );
}
