"use client";

import MagneticLink from "./MagneticLink";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <nav className="hairline-b flex items-center justify-between bg-bg/60 px-5 py-4 md:px-10">
        <a href="#top" className="font-display text-lg tracking-[0.08em]">
          REDLINE<span className="text-red">.</span>
        </a>
        <div className="flex items-center gap-6 md:gap-10">
          <MagneticLink href="#manifesto" className="label !text-fg/70">
            Manifesto
          </MagneticLink>
          <MagneticLink href="#collection" className="label !text-fg/70">
            Collection
          </MagneticLink>
          <MagneticLink href="#drop" className="label !text-red">
            Drop 01
          </MagneticLink>
        </div>
      </nav>
    </header>
  );
}
