import { useNavigate } from "react-router-dom";
import ScoreBadge from "./ScoreBadge";
import TagBadge from "./TagBadge";

const SOURCE_STYLES = {
  reddit: "bg-[var(--orange)]",
  hackernews: "bg-[var(--yellow)]",
  producthunt: "bg-[var(--pink)]",
  fixmyitch: "bg-[var(--sky)]",
};

function ArrowUpIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M6.5 11V2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
      <path d="M2.5 5.8L6.5 2L10.5 5.8" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="miter" />
    </svg>
  );
}

export default function ProblemCard({ problem }) {
  const navigate = useNavigate();

  return (
    <div
      id={`problem-card-${problem._id}`}
      onClick={() => navigate(`/problem/${problem._id}`)}
      className="neo-card flex min-h-[230px] cursor-pointer flex-col bg-white p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className={`${SOURCE_STYLES[problem.source] || "bg-white"} border-[3px] border-[var(--ink)] px-2 py-1 font-mono text-[11px] font-bold uppercase shadow-[3px_3px_0_var(--ink)]`}
        >
          {problem.source}
        </span>
        <ScoreBadge score={problem.saasScore} />
      </div>

      <h3 className="mb-3 overflow-hidden font-display text-[22px] leading-[0.98] tracking-[-0.06em] text-[var(--ink)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
        {problem.title}
      </h3>

      <p className="mb-5 overflow-hidden text-[14px] font-bold leading-6 text-[var(--muted)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
        {problem.description}
      </p>

      <div className="mt-auto flex items-end justify-between gap-4 border-t-[3px] border-[var(--ink)] pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="neo-tag bg-[var(--sky-3)]">{problem.difficulty}</span>
          <span className="inline-flex items-center gap-1 border-2 border-[var(--ink)] bg-white px-2 py-1 font-mono text-[12px] font-bold text-[var(--ink)]">
            <ArrowUpIcon />
            {problem.upvotes.toLocaleString()}
          </span>
        </div>

        <div className="flex max-w-[52%] flex-wrap justify-end gap-1.5">
          {problem.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
