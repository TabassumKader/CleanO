import type { Metadata } from "next";
import { Shield } from "react-feather";
import d from "@/components/dashboard.module.css";
import { Suspense } from "react";
import { CaretakerHeader, PublicHeader, ResidentHeader } from "@/components/headers";
import { PageHeader, PageMain, SiteHeader } from "@/components/layout";
import { Timeline } from "@/components/Timeline";
import { Card } from "@/components/sds";
import { currentRole } from "@/lib/serverSession";
import { roleHome } from "@/lib/session";
import { ReportForm } from "./ReportForm";

export const metadata: Metadata = { title: "Report a problem" };

/** S5 · Report a problem (optional photo, can be anonymous). */
export default function ReportPage({ searchParams }: PageProps<"/report">) {
  return (
    <Suspense fallback={<SiteHeader />}>
      <ReportScreen searchParams={searchParams} />
    </Suspense>
  );
}

/**
 * Residents and caretakers report from their own header; anyone else (or `?anonymous=1`,
 * used by the public pages) gets the public, always-anonymous version.
 */
async function ReportScreen({ searchParams }: Pick<PageProps<"/report">, "searchParams">) {
  const [{ anonymous }, role] = await Promise.all([searchParams, currentRole()]);
  const reporter = anonymous !== "1" && (role === "resident" || role === "caretaker") ? role : undefined;
  const isPublic = !reporter;

  return (
    <>
      {reporter === "resident" && <ResidentHeader active="Reports" />}
      {reporter === "caretaker" && <CaretakerHeader active="Reports" />}
      {isPublic && <PublicHeader active="Report a problem" role={role} />}
      <PageMain>
        <PageHeader
          title="Report a problem"
          subtitle={
            isPublic
              ? "Ward 20 · reports go to the provider first, then to the zonal office"
              : "Ward 20 · House 12, Road 3 · reports go to the provider first, then to the zonal office"
          }
        />
        <div className={d.split}>
          <ReportForm publicReport={isPublic} homeHref={reporter ? roleHome(reporter) : "/wards"} />
          <div className={d.splitSide}>
            <Card gap={12}>
              <h2 className="t-body-strong">What happens next</h2>
              <Timeline
                steps={[
                  {
                    title: "Sent to the service provider",
                    detail: "The provider has 48 hours to respond",
                    state: "done",
                  },
                  {
                    title: "Escalated if there is no reply",
                    detail: "The zonal office reviews unanswered reports",
                    state: "current",
                  },
                  {
                    title: "Resolved and closed",
                    detail: "You are notified and can confirm the outcome",
                    state: "upcoming",
                  },
                ]}
              />
            </Card>
            <Card gap={12}>
              <div className={d.row}>
                <Shield size={20} />
                <h2 className={`t-body-strong ${d.grow}`}>Your privacy</h2>
              </div>
              <p className="t-small c-secondary">
                Anonymous reports show only the building and ward. City corporation officers can see
                who reported, so false reports can be followed up.
              </p>
            </Card>
          </div>
        </div>
      </PageMain>
    </>
  );
}
