// ─── Core Types from PokeAPI ───────────────────────────────────────────────

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonAbility {
  ability: { name: string };
  is_hidden: boolean;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world: { front_default: string | null };
  };
}

// ─── Full Pokemon Detail ────────────────────────────────────────────────────

export interface Pokemon {
  id: number;
  name: string;
  height: number;   // in decimetres
  weight: number;   // in hectograms
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
}

// ─── Simplified card data (what we render in the grid) ─────────────────────

export interface PokemonCard {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  artwork: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    spAtk: number;
    spDef: number;
  };
  height: number;
  weight: number;
  abilities: string[];
}

// ─── Type color map ─────────────────────────────────────────────────────────

export const TYPE_COLORS: Record<string, string> = {
  normal:   "#A8A878",
  fire:     "#F08030",
  water:    "#6890F0",
  electric: "#F8D030",
  grass:    "#78C850",
  ice:      "#98D8D8",
  fighting: "#C03028",
  poison:   "#A040A0",
  ground:   "#E0C068",
  flying:   "#A890F0",
  psychic:  "#F85888",
  bug:      "#A8B820",
  rock:     "#B8A038",
  ghost:    "#705898",
  dragon:   "#7038F8",
  dark:     "#705848",
  steel:    "#B8B8D0",
  fairy:    "#EE99AC",
};

export const ALL_TYPES = Object.keys(TYPE_COLORS);
