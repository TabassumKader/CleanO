"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Animates descendants marked `data-reveal` as they scroll into view by setting
 * `data-reveal-state` to "hidden", then "shown". Elements already on screen, and
 * everything when JavaScript is off or reduced motion is requested, are left
 * visible. The CSS decides what each state looks like.
 */
export function RevealRoot({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealState = "shown";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    for (const element of root.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
      element.dataset.revealState = "hidden";
      observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
