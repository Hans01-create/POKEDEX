"use client";

// ─── PokemonModal ────────────────────────────────────────────────────────────
// Full-detail overlay shown when a card is clicked.
// Displays artwork, types, all 6 stats, height/weight, abilities.

import { useEffect } from "react";
import Image from "next/image";
import { TYPE_COLORS, type PokemonCard } from "@/types/pokemon";
import TypeBadge from "@/components/ui/TypeBadge";
import StatBar from "@/components/ui/StatBar";

interface Props {
  pokemon: PokemonCard;
  onClose: () => void;
}

export default function PokemonModal({ pokemon, onClose }: Props) {
  const primaryColor = TYPE_COLORS[pokemon.types[0]] ?? "#A8A878";

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-[#13131A] rounded-3xl border border-[#1E1E2E]
                   overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 60px ${primaryColor}22` }}
      >
        {/* ── Coloured top band ─────────────────────────────────────────── */}
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}66)` }}
        />

        {/* ── Close button ──────────────────────────────────────────────── */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center
                     rounded-full bg-[#1E1E2E] text-[#8888A0] hover:text-[#E8E8F0]
                     hover:bg-[#3A3A4A] transition-colors text-lg font-light z-10"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-6 sm:p-8">
          {/* ── Top: artwork + basic info ────────────────────────────────── */}
          <div className="flex gap-6 items-start mb-6">
            {/* Artwork */}
            <div
              className="relative w-32 h-32 shrink-0 rounded-2xl bg-[#0A0A0F] p-2"
              style={{ boxShadow: `inset 0 0 40px ${primaryColor}22` }}
            >
              <Image
                src={pokemon.artwork}
                alt={pokemon.name}
                fill
                className="object-contain animate-float"
                unoptimized
              />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2 min-w-0">
              <span className="font-mono text-sm text-[#3A3A4A]">
                #{String(pokemon.id).padStart(3, "0")}
              </span>
              <h2 className="font-display text-3xl tracking-widest capitalize text-[#E8E8F0] leading-none">
                {pokemon.name}
              </h2>

              <div className="flex flex-wrap gap-1.5 mt-1">
                {pokemon.types.map((t) => (
                  <TypeBadge key={t} type={t} size="md" />
                ))}
              </div>

              {/* Height / Weight */}
              <div className="flex gap-4 mt-2">
                <div>
                  <p className="text-[10px] font-mono text-[#8888A0] uppercase tracking-widest">Height</p>
                  <p className="text-sm font-medium text-[#E8E8F0]">{(pokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[#8888A0] uppercase tracking-widest">Weight</p>
                  <p className="text-sm font-medium text-[#E8E8F0]">{(pokemon.weight / 10).toFixed(1)} kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#1E1E2E] mb-6" />

          {/* ── All 6 stats ───────────────────────────────────────────────── */}
          <h3 className="text-[11px] font-mono text-[#8888A0] uppercase tracking-widest mb-3">
            Base Stats
          </h3>
          <div className="flex flex-col gap-2 mb-6">
            <StatBar label="HP"    value={pokemon.stats.hp}      />
            <StatBar label="ATK"   value={pokemon.stats.attack}   />
            <StatBar label="DEF"   value={pokemon.stats.defense}  />
            <StatBar label="Sp.ATK" value={pokemon.stats.spAtk}  />
            <StatBar label="Sp.DEF" value={pokemon.stats.spDef}  />
            <StatBar label="SPD"   value={pokemon.stats.speed}    />
          </div>

          {/* ── Abilities ─────────────────────────────────────────────────── */}
          <h3 className="text-[11px] font-mono text-[#8888A0] uppercase tracking-widest mb-3">
            Abilities
          </h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((a) => (
              <span
                key={a}
                className="text-xs font-mono px-3 py-1 rounded-full bg-[#1E1E2E]
                           text-[#E8E8F0] capitalize border border-[#3A3A4A]"
              >
                {a.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
