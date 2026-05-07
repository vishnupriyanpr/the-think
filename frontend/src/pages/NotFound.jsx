import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="neo-shell flex min-h-screen items-center justify-center px-5 py-16">
      <div className="neo-card max-w-2xl rotate-[-1deg] bg-white p-8 text-center">
        <p className="font-mono text-8xl font-bold leading-none text-[var(--sky)] [-webkit-text-stroke:3px_var(--ink)]">
          404
        </p>
        <h1 className="mt-4 font-display text-5xl leading-none tracking-[-0.07em]">
          Page got lost
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base font-bold leading-7 text-[var(--muted)]">
          This route does not exist. Jump back to the board and keep moving.
        </p>
        <button
          id="not-found-home-btn"
          onClick={() => navigate("/")}
          className="neo-button mt-7"
        >
          Back home
        </button>
      </div>
    </div>
  );
}
