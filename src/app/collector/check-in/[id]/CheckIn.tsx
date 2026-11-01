"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowLeft, Check, CheckCircle, Clock, XCircle } from "react-feather";
import d from "@/components/dashboard.module.css";
import { Button, Card, Divider, IconButton, Tag, TextareaField } from "@/components/sds";
import { buildingNameBn, buildingNameEn, toBn, type RouteBuilding, type RouteStatus } from "@/data/collector";
import { nowTime, OfflineNotice } from "../../CollectorRoute";
import { saveCheckIn } from "../../routeStore";
import s from "../../collector.module.css";

/** Bangla part-of-day word plus 12-hour time for a 24-hour HH:mm value, e.g. "সকাল ৮:৪২". */
function spokenTime(time24: string) {
  const [hour, minute] = time24.split(":").map(Number);
  return `${partOfDay(hour)} ${toBn(`${hour % 12 || 12}:${String(minute).padStart(2, "0")}`)}`;
}

function partOfDay(hour: number) {
  if (hour >= 5 && hour < 12) return "সকাল";
  if (hour >= 12 && hour < 15) return "দুপুর";
  if (hour >= 15 && hour < 18) return "বিকাল";
  if (hour >= 18 && hour < 20) return "সন্ধ্যা";
  return "রাত";
}

const choices: {
  status: RouteStatus;
  label: string;
  note?: string;
  variant: "primary" | "neutral";
  icon: ReactNode;
}[] = [
  { status: "collected", label: "সংগৃহীত", variant: "primary", icon: <Check size={16} /> },
  {
    status: "problem",
    label: "বর্জ্য প্রস্তুত নয়",
    note: "বর্জ্য প্রস্তুত ছিল না",
    variant: "neutral",
    icon: <Clock size={16} />,
  },
  { status: "problem", label: "ভবন বন্ধ", note: "ভবন বন্ধ ছিল", variant: "neutral", icon: <XCircle size={16} /> },
];

export function CheckIn({
  building,
  via,
  time,
}: {
  building: RouteBuilding;
  via: "qr" | "code";
  time?: string;
}) {
  const router = useRouter();
  const [comment, setComment] = useState("");

  const verified = via === "qr" ? "QR কোড যাচাই হয়েছে" : "ভবনের কোড দিয়ে খোলা হয়েছে";
  const subtitle = time && /^\d{1,2}:\d{2}$/.test(time) ? `${verified} · ${spokenTime(time)}` : verified;

  function record(choice: (typeof choices)[number]) {
    const note = [choice.note, comment.trim()].filter(Boolean).join(" · ") || undefined;
    saveCheckIn(building.id, { status: choice.status, time: toBn(nowTime()), note });
    router.push("/collector");
  }

  return (
    <>
      <div className={d.rowWide} lang="bn">
        <IconButton label="রুটে ফিরে যান" variant="neutral" href="/collector">
          <ArrowLeft size={20} />
        </IconButton>
        <div className={d.stack} style={{ gap: 4 }}>
          <h1 className="t-bangla-heading">ভবন নিশ্চিতকরণ</h1>
          <p className="t-bangla-small c-secondary">{subtitle}</p>
        </div>
      </div>

      <div className={s.checkRow} lang="bn">
        <Card gap={12} tone="positive" className={s.buildingCard}>
          <div className={s.buildingHero}>
            <CheckCircle size={48} className={s.heroIcon} aria-hidden />
            <h2 className="t-bangla-heading">{buildingNameBn(building)}</h2>
            <p className="t-small c-secondary" lang="en">
              {buildingNameEn(building)} · Ward 20
            </p>
            <Tag scheme="positive">{via === "qr" ? "QR সঠিক" : "কোড সঠিক"}</Tag>
          </div>
          <Divider />
          <div className={s.fact}>
            <span className="t-bangla-small">ফ্ল্যাট সংখ্যা</span>
            <span className="t-bangla-strong">{toBn(building.flats)}</span>
          </div>
          <div className={s.fact}>
            <span className="t-bangla-small">শেষ সংগ্রহ</span>
            <span className="t-bangla-strong">{building.lastCollected}</span>
          </div>
          <div className={s.fact}>
            <span className="t-bangla-small">তত্ত্বাবধায়ক</span>
            <span className="t-bangla-strong">{building.caretaker}</span>
          </div>
        </Card>

        <Card gap={16} padding={24} className={d.grow}>
          <h2 className="t-bangla-strong">সংগ্রহের অবস্থা বেছে নিন</h2>
          {choices.map((choice) => (
            <Button
              key={choice.label}
              variant={choice.variant}
              block
              className={s.statusButton}
              iconStart={choice.icon}
              onClick={() => record(choice)}
            >
              {choice.label}
            </Button>
          ))}
          <TextareaField
            id="comment"
            label="মন্তব্য (ঐচ্ছিক)"
            placeholder="যেমন: গেট বন্ধ ছিল"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Card>
      </div>

      <OfflineNotice />
    </>
  );
}
