"use client";

// ─── Navbar ─────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glass blur bar */}
      <div className="backdrop-blur-md bg-[#0A0A0F]/80 border-b border-[#1E1E2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Pokéball icon */}
            <div className="relative w-8 h-8">
              <div className="w-8 h-8 rounded-full border-2 border-[#E3350D] relative overflow-hidden group-hover:border-white transition-colors duration-200">
                <div className="absolute top-0 left-0 right-0 h-[48%] bg-[#E3350D]" />
                <div className="absolute bottom-0 left-0 right-0 h-[48%] bg-[#1E1E2E]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0A0A0F] border-2 border-[#E3350D] group-hover:border-white transition-colors duration-200 z-10" />
                <div className="absolute top-[46%] left-0 right-0 h-[8%] bg-[#3A3A4A]" />
              </div>
            </div>
            <span className="font-display text-2xl tracking-widest text-[#E8E8F0] group-hover:text-[#E3350D] transition-colors duration-200">
              POKÉDEX
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/pokedex">Database</NavLink>
            <NavLink href="#about">About</NavLink>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#8888A0] hover:text-[#E8E8F0] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-current transition-all duration-200 ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-6 h-0.5 bg-current my-1.5 transition-all duration-200 ${open ? "opacity-0" : ""}`} />
            <div className={`w-6 h-0.5 bg-current transition-all duration-200 ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-[#1E1E2E] px-4 py-4 flex flex-col gap-4">
            <NavLink href="/" onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink href="/pokedex" onClick={() => setOpen(false)}>Database</NavLink>
            <NavLink href="#about" onClick={() => setOpen(false)}>About</NavLink>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="font-body text-sm font-medium text-[#8888A0] hover:text-[#E8E8F0] transition-colors duration-200 relative group"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#E3350D] group-hover:w-full transition-all duration-200" />
    </Link>
  );
}
