// Shared layout constants for the shelf's DOM slots and its Three.js visual
// layer. Kept dependency-free (no `three` import) so importing it — from
// ShelfRow.tsx, which also lazy-loads ShelfRow3D.tsx itself — never drags
// Three.js into the main bundle; only the actual lazy import does that.
export const SLOT_W = 168;
export const SLOT_H = SLOT_W * 1.5;
export const GAP = 28;
export const CASE_W = 150;
export const CASE_H = 225;
// Slightly exaggerated past a real Blu-ray case's ~1:10 thickness ratio — at
// small on-shelf scale a physically-exact spine is only a few pixels wide
// and reads as noise, not depth. This is the "obviously a physical object,
// not a flat card" tell, so it gets legible width instead of strict accuracy.
export const CASE_T = 24;

export interface RowHover {
  index: number; // -1 = nothing hovered
  px: number; // 0..1 within the hovered case
  py: number;
}
