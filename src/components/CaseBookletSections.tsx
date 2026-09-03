import { Link } from "react-router-dom";
import type { Film } from "../data/films";
import { mockLetterboxdReviews, LETTERBOXD_PLACEHOLDER_NOTE } from "../lib/reviews";
import { useState } from "react";

function PageNumber({ n }: { n: string }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-line text-[0.68rem] font-serif text-ivory-faint mr-2.5 align-middle">
      {n}
    </span>
  );
}

export function CaseBookletSections({ film }: { film: Film }) {
  const reviews = mockLetterboxdReviews(film);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="booklet-paper max-w-[620px] mx-auto mt-12">
      <section className="pt-0 pb-7">
        <div className="text-[0.72rem] tracking-[0.08em] text-red uppercase font-semibold mb-2.5">Booklet</div>
        <h3 className="font-serif text-[1.3rem] mb-3.5 flex items-center">
          <PageNumber n="01" />
          Synopsis
        </h3>
        <p className="text-ivory-dim leading-relaxed pl-[34px]">{film.synopsis}</p>
        <div className="text-ivory-faint text-[0.86rem] mt-3.5 pl-[34px] leading-relaxed">
          {[film.year, film.director, `${film.runtime} min`, film.genre, film.language, film.country].join("  ·  ")}
        </div>
      </section>

      <section className="py-7 border-t border-line">
        <h3 className="font-serif text-[1.3rem] mb-4 flex items-center">
          <PageNumber n="02" />
          Cast &amp; Crew
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pl-[34px]">
          {film.cast.map((c) => (
            <div key={c.actor}>
              <div
                className="w-full aspect-square rounded-sm mb-2"
                style={{ background: `linear-gradient(160deg, ${film.gradient[0]}55, ${film.gradient[1]}55), #E3DAC5` }}
              />
              <div className="font-semibold text-[0.9rem]">{c.actor}</div>
              <div className="text-ivory-faint text-[0.8rem]">{c.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-7 border-t border-line">
        <div className="text-[0.72rem] tracking-[0.08em] text-red uppercase font-semibold mb-2.5">Reviews</div>
        <h3 className="font-serif text-[1.3rem] mb-3.5 flex items-center">
          <PageNumber n="03" />
          Letterboxd connection
        </h3>
        <div className="pl-[34px]">
          <p className="text-ivory-faint text-[0.85rem] mb-4 italic">{LETTERBOXD_PLACEHOLDER_NOTE}</p>
          <div className="border border-dashed border-line rounded px-4 py-3 mb-5 flex items-center justify-between gap-3">
            <span className="text-sm text-ivory-dim">Not connected</span>
            <button className="text-sm border border-line rounded-full px-3 py-1.5 hover:border-gold transition-colors duration-150">
              Connect Letterboxd
            </button>
          </div>
          <div className="text-[0.72rem] tracking-wide text-ivory-faint uppercase mb-2">Recommended community voices</div>
          {reviews.map((r, i) => (
            <div key={i} className="border-t border-line-soft py-3 first:border-t-0">
              <p className="italic">“{r.quote}”</p>
              <span className="text-ivory-faint text-[0.85rem]">— @{r.handle}</span>
            </div>
          ))}

          <div className="mt-6 border-t border-line pt-5">
            <h4 className="font-serif italic text-[1.05rem] mb-3">Write your StoryLens review</h4>
            {submitted ? (
              <p className="text-ivory-dim text-sm">Saved to your profile. Thanks for adding to the archive.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMyRating(n)}
                      className={`text-xl transition-colors duration-150 ${n <= myRating ? "text-gold" : "text-ivory-faint"}`}
                      aria-label={`Rate ${n}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={myReview}
                  onChange={(e) => setMyReview(e.target.value)}
                  placeholder="What did you notice this time?"
                  className="w-full bg-obsidian-elevated border border-line rounded p-3 text-sm min-h-[80px] focus:border-gold outline-none transition-colors duration-150"
                />
                <button
                  onClick={() => setSubmitted(true)}
                  className="bg-red text-ivory text-sm font-semibold px-4 py-2 rounded-sm hover:brightness-110 transition"
                >
                  Save review
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Special Features — deliberately reads as a bonus disc insert, not a nav card */}
      <section className="py-8 border-t border-line">
        <div className="text-[0.72rem] tracking-[0.08em] text-red uppercase font-semibold mb-4">Special Features</div>

        <Link
          to={`/study/${film.slug}`}
          className="group relative block rounded-md overflow-hidden border-2 border-gold/60 hover:border-gold transition-colors duration-200 px-6 py-7"
          style={{ background: "linear-gradient(155deg, rgba(201,162,39,0.12), rgba(201,162,39,0.02) 60%)" }}
        >
          <span className="absolute top-0 right-0 bg-gold text-obsidian text-[0.6rem] font-bold tracking-[0.14em] uppercase px-3 py-1 rounded-bl-md">
            Bonus
          </span>
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full border border-gold/60 flex items-center justify-center flex-shrink-0 text-gold text-lg">
              ✦
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.68rem] tracking-[0.1em] text-gold-bright uppercase mb-1">Special Feature</div>
              <h4 className="font-serif italic text-[1.3rem] mb-1.5">Study This Film</h4>
              <p className="text-ivory-dim text-[0.85rem] leading-snug max-w-[46ch]">
                Choose a role — Writer, Director, Cinematographer, Actor, Editor, Sound Designer, Production
                Designer, Producer, Marketing, Cinephile — and open its craft analysis.
              </p>
            </div>
            <span className="font-serif italic text-gold text-2xl flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>

        <Link
          to={`/scenes/${film.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-ivory-faint hover:text-gold text-sm transition-colors duration-150"
        >
          Or explore Scene Anatomy for this film →
        </Link>
      </section>
    </div>
  );
}
