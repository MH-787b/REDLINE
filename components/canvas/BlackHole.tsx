"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "@/lib/store";

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;      // lerped, -1..1
  uniform vec2  uCenter;     // hole center in aspect-corrected space
  uniform float uRadius;     // event horizon radius
  uniform float uRing;       // accretion ring intensity 0..1+
  uniform float uLens;       // lensing strength

  #define RED vec3(0.882, 0.024, 0.0)

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  // one parallax layer of stars
  float stars(vec2 uv, float density, float size) {
    vec2 g = uv * density;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash21(id);
    if (h > 0.08) return 0.0; // sparse
    vec2 offs = vec2(hash21(id + 7.1), hash21(id + 3.7)) - 0.5;
    float d = length(f - offs * 0.8);
    float star = smoothstep(size, 0.0, d);
    // twinkle
    float tw = 0.6 + 0.4 * sin(uTime * (0.5 + h * 2.0) + h * 40.0);
    return star * tw * (0.3 + 0.7 * hash21(id + 1.3));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 p = (uv * 2.0 - 1.0);
    p.x *= uRes.x / uRes.y;

    vec2 c = uCenter;
    vec2 d = p - c;
    float r = length(d);

    // --- gravitational lensing: bend space toward the hole ---
    float bend = uLens * uRadius * uRadius / max(r, 1e-4);
    vec2 warped = p - normalize(d) * bend;

    // slow drift + mouse parallax on the starfield
    vec2 drift = vec2(uTime * 0.004, -uTime * 0.002);
    vec2 par = uMouse * 0.03;

    float s = 0.0;
    s += stars(warped + drift + par * 1.6, 14.0, 0.10) * 1.00;
    s += stars(warped * 1.7 + drift * 1.6 + par * 0.8 + 3.1, 22.0, 0.08) * 0.55;
    vec3 col = vec3(s) * vec3(0.92, 0.93, 0.98);

    // faint red ember stars near the hole's plane
    float ember = stars(warped * 0.9 + drift * 0.5 + 9.7, 9.0, 0.12);
    col += RED * ember * 0.25;

    // --- accretion ring: thin, white-hot core, red fringe ---
    float ringR = uRadius * 1.35;
    float ringDist = abs(r - ringR);
    float angle = atan(d.y, d.x);
    // rotating brightness variation around the ring
    float swirl = 0.75 + 0.25 * sin(angle * 3.0 - uTime * 0.7)
                       * sin(angle * 7.0 + uTime * 0.35);
    float core = exp(-ringDist * ringDist * 28000.0) * swirl;       // razor-thin hot core
    float fringe = exp(-ringDist * ringDist * 1800.0) * swirl;      // soft red falloff
    // doppler-ish asymmetry: one side brighter
    float doppler = 0.65 + 0.35 * sin(angle + 2.2);
    col += (vec3(1.0) * core * 1.4 + RED * fringe * 0.8) * doppler * uRing;

    // photon glow hugging the horizon
    float hug = exp(-abs(r - uRadius) * 60.0);
    col += RED * hug * 0.35 * uRing;

    // --- event horizon: crisp black disc, swallows everything ---
    float horizon = smoothstep(uRadius * 0.985, uRadius * 1.015, r);
    col *= horizon;

    // vignette, very subtle
    float vig = 1.0 - 0.22 * dot(uv - 0.5, uv - 0.5) * 4.0 * 0.5;
    col *= vig;

    // grain: kills banding on the dark falloffs
    float grain = (hash21(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.035;
    col += grain;

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;

// hole behavior per section phase: [cx, cy, radius, ring, lens]
const PHASES: [number, number, number, number, number][] = [
  [0.0, -0.04, 0.16, 1.0, 1.1], // hero — centered, full lensing
  [-0.68, 0.34, 0.045, 0.35, 0.6], // collection — distant anchor, garments take focus
  [0.62, 0.28, 0.07, 0.55, 0.8], // manifesto — drifts back in, off-center
  [0.0, 0.06, 0.13, 1.15, 1.0], // signup — returns to center
];

function samplePhase(phase: number): [number, number, number, number, number] {
  const i = Math.min(Math.floor(phase), PHASES.length - 2);
  const t = THREE.MathUtils.smoothstep(phase - i, 0, 1);
  const a = PHASES[i];
  const b = PHASES[i + 1];
  return a.map((v, k) => v + (b[k] - v) * t) as [number, number, number, number, number];
}

export default function BlackHole() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const size = useThree((s) => s.size);
  const lerped = useRef({ mx: 0, my: 0, phase: 0, ring: 1 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uCenter: { value: new THREE.Vector2(0, -0.04) },
      uRadius: { value: 0.16 },
      uRing: { value: 1 },
      uLens: { value: 1.1 },
    }),
    []
  );

  useFrame((state, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const u = mat.uniforms;
    const L = lerped.current;
    const k = 1 - Math.exp(-delta * 4); // framerate-independent damping

    L.mx += (motion.mouse.x - L.mx) * k;
    L.my += (motion.mouse.y - L.my) * k;
    L.phase += (motion.phase - L.phase) * k;

    const [cx, cy, radius, ring, lens] = samplePhase(L.phase);
    const targetRing = ring + motion.ringBoost;
    L.ring += (targetRing - L.ring) * k;

    u.uTime.value = state.clock.elapsedTime;
    u.uRes.value.set(
      size.width * state.viewport.dpr,
      size.height * state.viewport.dpr
    );
    // hole subtly tracks the mouse
    u.uCenter.value.set(cx + L.mx * 0.05, cy + L.my * 0.04);
    u.uRadius.value = radius;
    u.uRing.value = L.ring;
    u.uLens.value = lens;
    u.uMouse.value.set(L.mx, L.my);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
