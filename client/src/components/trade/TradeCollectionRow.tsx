export function TradeCollectionRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex h-12 w-10 items-center justify-center rounded border border-slate-300 bg-slate-50 text-[10px] text-slate-700">
        Vinyl
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold">Album Name</p>
        <p className="text-[11px] text-slate-400">Artist Name</p>
      </div>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500"
      />
    </div>
  )
}
