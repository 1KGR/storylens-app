import { Link, useNavigate } from "react-router-dom";
import { FILMS, findFilm } from "../data/films";
import { COLLECTIONS, ROLES } from "../data/taxonomy";
import { CollectorCase } from "../components/CollectorCase";
import { ProgressBar } from "../components/shared";
import { useStore } from "../state/store";
import { useCaseStage } from "../state/caseStage";

const FEATURED_SLUGS = ["whiplash", "parasite", "the-prestige", "memento", "mad-max-fury-road", "get-out"];

export default function Home() {
  const { progress } = useStore();
  const { requestOpen } = useCaseStage();
  const navigate = useNavigate();
  const featured = findFilm("anbe-sivam")!;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line py-16 md:py-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(1200px 600px at 15% -10%, rgba(165,50,58,0.16), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(201,162,39,0.14), transparent 55%)",
          }}
        />
        <div className="relative max-w-[1180px] mx-auto px-5 md:px-10 grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <span className="font-hand text-red text-xl inline-block -rotate-2 mb-1">a private film collection, reopened</span>
            <h1 className="font-serif italic font-normal text-[clamp(2.3rem,5.4vw,4.1rem)] leading-[1.05] max-w-[13ch] mb-5">
              Why does this story work?
            </h1>
            <p className="text-lg text-ivory-dim max-w-[46ch] leading-relaxed mb-7">
              StoryLens is where you take a film apart to see how it's built, then use what you find to improve your
              own story.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <Link to="/archive" className="bg-red text-ivory font-semibold px-6 py-3.5 rounded-sm hover:-translate-y-px transition">
                Enter the Archive
              </Link>
              <Link to="/create" className="border border-line font-semibold px-6 py-3.5 rounded-sm hover:border-ivory-dim transition">
                Start a Study
              </Link>
            </div>
          </div>
          <div className="flex justify-center" style={{ perspective: 1400 }}>
            <div className="w-[220px]">
              <CollectorCase film={featured} mode="shelf" onClick={(el) => requestOpen(featured.slug, el)} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-5 md:px-10 py-14">
        <div className="flex items-baseline justify-between gap-5 flex-wrap mb-7">
          <h2 className="font-serif text-2xl">Continue where you left off</h2>
          <span className="text-ivory-faint text-sm">Recently studied</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {progress.map((p) => {
            const f = findFilm(p.filmSlug);
            const role = ROLES.find((r) => r.id === p.roleId);
            if (!f || !role) return null;
            return (
              <button
                key={`${p.filmSlug}-${p.roleId}`}
                onClick={() => navigate(`/study/${f.slug}/report?roles=${p.roleId}`)}
                className="flex-shrink-0 w-[230px] text-left border border-line rounded-sm overflow-hidden bg-obsidian-elevated hover:border-gold transition"
              >
                <div className="h-24" style={{ background: `linear-gradient(155deg, ${f.gradient[0]}, ${f.gradient[1]})` }} />
                <div className="p-3.5">
                  <div className="text-red text-[0.72rem] uppercase tracking-wide">{role.label} Study</div>
                  <h4 className="font-serif text-[1.02rem] mt-1">{f.title}</h4>
                  <div className="text-ivory-faint text-xs mt-1">{p.percent}%</div>
                  <ProgressBar percent={p.percent} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-5 md:px-10 py-14">
        <div className="flex items-baseline justify-between gap-5 flex-wrap mb-7">
          <h2 className="font-serif text-2xl">Curated Collections</h2>
          <Link to="/archive" className="text-ivory-dim hover:text-red text-sm">
            View full archive →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              to={`/archive?category=${c.slug}`}
              className="border border-line rounded-sm p-5 bg-obsidian-elevated hover:border-gold transition flex flex-col justify-between min-h-[120px]"
            >
              <h3 className="font-serif text-lg">{c.name}</h3>
              <span className="text-ivory-faint text-sm mt-6">{c.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-5 md:px-10 py-14">
        <div className="flex items-baseline justify-between gap-5 flex-wrap mb-7">
          <h2 className="font-serif text-2xl">Featured Studies</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {FEATURED_SLUGS.map((slug) => {
            const f = findFilm(slug)!;
            return <CollectorCase key={slug} film={f} mode="shelf" onClick={(el) => requestOpen(f.slug, el)} />;
          })}
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-5 md:px-10 py-14">
        <div className="border border-line rounded bg-obsidian-elevated p-8 grid md:grid-cols-[0.6fr_1fr] gap-10 items-center">
          <div className="aspect-[2/3] rounded overflow-hidden max-w-[240px]" style={{ background: `linear-gradient(155deg, ${FILMS[6].gradient[0]}, ${FILMS[6].gradient[1]})` }} />
          <div>
            <div className="text-red text-sm mb-2">Films That Teach</div>
            <h3 className="font-serif italic text-3xl mb-3">{FILMS[6].title}</h3>
            <p className="text-ivory-dim leading-relaxed max-w-[56ch] mb-5">{FILMS[6].synopsis}</p>
            <Link to={`/film/${FILMS[6].slug}`} className="bg-gold text-obsidian font-semibold px-6 py-3 rounded-sm inline-block">
              Open the case
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
