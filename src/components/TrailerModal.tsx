import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface TrailerState {
  title: string;
  kind: string;
}

interface TrailerContextValue {
  open: (title: string, kind: string) => void;
}

const TrailerContext = createContext<TrailerContextValue | null>(null);

export function TrailerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TrailerState | null>(null);

  return (
    <TrailerContext.Provider value={{ open: (title, kind) => setState({ title, kind }) }}>
      {children}
      {state &&
        createPortal(
          <div
            className="fixed inset-0 z-[960] bg-black/70 flex items-center justify-center p-5"
            onClick={(e) => {
              if (e.target === e.currentTarget) setState(null);
            }}
          >
            <div className="bg-obsidian rounded border border-line max-w-[720px] w-full overflow-hidden">
              <div className="aspect-video flex flex-col items-center justify-center gap-3 text-ivory relative">
                <div className="w-16 h-16 rounded-full border-2 border-white/70 flex items-center justify-center">
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="text-sm opacity-80">{state.kind} preview — not wired to a real source in this prototype</div>
              </div>
              <div className="px-5 py-4 flex justify-between items-center">
                <span className="font-serif italic">{state.title}</span>
                <button
                  onClick={() => setState(null)}
                  className="border border-line rounded-sm px-3.5 py-2 text-sm hover:border-gold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </TrailerContext.Provider>
  );
}

export function useTrailer() {
  const ctx = useContext(TrailerContext);
  if (!ctx) throw new Error("useTrailer must be used within TrailerProvider");
  return ctx;
}
