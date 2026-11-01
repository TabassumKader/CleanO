"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { Bell, CheckCircle, FileText, Plus } from "react-feather";
import { useRoute } from "@/app/collector/routeStore";
import d from "@/components/dashboard.module.css";
import { DataTable } from "@/components/DataTable";
import { Button, Card, InputField, Notification, ProgressBar, SelectField, Tag } from "@/components/sds";
import { fromBn } from "@/data/collector";
import {
  paymentDirectory,
  paymentMethods,
  provider,
  routes as staticRoutes,
  unpaidFlats,
  type RouteProgress,
  type UnpaidFlat,
} from "@/data/provider";
import o from "../officer/officer.module.css";
import s from "./provider.module.css";

const PREVIEW_ROWS = 4;

/** "৮:৪২" → "8:42 am" (collection runs in the morning, so 6–11 is am). */
function clockLabel(bnTime: string) {
  const time = fromBn(bnTime);
  const hour = Number(time.split(":")[0]);
  return `${time} ${hour >= 6 && hour <= 11 ? "am" : "pm"}`;
}

export function ProviderConsole() {
  const { buildings } = useRoute();
  const [extraCollectors, setExtraCollectors] = useState<RouteProgress[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [paid, setPaid] = useState<Set<string>>(new Set());
  const [reminded, setReminded] = useState<Set<string>>(new Set());
  const [showAllUnpaid, setShowAllUnpaid] = useState(false);

  const [building, setBuilding] = useState(paymentDirectory[0].building);
  const flats = paymentDirectory.find((b) => b.building === building)!.flats;
  const [flat, setFlat] = useState(flats[0].flat);
  const [amount, setAmount] = useState("100");
  const [method, setMethod] = useState<string>(paymentMethods[0]);
  const [issued, setIssued] = useState<{ receipt: string; flat: string; flagged: boolean } | null>(null);

  /* Route 2 comes from the collector's check-ins (S8/S9), so marking a building there updates this table. */
  const routeRows = useMemo<RouteProgress[]>(() => {
    const visited = buildings.filter((b) => b.status !== "pending");
    const problems = buildings.filter((b) => b.status === "problem").length;
    const last = visited.at(-1);
    const live: RouteProgress = {
      ...staticRoutes[0],
      collected: buildings.filter((b) => b.status === "collected").length,
      total: buildings.length,
      lastCheckIn: last?.time ? clockLabel(last.time) : "—",
      issues: problems === 0 ? "None" : `${problems} not ready`,
    };
    return [live, ...staticRoutes.slice(1), ...extraCollectors];
  }, [buildings, extraCollectors]);

  const collected = routeRows.reduce((sum, r) => sum + r.collected, 0);
  const total = routeRows.reduce((sum, r) => sum + r.total, 0);
  const unpaid = unpaidFlats.filter((f) => !paid.has(f.id));
  const unpaidRows = showAllUnpaid ? unpaid : unpaid.slice(0, PREVIEW_ROWS);
  const charged = Number(amount);
  const aboveRate = charged > provider.officialRate;

  function addCollector(event: FormEvent) {
    event.preventDefault();
    if (!newName.trim()) return;
    setExtraCollectors((current) => [
      ...current,
      { collector: newName.trim(), route: 5 + current.length, collected: 0, total: 0, lastCheckIn: "—", issues: "Not started" },
    ]);
    setNewName("");
    setAdding(false);
  }

  function savePayment(event: FormEvent) {
    event.preventDefault();
    if (!charged || charged <= 0) return;
    const match = unpaidFlats.find((f) => f.flat === flat && f.building === building);
    if (match) setPaid((current) => new Set(current).add(match.id));
    const receipt =
      building === "House 12, Road 3" && flat === "4B"
        ? "RC-2610-0412"
        : `RC-2610-${String(413 + paid.size).padStart(4, "0")}`;
    setIssued({ receipt, flat: `${flat}, ${building}`, flagged: aboveRate });
  }

  return (
    <>
      <div className={o.header}>
        <div className={o.headerText}>
          <h1 className="t-heading">Today: {provider.todayLabel}</h1>
          <p className="t-small c-secondary">
            {provider.name} · {routeRows.length} routes · sample data for illustration
          </p>
        </div>
        <Button variant="neutral" iconStart={<Plus size={16} />} onClick={() => setAdding((a) => !a)}>
          Add collector
        </Button>
      </div>

      {adding && (
        <Card gap={12}>
          <form onSubmit={addCollector} className={s.inlineForm}>
            <InputField
              id="collector-name"
              label="Collector name"
              placeholder="e.g. Babul Sheikh"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <Button type="submit" disabled={!newName.trim()}>
              Add to Route {5 + extraCollectors.length}
            </Button>
          </form>
        </Card>
      )}

      <section className={d.stats} aria-label="Today at a glance">
        <Card gap={8}>
          <p className="t-small c-secondary">Buildings collected</p>
          <p className="t-number">
            {collected}/{total}
          </p>
          <p className="t-caption c-secondary">
            {Math.floor((collected / total) * 100)}% of today&apos;s buildings
          </p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Collectors on route</p>
          <p className="t-number">{routeRows.filter((r) => r.lastCheckIn !== "—").length}</p>
          <p className="t-caption c-secondary">Last check-in {provider.lastCheckIn}</p>
        </Card>
        <Card gap={8}>
          <p className="t-small c-secondary">Unpaid flats, October</p>
          <p className="t-number">{unpaid.length}</p>
          <p className="t-caption c-secondary">
            Tk {(unpaid.length * provider.officialRate).toLocaleString("en-US")} at the official rate
          </p>
        </Card>
        <div id="complaints">
          <Card gap={8} style={{ height: "100%" }}>
            <p className="t-small c-secondary">Open complaints</p>
            <div className={d.statValue}>
              <p className="t-number">{provider.openComplaints}</p>
              <Tag scheme="danger">{provider.dueToday} due today</Tag>
            </div>
            <p className="t-caption c-secondary">{provider.dueToday} need a reply today</p>
          </Card>
        </div>
      </section>

      <div className={d.split}>
        <div className={d.splitMain}>
          <h2 id="routes" className="t-body-strong">
            Route progress
          </h2>
          <DataTable<RouteProgress>
            caption="Route progress"
            rows={routeRows}
            rowKey={(r) => `${r.route}-${r.collector}`}
            columns={[
              {
                key: "collector",
                header: "Collector",
                render: (r) => (r.route === 2 ? <Link href="/collector">{r.collector}</Link> : r.collector),
              },
              { key: "route", header: "Route", width: 96, render: (r) => `Route ${r.route}` },
              {
                key: "progress",
                header: "Progress",
                width: 216,
                render: (r) => (
                  <span className={s.progress}>
                    <span className={s.bar}>
                      <ProgressBar
                        value={r.total ? (r.collected / r.total) * 100 : 0}
                        label={`${r.collector}: ${r.collected} of ${r.total} buildings`}
                      />
                    </span>
                    <strong className="t-small-strong">
                      {r.collected}/{r.total}
                    </strong>
                  </span>
                ),
              },
              { key: "last", header: "Last check-in", width: 126, render: (r) => r.lastCheckIn },
              { key: "issues", header: "Issues", width: 126, render: (r) => r.issues },
            ]}
          />

          <div id="unpaid" className={d.sectionHeader}>
            <h2 className={`t-body-strong ${d.grow}`}>Unpaid this month</h2>
            <Button
              variant="subtle"
              size="small"
              iconStart={<Bell size={16} />}
              disabled={unpaid.every((f) => reminded.has(f.id))}
              onClick={() => setReminded(new Set(unpaid.map((f) => f.id)))}
            >
              {unpaid.length > 0 && unpaid.every((f) => reminded.has(f.id)) ? "All reminded" : "Remind all"}
            </Button>
          </div>
          <DataTable<UnpaidFlat>
            caption="Unpaid this month"
            rows={unpaidRows}
            rowKey={(f) => f.id}
            empty="Every flat has paid for October."
            columns={[
              { key: "flat", header: "Flat", render: (f) => f.flat },
              { key: "building", header: "Building", width: 196, render: (f) => f.building },
              { key: "months", header: "Months due", width: 126, render: (f) => f.monthsDue },
              {
                key: "amount",
                header: "Amount",
                width: 116,
                render: (f) => `Tk ${f.monthsDue * provider.officialRate}`,
              },
              {
                key: "action",
                header: "Action",
                width: 166,
                render: (f) =>
                  reminded.has(f.id) ? (
                    <span className="t-small c-secondary">Reminder sent</span>
                  ) : (
                    <Button
                      variant="subtle"
                      size="small"
                      onClick={() => setReminded((current) => new Set(current).add(f.id))}
                    >
                      Send reminder
                    </Button>
                  ),
              },
            ]}
          />
          {unpaid.length > PREVIEW_ROWS && (
            <div>
              <Button variant="subtle" size="small" onClick={() => setShowAllUnpaid((v) => !v)}>
                {showAllUnpaid ? "Show fewer" : `Show all ${unpaid.length} unpaid flats`}
              </Button>
            </div>
          )}
        </div>

        <Card gap={16} className={d.splitSide} as="aside">
          <form id="payment" onSubmit={savePayment} className={s.paymentForm}>
            <h2 className="t-body-strong">Record a payment</h2>
            <p className="t-small c-secondary">Saving a payment issues an e-receipt to the resident.</p>
            <SelectField
              id="pay-building"
              label="Building"
              value={building}
              onChange={(e) => {
                setBuilding(e.target.value);
                setFlat(paymentDirectory.find((b) => b.building === e.target.value)!.flats[0].flat);
                setIssued(null);
              }}
              options={paymentDirectory.map((b) => b.building)}
            />
            <SelectField
              id="pay-flat"
              label="Flat"
              value={flat}
              onChange={(e) => {
                setFlat(e.target.value);
                setIssued(null);
              }}
              options={flats.map((f) => ({ value: f.flat, label: `${f.flat} · ${f.resident}` }))}
            />
            <InputField
              id="pay-amount"
              label="Amount (Tk)"
              description={`Official rate: Tk ${provider.officialRate}. Higher amounts are flagged.`}
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              error={aboveRate ? "Above the official rate. The zonal office will see this payment." : undefined}
            />
            <SelectField
              id="pay-method"
              label="Method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              options={paymentMethods}
            />
            <Button type="submit" block iconStart={<FileText size={16} />} disabled={!charged}>
              Save and issue e-receipt
            </Button>
          </form>
          {issued && (
            <Notification icon={<CheckCircle size={20} />} title={`E-receipt ${issued.receipt} issued`}>
              Tk {charged} by {method} for flat {issued.flat}.{" "}
              {issued.flagged && "Flagged for the zonal office because it is above the official rate. "}
              {issued.receipt === "RC-2610-0412" && <Link href={`/receipts/${issued.receipt}`}>View receipt</Link>}
            </Notification>
          )}
        </Card>
      </div>
    </>
  );
}
