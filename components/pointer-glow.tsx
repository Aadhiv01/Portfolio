"use client";

import { useEffect } from "react";

/**
 * A soft highlight that follows the mouse across the whole page, plus a local
 * one on any element marked `.spot` while the pointer is over it.
 *
 * It writes CSS variables from a single passive listener, throttled to one
 * update per frame, and never touches React state, so moving the mouse causes no
 * re-render. It does nothing on touch screens or under reduced motion; the CSS
 * hides the overlay there too.
 */
export function PointerGlow() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;
    let spot: HTMLElement | null = null;

    const paint = () => {
      frame = 0;
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);

      if (spot) {
        const box = spot.getBoundingClientRect();
        spot.style.setProperty("--sx", `${x - box.left}px`);
        spot.style.setProperty("--sy", `${y - box.top}px`);
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      spot = (event.target as Element | null)?.closest<HTMLElement>(".spot") ?? null;
      root.dataset.glow = "on";
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      delete root.dataset.glow;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      delete root.dataset.glow;
    };
  }, []);

  return <div aria-hidden className="pointer-glow" />;
}
