import { useStore } from "../state/store";
import { ProgressBar } from "../components/shared";

const LABELS: Record<string, string> = { structure: "Structure", character: "Character", pacing: "Pacing", dialogue: "Dialogue", theme: "Theme" };

export default function Tracker() {
  const { drafts } = useStore();
  const latest = drafts[drafts.length - 1];
  const prev = drafts[drafts.length - 2];

  return (
    <section className="max-w-[820px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-10 pb-6 border-b border-line">
        <div className="text-red text-sm mb-2">My Story</div>
        <h1 className="font-serif italic text-4xl mb-2">Draft {latest.number}</h1>
        <p className="text-ivory-faint text-sm">{latest.date}</p>
      </div>

      <div className="grid sm:grid-cols-5 gap-5 my-8">
        {Object.entries(latest.metrics).map(([k, v]) => {
          const delta = latest.deltas[k as keyof typeof latest.deltas];
          return (
            <div key={k}>
              <div className="text-xs text-ivory-faint mb-1">{LABELS[k]}</div>
              <div className="text-2xl font-serif">{v}%</div>
              {delta !== undefined && (
                <div className={`text-xs mt-0.5 ${delta >= 0 ? "text-gold-bright" : "text-red-soft"}`}>
                  {delta >= 0 ? "+" : ""}
                  {delta}%
                </div>
              )}
              <ProgressBar percent={v} />
            </div>
          );
        })}
      </div>

      <h3 className="font-serif text-lg mb-4">Draft history</h3>
      <div className="space-y-5">
        {[...drafts].reverse().map((d) => (
          <div key={d.number} className="border border-line rounded p-5">
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-serif text-lg">Draft {d.number}</span>
              <span className="text-ivory-faint text-sm">{d.date}</span>
            </div>
            <div className="grid grid-cols-5 gap-3 text-sm">
              {Object.entries(d.metrics).map(([k, v]) => (
                <div key={k}>
                  <div className="text-ivory-faint text-xs">{LABELS[k]}</div>
                  <div>{v}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {prev && (
        <div className="mt-8 border-t border-line pt-6">
          <h3 className="font-serif text-lg mb-3">What changed since Draft {prev.number}</h3>
          <ul className="space-y-1.5 text-ivory-dim">
            {Object.entries(latest.deltas).map(([k, v]) => (
              <li key={k}>
                {LABELS[k]} {v! >= 0 ? "+" : ""}
                {v}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
