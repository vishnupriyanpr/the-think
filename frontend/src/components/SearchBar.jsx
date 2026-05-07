export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink)]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="10" height="10" stroke="currentColor" strokeWidth="2.2" />
          <path d="M11.5 11.5L16 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
        </svg>
      </div>

      <input
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search problems, pain points, domains..."
        className="neo-input pl-12 pr-12"
      />

      {value && (
        <button
          id="search-clear-btn"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border-2 border-[var(--ink)] bg-white text-xl font-black leading-none hover:bg-[var(--yellow)]"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
