import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { findFilm } from "../data/films";
import { useStore } from "../state/store";
import { parseScreenplayFile, parsePastedText, type ParsedScreenplay } from "../services/screenplayParser";
import { analyzeScreenplay, type AnalysisResult } from "../services/aiService";
import { hasAiEndpoint } from "../services/env";

type Phase = "idle" | "reading" | "analyzing" | "result" | "error";

const PIPELINE_STAGES = ["Uploading", "Reading", "Extracting scenes", "Identifying characters", "Mapping structure", "Analyzing"];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line rounded p-3">
      <div className="text-ivory-faint text-xs mb-1">{label}</div>
      <div className="font-serif truncate">{value}</div>
    </div>
  );
}

export default function Create() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stageIndex, setStageIndex] = useState(0);
  const [pasted, setPasted] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [parsed, setParsed] = useState<ParsedScreenplay | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { drafts, addDraftFromAnalysis } = useStore();
  const latest = drafts[drafts.length - 1];

  const runPipeline = async (getParsed: () => Promise<ParsedScreenplay> | ParsedScreenplay) => {
    setError(null);
    setPhase("reading");
    setStageIndex(0);
    try {
      // Stage 0–1: Uploading / Reading — the actual file read + text extraction.
      const p = await getParsed();
      setParsed(p);
      setStageIndex(2);
      await tick();
      setStageIndex(3); // Identifying characters — already computed by the parser
      await tick();
      setStageIndex(4); // Mapping structure
      await tick();
      setPhase("analyzing");
      setStageIndex(5);
      const r = await analyzeScreenplay(p);
      setResult(r);

      const clamp = (n: number) => Math.max(20, Math.min(98, Math.round(n)));
      const structureWeak = r.weaknesses.filter((w) => w.topic === "Structure").length;
      const characterWeak = r.weaknesses.filter((w) => w.topic === "Character").length;
      addDraftFromAnalysis({
        metrics: {
          structure: clamp(88 - structureWeak * 16),
          character: clamp(88 - characterWeak * 16),
          pacing: clamp(r.pacing.rating),
          dialogue: clamp(r.dialogue.rating),
          theme: clamp(84 - (r.foreshadowing.length ? 0 : 8)),
        },
        weaknesses: r.weaknesses.map((w) => `${w.topic}: ${w.what}`),
        strengths: r.strengths,
        questions: r.questions,
        recommended: [...new Set(r.weaknesses.flatMap((w) => w.recommendedFilms))],
      });

      setPhase("result");
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Something went wrong reading that file.");
      setPhase("error");
    }
  };

  const tick = () => new Promise((r) => setTimeout(r, 260));

  const onFile = (file: File) => {
    const ok = /\.(pdf|docx|txt)$/i.test(file.name);
    if (!ok) {
      setError("StoryLens can read PDF, DOCX, or TXT files.");
      setPhase("error");
      return;
    }
    runPipeline(() => parseScreenplayFile(file));
  };

  const onPaste = () => {
    if (!pasted.trim()) return;
    runPipeline(() => parsePastedText(pasted));
  };

  if (phase === "idle" || phase === "error") {
    return (
      <section className="max-w-[820px] mx-auto px-5 md:px-10 pb-20">
        <div className="pt-10 pb-6 border-b border-line">
          <div className="text-red text-sm mb-2">World 2 — My Story</div>
          <h1 className="font-serif italic text-4xl mb-3">Create / Analyze Your Story</h1>
          <p className="text-ivory-dim max-w-[60ch]">
            Upload a screenplay or paste your story. StoryLens actually reads the file client-side — real page/scene/character
            detection — then runs it through a structured analysis pipeline.
            {!hasAiEndpoint() && (
              <span className="block mt-2 text-ivory-faint text-sm italic">
                No AI endpoint is configured in this environment, so the analysis below is StoryLens's structured mock
                pipeline rather than a live model — see the README for wiring up a real one.
              </span>
            )}
          </p>
        </div>

        {error && <div className="mt-6 border border-red/50 bg-red/10 text-red-soft rounded px-4 py-3 text-sm">{error}</div>}

        <div className="grid sm:grid-cols-2 gap-5 mt-8">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) onFile(file);
            }}
            className={`border rounded bg-obsidian-elevated p-7 text-left transition-colors ${dragOver ? "border-gold bg-gold/5" : "border-line"}`}
          >
            <h3 className="font-serif text-lg mb-1.5">Upload screenplay</h3>
            <p className="text-ivory-faint text-sm mb-4">Drag a file here, or PDF / DOCX / TXT</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFile(file);
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-block bg-red text-ivory text-sm font-semibold px-4 py-2 rounded-sm hover:brightness-110 transition"
            >
              Choose a file
            </button>
          </div>
          <div className="border border-line rounded bg-obsidian-elevated p-7">
            <h3 className="font-serif text-lg mb-1.5">Paste story / screenplay</h3>
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder="Paste a scene, outline, or full draft…"
              className="w-full bg-obsidian border border-line rounded p-3 text-sm min-h-[100px] mb-3 focus:border-gold outline-none transition-colors"
            />
            <button onClick={onPaste} className="bg-red text-ivory text-sm font-semibold px-4 py-2 rounded-sm hover:brightness-110 transition">
              Analyze pasted text
            </button>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          <Link to="/tracker" className="border border-line rounded-sm p-5 hover:border-gold transition-colors">
            <h4 className="font-serif mb-1">My Story Tracker</h4>
            <p className="text-ivory-faint text-sm">Draft {latest.number} · see improvement over time</p>
          </Link>
          <Link to="/path" className="border border-line rounded-sm p-5 hover:border-gold transition-colors">
            <h4 className="font-serif mb-1">My Learning Path</h4>
            <p className="text-ivory-faint text-sm">Currently studying pacing</p>
          </Link>
          <Link to="/skills" className="border border-line rounded-sm p-5 hover:border-gold transition-colors">
            <h4 className="font-serif mb-1">Study by Skill</h4>
            <p className="text-ivory-faint text-sm">Film → learning → your story</p>
          </Link>
        </div>
      </section>
    );
  }

  if (phase === "reading" || phase === "analyzing") {
    return (
      <section className="max-w-[600px] mx-auto px-5 md:px-10 py-24">
        <h1 className="font-serif italic text-3xl mb-8">{phase === "reading" ? "Reading your file…" : "Analyzing story…"}</h1>
        <div className="space-y-3">
          {PIPELINE_STAGES.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs flex-shrink-0 transition-colors ${
                  i < stageIndex ? "bg-gold border-gold text-obsidian" : i === stageIndex ? "border-gold animate-pulse" : "border-line text-ivory-faint"
                }`}
              >
                {i < stageIndex ? "✓" : ""}
              </span>
              <span className={i <= stageIndex ? "text-ivory" : "text-ivory-faint"}>{s}</span>
            </div>
          ))}
        </div>
        {parsed && (
          <div className="mt-8 pt-6 border-t border-line text-sm text-ivory-faint space-y-1">
            <div>{parsed.fileName}</div>
            <div>
              {parsed.pageCount ? `${parsed.pageCount} pages · ` : ""}
              {parsed.charCount.toLocaleString()} characters read
            </div>
          </div>
        )}
      </section>
    );
  }

  // phase === "result"
  if (!result || !parsed) return null;

  return (
    <section className="max-w-[820px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-10 pb-6 border-b border-line">
        <div className="text-red text-sm mb-2">
          StoryLens Study — Draft {latest.number} · {result.source === "llm" ? "Live model" : "Structured mock pipeline"}
        </div>
        <h1 className="font-serif italic text-4xl mb-2">Your Story</h1>
        <p className="text-ivory-faint text-sm">{result.summary}</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 my-8 text-sm">
        <Stat label="File" value={parsed.fileName} />
        <Stat label="Scenes detected" value={String(parsed.scenes.length)} />
        <Stat label="Characters detected" value={String(parsed.characters.length)} />
        <Stat label={parsed.pageCount ? "Pages" : "Characters (text)"} value={parsed.pageCount ? String(parsed.pageCount) : parsed.charCount.toLocaleString()} />
      </div>

      <div className="grid sm:grid-cols-5 gap-4 mb-10">
        {Object.entries(latest.metrics).map(([k, v]) => (
          <div key={k}>
            <div className="text-xs text-ivory-faint capitalize mb-1">{k}</div>
            <div className="text-2xl font-serif">{v}%</div>
            {latest.deltas[k as keyof typeof latest.deltas] !== undefined && (
              <div className={`text-xs ${(latest.deltas[k as keyof typeof latest.deltas] ?? 0) >= 0 ? "text-gold-bright" : "text-red-soft"}`}>
                {(latest.deltas[k as keyof typeof latest.deltas] ?? 0) >= 0 ? "+" : ""}
                {latest.deltas[k as keyof typeof latest.deltas]}%
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="font-serif text-lg mb-4 text-red">Weaknesses</h3>
          <div className="space-y-6">
            {result.weaknesses.map((w) => (
              <div key={w.id} className="border-l-2 border-red pl-5">
                <div className="text-[0.7rem] tracking-wide text-red uppercase mb-1.5">{w.topic}</div>
                <p className="font-medium mb-2">{w.what}</p>
                <div className="text-sm text-ivory-faint mb-1">
                  <span className="text-ivory-dim">Where: </span>
                  {w.where}
                </div>
                <div className="text-sm text-ivory-dim leading-relaxed mb-2">
                  <span className="font-medium">Why it matters — </span>
                  {w.whyItMatters}
                </div>
                <div className="text-sm text-ivory-dim leading-relaxed mb-3">
                  <span className="font-medium">Try — </span>
                  {w.tryThis}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-ivory-faint">StoryLens recommends studying:</span>
                  {w.recommendedFilms.map((slug) => {
                    const f = findFilm(slug);
                    if (!f) return null;
                    return (
                      <Link key={slug} to={`/film/${slug}`} className="text-xs border border-gold/50 text-gold-bright rounded-full px-2.5 py-1 hover:border-gold transition-colors">
                        {f.title}
                      </Link>
                    );
                  })}
                  <Link
                    to={`/skills/${w.relatedSkill}`}
                    className="text-xs text-ivory-faint hover:text-gold underline underline-offset-2"
                  >
                    Study this technique →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg mb-3 text-gold">Strengths</h3>
          <ul className="space-y-2 list-disc list-inside text-ivory-dim">
            {result.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg mb-3">Turning points detected</h3>
          <div className="space-y-2">
            {result.turningPoints.map((tp, i) => (
              <div key={i} className="flex items-baseline gap-3 text-sm">
                <span className="text-gold-bright font-mono w-10 flex-shrink-0">{tp.approxPosition}%</span>
                <span className="font-medium w-32 flex-shrink-0">{tp.label}</span>
                <span className="text-ivory-dim">{tp.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg mb-3">Questions to reconsider</h3>
          <ul className="space-y-2 list-disc list-inside text-ivory-dim">
            {result.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg mb-3">Characters detected in your draft</h3>
          <div className="flex flex-wrap gap-2">
            {parsed.characters.length ? (
              parsed.characters.map((c) => (
                <span key={c} className="text-sm border border-line rounded-full px-3 py-1">
                  {c}
                </span>
              ))
            ) : (
              <span className="text-sm text-ivory-faint italic">No character cues detected — StoryLens looks for ALL-CAPS name lines, standard screenplay style.</span>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap pt-4 border-t border-line">
          <Link to="/tracker" className="bg-red text-ivory font-semibold px-5 py-2.5 rounded-sm text-sm hover:brightness-110 transition">
            Compare with your story →
          </Link>
          <button
            onClick={() => {
              setPhase("idle");
              setParsed(null);
              setResult(null);
            }}
            className="border border-line font-semibold px-5 py-2.5 rounded-sm text-sm hover:border-gold transition-colors"
          >
            Analyze another draft
          </button>
        </div>
      </div>
    </section>
  );
}
