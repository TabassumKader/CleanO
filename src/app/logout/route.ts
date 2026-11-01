import { NextResponse, type NextRequest } from "next/server";
import { ROLE_COOKIE } from "@/lib/session";

/** Clears the demo session and returns to the login screen (or `?next=` if given). */
export function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");
  const target = next?.startsWith("/") && !next.startsWith("//") ? next : "/login";
  const response = NextResponse.redirect(new URL(target, request.nextUrl));
  response.cookies.delete(ROLE_COOKIE);
  return response;
}
