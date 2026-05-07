import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../api/problems";

const statsConfig = [
  { key: "total", label: "Total Problems" },
  { key: "saasViableCount", label: "SaaS-Viable Ideas" },
  { key: "avgSaasScore", label: "Avg Viability Score" },
];

function Wordmark({ inverted = false }) {
  return (
    <div className="inline-flex items-center gap-3">
      <div className={`${inverted ? "bg-white text-[var(--ink)]" : "bg-[var(--ink)] text-white"} flex h-11 w-11 items-center justify-center border-[3px] border-[var(--ink)] font-display text-2xl shadow-[4px_4px_0_var(--sky)]`}>
        T
      </div>
      <span className={`${inverted ? "text-white" : "text-[var(--ink)]"} font-display text-xl tracking-[-0.06em]`}>
        The Think
      </span>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="25" height="25" stroke="currentColor" strokeWidth="3" />
      <path d="M27 27L38 38" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
      <path d="M8 32V20" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M21 32V10" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M34 32V16" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M5 35H37" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
      <path d="M24 4L8 24H21L18 38L34 17H22L24 4Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    Icon: SearchIcon,
    title: "Scrape the noise",
    body: "Real complaints, unmet needs, and messy operational pain get pulled from founder-heavy corners of the web.",
  },
  {
    number: "02",
    Icon: SignalIcon,
    title: "Score the signal",
    body: "Each problem is ranked by recurring demand, willingness to pay, market clarity, and solo-builder feasibility.",
  },
  {
    number: "03",
    Icon: BoltIcon,
    title: "Build the sharp thing",
    body: "Skip vague brainstorming. Open the feed, filter the strongest ideas, and move straight into execution.",
  },
];

export default function LandingPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let ignore = false;

    getStats()
      .then((data) => {
        if (!ignore) {
          setStats(data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setStats(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll(".section-pop");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="neo-shell overflow-hidden">
      <section className="relative min-h-screen border-b-[5px] border-[var(--ink)] bg-[var(--sky)] px-5 py-8">
        <div className="absolute inset-0 brutal-dots opacity-[0.08]" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between">
          <Wordmark />
          <Link to="/explore" className="neo-button-dark hidden sm:inline-flex">
            Open feed
          </Link>
        </div>

        <div className="section-pop relative mx-auto grid max-w-7xl items-center gap-8 py-14 lg:min-h-[calc(100vh-92px)] lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex rotate-[-1deg] border-[3px] border-[var(--ink)] bg-[var(--yellow)] px-4 py-2 font-mono text-sm font-bold uppercase shadow-[4px_4px_0_var(--ink)]">
              Ideas with teeth
            </div>
            <h1 className="max-w-4xl font-display text-[clamp(3.8rem,9vw,9.5rem)] leading-[0.82] tracking-[-0.09em] text-[var(--ink)]">
              Stop guessing. Start shipping.
            </h1>
            <p className="mt-8 max-w-2xl border-l-[5px] border-[var(--ink)] bg-white px-5 py-4 text-xl font-extrabold leading-8 text-[var(--ink)] shadow-[6px_6px_0_var(--ink)]">
              The Think turns internet pain points into ranked SaaS problems,
              so your next build starts with demand instead of vibes.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/explore" className="neo-button-dark">
                Explore problems
              </Link>
              <a href="#how" className="neo-button">
                See the machine
              </a>
            </div>
          </div>

          <div className="neo-card rotate-[1deg] bg-white p-5 lg:p-7">
            <div className="mb-5 flex items-center justify-between border-b-[3px] border-[var(--ink)] pb-4">
              <p className="font-display text-3xl tracking-[-0.06em]">Live board</p>
              <span className="neo-tag bg-[var(--yellow)]">10 min sync</span>
            </div>
            <div className="grid gap-4">
              {statsConfig.map((item, index) => (
                <div
                  key={item.key}
                  className={`${index === 1 ? "bg-[var(--sky-3)]" : "bg-white"} border-[3px] border-[var(--ink)] p-5 shadow-[4px_4px_0_var(--ink)]`}
                >
                  <p className="font-mono text-5xl font-bold leading-none text-[var(--ink)]">
                    {stats ? Number(stats[item.key]).toFixed(item.key === "avgSaasScore" ? 1 : 0) : "--"}
                  </p>
                  <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="min-h-screen border-b-[5px] border-[var(--ink)] bg-white px-5 py-20">
        <div className="section-pop mx-auto max-w-7xl">
          <div className="mb-12 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <p className="neo-label inline-flex w-fit bg-[var(--sky-2)] px-3 py-2 text-[var(--ink)] shadow-[3px_3px_0_var(--ink)]">
              How it works
            </p>
            <h2 className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.08em]">
              Noise gets punched into signal.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(({ number, Icon, title, body }) => (
              <article key={number} className="neo-card-blue p-6">
                <div className="mb-8 flex items-start justify-between">
                  <span className="font-mono text-5xl font-bold text-[var(--ink)]">{number}</span>
                  <div className="border-[3px] border-[var(--ink)] bg-white p-3 shadow-[4px_4px_0_var(--ink)]">
                    <Icon />
                  </div>
                </div>
                <h3 className="font-display text-3xl leading-none tracking-[-0.06em]">{title}</h3>
                <p className="mt-4 text-base font-bold leading-7 text-[var(--ink-2)]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center bg-[var(--ink)] px-5 py-20 text-white">
        <div className="absolute inset-0 brutal-dots opacity-[0.12]" />
        <div className="section-pop relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-8 h-4 w-40 border-[3px] border-white bg-[var(--sky)] shadow-[6px_6px_0_#fff]" />
          <h2 className="font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.86] tracking-[-0.08em]">
            Your next SaaS idea is already yelling.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-xl font-extrabold leading-8 text-[var(--sky-3)]">
            The Think finds the complaint, scores the opportunity, and gives you
            a cleaner shot at building something people actually need.
          </p>
          <Link
            to="/explore"
            className="mt-10 inline-flex border-[3px] border-white bg-white px-8 py-4 text-base font-black uppercase text-[var(--ink)] shadow-[8px_8px_0_var(--sky)] hover:bg-[var(--yellow)] hover:shadow-[12px_12px_0_var(--sky)]"
          >
            Start exploring
          </Link>
        </div>
      </section>
    </main>
  );
}
