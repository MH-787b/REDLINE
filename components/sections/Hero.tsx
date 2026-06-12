"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "@/lib/store";
import { PRELOAD_DONE_EVENT } from "@/components/ui/Preloader";

const LETTERS = "REDLINE".split("");

const DROPS = [
  { name: "ORBIT JERSEY", index: "01" },
  { name: "HORIZON JOGGER", index: "02" },
  { name: "SINGULARITY HOODIE", index: "03" },
  { name: "ACCRETION TEE", index: "04" },
];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const dropsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-letter", { yPercent: 110 });
      gsap.set(".hero-meta", { autoAlpha: 0, y: 12 });
      gsap.set(".hero-drop", { autoAlpha: 0, y: 36, scale: 0.9 });

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
          }, "-=0.6")
          // the four drops arrive last
          .to(".hero-drop", {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
          }, "-=0.35");
      };

      window.addEventListener(PRELOAD_DONE_EVENT, enter, { once: true });
      // fallback if preloader already finished (fast refresh)
      const fallback = setTimeout(enter, 2600);
      return () => {
        window.removeEventListener(PRELOAD_DONE_EVENT, enter);
        clearTimeout(fallback);
      };
    }, rootRef);

    // mouse parallax — wordmark and drops drift at different depths
    let raf = 0;
    const tick = () => {
      if (!motion.reducedMotion) {
        if (wordRef.current) {
          gsap.set(wordRef.current, {
            x: motion.mouse.x * 14,
            y: -motion.mouse.y * 10,
          });
        }
        if (dropsRef.current) {
          gsap.set(dropsRef.current, {
            x: motion.mouse.x * 26,
            y: -motion.mouse.y * 16,
          });
        }
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
        className="font-display select-none text-center leading-none tracking-[0.02em] text-[clamp(4rem,16vw,17rem)]"
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

      {/* the four drop titles — arrive last, link into the collection */}
      <div ref={dropsRef} className="flex flex-col items-end gap-2.5 md:gap-3">
        {DROPS.map((d) => (
          <a
            key={d.index}
            href={`#g-${d.index}`}
            className="hero-drop group flex items-center gap-3"
            aria-label={`${d.name} — view in collection`}
          >
            <span className="label !text-fg/40 transition-colors duration-300 group-hover:!text-red">
              {d.index}
            </span>
            <span className="font-display text-xl leading-none tracking-[0.04em] text-fg/85 transition-colors duration-300 group-hover:text-red md:text-3xl">
              {d.name}
            </span>
            <span className="h-px w-6 origin-right scale-x-0 bg-red transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        ))}
      </div>

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
