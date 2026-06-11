"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      document.body.classList.remove("custom-cursor");
      return;
    }
    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
    };

    const onOver = (e: PointerEvent) => {
      const interactive = (e.target as HTMLElement).closest(
        "a, button, input, [data-cursor]"
      );
      gsap.to(ring, {
        scale: interactive ? 2.2 : 1,
        borderColor: interactive ? "#e10600" : "rgba(242,242,242,0.5)",
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(dot, { scale: interactive ? 0 : 1, duration: 0.3 });
    };

    const onLeave = () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block" aria-hidden>
      <div
        ref={dotRef}
        className="invisible absolute -top-[3px] -left-[3px] h-1.5 w-1.5 bg-red"
      />
      <div
        ref={ringRef}
        className="invisible absolute -top-4 -left-4 h-8 w-8 rounded-full border border-fg/50"
      />
    </div>
  );
}
