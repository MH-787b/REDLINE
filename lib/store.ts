// Mutable, frame-synced motion state. Written by scroll/pointer handlers,
// read every frame by the shader and tilt effects. No React re-renders.
export const motion = {
  // continuous section phase: 0 hero, 1 manifesto, 2 collection, 3 signup/footer
  phase: 0,
  // normalized pointer, -1..1 (y up)
  mouse: { x: 0, y: 0 },
  // extra accretion-ring energy (e.g. email input focused)
  ringBoost: 0,
  reducedMotion: false,
};
