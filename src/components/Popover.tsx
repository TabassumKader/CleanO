"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import s from "./Popover.module.css";

type TriggerProps = {
  "aria-expanded": boolean;
  "aria-controls": string;
  "aria-haspopup": "dialog";
  onClick: () => void;
};

/** A small panel anchored under its trigger. Closes on outside click, Escape, or following a link inside it. */
export function Popover({
  renderTrigger,
  label,
  width = 320,
  children,
}: {
  renderTrigger: (props: TriggerProps) => ReactNode;
  label: string;
  width?: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={s.wrap}>
      {renderTrigger({
        "aria-expanded": open,
        "aria-controls": panelId,
        "aria-haspopup": "dialog",
        onClick: () => setOpen((value) => !value),
      })}
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className={s.panel}
          style={{ width }}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
