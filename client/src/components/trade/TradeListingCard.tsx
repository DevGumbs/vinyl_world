export function TradeListingCard() {
  return (
    <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <div className="flex h-16 w-16 items-center justify-center rounded border border-slate-300 bg-white text-[11px] text-slate-700">
        Vinyl
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold">Album Name</p>
        <p className="text-[11px] text-slate-500">Artist Name</p>
        <p className="text-[11px] text-slate-500">
          Listed by: <span className="text-slate-800">User12</span>
        </p>
        <p className="text-[11px] text-slate-500">
          VG | <span className="text-slate-800">3 comments</span>
        </p>
      </div>
      <div className="flex flex-col items-end justify-between gap-2">
        <button
          type="button"
          className="rounded-full border border-emerald-500 bg-emerald-500 px-3 py-1 text-[11px] text-white hover:bg-emerald-600"
        >
          View Discussion
        </button>
      </div>
    </article>
  )
}
