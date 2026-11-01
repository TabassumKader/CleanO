import type { Metadata } from "next";
import { ProviderConsole } from "./ProviderConsole";
import { ProviderShell } from "./ProviderShell";

export const metadata: Metadata = { title: "Service provider console" };

/** S13 · Service provider console. */
export default function ProviderPage() {
  return (
    <ProviderShell active="Today">
      <ProviderConsole />
    </ProviderShell>
  );
}
