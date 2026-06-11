"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const PRELOAD_DONE_EVENT = "redline:preload-done";

export default function Preloader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new Event(PRELOAD_DONE_EVENT));
        setGone(true);
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (numRef.current)
          numRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to(lineRef.current, { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0)
      .to(rootRef.current, {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
        delay: 0.15,
      });

    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[90] bg-bg">
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <span className="font-display text-2xl tracking-[0.1em]">
          REDLINE<span className="text-red">.</span>
        </span>
        <div className="w-48">
          <div
            ref={lineRef}
            className="h-px origin-left scale-x-0 bg-red"
          />
        </div>
        <span ref={numRef} className="label tabular-nums !text-fg/60">
          000
        </span>
      </div>
    </div>
  );
}
