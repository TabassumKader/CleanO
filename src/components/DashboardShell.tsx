import Link from "next/link";
import type { ReactNode } from "react";
import { LogOut } from "react-feather";
import { Logo } from "@/components/layout";
import { Avatar, Button, Divider } from "@/components/sds";
import s from "./DashboardShell.module.css";

export type SideItem = { label: string; href: string; icon: ReactNode };

/** Sidebar layout used by the zonal officer and service provider dashboards (S10–S13). */
export function DashboardShell({
  items,
  active,
  user,
  children,
}: {
  items: SideItem[];
  active: string;
  user: { initials: string; name: string; detail: string };
  children: ReactNode;
}) {
  return (
    <div className={s.shell}>
      <aside className={`${s.sidebar} print-hide`}>
        <div className={s.top}>
          <Logo href={items[0]?.href} />
          <nav className={s.nav} aria-label="Dashboard">
            {items.map((item) => {
              const isActive = item.label === active;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${s.navItem} ${isActive ? s.navItemActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.icon}
                  <span className="t-body">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className={s.bottom}>
          <Divider />
          <div className={s.user}>
            <Avatar initials={user.initials} name={user.name} />
            <div className={s.userText}>
              <p className="t-small-strong">{user.name}</p>
              <p className="t-caption c-secondary">{user.detail}</p>
            </div>
          </div>
          <Button
            variant="subtle"
            size="small"
            href="/logout"
            plainLink
            iconStart={<LogOut size={16} />}
            className={s.logout}
          >
            Log out
          </Button>
        </div>
      </aside>
      <main className={s.main}>{children}</main>
    </div>
  );
}
