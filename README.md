# Pokédex — Next.js + PokeAPI

A fast, dark-themed Pokédex built with Next.js 14, TailwindCSS, and the PokeAPI.
Ready to receive Draftly 3D cinematic visuals as a background layer.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          ← Root layout (Draftly anchor lives here)
│   ├── page.tsx            ← Landing / Hero page
│   ├── globals.css         ← Base styles, CSS variables, keyframes
│   └── pokedex/
│       └── page.tsx        ← Full Pokédex database page
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx      ← Fixed glassmorphism navbar
│   ├── pokemon/
│   │   ├── HeroSection.tsx ← Landing hero (Draftly replaces bg here)
│   │   ├── PokemonCard.tsx ← Grid card with stats + hover effect
│   │   ├── PokemonModal.tsx← Full detail overlay modal
│   │   └── FilterBar.tsx   ← Search input + type filter pills
│   └── ui/
│       ├── TypeBadge.tsx   ← Coloured type pill
│       ├── StatBar.tsx     ← Animated stat progress bar
│       └── SkeletonCard.tsx← Loading skeleton
│
├── hooks/
│   └── usePokemon.ts       ← All client state: load, search, filter, modal
│
├── lib/
│   └── pokeapi.ts          ← All API fetch logic (centralised)
│
└── types/
    └── pokemon.ts          ← TypeScript types + type colour map
```

---

## 🎨 Draftly Integration Guide

When you have your Draftly cinematic output, here's how to integrate it:

### Step 1 — Hero background
In `src/app/layout.tsx`, find:
```html
<div id="draftly-scene" aria-hidden="true" />
```
Replace with your Draftly scroll container. It's already `position: fixed; z-index: 0`.

### Step 2 — Remove placeholder bg
In `HeroSection.tsx`, delete or hide:
```html
<div id="hero-bg-placeholder"> ... </div>
```

### Step 3 — Adjust z-index if needed
The `#app-content` wrapper in `layout.tsx` has `z-index: 1` via `globals.css`.
All content stays on top of the Draftly layer automatically.

### Step 4 — Sync scroll (optional)
If Draftly uses its own scroll listener, make sure it listens on `window` scroll,
not a nested container — Next.js renders in the default document flow.

---

## 🛠 Tech Stack

| Layer      | Tool                       |
|------------|----------------------------|
| Framework  | Next.js 14 (App Router)    |
| Styling    | TailwindCSS 3              |
| Data       | PokeAPI (https://pokeapi.co) |
| Language   | TypeScript                 |
| Fonts      | Bebas Neue + DM Sans + DM Mono (Google Fonts) |

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

Or deploy directly to **Vercel** — zero config needed for Next.js.

---

## 🔮 Future Enhancements (after Draftly)

- [ ] Evolution chain display in modal
- [ ] Compare two Pokémon side by side
- [ ] Gen II–IX expansion
- [ ] Shiny toggle on artwork
