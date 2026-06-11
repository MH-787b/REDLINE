"use client";

import { useRef } from "react";
import { useSplitReveal } from "@/lib/useSplitReveal";

function Statement({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useSplitReveal(ref);
  return (
    <p
      ref={ref}
      className={`font-display leading-[1.02] tracking-[0.01em] text-[clamp(2.2rem,7vw,6.5rem)] ${className}`}
    >
      {children}
    </p>
  );
}

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative px-5 py-40 md:px-10 md:py-56">
      <span className="label mb-16 block">002 — MANIFESTO</span>

      <div className="flex flex-col gap-24 md:gap-36">
        <Statement className="max-w-[16ch]">
          TRENDS COLLAPSE UNDER THEIR OWN WEIGHT.
        </Statement>

        <Statement className="max-w-[18ch] self-end text-right">
          WHAT SURVIVES IS WHAT REFUSES TO LET GO.
        </Statement>

        <Statement className="max-w-[14ch]">
          PAST THIS POINT, <span className="text-red">NOTHING ESCAPES.</span>
        </Statement>
      </div>

      <div className="hairline-t mt-32 flex justify-between pt-4 md:mt-44">
        <span className="label">EVERY PIECE CUT IN BLACK</span>
        <span className="label">GRAVITY OPTIONAL</span>
      </div>
    </section>
  );
}
