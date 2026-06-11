"use client";

import { Canvas } from "@react-three/fiber";
import BlackHole from "./BlackHole";

export default function Scene() {
  return (
    // z-0 (not negative): Chromium paints the root background OVER negative
    // z-index fixed elements, which hides the canvas. Content sits at z-10.
    <div className="pointer-events-none fixed inset-0 z-0 bg-bg" aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
        }}
        camera={{ position: [0, 0, 1] }}
      >
        <BlackHole />
      </Canvas>
    </div>
  );
}
