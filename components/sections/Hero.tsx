"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "@/lib/store";
import { PRELOAD_DONE_EVENT } from "@/components/ui/Preloader";

const LETTERS = "REDLINE".split("");

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-letter", { yPercent: 110 });
      gsap.set(".hero-meta", { autoAlpha: 0, y: 12 });

      const enter = () => {
        gsap
          .timeline()
          .to(".hero-letter", {
            yPercent: 0,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.055,
          })
          .to(".hero-meta", {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
          }, "-=0.6");
      };

      window.addEventListener(PRELOAD_DONE_EVENT, enter, { once: true });
      // fallback if preloader already finished (fast refresh)
      const fallback = setTimeout(enter, 2600);
      return () => {
        window.removeEventListener(PRELOAD_DONE_EVENT, enter);
        clearTimeout(fallback);
      };
    }, rootRef);

    // wordmark mouse parallax
    let raf = 0;
    const tick = () => {
      if (wordRef.current && !motion.reducedMotion) {
        gsap.set(wordRef.current, {
          x: motion.mouse.x * 14,
          y: -motion.mouse.y * 10,
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      ctx.revert();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative flex h-[100svh] flex-col justify-between px-5 pt-24 pb-8 md:px-10"
    >
      <div className="hero-meta label flex justify-between">
        <span>SGR A* — 26,000 LY</span>
        <span className="hidden md:inline">CLOTHING FOR THE COLLAPSE</span>
        <span>EST. 2026</span>
      </div>

      <h1
        ref={wordRef}
        className="font-display select-none text-center leading-none tracking-[0.02em] text-[clamp(4rem,17.5vw,19rem)]"
        aria-label="REDLINE"
      >
        {LETTERS.map((ch, i) => (
          <span key={i} className="inline-block overflow-clip align-bottom">
            <span
              className={`hero-letter inline-block ${ch === "I" ? "text-red" : ""}`}
            >
              {ch}
            </span>
          </span>
        ))}
      </h1>

      <div className="hero-meta flex items-end justify-between">
        <p className="label max-w-55">
          GARMENTS ENGINEERED AT THE EDGE OF THE EVENT HORIZON.
        </p>
        <div className="flex flex-col items-end gap-2">
          <span className="label !text-fg/80">SCROLL</span>
          <span className="block h-10 w-px animate-pulse bg-red" />
        </div>
      </div>
    </section>
  );
}
