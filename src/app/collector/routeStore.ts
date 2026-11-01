"use client";

import { useMemo, useSyncExternalStore } from "react";
import { route, type RouteBuilding, type RouteStatus } from "@/data/collector";

/*
 * The collector's check-ins are kept in localStorage so they survive reloads and
 * work offline, as the design promises ("stored in the browser until the
 * connection returns"). With no backend this is the shared record for S8 and S9.
 */

const KEY = "cleano-collector-route-v1";
const EVENT = "cleano-collector-route-change";

type Override = { status: RouteStatus; time: string; note?: string };
type Overrides = Record<string, Override>;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function read(): Overrides {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Overrides;
  } catch {
    return {};
  }
}

export function useRoute(): { buildings: RouteBuilding[]; edited: boolean } {
  const raw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(KEY),
    () => null,
  );
  return useMemo(() => {
    const overrides: Overrides = raw ? JSON.parse(raw) : {};
    return {
      buildings: route.map((b) => (overrides[b.id] ? { ...b, ...overrides[b.id] } : b)),
      edited: Object.keys(overrides).length > 0,
    };
  }, [raw]);
}

export function saveCheckIn(id: string, value: Override) {
  localStorage.setItem(KEY, JSON.stringify({ ...read(), [id]: value }));
  window.dispatchEvent(new Event(EVENT));
}

export function resetRoute() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}
