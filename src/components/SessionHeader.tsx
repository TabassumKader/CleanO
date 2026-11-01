import { Suspense } from "react";
import { CaretakerHeader, PublicHeader, ResidentHeader } from "@/components/headers";
import { SiteHeader } from "@/components/layout";
import { currentRole } from "@/lib/serverSession";

type Props = {
  /** Active nav item for the resident and caretaker headers. */
  active?: string;
  /** Active nav item when the public header is shown. */
  publicActive?: string;
  /** Always show the public header (with "My dashboard" for signed-in users). */
  publicOnly?: boolean;
};

/**
 * Header for pages several roles can reach. It reads the demo session cookie, so it
 * renders inside Suspense with a logo-only header as the fallback.
 */
export function SessionHeader(props: Props) {
  return (
    <Suspense fallback={<SiteHeader />}>
      <RoleHeader {...props} />
    </Suspense>
  );
}

async function RoleHeader({ active, publicActive, publicOnly }: Props) {
  const role = await currentRole();
  if (!publicOnly && role === "resident") return <ResidentHeader active={active} />;
  if (!publicOnly && role === "caretaker") return <CaretakerHeader active={active} />;
  return <PublicHeader active={publicActive} role={role} />;
}
