"use client";

// ─── PokemonCard ─────────────────────────────────────────────────────────────
// Grid card that shows artwork, name, types and key stats.
// Clicking it opens the detail modal via the setSelected callback.

import Image from "next/image";
import { TYPE_COLORS, type PokemonCard } from "@/types/pokemon";
import TypeBadge from "@/components/ui/TypeBadge";
import StatBar from "@/components/ui/StatBar";

interface Props {
  pokemon: PokemonCard;
  onSelect: (p: PokemonCard) => void;
  style?: React.CSSProperties;
}

export default function PokemonCard({ pokemon, onSelect, style }: Props) {
  // Use the primary type colour as the card's accent
  const primaryColor = TYPE_COLORS[pokemon.types[0]] ?? "#A8A878";

  return (
    <button
      onClick={() => onSelect(pokemon)}
      className="group text-left w-full rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-5
                 card-hover cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3350D]"
      style={{
        ...style,
        // Subtle type-coloured glow on hover — applied via CSS var trick
        "--accent": primaryColor,
      } as React.CSSProperties}
    >
      {/* ── Pokémon number ──────────────────────────────────────────────── */}
      <span className="font-mono text-xs text-[#3A3A4A] group-hover:text-[#8888A0] transition-colors">
        #{String(pokemon.id).padStart(3, "0")}
      </span>

      {/* ── Artwork ─────────────────────────────────────────────────────── */}
      <div className="relative mt-2 mb-4 mx-auto w-full aspect-square max-w-[140px]"
           style={{ filter: `drop-shadow(0 8px 24px ${primaryColor}44)` }}>
        <Image
          src={pokemon.artwork}
          alt={pokemon.name}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          loading="lazy"
          unoptimized // GitHub raw URLs don't need Next.js optimisation
        />
      </div>

      {/* ── Name ────────────────────────────────────────────────────────── */}
      <h3 className="font-display text-xl tracking-widest capitalize text-[#E8E8F0]
                     group-hover:text-white transition-colors truncate">
        {pokemon.name}
      </h3>

      {/* ── Types ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} size="sm" />
        ))}
      </div>

      {/* ── Stats (HP, ATK, DEF, SPD) ──────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <StatBar label="HP"  value={pokemon.stats.hp}      />
        <StatBar label="ATK" value={pokemon.stats.attack}   />
        <StatBar label="DEF" value={pokemon.stats.defense}  />
        <StatBar label="SPD" value={pokemon.stats.speed}    />
      </div>

      {/* ── Hover accent line ───────────────────────────────────────────── */}
      <div
        className="mt-4 h-px w-0 group-hover:w-full transition-all duration-300 rounded"
        style={{ backgroundColor: primaryColor }}
      />
    </button>
  );
}
