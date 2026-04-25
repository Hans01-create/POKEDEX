import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokédex — Explore Every Pokémon",
  description: "A fast, beautiful Pokédex built with Next.js & PokeAPI. Search, filter, and explore all Pokémon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/*
          ── Draftly Integration Point ─────────────────────────────────────
          When you have the Draftly output, drop its scroll container here:

          <div id="draftly-scene">
            { paste Draftly canvas/scroll element here }
          </div>

          Everything below sits on top via z-index: 1 in globals.css
          ─────────────────────────────────────────────────────────────────
        */}
        <div id="draftly-scene" aria-hidden="true" />

        <div id="app-content">
          {children}
        </div>
      </body>
    </html>
  );
}
