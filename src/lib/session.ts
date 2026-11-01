import type { Role } from "@/data/types";

/*
 * Demo session: the role chosen on the login screen is kept in a cookie so shared
 * pages (reports, receipts, the report form) can show the right header and links.
 * There is no real authentication in this MVP.
 */

export const ROLE_COOKIE = "cleano_role";

export const roles: { value: Role; label: string; home: string }[] = [
  { value: "resident", label: "Resident (owner or tenant)", home: "/resident" },
  { value: "caretaker", label: "Building caretaker", home: "/caretaker" },
  { value: "collector", label: "Collector", home: "/collector" },
  { value: "officer", label: "Zonal officer", home: "/officer" },
  { value: "provider", label: "Service provider", home: "/provider" },
];

export function isRole(value: string | undefined): value is Role {
  return roles.some((role) => role.value === value);
}

export function roleHome(role: Role | undefined) {
  return roles.find((r) => r.value === role)?.home ?? "/";
}

/** Called from the login form once the one-time code is accepted. */
export function setRoleCookie(role: Role) {
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}
