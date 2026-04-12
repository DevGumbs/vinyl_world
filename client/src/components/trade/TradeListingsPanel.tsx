import { TradeListingCard } from './TradeListingCard'

export function TradeListingsPanel() {
  return (
    <section className="flex flex-col rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-3 border-b border-slate-800 pb-3 text-sm md:flex-row md:items-center md:justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Vinyls Listed For Trade</h2>
        <div className="flex items-center gap-2 text-xs">
          <input
            type="search"
            placeholder="Search listings"
            className="h-8 w-44 rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="button"
            className="h-8 rounded-full border border-slate-300 bg-slate-50 px-3 text-xs text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
          >
            Filter
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1 text-xs">
        {Array.from({ length: 4 }).map((_, i) => (
          <TradeListingCard key={i} />
        ))}
      </div>
    </section>
  )
}
