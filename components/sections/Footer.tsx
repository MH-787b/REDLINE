"use client";

import MagneticLink from "@/components/ui/MagneticLink";

export default function Footer() {
  return (
    <footer className="hairline-t relative overflow-clip">
      <div className="flex flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <span className="label">© 2026 REDLINE — ALL MATTER RESERVED</span>
        <div className="flex gap-8">
          <MagneticLink href="#" className="label !text-fg/70">
            INSTAGRAM
          </MagneticLink>
          <MagneticLink href="#" className="label !text-fg/70">
            TIKTOK
          </MagneticLink>
          <MagneticLink href="#" className="label !text-fg/70">
            X
          </MagneticLink>
        </div>
        <span className="label">DESIGNED PAST THE EVENT HORIZON</span>
      </div>

      <div
        className="font-display pointer-events-none -mb-[0.36em] select-none text-center leading-none tracking-[0.02em] text-[clamp(5rem,19vw,22rem)] text-fg/[0.05]"
        aria-hidden
      >
        REDLINE
      </div>
    </footer>
  );
}
