"use client";

import Link from "next/link";
import { Bell, Info, LogOut, Repeat } from "react-feather";
import { Popover } from "@/components/Popover";
import { AvatarButton, Divider, IconButton, PillButton } from "@/components/sds";
import type { AppNotification } from "@/data/notifications";
import s from "./Popover.module.css";

/** বাংলা / EN switch. Only the collector screens are translated so far, so it explains that. */
export function LanguageToggle({ to }: { to: "bn" | "en" }) {
  return (
    <Popover
      label={to === "bn" ? "Bangla version" : "English version"}
      width={300}
      renderTrigger={(props) =>
        to === "bn" ? (
          <PillButton lang="bn" {...props}>
            বাংলা
          </PillButton>
        ) : (
          <PillButton {...props}>EN</PillButton>
        )
      }
    >
      <div className={s.itemRow}>
        <Info size={16} />
        <p className="t-small-strong">{to === "bn" ? "বাংলা সংস্করণ শীঘ্রই আসছে" : "English version coming soon"}</p>
      </div>
      <p className="t-caption c-secondary">
        {to === "bn"
          ? "Bangla for these pages is coming soon. The collector screens are already Bangla-first."
          : "এই পাতার ইংরেজি সংস্করণ শীঘ্রই আসছে। Collector screens are Bangla-first in this version."}
      </p>
    </Popover>
  );
}

export function NotificationsMenu({ items }: { items: AppNotification[] }) {
  return (
    <Popover
      label="Notifications"
      renderTrigger={(props) => (
        <IconButton label="Notifications" size="small" {...props}>
          <Bell size={20} />
        </IconButton>
      )}
    >
      <p className="t-body-strong" style={{ padding: "0 8px" }}>
        Notifications
      </p>
      {items.map((item) => (
        <Link key={item.title} href={item.href} className={s.item}>
          <span className="t-small-strong">{item.title}</span>
          <span className="t-caption c-secondary">{item.detail}</span>
          <span className="t-caption c-secondary">{item.time}</span>
        </Link>
      ))}
    </Popover>
  );
}

/** Avatar menu: who is signed in, plus switch role and log out. */
export function AccountMenu({
  initials,
  name,
  roleLabel,
  bangla = false,
}: {
  initials: string;
  name: string;
  roleLabel: string;
  bangla?: boolean;
}) {
  return (
    <Popover
      label={bangla ? "অ্যাকাউন্ট" : "Account"}
      width={260}
      renderTrigger={(props) => <AvatarButton initials={initials} label={`${name}: account menu`} {...props} />}
    >
      <div style={{ padding: "0 8px" }}>
        <p className="t-small-strong">{name}</p>
        <p className="t-caption c-secondary">{roleLabel}</p>
      </div>
      <Divider />
      <Link href="/login" className={`${s.item} ${s.itemRow}`} lang={bangla ? "bn" : undefined}>
        <Repeat size={16} />
        <span className="t-small">{bangla ? "অন্য ভূমিকায় লগ ইন" : "Switch role"}</span>
      </Link>
      {/* Plain link: /logout clears the session cookie, so it must never be prefetched. */}
      <a href="/logout" className={`${s.item} ${s.itemRow}`} lang={bangla ? "bn" : undefined}>
        <LogOut size={16} />
        <span className="t-small">{bangla ? "লগ আউট" : "Log out"}</span>
      </a>
    </Popover>
  );
}
