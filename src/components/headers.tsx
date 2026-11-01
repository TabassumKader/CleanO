import { AccountMenu, LanguageToggle, NotificationsMenu } from "@/components/HeaderMenus";
import { SiteHeader } from "@/components/layout";
import { Button } from "@/components/sds";
import { caretakerNotifications, residentNotifications, type AppNotification } from "@/data/notifications";
import type { Role } from "@/data/types";
import { roleHome } from "@/lib/session";

function UserActions({
  initials,
  name,
  roleLabel,
  notifications,
}: {
  initials: string;
  name: string;
  roleLabel: string;
  notifications: AppNotification[];
}) {
  return (
    <>
      <LanguageToggle to="bn" />
      <NotificationsMenu items={notifications} />
      <AccountMenu initials={initials} name={name} roleLabel={roleLabel} />
    </>
  );
}

/** Header for pages anyone can open. Signed-in users get a way back to their dashboard. */
export function PublicHeader({ active, role }: { active?: string; role?: Role }) {
  return (
    <SiteHeader
      active={active}
      nav={[
        { label: "Ward dashboards", href: "/wards" },
        { label: "How it works", href: "/how-it-works" },
        { label: "Report a problem", href: role ? "/report" : "/report?anonymous=1" },
      ]}
      actions={
        <>
          <LanguageToggle to="bn" />
          {role ? (
            <Button size="small" href={roleHome(role)}>
              My dashboard
            </Button>
          ) : (
            <Button size="small" href="/login">
              Log in
            </Button>
          )}
        </>
      }
    />
  );
}

export function LoginHeader() {
  return <SiteHeader actions={<LanguageToggle to="bn" />} />;
}

export function CollectorHeader({ active }: { active?: string }) {
  return (
    <SiteHeader
      homeHref="/collector"
      active={active}
      nav={[
        { label: "আজকের রুট", href: "/collector", lang: "bn" },
        { label: "সংগ্রহের ইতিহাস", href: "/collector?view=all", lang: "bn" },
        { label: "সাহায্য", href: "/how-it-works", lang: "bn" },
      ]}
      actions={
        <>
          <LanguageToggle to="en" />
          <AccountMenu initials="RU" name="Rahim Uddin" roleLabel="সংগ্রাহক · রুট ২" bangla />
        </>
      }
    />
  );
}

export function CaretakerHeader({ active }: { active?: string }) {
  return (
    <SiteHeader
      homeHref="/caretaker"
      active={active}
      nav={[
        { label: "Dashboard", href: "/caretaker" },
        { label: "Pickups", href: "/caretaker/pickups" },
        { label: "Reports", href: "/reports" },
        { label: "Receipts", href: "/receipts/RC-2610-0412" },
      ]}
      actions={
        <UserActions
          initials="AK"
          name="Abdul Karim"
          roleLabel="Caretaker · House 12, Road 3"
          notifications={caretakerNotifications}
        />
      }
    />
  );
}

export function ResidentHeader({ active }: { active?: string }) {
  return (
    <SiteHeader
      homeHref="/resident"
      active={active}
      nav={[
        { label: "Dashboard", href: "/resident" },
        { label: "Pickups", href: "/resident/pickups" },
        { label: "Reports", href: "/reports" },
        { label: "Receipts", href: "/receipts/RC-2610-0412" },
      ]}
      actions={
        <UserActions
          initials="FA"
          name="Farhana Akter"
          roleLabel="Resident · Flat 4B, House 12, Road 3"
          notifications={residentNotifications}
        />
      }
    />
  );
}
