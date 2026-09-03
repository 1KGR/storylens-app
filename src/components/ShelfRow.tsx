import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { Film } from "../data/films";
import { CollectorCase } from "./CollectorCase";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";
import { reduceEffects } from "../state/caseStage";
import { SLOT_H, type RowHover } from "../three/shelfLayout";

// Three.js is a large dependency — only pull it into the bundle for visitors
// who land on /archive, not the rest of the app (Study/Create/Tracker stay lean).
const ShelfRow3D = lazy(() => import("../three/ShelfRow3D").then((m) => ({ default: m.ShelfRow3D })));

// Kept tight on purpose: each row is its own WebGL context, and both real
// low-end/integrated GPUs and (rarely) software-rendered fallbacks have hard
// limits on how many contexts can be live at once. Mounting only the row
// closest to view — not every row on the page — keeps peak concurrent
// contexts low regardless of how many shelves the archive has.
function useInViewport(margin = "250px") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: margin });
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);
  return { ref, inView };
}

interface ShelfRowProps {
  films: Film[];
  openSlug: string | null;
  onOpen: (slug: string, el: HTMLElement) => void;
}

// A shelf of physical cases: the DOM below stays the real interaction surface
// (click, keyboard, focus, and the FLIP-to-stage rect all still come from
// real, laid-out <div>s exactly as before) while a single Three.js canvas
// layered on top — pointer-events: none, so it never intercepts anything —
// draws the actual dimensional case geometry those elements represent.
export function ShelfRow({ films, openSlug, onOpen }: ShelfRowProps) {
  const { ref: viewRef, inView } = useInViewport();
  const hoverRef = useRef<RowHover>({ index: -1, px: 0.5, py: 0.5 });
  const [webglOk, setWebglOk] = useState(true);
  // If WebGL genuinely can't render here (no GPU, hardware acceleration off,
  // too many contexts already open elsewhere on the page), fall back to the
  // proven CSS 3D case rather than leaving an invisible, hidden-for-3D shelf.
  const show3D = !reduceEffects() && webglOk;

  return (
    <div ref={viewRef} className="shelf-row flex gap-7 px-2 pb-7 min-w-max relative">
      <div
        className="absolute left-0 top-0 pointer-events-none"
        style={{ width: "100%", height: SLOT_H, zIndex: 0 }}
      >
        {show3D && inView && (
          <WebGLErrorBoundary onError={() => setWebglOk(false)}>
            <Suspense fallback={null}>
              <ShelfRow3D films={films} hoverRef={hoverRef} openSlug={openSlug} onContextLost={() => setWebglOk(false)} />
            </Suspense>
          </WebGLErrorBoundary>
        )}
      </div>
      <div
        className="absolute left-0 right-0 bottom-3.5 h-2.5 rounded-sm"
        style={{
          background: "linear-gradient(180deg, #241D14, #16110B)",
          boxShadow: "0 10px 16px -8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      />
      {films.map((f, i) => (
        <div key={f.slug} className="w-[168px] max-[640px]:w-[132px] flex-shrink-0 relative" style={{ zIndex: 1 }}>
          <CollectorCase
            film={f}
            mode="shelf"
            hideVisual={show3D && inView}
            onHoverChange={(px, py) => {
              hoverRef.current = px === null || py === null ? { index: -1, px: 0.5, py: 0.5 } : { index: i, px, py };
            }}
            onClick={(el) => onOpen(f.slug, el)}
          />
        </div>
      ))}
    </div>
  );
}
