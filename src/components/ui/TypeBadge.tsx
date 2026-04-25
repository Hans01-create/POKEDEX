// ─── TypeBadge ──────────────────────────────────────────────────────────────
// Renders a coloured pill for a Pokémon type (Fire, Water, etc.)

import { TYPE_COLORS } from "@/types/pokemon";
import { clsx } from "clsx";

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function TypeBadge({ type, size = "md", className }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] ?? "#A8A878";

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 tracking-wider",
    md: "text-xs px-3 py-1 tracking-widest",
    lg: "text-sm px-4 py-1.5 tracking-widest",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-mono font-medium uppercase",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${color}22`,  // 13% opacity background
        color: color,
        border: `1px solid ${color}55`, // 33% opacity border
      }}
    >
      {type}
    </span>
  );
}
