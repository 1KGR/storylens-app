import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface StageState {
  slug: string | null;
  originEl: HTMLElement | null;
  originRect: DOMRect | null;
  animate: boolean;
}

interface StageContextValue {
  stage: StageState;
  stageCaseRef: React.RefObject<HTMLDivElement | null>;
  requestOpen: (slug: string, el: HTMLElement) => void;
  requestClose: () => void;
  closeImmediate: () => void;
  registerStageMounted: () => void;
}

const StageContext = createContext<StageContextValue | null>(null);

function reduceEffects() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(max-width: 640px)").matches
  );
}

export function CaseStageProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<StageState>({ slug: null, originEl: null, originRect: null, animate: false });
  const stageCaseRef = useRef<HTMLDivElement>(null);

  const requestOpen = useCallback((slug: string, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    el.style.visibility = "hidden";
    document.body.classList.add("stage-open");
    document.documentElement.classList.add("stage-open");
    setStage({ slug, originEl: el, originRect: rect, animate: !reduceEffects() });
  }, []);

  const requestClose = useCallback(() => {
    const el = stage.originEl;
    const finish = () => {
      if (el) {
        el.style.visibility = "";
      }
      document.body.classList.remove("stage-open");
      document.documentElement.classList.remove("stage-open");
      setStage({ slug: null, originEl: null, originRect: null, animate: false });
    };

    const stageCase = stageCaseRef.current;
    if (!stageCase || !el || reduceEffects()) {
      finish();
      return;
    }

    stageCase.classList.remove("open-hinge");
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const lastRect = stageCase.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - (lastRect.left + lastRect.width / 2);
      const dy = rect.top + rect.height / 2 - (lastRect.top + lastRect.height / 2);
      const sx = rect.width / lastRect.width;
      const sy = rect.height / lastRect.height;
      stageCase.style.transition = "transform .36s cubic-bezier(.4,.2,.2,1)";
      stageCase.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      setTimeout(finish, 360);
    }, 300);
  }, [stage.originEl]);

  const closeImmediate = useCallback(() => {
    setStage((s) => {
      if (s.originEl) s.originEl.style.visibility = "";
      return { slug: null, originEl: null, originRect: null, animate: false };
    });
    document.body.classList.remove("stage-open");
    document.documentElement.classList.remove("stage-open");
  }, []);

  const registerStageMounted = useCallback(() => {
    // no-op hook point retained for symmetry / future use
  }, []);

  return (
    <StageContext.Provider value={{ stage, stageCaseRef, requestOpen, requestClose, closeImmediate, registerStageMounted }}>
      {children}
    </StageContext.Provider>
  );
}

export function useCaseStage() {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useCaseStage must be used within CaseStageProvider");
  return ctx;
}

export { reduceEffects };
