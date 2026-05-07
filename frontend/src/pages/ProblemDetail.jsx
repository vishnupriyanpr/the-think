import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProblemById } from "../api/problems";
import ScoreBadge from "../components/ScoreBadge";
import TagBadge from "../components/TagBadge";

const SOURCE_STYLES = {
  reddit: "bg-[var(--orange)]",
  hackernews: "bg-[var(--yellow)]",
  producthunt: "bg-[var(--pink)]",
  fixmyitch: "bg-[var(--sky)]",
};

function getViabilityExplanation(score) {
  if (score >= 80) {
    return "This one has hard signals: recurring pain, clear buying intent, and enough sharpness to become a focused SaaS product.";
  }
  if (score >= 60) {
    return "This is a strong candidate. The problem is specific enough to validate quickly and broad enough to deserve a prototype.";
  }
  if (score >= 40) {
    return "This has some signal, but the demand needs proof. Talk to users before turning it into a full product.";
  }
  return "The signal is early or weak. Treat it as a research lead, not a build decision yet.";
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 12V2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="square" />
      <path d="M2.8 6.2L7 2L11.2 6.2" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="miter" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="38" height="38" stroke="currentColor" strokeWidth="3" />
      <path d="M18 18L36 36" stroke="currentColor" strokeWidth="3" />
      <path d="M36 18L18 36" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProblemById(id)
      .then((data) => {
        setProblem(data);
        setError(null);
      })
      .catch(() => {
        setError("Problem not found");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="neo-shell px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 h-12 w-40 animate-pulse border-[3px] border-[var(--ink)] bg-[var(--sky-3)] shadow-[4px_4px_0_var(--ink)]" />
          <div className="h-96 animate-pulse border-[3px] border-[var(--ink)] bg-white shadow-[8px_8px_0_var(--ink)]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="neo-shell flex items-center justify-center px-5 py-24">
        <div className="neo-card max-w-xl bg-white p-8 text-center">
          <div className="mx-auto mb-5 flex justify-center text-[var(--ink)]">
            <EmptyIcon />
          </div>
          <h2 className="font-display text-5xl tracking-[-0.07em]">{error}</h2>
          <button onClick={() => navigate("/explore")} className="neo-button mt-7">
            Back to feed
          </button>
        </div>
      </div>
    );
  }

  const viability = getViabilityExplanation(problem.saasScore);

  return (
    <article className="neo-shell px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <button
          id="back-to-feed-btn"
          onClick={() => navigate("/explore")}
          className="neo-button-ghost mb-8"
        >
          Back to feed
        </button>

        <div className="neo-card bg-white p-6 sm:p-8">
          <header className="border-b-[5px] border-[var(--ink)] pb-6">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className={`${SOURCE_STYLES[problem.source] || "bg-white"} border-[3px] border-[var(--ink)] px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-[3px_3px_0_var(--ink)]`}
              >
                {problem.source}
              </span>
              <span className="neo-tag bg-[var(--sky-3)]">{problem.domain}</span>
            </div>

            <h1 className="font-display text-[clamp(2.7rem,6vw,5.5rem)] leading-[0.9] tracking-[-0.08em]">
              {problem.title}
            </h1>
          </header>

          <div className="grid gap-5 border-b-[5px] border-[var(--ink)] py-6 md:grid-cols-3">
            <div>
              <p className="neo-label mb-2 text-[var(--muted)]">Viability</p>
              <ScoreBadge score={problem.saasScore} />
            </div>
            <div>
              <p className="neo-label mb-2 text-[var(--muted)]">Difficulty</p>
              <span className="neo-tag bg-[var(--yellow)]">{problem.difficulty}</span>
            </div>
            <div>
              <p className="neo-label mb-2 text-[var(--muted)]">Demand</p>
              <span className="inline-flex items-center gap-2 border-[3px] border-[var(--ink)] bg-white px-3 py-2 font-mono text-sm font-bold shadow-[3px_3px_0_var(--ink)]">
                <ArrowUpIcon />
                {problem.upvotes.toLocaleString()}
              </span>
            </div>
          </div>

          <section className="border-b-[5px] border-[var(--ink)] py-7">
            <p className="text-xl font-extrabold leading-9 text-[var(--ink-2)]">
              {problem.description}
            </p>
          </section>

          <section className="border-b-[5px] border-[var(--ink)] py-6">
            <p className="neo-label mb-3 text-[var(--muted)]">Tags</p>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </section>

          <section className="mt-7 border-[3px] border-[var(--ink)] bg-[var(--sky-3)] p-5 shadow-[6px_6px_0_var(--ink)]">
            <h2 className="font-display text-3xl tracking-[-0.06em]">
              Why this can become SaaS
            </h2>
            <p className="mt-3 text-base font-bold leading-7 text-[var(--ink-2)]">
              {viability}
            </p>
          </section>

          {problem.sourceUrl && (
            <a
              id="view-source-link"
              href={problem.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button-dark mt-8"
            >
              View original source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
