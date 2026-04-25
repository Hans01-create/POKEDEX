"use client";

// ─── HeroSection ─────────────────────────────────────────────────────────────
// Landing hero with Vanta.js Globe animated background

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<unknown>(null);

  useEffect(() => {
    // Dynamically load Three.js and Vanta from CDN
    const loadVanta = async () => {
      // Load Three.js first
      if (!window.THREE) {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
      }
      // Then load Vanta Globe
      await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js");

      // Init Vanta effect
      if (window.VANTA && vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.GLOBE({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xe3350d,        // Pokéball red
          color2: 0x3a3a4a,       // Muted dark
          backgroundColor: 0x0a0a0f, // Deep dark
          size: 1.2,
          points: 9,
          maxDistance: 22,
          spacing: 18,
        });
      }
    };

    loadVanta();

    // Cleanup on unmount
    return () => {
      if (vantaEffect.current) {
        (vantaEffect.current as { destroy: () => void }).destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center
                 text-center px-4 overflow-hidden"
    >
      {/* ── Vanta Globe Background ───────────────────────────────────────── */}
      <div
        ref={vantaRef}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
        {/* Eyebrow */}
        <span className="font-mono text-xs tracking-[0.3em] text-[#E3350D] uppercase animate-fadeIn">
          Gen I — 151 Pokémon
        </span>

        {/* Pokéball icon */}
        <div className="animate-float" style={{ animationDuration: "4s" }}>
          <PokeBallSVG size={96} />
        </div>

        {/* Headline */}
        <h1
          className="font-display text-6xl sm:text-8xl md:text-[10rem] tracking-widest
                     text-[#E8E8F0] leading-none animate-fadeIn"
          style={{ animationDelay: "0.1s", textShadow: "0 0 80px rgba(227,53,13,0.2)" }}
        >
          POKÉDEX
        </h1>

        {/* Subtext */}
        <p
          className="font-body text-base sm:text-lg text-[#8888A0] max-w-lg leading-relaxed animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          Explore every Pokémon. Filter by type, search by name, and dive into
          detailed stats for all 151 original Pokémon.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-wrap gap-4 justify-center animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/pokedex"
            className="px-8 py-3.5 rounded-xl bg-[#E3350D] text-white font-body font-semibold
                       text-sm tracking-wide hover:bg-[#C42E0B] transition-colors duration-200
                       animate-pulseGlow"
          >
            Explore Database →
          </Link>
          <a
            href="#about"
            className="px-8 py-3.5 rounded-xl border border-[#1E1E2E] text-[#8888A0] font-body
                       text-sm tracking-wide hover:border-[#3A3A4A] hover:text-[#E8E8F0]
                       transition-colors duration-200"
          >
            Learn More
          </a>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute -bottom-32 flex flex-col items-center gap-2 text-[#3A3A4A] animate-fadeIn"
          style={{ animationDelay: "0.8s" }}
        >
          <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#3A3A4A] to-transparent" />
        </div>
      </div>
    </section>
  );
}

// ── Helper: load external script dynamically ────────────────────────────────
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ── Extend window type for Vanta ─────────────────────────────────────────────
declare global {
  interface Window {
    THREE: unknown;
    VANTA: {
      GLOBE: (opts: Record<string, unknown>) => { destroy: () => void };
    };
  }
}

// ── Helper: Pokéball SVG ─────────────────────────────────────────────────────
function PokeBallSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top half — red */}
      <path d="M 10 50 A 40 40 0 0 1 90 50 Z" fill="#E3350D" />
      {/* Bottom half — dark */}
      <path d="M 10 50 A 40 40 0 0 0 90 50 Z" fill="#1E1E2E" />
      {/* Outer ring */}
      <circle cx="50" cy="50" r="40" stroke="#3A3A4A" strokeWidth="2.5" fill="none" />
      {/* Divider line */}
      <line x1="10" y1="50" x2="90" y2="50" stroke="#3A3A4A" strokeWidth="2.5" />
      {/* Centre circle outer */}
      <circle cx="50" cy="50" r="12" fill="#0A0A0F" stroke="#3A3A4A" strokeWidth="2.5" />
      {/* Centre circle inner */}
      <circle cx="50" cy="50" r="6" fill="#E8E8F0" />
    </svg>
  );
}
