import { useEffect, useState } from "react";
import { getDomains } from "../api/problems";

function formatDomainLabel(domain) {
  const labels = {
    fintech: "FinTech",
    edtech: "EdTech",
    saas: "SaaS",
    devtools: "DevTools",
    ecommerce: "Ecommerce",
    "b2b-services": "B2B Services",
    "beauty-personal-care": "Beauty & Care",
    "consumer-services": "Consumer Services",
    "food-beverage": "Food & Beverage",
    "home-services": "Home Services",
    "real-estate": "Real Estate",
  };
  return labels[domain] || domain.charAt(0).toUpperCase() + domain.slice(1);
}

const DIFFICULTIES = [
  { value: "", label: "All Difficulties" },
  { value: "weekend", label: "Weekend" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
];

const SORT_OPTIONS = [
  { value: "saasScore", label: "Sort by Score" },
  { value: "upvotes", label: "Sort by Upvotes" },
  { value: "createdAt", label: "Sort by Newest" },
];

const selectClasses = "neo-input neo-select w-auto min-w-[170px] bg-white";

export default function FilterBar({ filters, onFilterChange }) {
  const [domainOptions, setDomainOptions] = useState([
    { value: "", label: "All Domains" },
  ]);

  useEffect(() => {
    let ignore = false;

    getDomains()
      .then((domains) => {
        if (ignore || !Array.isArray(domains) || domains.length === 0) {
          return;
        }

        setDomainOptions([
          { value: "", label: "All Domains" },
          ...domains.map((domain) => ({
            value: domain,
            label: formatDomainLabel(domain),
          })),
        ]);
      })
      .catch((error) => {
        console.error("Failed to fetch domains:", error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        id="filter-domain"
        value={filters.domain || ""}
        onChange={(e) => onFilterChange("domain", e.target.value)}
        className={selectClasses}
      >
        {domainOptions.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <select
        id="filter-difficulty"
        value={filters.difficulty || ""}
        onChange={(e) => onFilterChange("difficulty", e.target.value)}
        className={selectClasses}
      >
        {DIFFICULTIES.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <label
        htmlFor="filter-saas-viable"
        className="flex cursor-pointer items-center gap-2 border-[3px] border-[var(--ink)] bg-white px-4 py-[13px] text-sm font-black uppercase shadow-[4px_4px_0_var(--ink)] hover:bg-[var(--sky-3)]"
      >
        <input
          id="filter-saas-viable"
          type="checkbox"
          checked={filters.isSaasViable || false}
          onChange={(e) => onFilterChange("isSaasViable", e.target.checked)}
          className="h-4 w-4"
          style={{ accentColor: "var(--sky)" }}
        />
        SaaS viable
      </label>

      <select
        id="filter-sort"
        value={filters.sortBy || "saasScore"}
        onChange={(e) => onFilterChange("sortBy", e.target.value)}
        className={selectClasses}
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <button
        id="clear-filters-btn"
        onClick={() => {
          onFilterChange("domain", "");
          onFilterChange("difficulty", "");
          onFilterChange("isSaasViable", false);
          onFilterChange("sortBy", "saasScore");
        }}
        className="neo-button-ghost"
      >
        Clear
      </button>
    </div>
  );
}
