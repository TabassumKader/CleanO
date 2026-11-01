import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectorHeader } from "@/components/headers";
import { PageMain } from "@/components/layout";
import { findBuilding, route } from "@/data/collector";
import { CheckIn } from "./CheckIn";

export function generateStaticParams() {
  return route.map((building) => ({ id: building.id }));
}

export const metadata: Metadata = { title: "ভবন নিশ্চিতকরণ" };

// Reads query parameters, so the page renders per request instead of being prerendered.
export const instant = false;

/** S9 · Collector building check-in (Bangla-first). */
export default async function CheckInPage({ params, searchParams }: PageProps<"/collector/check-in/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const building = findBuilding(id);
  if (!building) notFound();

  const via = query.via === "qr" ? "qr" : "code";
  const time = typeof query.t === "string" ? query.t : undefined;

  return (
    <>
      <CollectorHeader active="আজকের রুট" />
      <PageMain>
        <CheckIn building={building} via={via} time={time} />
      </PageMain>
    </>
  );
}
