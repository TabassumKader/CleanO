import type { Metadata } from "next";
import { CollectorHeader } from "@/components/headers";
import { PageMain } from "@/components/layout";
import { CollectorRoute } from "./CollectorRoute";

export const metadata: Metadata = { title: "আজকের রুট" };

// Reads query parameters, so the page renders per request instead of being prerendered.
export const instant = false;

/** S8 · Collector route (Bangla-first). */
export default async function CollectorPage({ searchParams }: PageProps<"/collector">) {
  const { view } = await searchParams;
  const showAll = view === "all";
  return (
    <>
      <CollectorHeader active={showAll ? "সংগ্রহের ইতিহাস" : "আজকের রুট"} />
      <PageMain>
        <CollectorRoute showAll={showAll} />
      </PageMain>
    </>
  );
}
