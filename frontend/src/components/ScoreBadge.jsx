export default function ScoreBadge({ score }) {
  let background = "var(--orange)";

  if (score >= 80) {
    background = "var(--sky)";
  } else if (score >= 60) {
    background = "var(--green)";
  }

  return (
    <span
      className="inline-flex items-center gap-2 border-[3px] border-[var(--ink)] px-2.5 py-1.5 text-[var(--ink)] shadow-[3px_3px_0_var(--ink)]"
      style={{ background }}
    >
      <span className="text-[11px] font-black uppercase leading-none">Score</span>
      <span className="font-mono text-[15px] font-bold leading-none">{score}</span>
    </span>
  );
}
