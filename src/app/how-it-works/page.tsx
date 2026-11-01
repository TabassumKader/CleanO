import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "react-feather";
import d from "@/components/dashboard.module.css";
import { PageHeader, PageMain } from "@/components/layout";
import { Card, Tag } from "@/components/sds";
import { SessionHeader } from "@/components/SessionHeader";
import s from "./how.module.css";

export const metadata: Metadata = { title: "How it works" };

/* Roles and screens from the "User flow and navigation map" frame in the design file. */
const roles = [
  {
    role: "Public visitor",
    note: "No login needed",
    screens: [
      { id: "S1", name: "Public ward dashboard", detail: "Reliability, fees and complaints for a ward", href: "/wards" },
      { id: "S5", name: "Report a problem", detail: "Anonymous, with an optional photo", href: "/report?anonymous=1" },
    ],
  },
  {
    role: "Resident",
    note: "Mobile number + one-time code",
    screens: [
      { id: "S2", name: "Log in", detail: "Mobile number + one-time code", href: "/login" },
      { id: "S3", name: "Resident dashboard", detail: "Pickup status, fee, reports", href: "/resident" },
      { id: "S6", name: "Report status", detail: "Timeline and responses", href: "/reports/SC-1042" },
      { id: "S7", name: "E-receipt", detail: "Verifiable fee receipt", href: "/receipts/RC-2610-0412" },
    ],
  },
  {
    role: "Building caretaker",
    note: "Confirms the daily pickup",
    screens: [{ id: "S4", name: "Pickup log", detail: "Confirm today's collection", href: "/caretaker/pickups" }],
  },
  {
    role: "Collector",
    note: "Bangla-first, works offline",
    screens: [
      { id: "S8", name: "Collector route", detail: "Bangla-first building list", href: "/collector" },
      { id: "S9", name: "Building check-in", detail: "QR or code, status choice", href: "/collector/check-in/r4-h2?via=qr" },
    ],
  },
  {
    role: "Zonal officer",
    note: "Oversees Zone 1",
    screens: [
      { id: "S10", name: "Zone overview", detail: "KPIs, wards, overdue items", href: "/officer" },
      { id: "S11", name: "Complaint queue", detail: "Assign, respond, resolve", href: "/officer/complaints" },
      { id: "S12", name: "Weekly report", detail: "Auto-generated 7-day report", href: "/officer/weekly-report" },
    ],
  },
  {
    role: "Service provider",
    note: "Runs the collection vans",
    screens: [{ id: "S13", name: "Provider console", detail: "Routes, dues, payments", href: "/provider" }],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <SessionHeader publicOnly publicActive="How it works" />
      <PageMain>
        <PageHeader
          title="How CLEAN - O works"
          subtitle="Every role works from the same records: pickup confirmations feed the public dashboard, recorded payments issue e-receipts, and officer actions update the status residents see."
        />
        <div className={s.grid}>
          {roles.map((group) => (
            <Card key={group.role} gap={12}>
              <div className={d.row}>
                <h2 className={`t-body-strong ${d.grow}`}>{group.role}</h2>
                <Tag>{group.note}</Tag>
              </div>
              <ul className={s.list}>
                {group.screens.map((screen) => (
                  <li key={screen.id}>
                    <Link href={screen.href} className={s.item}>
                      <span className={`t-caption-strong c-secondary ${s.id}`}>{screen.id}</span>
                      <span className={d.stack}>
                        <span className="t-small-strong">{screen.name}</span>
                        <span className="t-caption c-secondary">{screen.detail}</span>
                      </span>
                      <ChevronRight size={16} className={s.chevron} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </PageMain>
    </>
  );
}
