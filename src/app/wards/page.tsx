import type { Metadata } from "next";
import { AlertTriangle, ChevronRight, Flag, Truck } from "react-feather";
import { AutoSubmitSelect } from "@/components/AutoSubmitSelect";
import d from "@/components/dashboard.module.css";
import { PageMain, StatusLegend } from "@/components/layout";
import { MonthGrid } from "@/components/MonthGrid";
import { Button, Card, Search, Tag } from "@/components/sds";
import { SessionHeader } from "@/components/SessionHeader";
import { findWard, wardStats, wards } from "@/data/wards";
import s from "./page.module.css";

const periods = [
  { value: "30", label: "Last 30 days" },
  { value: "7", label: "Last 7 days" },
];

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// Reads query parameters, so the page renders per request instead of being prerendered.
export const instant = false;

export const metadata: Metadata = { title: "Ward dashboard" };

/** S1 · Public ward dashboard (no login needed). */
export default async function PublicWardDashboard({ searchParams }: PageProps<"/wards">) {
  const params = await searchParams;
  const query = one(params.q);
  const period = one(params.period) === "7" ? 7 : 30;
  const ward = findWard(query);

  return (
    <>
      <SessionHeader publicOnly publicActive="Ward dashboards" />
      <PageMain>
        <section className={s.intro}>
          <div className={s.introText}>
            <h1 className="t-heading">Household waste collection in your ward</h1>
            <p className="t-body c-secondary">
              See how reliably waste is collected, what residents pay and how complaints are
              handled. Anyone can report a problem.
            </p>
          </div>
          <Search
            className={s.search}
            placeholder="Search ward or area"
            defaultValue={query}
            action="/wards"
          />
          <Button href="/report?anonymous=1" iconStart={<Flag size={16} />}>
            Report a problem
          </Button>
        </section>

        {ward ? (
          <WardDetails ward={ward} period={period} query={query} />
        ) : (
          <Card gap={12}>
            <p className="t-body-strong">No ward matches “{query}”</p>
            <p className="t-small c-secondary">Sample data is available for these wards:</p>
            <div className={s.notFound}>
              {wards.map((w) => (
                <Button key={w.id} variant="neutral" size="small" href={`/wards?q=${w.id}`}>
                  {w.name} · {w.corporation}
                </Button>
              ))}
            </div>
          </Card>
        )}
      </PageMain>
    </>
  );
}

function WardDetails({
  ward,
  period,
  query,
}: {
  ward: NonNullable<ReturnType<typeof findWard>>;
  period: 7 | 30;
  query?: string;
}) {
  const firstDay = ward.october.length - period + 1;
  const stats = wardStats({ ...ward, october: ward.october.slice(firstDay - 1) });
  const overcharged = ward.typicalFeePaid > ward.officialFee;

  return (
    <>
      <div className={s.wardRow}>
        <h2 className="t-heading">
          {ward.name} · {ward.corporation}
        </h2>
        <Tag>Sample data</Tag>
        <form action="/wards" className={s.periodForm}>
          {query && <input type="hidden" name="q" value={query} />}
          <AutoSubmitSelect
            id="period"
            name="period"
            aria-label="Time period"
            options={periods}
            defaultValue={String(period)}
          />
        </form>
      </div>

      <section className={d.stats} aria-label="Ward summary">
        <Card gap={8}>
          <p className="t-small c-secondary">Pickup reliability</p>
          <p className="t-number">{stats.reliability}%</p>
          <p className="t-caption c-secondary">
            {stats.collected} of {stats.days} days collected
          </p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Official monthly fee</p>
          <p className="t-number">Tk {ward.officialFee}</p>
          <p className="t-caption c-secondary">
            {ward.corporation} rate for household collection
          </p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Typical fee paid</p>
          <div className={d.statValue}>
            <p className="t-number">Tk {ward.typicalFeePaid}</p>
            {overcharged ? <Tag scheme="warning">Above rate</Tag> : <Tag scheme="positive">At rate</Tag>}
          </div>
          <p className="t-caption c-secondary">Median of {ward.feeReports} resident reports</p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Complaints resolved</p>
          <p className="t-number">
            {ward.complaintsResolved}/{ward.complaintsTotal}
          </p>
          <p className="t-caption c-secondary">Resolved within the last 30 days</p>
        </Card>
      </section>

      {overcharged && (
        <div className={d.alert} role="note">
          <AlertTriangle size={20} />
          <p className="t-small-strong">
            Residents in this ward report paying {stats.overcharge}% more than the official rate. If
            you were charged more, please report it.
          </p>
        </div>
      )}

      <div className={d.split}>
        <Card gap={16} className={d.grow}>
          <div className={s.recordHeader}>
            <h3 className="t-body-strong">Pickup record, October</h3>
            <p className="t-caption c-secondary">Confirmed by caretakers, collectors and residents</p>
          </div>
          <MonthGrid days={ward.october} month="October" dimBefore={firstDay} />
          <StatusLegend />
        </Card>

        <div className={d.splitSide}>
          <Card gap={12}>
            <p className="t-small c-secondary">Service provider</p>
            <div className={s.provider}>
              <Truck size={24} />
              <div className={d.stack}>
                <p className="t-body-strong">{ward.provider.name}</p>
                <p className="t-small c-secondary">{ward.provider.service}</p>
              </div>
            </div>
            <Button variant="neutral" block href="/weekly-report" iconEnd={<ChevronRight size={16} />}>
              View weekly report
            </Button>
          </Card>
          <Card gap={12}>
            <p className="t-body-strong">Missed pickup or overcharged?</p>
            <p className="t-small c-secondary">
              Tell the city corporation. You can report without giving your name.
            </p>
            <Button block href="/report?anonymous=1" iconStart={<Flag size={16} />}>
              Report a problem
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
