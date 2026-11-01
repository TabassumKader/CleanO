import { cookies } from "next/headers";
import type { Role } from "@/data/types";
import { ROLE_COOKIE, isRole } from "./session";

/** The demo role for this request. Call only inside a <Suspense> boundary (Cache Components). */
export async function currentRole(): Promise<Role | undefined> {
  const value = (await cookies()).get(ROLE_COOKIE)?.value;
  return isRole(value) ? value : undefined;
}
