"use client";

// ─── FilterBar ───────────────────────────────────────────────────────────────
// Search input + type filter pills for the Pokédex page.

import { ALL_TYPES, TYPE_COLORS } from "@/types/pokemon";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  activeType: string | null;
  onTypeChange: (t: string | null) => void;
}

export default function FilterBar({ search, onSearch, activeType, onTypeChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* ── Search input ─────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Search icon */}
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A3A4A] text-sm select-none">
          ⌕
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name or number…"
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#13131A] border border-[#1E1E2E]
                     text-sm text-[#E8E8F0] placeholder-[#3A3A4A] font-body
                     focus:outline-none focus:border-[#E3350D] transition-colors duration-200"
        />
        {/* Clear button */}
        {search && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8888A0]
                       hover:text-[#E8E8F0] transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Type filter pills ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {/* "All" pill */}
        <button
          onClick={() => onTypeChange(null)}
          className={`text-xs font-mono px-3 py-1 rounded-full border transition-all duration-150
                      ${activeType === null
                        ? "bg-[#E3350D] border-[#E3350D] text-white"
                        : "bg-transparent border-[#1E1E2E] text-[#8888A0] hover:border-[#3A3A4A] hover:text-[#E8E8F0]"
                      }`}
        >
          All
        </button>

        {ALL_TYPES.map((type) => {
          const color   = TYPE_COLORS[type];
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => onTypeChange(isActive ? null : type)}
              className="text-xs font-mono px-3 py-1 rounded-full border transition-all duration-150 capitalize"
              style={{
                backgroundColor: isActive ? `${color}33` : "transparent",
                borderColor:      isActive ? color       : "#1E1E2E",
                color:            isActive ? color       : "#8888A0",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = color;
                  (e.currentTarget as HTMLButtonElement).style.color = color;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#1E1E2E";
                  (e.currentTarget as HTMLButtonElement).style.color = "#8888A0";
                }
              }}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
