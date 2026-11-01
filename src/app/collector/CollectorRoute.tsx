"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Grid, Info, Maximize } from "react-feather";
import d from "@/components/dashboard.module.css";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/layout";
import { Button, Card, InputField, Notification, Tag, type TagScheme } from "@/components/sds";
import {
  buildingNameBn,
  buildingNameEn,
  collector,
  findBuilding,
  routeStatusLabel,
  toBn,
  type RouteBuilding,
  type RouteStatus,
} from "@/data/collector";
import { resetRoute, saveCheckIn, useRoute } from "./routeStore";
import s from "./collector.module.css";

const statusScheme: Record<RouteStatus, TagScheme> = {
  collected: "positive",
  problem: "danger",
  pending: "neutral",
};

/** Current time as 12-hour h:mm, the format shown in the route table. */
export function nowTime() {
  const now = new Date();
  return `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/** Current time as 24-hour HH:mm, passed to the check-in page. */
function now24() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/** Rows around the collector's current position: the last 3 visited and the next 2 to visit. */
function currentWindow(buildings: RouteBuilding[]) {
  const next = buildings.findIndex((b) => b.status === "pending");
  if (next === -1) return buildings.slice(-5);
  return buildings.slice(Math.max(0, next - 3), next + 2);
}

export function OfflineNotice() {
  return (
    <div lang="bn">
      <Notification icon={<Info size={20} />} title="অফলাইনেও কাজ করবে">
        ইন্টারনেট না থাকলে তথ্য ব্রাউজারে জমা থাকবে এবং সংযোগ ফিরলে পাঠানো হবে।
      </Notification>
    </div>
  );
}

export function CollectorRoute({ showAll }: { showAll: boolean }) {
  const router = useRouter();
  const { buildings, edited } = useRoute();
  const [codeOpen, setCodeOpen] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();

  const count = (status: RouteStatus) => buildings.filter((b) => b.status === status).length;
  const collected = count("collected");
  const problems = count("problem");
  const remaining = count("pending");
  const nextPending = buildings.find((b) => b.status === "pending");
  const rows = showAll ? buildings : currentWindow(buildings);

  function scanQr() {
    if (!nextPending) return;
    // No camera in the demo: scanning "reads" the sticker of the next building on the route.
    router.push(`/collector/check-in/${nextPending.id}?via=qr&t=${now24()}`);
  }

  function openByCode(event: FormEvent) {
    event.preventDefault();
    const building = findBuilding(code);
    if (!building) {
      setCodeError("এই কোডের কোনো ভবন পাওয়া যায়নি।");
      return;
    }
    router.push(`/collector/check-in/${building.id}?via=code&t=${now24()}`);
  }

  return (
    <>
      <PageHeader
        lang="bn"
        title="আজকের রুট"
        subtitle={`ওয়ার্ড ${toBn(collector.ward)} · রুট ${toBn(collector.route)} · ${collector.dateBn}`}
        actions={
          <div className={d.rowWide} lang="bn">
            <Button variant="neutral" iconStart={<Grid size={16} />} onClick={() => setCodeOpen((o) => !o)}>
              ভবনের কোড লিখুন
            </Button>
            <Button iconStart={<Maximize size={16} />} onClick={scanQr} disabled={!nextPending}>
              QR স্ক্যান করুন
            </Button>
          </div>
        }
      />

      {codeOpen && (
        <Card gap={12}>
          <form onSubmit={openByCode} className={s.codeForm} lang="bn">
            <InputField
              id="building-code"
              label="ভবনের কোড"
              description="QR স্টিকারের নিচে লেখা কোড, যেমন ২০-৪-২"
              placeholder="২০-৪-২"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setCodeError(undefined);
              }}
              error={codeError}
              autoFocus
            />
            <Button type="submit">খুঁজুন</Button>
          </form>
        </Card>
      )}

      <section className={s.stats} lang="bn" aria-label="আজকের অগ্রগতি">
        <Card style={{ gap: 6 }}>
          <p className="t-bangla-small c-secondary">সংগৃহীত ভবন</p>
          <p className="t-bangla-number">
            {toBn(collected)} / {toBn(buildings.length)}
          </p>
          <p className="t-caption c-secondary" lang="en">
            {collected} of {buildings.length} buildings collected
          </p>
        </Card>
        <Card style={{ gap: 6 }}>
          <p className="t-bangla-small c-secondary">বাকি ভবন</p>
          <p className="t-bangla-number">{toBn(remaining)}</p>
          <p className="t-caption c-secondary" lang="en">
            {remaining} buildings still to visit
          </p>
        </Card>
        <Card style={{ gap: 6 }}>
          <p className="t-bangla-small c-secondary">সমস্যা</p>
          <p className="t-bangla-number">{toBn(problems)}</p>
          <p className="t-caption c-secondary" lang="en">
            {problems} {problems === 1 ? "building" : "buildings"} reported a problem
          </p>
        </Card>
      </section>

      <DataTable<RouteBuilding>
        lang="bn"
        caption="আজকের রুটের ভবন"
        rows={rows}
        rowKey={(b) => b.id}
        columns={[
          {
            key: "building",
            header: "ভবন",
            render: (b) => (
              <Link href={`/collector/check-in/${b.id}?via=code`} className={s.building}>
                <span className="t-bangla-strong">{buildingNameBn(b)}</span>
                <span className="t-caption c-secondary" lang="en">
                  {buildingNameEn(b)}
                </span>
              </Link>
            ),
          },
          { key: "flats", header: "ফ্ল্যাট", width: 106, render: (b) => toBn(b.flats) },
          {
            key: "status",
            header: "অবস্থা",
            width: 166,
            render: (b) => <Tag scheme={statusScheme[b.status]}>{routeStatusLabel[b.status]}</Tag>,
          },
          {
            key: "time",
            header: "সময়",
            width: 126,
            render: (b) => b.time ?? <span className="t-small c-secondary">—</span>,
          },
          {
            key: "action",
            header: "কাজ",
            width: 246,
            render: (b) =>
              b.status === "pending" ? (
                <Button
                  size="small"
                  onClick={() => saveCheckIn(b.id, { status: "collected", time: toBn(nowTime()) })}
                >
                  সংগৃহীত চিহ্নিত করুন
                </Button>
              ) : (
                b.note ?? <span className="t-small c-secondary">—</span>
              ),
          },
        ]}
      />

      <div className={d.rowWide} lang="bn">
        <Button variant="subtle" size="small" href={showAll ? "/collector" : "/collector?view=all"}>
          {showAll ? "শুধু বর্তমান অংশ দেখুন" : `সব ভবন দেখুন (${toBn(buildings.length)})`}
        </Button>
        {edited && (
          <Button variant="subtle" size="small" onClick={resetRoute}>
            ডেমো তথ্য রিসেট করুন
          </Button>
        )}
      </div>

      <OfflineNotice />
    </>
  );
}
