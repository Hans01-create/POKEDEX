// ─── PokeAPI Utilities ──────────────────────────────────────────────────────
// All fetch logic is centralised here so components stay clean.

import type { Pokemon, PokemonCard, PokemonListItem } from "@/types/pokemon";

const BASE = "https://pokeapi.co/api/v2";

// ── 1. Fetch a page of Pokémon names + urls ─────────────────────────────────
export async function fetchPokemonList(
  limit = 151,
  offset = 0
): Promise<PokemonListItem[]> {
  const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 86400 }, // cache 24 h on the server
  });
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
  const data = await res.json();
  return data.results as PokemonListItem[];
}

// ── 2. Fetch full detail for a single Pokémon ───────────────────────────────
export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
  const res = await fetch(`${BASE}/pokemon/${nameOrId}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${nameOrId}`);
  return res.json();
}

// ── 3. Transform raw API response → our lean PokemonCard shape ──────────────
export function transformPokemon(raw: Pokemon): PokemonCard {
  const getStat = (name: string) =>
    raw.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

  return {
    id: raw.id,
    name: raw.name,
    types: raw.types.map((t) => t.type.name),
    sprite: raw.sprites.front_default ?? "",
    artwork:
      raw.sprites.other["official-artwork"].front_default ??
      raw.sprites.front_default ??
      "",
    stats: {
      hp:      getStat("hp"),
      attack:  getStat("attack"),
      defense: getStat("defense"),
      speed:   getStat("speed"),
      spAtk:   getStat("special-attack"),
      spDef:   getStat("special-defense"),
    },
    height:    raw.height,
    weight:    raw.weight,
    abilities: raw.abilities.map((a) => a.ability.name),
  };
}

// ── 4. Batch-fetch and transform a full list ────────────────────────────────
export async function fetchAllPokemonCards(
  limit = 151
): Promise<PokemonCard[]> {
  const list = await fetchPokemonList(limit);

  // Fetch all in parallel (PokeAPI handles concurrent requests well)
  const raws = await Promise.all(list.map((p) => fetchPokemon(p.name)));
  return raws.map(transformPokemon);
}

// ── 5. Extract id from a PokeAPI url string ─────────────────────────────────
export function idFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

// ── 6. Official artwork URL helper ──────────────────────────────────────────
export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
