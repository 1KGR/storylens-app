import type { Film } from "../data/films";

export function CaseInteriorSpread({
  film,
  onWatch,
  onTrailer,
  flat,
}: {
  film: Film;
  onWatch: () => void;
  onTrailer: () => void;
  flat?: boolean;
}) {
  return (
    <div className={flat ? "flex w-full rounded-b-md overflow-hidden border border-t-0 border-line" : "case-interior-spread"}>
      <div className="w-1/2 p-5 bg-[#F6F1E5] text-[#1B1712] overflow-hidden relative">
        <div className="text-[0.66rem] tracking-[0.08em] text-red uppercase font-semibold">Notes</div>
        <div className="font-hand text-[1.15rem] mt-2 mb-2.5 leading-snug -rotate-1">“{film.why}”</div>
        <p className="text-[0.8rem] text-[#6B6153] leading-relaxed">{film.signature}</p>
        {/* hinge crease shadow, sold as the fold between the two panels */}
        <div
          className="absolute top-0 bottom-0 right-0 w-3 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.12))" }}
        />
      </div>
      <div className="w-1/2 p-5 relative flex flex-col items-center justify-center gap-3.5 text-center" style={{ background: "radial-gradient(120% 100% at 50% 30%, #EAE1CB, #DCD1B4)" }}>
        <div
          className="absolute top-0 bottom-0 left-0 w-3 pointer-events-none"
          style={{ background: "linear-gradient(270deg, transparent, rgba(0,0,0,0.12))" }}
        />
        {/* recessed disc tray */}
        <div
          className="disc-well rounded-full p-3"
          tabIndex={0}
          style={{ boxShadow: "inset 0 3px 8px rgba(0,0,0,0.22), inset 0 -1px 0 rgba(255,255,255,0.4)" }}
        >
          <div className="disc-graphic" style={{ width: 78, height: 78 }} />
        </div>
        <div className="flex flex-col gap-1.5 w-full max-w-[160px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatch();
            }}
            className="w-full justify-center inline-flex items-center gap-2 bg-red text-ivory text-[0.85rem] font-semibold px-4 py-2.5 rounded-sm hover:-translate-y-px transition-transform duration-150"
          >
            ▷ Watch
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTrailer();
            }}
            className="w-full justify-center inline-flex items-center gap-2 border border-[#1B1712]/20 text-[#1B1712] text-[0.85rem] font-semibold px-4 py-2.5 rounded-sm hover:border-[#1B1712]/40 transition-colors duration-150"
          >
            Trailer
          </button>
        </div>
      </div>
    </div>
  );
}

export function MobileNotesDisc({ film, onWatch, onTrailer }: { film: Film; onWatch: () => void; onTrailer: () => void }) {
  return (
    <div className="hidden max-[640px]:block">
      <div className="border-t border-line pt-6 mt-6">
        <div className="text-[0.72rem] tracking-[0.08em] text-red uppercase font-semibold mb-2">Notes</div>
        <div className="font-hand text-[1.15rem] mb-2 -rotate-1">“{film.why}”</div>
        <p className="text-ivory-dim leading-relaxed">{film.signature}</p>
      </div>
      <div className="border-t border-line pt-6 mt-6">
        <div className="text-[0.72rem] tracking-[0.08em] text-red uppercase font-semibold mb-3">Disc</div>
        <div className="flex items-center gap-4">
          <div className="disc-well" tabIndex={0}>
            <div className="disc-graphic" style={{ width: 56, height: 56, flexShrink: 0 }} />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <button onClick={onWatch} className="bg-red text-ivory text-sm font-semibold px-4 py-2.5 rounded-sm">
              ▷ Watch
            </button>
            <button onClick={onTrailer} className="border border-line text-ivory text-sm font-semibold px-4 py-2.5 rounded-sm">
              Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
