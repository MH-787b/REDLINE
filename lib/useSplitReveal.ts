"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Splits the element's text into masked lines and reveals them
 * with a slide-up as the element scrolls into view.
 */
export function useSplitReveal(
  ref: RefObject<HTMLElement | null>,
  opts: { stagger?: number; start?: string } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const split = SplitText.create(el, {
      type: "lines",
      linesClass: "split-line",
      mask: "lines",
      autoSplit: true,
    });

    const tween = gsap.from(split.lines, {
      yPercent: 110,
      duration: 1,
      ease: "power4.out",
      stagger: opts.stagger ?? 0.09,
      scrollTrigger: {
        trigger: el,
        start: opts.start ?? "top 80%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [ref, opts.stagger, opts.start]);
}
