// ─── Landing Page (/) ────────────────────────────────────────────────────────

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/pokemon/HeroSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />

      {/* ── About section ──────────────────────────────────────────────── */}
      <section
        id="about"
        className="py-32 px-4 max-w-4xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-[#E3350D] uppercase">
              About this project
            </span>
            <h2 className="font-display text-5xl tracking-widest text-[#E8E8F0] mt-3 mb-6 leading-none">
              BUILT WITH<br />PURPOSE
            </h2>
            <p className="font-body text-[#8888A0] leading-relaxed mb-4">
              A clean, fast Pokédex built with Next.js and the official PokéAPI.
              Data is cached on the server for instant loads — no spinner waiting.
            </p>
            <p className="font-body text-[#8888A0] leading-relaxed">
              Designed with a dark aesthetic, type-accurate colouring, and full
              stat breakdowns. Search, filter, and explore every Gen I Pokémon.
            </p>
            <Link
              href="/pokedex"
              className="inline-flex mt-8 px-6 py-3 rounded-xl border border-[#E3350D]
                         text-[#E3350D] font-body text-sm font-medium tracking-wide
                         hover:bg-[#E3350D] hover:text-white transition-all duration-200"
            >
              Open Pokédex →
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Pokémon", value: "151", sub: "Generation I" },
              { label: "Types",   value: "18",  sub: "Fully filterable" },
              { label: "Stats",   value: "6",   sub: "Per Pokémon" },
              { label: "Source",  value: "API", sub: "PokeAPI.co" },
            ].map(({ label, value, sub }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6"
              >
                <p className="font-display text-4xl tracking-wider text-[#E8E8F0]">{value}</p>
                <p className="font-body text-sm font-medium text-[#E8E8F0] mt-1">{label}</p>
                <p className="font-mono text-xs text-[#3A3A4A] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1E1E2E] py-8 px-4 text-center">
        <p className="font-mono text-xs text-[#3A3A4A]">
          Built with Next.js · Data from{" "}
          <a href="https://pokeapi.co" className="text-[#8888A0] hover:text-[#E3350D] transition-colors">
            PokeAPI
          </a>
          {" "}· Pokémon © Nintendo / Game Freak
        </p>
      </footer>
    </main>
  );
}
