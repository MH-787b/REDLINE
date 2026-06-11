"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

// Maps scroll position to the shader's section phase:
// 0 hero → 1 collection → 2 manifesto → 3 signup
const TRANSITIONS: { id: string; base: number }[] = [
  { id: "#collection", base: 0 },
  { id: "#manifesto", base: 1 },
  { id: "#drop", base: 2 },
];

export default function PhaseTracker() {
  useEffect(() => {
    const triggers = TRANSITIONS.map(({ id, base }) =>
      ScrollTrigger.create({
        trigger: id,
        start: "top bottom",
        end: "top 25%",
        onUpdate: (self) => {
          motion.phase = base + self.progress;
        },
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
}
