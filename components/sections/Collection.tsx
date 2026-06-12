"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

type Callout = {
  x: number; // anchor, % of image width
  y: number; // anchor, % of image height
  side: "left" | "right";
  text: string;
  accent?: boolean;
};

const GARMENTS: {
  src: string;
  name: string;
  index: string;
  notes: string[];
  callouts: Callout[];
}[] = [
  {
    src: "/clothing/jersey.png",
    name: "ORBIT JERSEY",
    index: "01",
    notes: ["BOXY FOOTBALL CUT", "HAND-DRAWN SINGULARITY", "WHITE COLLAR"],
    callouts: [
      { x: 70, y: 36, side: "right", text: "£45", accent: true },
      { x: 40, y: 47, side: "left", text: "HAND-DRAWN SINGULARITY" },
      { x: 56, y: 78, side: "right", text: "BOXY CROP FIT" },
    ],
  },
  {
    src: "/clothing/joggers.png",
    name: "HORIZON JOGGER",
    index: "02",
    notes: ["STRAIGHT LEG", "CONTRAST STITCH", "RL ANKLE MARK"],
    callouts: [
      { x: 72, y: 18, side: "right", text: "£55", accent: true },
      { x: 36, y: 44, side: "left", text: "THIGH SINGULARITY PRINT" },
      { x: 68, y: 82, side: "right", text: "RL ANKLE STAMP" },
    ],
  },
  {
    src: "/clothing/hoodie.png",
    name: "SINGULARITY HOODIE",
    index: "03",
    notes: ["OVERSIZED", "RED SCRIPT", "HEAVYWEIGHT FLEECE"],
    callouts: [
      { x: 78, y: 30, side: "right", text: "£70", accent: true },
      { x: 46, y: 50, side: "left", text: "RED SCRIPT EMBROIDERY" },
      { x: 32, y: 76, side: "left", text: "450GSM HEAVY FLEECE" },
    ],
  },
  {
    src: "/clothing/red-tee.png",
    name: "ACCRETION TEE",
    index: "04",
    notes: ["TRI-PANEL", "RED / BLACK / WHITE", "K-SERIES"],
    callouts: [
      { x: 76, y: 22, side: "right", text: "£40", accent: true },
      { x: 32, y: 42, side: "left", text: "TRI-PANEL CONSTRUCTION" },
      { x: 58, y: 84, side: "right", text: "K-SERIES MARK" },
    ],
  },
];

