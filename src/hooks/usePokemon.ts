"use client";

// ─── usePokemon Hook ────────────────────────────────────────────────────────
// Manages the full client-side state for the Pokédex:
//   - paginated loading from PokeAPI
//   - search query
//   - type filter
//   - selected Pokémon for detail modal

import { useState, useEffect, useCallback, useMemo } from "react";
import type { PokemonCard } from "@/types/pokemon";
import { fetchPokemon, transformPokemon, idFromUrl, fetchPokemonList } from "@/lib/pokeapi";

const PAGE_SIZE = 24; // cards loaded per "load more"

export function usePokemon() {
  // ── Raw data ──────────────────────────────────────────────────────────────
  const [allCards, setAllCards]       = useState<PokemonCard[]>([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset]           = useState(0);
  const [hasMore, setHasMore]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  // ── Filter / search state ─────────────────────────────────────────────────
  const [search, setSearch]           = useState("");
  const [activeType, setActiveType]   = useState<string | null>(null);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [selected, setSelected]       = useState<PokemonCard | null>(null);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadBatch(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBatch = useCallback(async (currentOffset: number, initial = false) => {
    try {
      if (initial) setLoading(true);
      else setLoadingMore(true);

      // Get names for this page
      const list = await fetchPokemonList(PAGE_SIZE, currentOffset);
      if (list.length < PAGE_SIZE) setHasMore(false);

      // Fetch details in parallel
      const raws = await Promise.all(list.map((p) => fetchPokemon(p.name)));
      const cards = raws.map(transformPokemon);

      setAllCards((prev) => (initial ? cards : [...prev, ...cards]));
      setOffset(currentOffset + PAGE_SIZE);
    } catch (e) {
      setError("Failed to load Pokémon. Check your connection.");
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) loadBatch(offset);
  }, [loadBatch, loadingMore, hasMore, offset]);

  // ── Filtered + searched view ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allCards.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          String(p.id).includes(search);
      const matchType   = activeType ? p.types.includes(activeType) : true;
      return matchSearch && matchType;
    });
  }, [allCards, search, activeType]);

  return {
    // Data
    cards: filtered,
    totalLoaded: allCards.length,
    loading,
    loadingMore,
    hasMore,
    error,
    // Pagination
    loadMore,
    // Filters
    search,
    setSearch,
    activeType,
    setActiveType,
    // Modal
    selected,
    setSelected,
  };
}
