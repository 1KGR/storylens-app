import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCaseStage, reduceEffects } from "../state/caseStage";
import { findFilm } from "../data/films";
import { CollectorCase } from "./CollectorCase";
import { CaseInteriorSpread, MobileNotesDisc } from "./CaseInteriorSpread";
import { CaseBookletSections } from "./CaseBookletSections";
import { useTrailer } from "./TrailerModal";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

// Three.js/@react-three/fiber is a large dependency — only fetch it once
// someone actually opens a case, not on initial app load.
const CaseCanvas3D = lazy(() => import("../three/CaseCanvas3D").then((m) => ({ default: m.CaseCanvas3D })));

// Sequence: the shelf case FLIP-animates to center as the existing, proven
// CSS 3D object (cheap, and there's only ever one on screen at a time here).
// Once it arrives, we crossfade into a real Three.js case in the same box —
// that's the object that actually performs the hinge-opening. Skipped
// entirely on mobile / prefers-reduced-motion, where the CSS case (already
// simplified to a closed cover) is the whole experience — no WebGL there.
export function CaseStageOverlay() {
  const { stage, stageCaseRef, requestClose } = useCaseStage();
  const [contentIn, setContentIn] = useState(false);
  const [scrimIn, setScrimIn] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [open3D, setOpen3D] = useState(false);
  const [pickedUp3D, setPickedUp3D] = useState(true);
  const scrimRef = useRef<HTMLDivElement>(null);
  const { open: openTrailer } = useTrailer();
  const [webglOk, setWebglOk] = useState(true);
  const use3D = !reduceEffects() && webglOk;

  const fallBackToCss = () => {
    setWebglOk(false);
    setShow3D(false);
  };

  useEffect(() => {
    if (!stage.slug) {
      setContentIn(false);
      setScrimIn(false);
      setShow3D(false);
      setOpen3D(false);
      setPickedUp3D(true);
      return;
    }
    const stageCase = stageCaseRef.current;
    if (!stageCase) return;

    if (!stage.animate || !stage.originRect) {
      requestAnimationFrame(() => {
        setScrimIn(true);
        if (use3D) {
          setShow3D(true);
          setPickedUp3D(false);
          setTimeout(() => setOpen3D(true), 60);
          setTimeout(() => setContentIn(true), 60 + 500);
        } else {
          stageCase.classList.add("open-hinge");
          setContentIn(true);
        }
      });
      return;
    }

    const originRect = stage.originRect;
    requestAnimationFrame(() => {
      const lastRect = stageCase.getBoundingClientRect();
      const dx = originRect.left + originRect.width / 2 - (lastRect.left + lastRect.width / 2);
      const dy = originRect.top + originRect.height / 2 - (lastRect.top + lastRect.height / 2);
      const sx = originRect.width / lastRect.width;
      const sy = originRect.height / lastRect.height;
      stageCase.style.transition = "none";
      stageCase.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      requestAnimationFrame(() => {
        setScrimIn(true);
        stageCase.style.transition = "transform .44s cubic-bezier(.22,.75,.2,1)";
        stageCase.style.transform = "translate(0,0) scale(1,1)";
        if (use3D) {
          // crossfade to the real 3D case once the FLIP arrives, then open it
          setTimeout(() => setShow3D(true), 400);
          setTimeout(() => setPickedUp3D(false), 620);
          setTimeout(() => setOpen3D(true), 620);
          setTimeout(() => setContentIn(true), 620 + 500);
        } else {
          setTimeout(() => stageCase.classList.add("open-hinge"), 400);
          setTimeout(() => setContentIn(true), 400 + 400);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.slug]);

  if (!stage.slug) return null;
  const film = findFilm(stage.slug);
  if (!film) return null;

  const revealCls = contentIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2";

  return createPortal(
    <div
      ref={scrimRef}
      onClick={(e) => {
        if (e.target === scrimRef.current) requestClose();
      }}
      className="fixed inset-0 z-[970] overflow-y-auto flex px-5 py-16"
      style={{
        background: scrimIn ? "rgba(6,5,4,0.82)" : "rgba(6,5,4,0)",
        backdropFilter: scrimIn ? "blur(3px)" : "none",
        transition: "background .32s ease, backdrop-filter .32s ease",
      }}
    >
      <div className="w-full max-w-[700px] mx-auto my-auto">
        <button
          onClick={requestClose}
          className={`inline-flex items-center gap-2 bg-obsidian-elevated border border-line text-ivory-dim px-4 py-2 rounded-full text-sm mb-6 transition-opacity ${contentIn || show3D ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: contentIn ? "0.28s" : "0s" }}
        >
          ← Close the case
        </button>

        <div className="w-[min(300px,62vw)] mx-auto relative" style={{ aspectRatio: "2 / 3" }}>
          <div className="absolute inset-0 transition-opacity duration-200" style={{ opacity: show3D ? 0 : 1 }}>
            <CollectorCase
              film={film}
              mode="stage"
              ref={stageCaseRef}
              interior={
                <CaseInteriorSpread
                  film={film}
                  onWatch={() => openTrailer(film.title, "Watch")}
                  onTrailer={() => openTrailer(film.title, "Trailer")}
                />
              }
            />
          </div>
          {use3D && (
            <div className="absolute inset-0 transition-opacity duration-200" style={{ opacity: show3D ? 1 : 0, pointerEvents: show3D ? "auto" : "none" }}>
              <WebGLErrorBoundary onError={fallBackToCss}>
                <Suspense fallback={null}>
                  <CaseCanvas3D film={film} open={open3D} pickedUp={pickedUp3D} onContextLost={fallBackToCss} />
                </Suspense>
              </WebGLErrorBoundary>
            </div>
          )}
        </div>

        {/* interior content — same proven Notes/Disc/Booklet DOM, revealed once the 3D case has finished opening.
            (The CSS fallback case already renders its own interior spread internally, so this stays hidden there.) */}
        {use3D && (
          <div className={`w-[min(300px,62vw)] mx-auto relative -mt-1 ${open3D ? "" : "invisible h-0 overflow-hidden"}`} aria-hidden={!open3D}>
            <CaseInteriorAsFlatPanel film={film} onWatch={() => openTrailer(film.title, "Watch")} onTrailer={() => openTrailer(film.title, "Trailer")} visible={contentIn} />
          </div>
        )}

        <div className={`max-w-[620px] mx-auto mt-8 text-left transition-all duration-[450ms] ${revealCls}`}>
          <div className="text-red text-[0.82rem] mb-2">{film.categories[0]?.replace(/-/g, " ")}</div>
          <h1 className="font-serif italic text-3xl mb-2">{film.title}</h1>
          <div className="text-ivory-faint text-[0.9rem] space-x-2 mb-3">
            <span>{film.year}</span>
            <span>·</span>
            <span>{film.director}</span>
            <span>·</span>
            <span>{film.runtime} min</span>
          </div>
          <p className="font-serif italic text-lg text-ivory-dim">{film.logline}</p>
        </div>

        <div className={`transition-all duration-[450ms] ${revealCls}`}>
          <MobileNotesDisc film={film} onWatch={() => openTrailer(film.title, "Watch")} onTrailer={() => openTrailer(film.title, "Trailer")} />
          <CaseBookletSections film={film} />
        </div>
      </div>
    </div>,
    document.body
  );
}

// The Notes/Disc spread, presented as a flat panel directly beneath the 3D
// case once it's open (the 3D scene renders the physical object only; this
// keeps the interactive Watch/Trailer buttons as ordinary, reliable DOM).
function CaseInteriorAsFlatPanel({
  film,
  onWatch,
  onTrailer,
  visible,
}: {
  film: ReturnType<typeof findFilm>;
  onWatch: () => void;
  onTrailer: () => void;
  visible: boolean;
}) {
  if (!film) return null;
  return (
    <div
      className="transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(6px)" }}
    >
      <CaseInteriorSpread film={film} onWatch={onWatch} onTrailer={onTrailer} flat />
    </div>
  );
}