function Garment({
  garment,
  flip,
}: {
  garment: (typeof GARMENTS)[number];
  flip: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const imgWrap = imgWrapRef.current!;

    const rx = gsap.quickTo(imgWrap, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(imgWrap, "rotationY", { duration: 0.6, ease: "power3.out" });
    const tx = gsap.quickTo(imgWrap, "x", { duration: 0.8, ease: "power3.out" });
    const ty = gsap.quickTo(imgWrap, "y", { duration: 0.8, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      if (motion.reducedMotion) return;
      const r = root.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      rx(-ny * 9);
      ry(nx * 12);
      tx(nx * 16);
      ty(ny * 10);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
      tx(0);
      ty(0);
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    const ctx = gsap.context(() => {
      // garment drifts up slightly faster than scroll (parallax)
      gsap.fromTo(
        imgWrap,
        { yPercent: 8 },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      // entrance: scale + fade once
      gsap.from(imgWrap, {
        scale: 0.85,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      });
      // metadata stagger
      gsap.from(root.querySelectorAll(".g-meta"), {
        autoAlpha: 0,
        y: 18,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      // oversized index number drifts opposite (parallax depth)
      gsap.fromTo(
        root.querySelector(".g-index"),
        { yPercent: -14 },
        {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, root);

    // --- idle float: garment slowly drifts like it's in zero-g ---
    let float: gsap.core.Tween | undefined;
    if (!motion.reducedMotion) {
      float = gsap.to(floatRef.current, {
        y: -12,
        rotation: 0.8,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    // --- hover: spec callouts draw outward from the garment ---
    const hoverTl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    hoverTl.to(floatRef.current, { scale: 1.05, duration: 0.5 }, 0);
    root.querySelectorAll<HTMLElement>(".callout").forEach((c, i) => {
      const fromX = c.dataset.side === "left" ? 12 : -12;
      const tipLabel = [c.querySelector(".c-tip"), c.querySelector(".c-label")];
      gsap.set(tipLabel, { x: fromX });
      const at = i * 0.12;
      hoverTl
        .to(c.querySelector(".c-dot"), { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, at)
        .to(c.querySelector(".c-line"), { scaleX: 1, duration: 0.35 }, at + 0.07)
        .to(tipLabel, { autoAlpha: 1, x: 0, duration: 0.3 }, at + 0.26);
    });

    const stage = stageRef.current!;
    const enter = () => hoverTl.play();
    const leave = () => hoverTl.reverse();
    let st: ScrollTrigger | undefined;
    if (window.matchMedia("(hover: none)").matches) {
      // no hover on touch — play callouts while the garment is center-stage
      st = ScrollTrigger.create({
        trigger: root,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: enter,
        onLeave: leave,
        onEnterBack: enter,
        onLeaveBack: leave,
      });
    } else {
      stage.addEventListener("pointerenter", enter);
      stage.addEventListener("pointerleave", leave);
    }

    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerenter", enter);
      stage.removeEventListener("pointerleave", leave);
      st?.kill();
      hoverTl.kill();
      float?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      id={`g-${garment.index}`}
      className={`relative flex min-h-screen items-center gap-8 px-5 py-24 md:px-10 ${
        flip ? "flex-row-reverse" : ""
      } flex-col md:flex-row`}
    >
      {/* oversized background index */}
      <span
        className={`g-index font-display pointer-events-none absolute top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,30vw,26rem)] leading-none text-fg/[0.04] ${
          flip ? "left-2 md:left-6" : "right-2 md:right-6"
        }`}
        aria-hidden
      >
        {garment.index}
      </span>

      <div
        ref={stageRef}
        className="relative z-10 flex flex-1 items-center justify-center"
        style={{ perspective: "1200px" }}
        data-cursor
      >
        <div ref={imgWrapRef} className="relative w-[min(88vw,640px)] will-change-transform">
          <div ref={floatRef} className="will-change-transform">
            <Image
              src={garment.src}
              alt={garment.name}
              width={900}
              height={900}
              className="h-auto w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)]"
              sizes="(max-width: 768px) 88vw, 640px"
            />
          </div>

          {/* spec callouts — revealed on hover */}
          {garment.callouts.map((c) => (
            <div
              key={c.text}
              data-side={c.side}
              className="callout pointer-events-none absolute z-20"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <div
                className={`flex -translate-y-1/2 items-center ${
                  c.side === "left" ? "-translate-x-full flex-row-reverse" : ""
                }`}
              >
                <span className="c-dot h-2 w-2 shrink-0 scale-0 rounded-full bg-red" />
                <span
                  className={`c-line h-px w-12 shrink-0 scale-x-0 bg-red/80 md:w-20 ${
                    c.side === "left" ? "origin-right" : "origin-left"
                  }`}
                />
                <span
                  className={`c-tip invisible h-0 w-0 shrink-0 border-y-[3px] border-y-transparent ${
                    c.side === "left"
                      ? "border-r-[5px] border-r-red"
                      : "border-l-[5px] border-l-red"
                  }`}
                />
                <span
                  className={`c-label label invisible whitespace-nowrap border bg-bg/90 px-2.5 py-1.5 ${
                    c.side === "left" ? "mr-1.5" : "ml-1.5"
                  } ${
                    c.accent
                      ? "border-red/50 font-medium !text-[13px] !text-red"
                      : "border-fg/15 !text-fg/85"
                  }`}
                >
                  {c.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-5 md:max-w-sm">
        <span className="g-meta label !text-red">{garment.index} / 04</span>
        <h3 className="g-meta font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-none">
          {garment.name}
        </h3>
        <ul className="g-meta flex flex-col gap-1.5">
          {garment.notes.map((n) => (
            <li key={n} className="label flex items-center gap-3 !text-fg/60">
              <span className="h-px w-5 bg-red" />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Collection() {
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tween = gsap.fromTo(
      progressRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="collection" className="relative">
      <div className="px-5 pt-32 md:px-10">
        <span className="label block">001 — COLLECTION</span>
        <h2 className="font-display mt-6 text-[clamp(2.6rem,8vw,7rem)] leading-none">
          DROP <span className="text-red">01</span>
        </h2>
      </div>

      {/* scroll progress rule */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-5 hidden w-px bg-fg/10 md:left-10 md:block">
        <div ref={progressRef} className="h-full w-full origin-top bg-red" />
      </div>

      {GARMENTS.map((g, i) => (
        <Garment key={g.index} garment={g} flip={i % 2 === 1} />
      ))}
    </section>
  );
}
