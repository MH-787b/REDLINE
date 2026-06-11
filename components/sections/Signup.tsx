"use client";

import { useRef, useState } from "react";
import { motion } from "@/lib/store";
import { useSplitReveal } from "@/lib/useSplitReveal";

export default function Signup() {
  const [done, setDone] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  useSplitReveal(headRef);

  return (
    <section
      id="drop"
      className="relative flex min-h-[90svh] flex-col items-center justify-center px-5 py-32 text-center md:px-10"
    >
      <span className="label mb-10 block">003 — NEXT DROP</span>

      <h2
        ref={headRef}
        className="font-display max-w-[14ch] text-[clamp(2.6rem,8vw,7.5rem)] leading-[1.02]"
      >
        CROSS THE <span className="text-red">REDLINE.</span>
      </h2>

      {done ? (
        <p className="label mt-14 !text-red">YOU&apos;RE IN ORBIT. TRANSMISSION INCOMING.</p>
      ) : (
        <form
          className="mt-14 flex w-full max-w-md items-end gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            motion.ringBoost = 0;
            setDone(true);
          }}
        >
          <input
            type="email"
            required
            placeholder="YOUR@COORDINATES.COM"
            className="label w-full border-b border-fg/25 bg-transparent pb-3 !text-fg placeholder:text-fg/30 focus:border-red"
            onFocus={() => (motion.ringBoost = 0.7)}
            onBlur={() => (motion.ringBoost = 0)}
          />
          <button
            type="submit"
            className="label shrink-0 border border-fg/25 px-6 py-3 !text-fg transition-colors duration-300 hover:border-red hover:!text-red"
          >
            ENTER
          </button>
        </form>
      )}

      <p className="label mt-8 max-w-xs !text-fg/40">
        NO SPAM. ONE SIGNAL PER DROP. ESCAPE VELOCITY NOT GUARANTEED.
      </p>
    </section>
  );
}
