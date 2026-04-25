// ─── SkeletonCard ────────────────────────────────────────────────────────────
// Placeholder card shown while Pokémon data is loading.

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-5 flex flex-col gap-4">
      {/* Image placeholder */}
      <div className="skeleton w-full aspect-square rounded-xl" />

      {/* Name */}
      <div className="skeleton h-4 w-2/3 rounded-md" />

      {/* Types */}
      <div className="flex gap-2">
        <div className="skeleton h-5 w-14 rounded-full" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="skeleton h-3 w-10 rounded" />
            <div className="skeleton h-3 w-6 rounded" />
            <div className="skeleton h-1.5 flex-1 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
