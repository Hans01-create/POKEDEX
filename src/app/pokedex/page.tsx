"use client";

// ─── /pokedex page ───────────────────────────────────────────────────────────
// Full Pokédex database: search, filter by type, card grid, modal detail.

import { usePokemon } from "@/hooks/usePokemon";
import Navbar from "@/components/layout/Navbar";
import PokemonCard from "@/components/pokemon/PokemonCard";
import PokemonModal from "@/components/pokemon/PokemonModal";
import FilterBar from "@/components/pokemon/FilterBar";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function PokedexPage() {
  const {
    cards, totalLoaded, loading, loadingMore, hasMore, error,
    loadMore,
    search, setSearch,
    activeType, setActiveType,
    selected, setSelected,
  } = usePokemon();

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <span className="font-mono text-xs tracking-[0.3em] text-[#E3350D] uppercase">
            Generation I
          </span>
          <h1 className="font-display text-5xl sm:text-6xl tracking-widest text-[#E8E8F0] mt-1 leading-none">
            POKÉDEX
          </h1>
          <p className="font-body text-sm text-[#8888A0] mt-2">
            {loading ? "Loading Pokémon..." : `${totalLoaded} of 1025 Pokémon loaded`}
          </p>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <div className="mb-10">
          <FilterBar
            search={search}
            onSearch={setSearch}
            activeType={activeType}
            onTypeChange={setActiveType}
          />
        </div>

        {/* ── Error state ─────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-2xl border border-red-900 bg-red-900/10 p-6 text-center mb-8">
            <p className="text-[#E3350D] font-body">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-[#8888A0] hover:text-[#E8E8F0] underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Grid ────────────────────────────────────────────────────── */}
        {loading ? (
          /* Skeleton loading grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : cards.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <p className="font-display text-4xl tracking-widest text-[#1E1E2E] mb-3">
              NO RESULTS
            </p>
            <p className="font-body text-sm text-[#3A3A4A]">
              Try a different name, number, or type filter.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveType(null); }}
              className="mt-6 text-sm text-[#E3350D] hover:text-[#C42E0B] transition-colors underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Card grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {cards.map((p, i) => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                onSelect={setSelected}
                // Stagger fade-in per card
                style={{
                  animation: "fadeIn 0.4s ease forwards",
                  animationDelay: `${Math.min(i * 0.03, 0.6)}s`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* ── Load more button ─────────────────────────────────────────── */}
        {!loading && hasMore && cards.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-10 py-3.5 rounded-xl border border-[#1E1E2E] text-[#8888A0]
                         font-body text-sm font-medium hover:border-[#E3350D] hover:text-[#E3350D]
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#3A3A4A] border-t-[#E3350D]
                                   rounded-full animate-spin inline-block" />
                  Loading…
                </span>
              ) : (
                "Load More Pokémon"
              )}
            </button>
          </div>
        )}
      </main>

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      {selected && (
        <PokemonModal
          pokemon={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
