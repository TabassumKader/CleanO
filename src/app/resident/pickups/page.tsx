import type { Metadata } from "next";
import { Flag } from "react-feather";
import d from "@/components/dashboard.module.css";
import { ResidentHeader } from "@/components/headers";
import { KeyValue, PageHeader, PageMain, pickupStatusLabel, pickupStatusScheme } from "@/components/layout";
import { MonthSummaryCard, PickupLogTable } from "@/components/PickupHistory";
import { Button, Card, Divider, Tag } from "@/components/sds";
import { caretaker, type PickupLogEntry } from "@/data/caretaker";
import { collector } from "@/data/collector";
import { resident } from "@/data/resident";
import { findWard } from "@/data/wards";

export const metadata: Metadata = { title: "Pickups" };

/** Resident's pickup history for their building (the "Pickups" item in the resident header). */
export default function ResidentPickupsPage() {
  const ward = findWard(resident.wardId)!;
  const today = resident.today;
  const days = [...caretaker.october, today.status];
  const rows: PickupLogEntry[] = [
    {
      date: caretaker.today.short,
      status: today.status,
      time: today.time,
      confirmedBy: "Collector QR scan",
      note: "—",
    },
    ...caretaker.recent,
  ];

  return (
    <>
      <ResidentHeader active="Pickups" />
      <PageMain>
        <PageHeader
          title={`Pickups for ${resident.building}`}
          subtitle={`${resident.flat} · ${resident.wardLabel} · ${ward.provider.service.toLowerCase()}`}
          actions={
            <Button variant="neutral" href="/report" iconStart={<Flag size={16} />}>
              Report a missed pickup
            </Button>
          }
        />

        <div className={`${d.split} ${d.splitStretch}`}>
          <Card gap={12} className={d.splitSide}>
            <p className="t-small c-secondary">{caretaker.today.label}</p>
            <div className={d.row}>
              <h2 className={`t-body-strong ${d.grow}`}>Today&apos;s pickup</h2>
              <Tag scheme={pickupStatusScheme[today.status]}>{pickupStatusLabel[today.status]}</Tag>
            </div>
            <p className="t-small c-secondary">
              Collected at {today.time}, {today.source}.
            </p>
            <Divider />
            <KeyValue labelWidth={120} label="Collector" value={`Rahim Uddin · Route ${collector.route}`} />
            <KeyValue labelWidth={120} label="Caretaker" value={caretaker.name} />
            <KeyValue labelWidth={120} label="Provider" value={ward.provider.name} />
            <p className="t-caption c-secondary">
              If the van did not come, report it. The provider has 48 hours to reply before the zonal
              office steps in.
            </p>
          </Card>

          <MonthSummaryCard days={days} month="October" className={d.grow} />
        </div>

        <h2 className="t-body-strong">Recent days</h2>
        <PickupLogTable rows={rows} />
      </PageMain>
    </>
  );
}
