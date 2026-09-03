import type { Finding } from "../lib/findings";

export function FindingCard({ f, index }: { f: Finding; index: number }) {
  const tilt = [-0.4, 0.3, -0.2, 0.4][index % 4];
  return (
    <div
      className="border border-line rounded-sm p-5 bg-obsidian-elevated"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="text-[0.72rem] tracking-wide text-red uppercase">{f.topic}</div>
      <div className="text-[0.78rem] text-ivory-faint mb-2.5">{f.where}</div>
      <dl className="space-y-2.5">
        <div>
          <dt className="font-serif text-[0.82rem] text-ivory-dim">What</dt>
          <dd className="text-[0.92rem] leading-relaxed">{f.what}</dd>
        </div>
        <div>
          <dt className="font-serif text-[0.82rem] text-ivory-dim">Why</dt>
          <dd className="text-[0.92rem] leading-relaxed">{f.why}</dd>
        </div>
        <div>
          <dt className="font-serif text-[0.82rem] text-ivory-dim">Impact</dt>
          <dd className="text-[0.92rem] leading-relaxed">{f.impact}</dd>
        </div>
        <div>
          <dt className="font-serif text-[0.82rem] text-ivory-dim">What can I learn</dt>
          <dd className="text-[0.92rem] leading-relaxed">{f.learn}</dd>
        </div>
        <div>
          <dt className="font-serif text-[0.82rem] text-ivory-dim">Try it</dt>
          <dd className="text-[0.92rem] leading-relaxed">{f.apply}</dd>
        </div>
      </dl>
      <div className="mt-3 pt-3 border-t border-line-soft text-[0.8rem] text-gold-bright/90 italic">{f.principle}</div>
    </div>
  );
}

export function ProgressBar({ percent, color = "var(--color-gold)" }: { percent: number; color?: string }) {
  return (
    <div className="h-[3px] bg-line rounded-full overflow-hidden mt-2">
      <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
    </div>
  );
}
