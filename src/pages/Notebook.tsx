import { useState } from "react";
import { Link } from "react-router-dom";
import { FILMS } from "../data/films";
import { useStore } from "../state/store";

export default function Notebook() {
  const { notes, addNote } = useStore();
  const [filmSlug, setFilmSlug] = useState(FILMS[0].slug);
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [sceneRef, setSceneRef] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    addNote({
      filmSlug,
      text: text.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean),
      sceneRef: sceneRef.trim() || "—",
    });
    setText("");
    setTags("");
    setSceneRef("");
  };

  return (
    <section className="max-w-[900px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-10 pb-6 border-b border-line">
        <div className="font-hand text-red text-xl -rotate-1 inline-block">a filmmaker's digital notebook</div>
        <h1 className="font-serif italic text-4xl mt-1">My Film Notes</h1>
      </div>

      <div className="border border-line rounded bg-obsidian-elevated p-6 my-8">
        <h3 className="font-serif text-lg mb-4">New note</h3>
        <div className="space-y-3">
          <select value={filmSlug} onChange={(e) => setFilmSlug(e.target.value)} className="w-full bg-obsidian border border-line rounded px-3 py-2 text-sm">
            {FILMS.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.title}
              </option>
            ))}
          </select>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='e.g. "The camera remains outside the room during the argument."'
            className="w-full bg-obsidian border border-line rounded p-3 text-sm min-h-[80px]"
          />
          <div className="flex gap-3 flex-wrap">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tags, comma separated — blocking, distance, subtext"
              className="flex-1 min-w-[200px] bg-obsidian border border-line rounded px-3 py-2 text-sm"
            />
            <input
              value={sceneRef}
              onChange={(e) => setSceneRef(e.target.value)}
              placeholder="scene time — 01:14:22"
              className="w-40 bg-obsidian border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <button onClick={submit} className="bg-red text-ivory font-semibold px-5 py-2.5 rounded-sm text-sm">
            Save note
          </button>
        </div>
      </div>

      <h3 className="font-serif text-lg mb-4">My film notes</h3>
      <div className="space-y-4">
        {notes.map((n) => {
          const f = FILMS.find((x) => x.slug === n.filmSlug);
          return (
            <div key={n.id} className="border-t border-line-soft pt-4">
              <div className="flex justify-between gap-3 flex-wrap mb-1.5">
                <Link to={f ? `/film/${f.slug}` : "#"} className="font-serif italic text-lg hover:text-red">
                  {f?.title ?? n.filmSlug}
                </Link>
                <span className="text-ivory-faint text-sm font-mono">{n.sceneRef}</span>
              </div>
              <p className="mb-2">“{n.text}”</p>
              <div className="flex gap-2 flex-wrap">
                {n.tags.map((t) => (
                  <span key={t} className="text-xs text-gold-bright/90">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {notes.length === 0 && <p className="text-ivory-faint italic">No notes yet — save your first above.</p>}
      </div>
    </section>
  );
}
