import Image from "next/image";
import type { ReactNode } from "react";
import s from "./Timeline.module.css";

export type TimelineStep = {
  title: ReactNode;
  detail?: ReactNode;
  meta?: ReactNode;
  state: "done" | "current" | "upcoming";
};

/** Vertical step list with the 16px status dots from the design (green done, yellow current, grey upcoming). */
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className={s.timeline}>
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        const upcoming = step.state === "upcoming";
        return (
          <li key={index} className={s.step} aria-current={step.state === "current" ? "step" : undefined}>
            <div className={s.rail}>
              <Image src={`/figma/dot-16-${step.state}.svg`} alt="" width={16} height={16} unoptimized />
              {!last && <span className={s.line} />}
            </div>
            <div className={`${s.body} ${last ? "" : s.bodySpaced} ${upcoming ? "c-secondary" : ""}`}>
              <p className={upcoming ? "t-small" : "t-small-strong"}>{step.title}</p>
              {step.detail && <p className={`t-caption ${upcoming ? "" : "c-secondary"}`}>{step.detail}</p>}
              {step.meta && <p className="t-caption c-secondary">{step.meta}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
