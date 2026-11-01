import { StatusDot, pickupStatusLabel } from "@/components/layout";
import type { PickupStatus } from "@/data/types";
import s from "./MonthGrid.module.css";

/** One column per day: day number above a 14px status dot. */
export function MonthGrid({
  days,
  month,
  dimBefore = 1,
}: {
  days: PickupStatus[];
  month: string;
  /** Days before this one are faded (outside the selected period). */
  dimBefore?: number;
}) {
  return (
    <ol className={s.grid}>
      {days.map((status, i) => {
        const day = i + 1;
        return (
          <li key={day} className={`${s.day} ${day < dimBefore ? s.dim : ""}`}>
            <span className="t-caption c-secondary">{day}</span>
            <StatusDot status={status} size={14} label={`${day} ${month}: ${pickupStatusLabel[status]}`} />
          </li>
        );
      })}
    </ol>
  );
}
