import { forwardRef, useRef, useState } from "react";
import type { Film } from "../data/films";
import { reduceEffects } from "../state/caseStage";
import { useFilmArt } from "../services/filmDataLayer";

interface CollectorCaseProps {
  film: Film;
  mode: "shelf" | "stage" | "staticOpen";
  openHinge?: boolean;
  onClick?: (el: HTMLElement) => void;
  interior?: React.ReactNode;
  /** When a ShelfRow3D canvas is drawing this case's real geometry on top, this DOM
   * case becomes an invisible interaction shell: same size/position/click/keyboard/FLIP
   * rect as always, pixels hidden so the 3D layer is the only thing actually seen. */
  hideVisual?: boolean;
  /** Mirrors this case's hover/pointer state out to a sibling 3D layer (normalized 0..1
   * position within the case, or null on leave) — read once per frame there, not on
   * every event, so it never drives a React re-render. */
  onHoverChange?: (px: number | null, py: number | null) => void;
}

// A small deterministic hash so each case gets a consistent, non-random
// "sat on the shelf a while" tilt/lift instead of perfectly ruler-aligned
// spacing — same film always gets the same jitter, no layout thrash on re-render.
export function shelfJitter(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const rotate = (h % 240) / 100 - 1.2; // -1.2..1.2deg
  const lift = ((h >> 8) % 400) / 100 - 2; // -2..2px
  const depth = ((h >> 16) % 300) / 100 - 1.5; // -1.5..1.5px
  return { rotate, lift, depth };
}

const canHoverPrecisely = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const CollectorCase = forwardRef<HTMLDivElement, CollectorCaseProps>(function CollectorCase(
  { film, mode, openHinge, onClick, interior, hideVisual, onHoverChange },
  ref
) {
  const isStage = mode !== "shelf";
  const clickable = mode === "shelf";
  const hingeOpen = mode === "staticOpen" || openHinge;
  const art = useFilmArt(film);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const jitter = shelfJitter(film.slug);

  const setRefs = (el: HTMLDivElement | null) => {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const pickUp = (el: HTMLElement) => {
    el.classList.add("picked-up");
    const pause = reduceEffects() ? 0 : 180;
    setTimeout(() => onClick?.(el), pause);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickable || !canHoverPrecisely() || reduceEffects()) return;
    const el = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--tiltX", `${(px - 0.5) * 16}deg`);
    el.style.setProperty("--tiltY", `${(0.5 - py) * 12}deg`);
    el.style.setProperty("--px", `${px * 100}%`);
    el.style.setProperty("--py", `${py * 100}%`);
    onHoverChange?.(px, py);
  };

  const handlePointerLeave = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.removeProperty("--tiltX");
    el.style.removeProperty("--tiltY");
    el.style.removeProperty("--px");
    el.style.removeProperty("--py");
    onHoverChange?.(null, null);
  };

  return (
    <div
      className="case-slot"
      style={
        mode === "shelf"
          ? ({ "--jitter-r": `${jitter.rotate.toFixed(2)}deg`, "--jitter-y": `${jitter.lift.toFixed(2)}px` } as React.CSSProperties)
          : undefined
      }
    >
      <div
        ref={setRefs}
        className={`collector-case${isStage ? " stage" : ""}${hingeOpen ? " open-hinge" : ""}${hideVisual ? " visual-hidden" : ""}`}
        tabIndex={clickable ? 0 : undefined}
        role={clickable ? "button" : undefined}
        aria-label={clickable ? `Open ${film.title}` : undefined}
        onClick={clickable ? (e) => pickUp(e.currentTarget) : undefined}
        onMouseMove={clickable ? handlePointerMove : undefined}
        onMouseLeave={clickable ? handlePointerLeave : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pickUp(e.currentTarget);
                }
              }
            : undefined
        }
      >
        <div className="contact-shadow" />
        <div className="box3d">
          <div className="face back" />
          <div className="face spine" style={{ backgroundColor: film.gradient[1] }}>
            <span className="spine-title">{film.title.toUpperCase()}</span>
            <span className="spine-ticks" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
          <div className="face top" />
          <div className="face bottom" />
          <div className="front-hinge">
            <div
              className="front-face"
              style={{ background: `linear-gradient(155deg, ${film.gradient[0]}, ${film.gradient[1]})` }}
            >
              {art.posterUrl && (
                <img
                  src={art.posterUrl}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className={`cover-poster${posterLoaded ? " loaded" : ""}`}
                  onLoad={() => setPosterLoaded(true)}
                />
              )}
              <span className="case-texture" aria-hidden="true" />
              <span className="cover-sheen" aria-hidden="true" />
              {!art.posterUrl && <span className="cover-mark">{film.mark}</span>}
              <div className="cover-info">
                {art.logoUrl ? (
                  <img src={art.logoUrl} alt={film.title} className="cover-logo" loading="lazy" />
                ) : (
                  <>
                    <div className="text-[0.65rem] tracking-wide text-ivory/70">{film.categories[0]?.replace(/-/g, " ")}</div>
                    <h4 className="font-serif font-semibold text-[0.97rem] leading-tight mt-0.5">{film.title}</h4>
                  </>
                )}
                <div className="text-[0.73rem] text-ivory/60 mt-0.5">
                  {film.year} · {film.director}
                </div>
              </div>
            </div>
          </div>
          {isStage && interior}
        </div>
      </div>
      {mode === "shelf" && (
        <div className="case-title-plate">
          <div className="font-serif text-[0.92rem]">{film.title}</div>
          <div className="text-[0.76rem] text-ivory-faint">{film.year}</div>
        </div>
      )}
    </div>
  );
});
