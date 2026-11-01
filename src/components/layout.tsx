import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { NavigationPill, type TagScheme } from "@/components/sds";
import type { PickupStatus } from "@/data/types";
import d from "./dashboard.module.css";
import s from "./layout.module.css";

export function LogoMark({ size = 32 }: { size?: 32 | 64 }) {
  return (
    <Image
      src={`/figma/logo-mark-${size}.svg`}
      alt=""
      width={size}
      height={size}
      unoptimized
      priority
    />
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className={s.logo} aria-label="CLEAN - O home">
      <LogoMark />
      <span className={s.logoText}>
        <span className="t-body-strong">CLEAN - O</span>
        <span className={`t-bangla-small c-secondary ${s.logoBangla}`} lang="bn">
          ক্লিন - ও
        </span>
      </span>
    </Link>
  );
}

export type NavItem = { label: string; href: string; lang?: string };

/** The 72px site header shared by every screen. */
export function SiteHeader({
  nav = [],
  active,
  actions,
  homeHref = "/",
}: {
  nav?: NavItem[];
  active?: string;
  actions?: ReactNode;
  homeHref?: string;
}) {
  return (
    <header className={s.header}>
      <Logo href={homeHref} />
      {nav.length > 0 && (
        <nav className={s.nav} aria-label="Primary">
          {nav.map((item) => (
            <NavigationPill
              key={item.label}
              href={item.href}
              lang={item.lang}
              active={item.label === active}
            >
              {item.label}
            </NavigationPill>
          ))}
        </nav>
      )}
      <div className={s.spacer} />
      {actions && <div className={s.actions}>{actions}</div>}
    </header>
  );
}

export function PageMain({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={className ? `${s.main} ${className}` : s.main}>{children}</main>;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  lang,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  lang?: string;
}) {
  const bangla = lang === "bn";
  return (
    <div className={s.pageHeader}>
      <div className={s.pageHeaderText} lang={lang}>
        <h1 className={bangla ? "t-bangla-heading" : "t-heading"}>{title}</h1>
        {subtitle && (
          <p className={`${bangla ? "t-bangla-small" : "t-small"} c-secondary`}>{subtitle}</p>
        )}
      </div>
      {actions}
    </div>
  );
}

/** Label on the left (secondary), strong value right-aligned. */
export function KeyValue({
  label,
  value,
  labelWidth = 180,
}: {
  label: ReactNode;
  value: ReactNode;
  labelWidth?: number;
}) {
  return (
    <div className={`${d.keyValue} t-small`} style={{ "--kv-label": `${labelWidth}px` } as CSSProperties}>
      <span className="c-secondary">{label}</span>
      <span className="t-small-strong">{value}</span>
    </div>
  );
}

/** Coloured status dot exported from the Figma file (collected / missed / not confirmed). */
export function StatusDot({
  status,
  size,
  label,
}: {
  status: PickupStatus;
  size: 10 | 12 | 14;
  label?: string;
}) {
  return (
    <Image
      className={s.dot}
      src={`/figma/dot-${size}-${status}.svg`}
      alt={label ?? ""}
      width={size}
      height={size}
      unoptimized
    />
  );
}

export const pickupStatusLabel: Record<PickupStatus, string> = {
  collected: "Collected",
  missed: "Missed",
  pending: "Not confirmed",
};

export const pickupStatusScheme: Record<PickupStatus, TagScheme> = {
  collected: "positive",
  missed: "danger",
  pending: "neutral",
};

export function StatusLegend() {
  return (
    <div className={s.legend}>
      {(Object.keys(pickupStatusLabel) as PickupStatus[]).map((status) => (
        <div key={status} className={s.legendItem}>
          <StatusDot status={status} size={10} />
          <span className="t-caption c-secondary">{pickupStatusLabel[status]}</span>
        </div>
      ))}
    </div>
  );
}
