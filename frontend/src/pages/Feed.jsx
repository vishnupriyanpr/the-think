import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getProblems, getStats } from "../api/problems";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import ProblemCard from "../components/ProblemCard";

function SkeletonCard() {
  return (
    <div className="h-[230px] animate-pulse border-[3px] border-[var(--ink)] bg-[var(--sky-3)] shadow-[4px_4px_0_var(--ink)]" />
  );
}

function Wordmark() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center border-[3px] border-[var(--ink)] bg-[var(--ink)] font-display text-2xl text-white shadow-[4px_4px_0_var(--sky)]">
        T
      </div>
      <span className="font-display text-xl tracking-[-0.06em] text-[var(--ink)]">
        The Think
      </span>
    </div>
  );
}

function EmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="27" height="27" stroke="currentColor" strokeWidth="3" />
      <path d="M32 32L43 43" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

export default function Feed() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStatsData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    domain: "",
    difficulty: "",
    isSaasViable: false,
    sortBy: "saasScore",
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch stats on mount
  useEffect(() => {
    getStats()
      .then(setStatsData)
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  // Fetch problems when filters/search/page change
  const fetchProblems = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12 };

    if (filters.domain) params.domain = filters.domain;
    if (filters.difficulty) params.difficulty = filters.difficulty;
    if (filters.isSaasViable) params.isSaasViable = "true";
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (searchQuery) params.search = searchQuery;

    getProblems(params)
      .then((data) => {
        setProblems(data.problems);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      })
      .catch((err) => console.error("Failed to fetch problems:", err))
      .finally(() => setLoading(false));
  }, [page, filters, searchQuery]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="neo-shell">
      <header className="sticky top-0 z-50 border-b-[5px] border-[var(--ink)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Wordmark />
          <Link to="/" className="neo-button-ghost">
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="neo-label mb-3 inline-flex bg-[var(--yellow)] px-3 py-2 shadow-[3px_3px_0_var(--ink)]">
              Live opportunity board
            </p>
            <h1 className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.86] tracking-[-0.08em]">
              Problem Feed
            </h1>
          </div>
          <div className="neo-card-blue grid grid-cols-2 gap-0 overflow-hidden">
            <div className="border-r-[3px] border-[var(--ink)] p-5">
              <p className="font-mono text-4xl font-bold">{stats ? stats.total : "--"}</p>
              <p className="neo-label mt-2 text-[var(--muted)]">Problems</p>
            </div>
            <div className="p-5">
              <p className="font-mono text-4xl font-bold">{stats ? stats.saasViableCount : "--"}</p>
              <p className="neo-label mt-2 text-[var(--muted)]">SaaS viable</p>
            </div>
          </div>
        </section>

        <section className="neo-card mb-8 bg-white p-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <SearchBar value={searchInput} onChange={setSearchInput} />
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </section>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {!loading && (
            <p className="border-[3px] border-[var(--ink)] bg-white px-4 py-2 font-mono text-sm font-bold shadow-[3px_3px_0_var(--ink)]">
              Showing {problems.length} / {total}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="neo-card flex flex-col items-center justify-center bg-white px-6 py-20 text-center">
            <div className="mb-5 text-[var(--ink)]">
              <EmptyIcon />
            </div>
            <h3 className="font-display text-4xl tracking-[-0.06em]">No match found</h3>
            <p className="mt-3 max-w-md text-base font-bold leading-7 text-[var(--muted)]">
              Change the filters or search with a broader pain point.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              id="pagination-prev"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="neo-button-ghost"
            >
              Prev
            </button>
            <span className="border-[3px] border-[var(--ink)] bg-[var(--sky-3)] px-4 py-3 font-mono text-sm font-bold shadow-[3px_3px_0_var(--ink)]">
              {page} / {totalPages}
            </span>
            <button
              id="pagination-next"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="neo-button-ghost"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
