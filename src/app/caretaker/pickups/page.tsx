import type { Metadata } from "next";
import { CaretakerHeader } from "@/components/headers";
import { PageMain } from "@/components/layout";
import { CaretakerLog } from "./CaretakerLog";

export const metadata: Metadata = { title: "Pickup log" };

/** S4 · Caretaker pickup log. */
export default function CaretakerPickupsPage() {
  return (
    <>
      <CaretakerHeader active="Pickups" />
      <PageMain>
        <CaretakerLog />
      </PageMain>
    </>
  );
}
