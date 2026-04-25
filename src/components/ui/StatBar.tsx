"use client";

// ─── StatBar ────────────────────────────────────────────────────────────────
// Animated horizontal progress bar for Pokémon base stats.
// Max stat value is 255 (Blissey HP). We normalise against that.

import { useEffect, useState } from "react";
import { clsx } from "clsx";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

// Colour thresholds
function getColor(value: number): string {
  if (value >= 100) return "#78C850"; // green  — excellent
  if (value >= 70)  return "#F8D030"; // yellow — good
  if (value >= 45)  return "#F08030"; // orange — average
  return "#E3350D";                   // red    — low
}

export default function StatBar({ label, value, max = 255, color }: StatBarProps) {
  const [width, setWidth] = useState(0);
  const pct = Math.min((value / max) * 100, 100);
  const barColor = color ?? getColor(value);

  // Animate in after mount
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className="text-[11px] font-mono text-[#8888A0] w-16 shrink-0 uppercase tracking-wider">
        {label}
      </span>

      {/* Value */}
      <span className="text-sm font-mono font-medium text-[#E8E8F0] w-8 shrink-0 text-right">
        {value}
      </span>

      {/* Bar track */}
      <div className="flex-1 h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full stat-bar")}
          style={{
            width: `${width}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}66`,
          }}
        />
      </div>
    </div>
  );
}
