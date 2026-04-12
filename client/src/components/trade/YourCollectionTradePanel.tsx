import { TradeCollectionRow } from './TradeCollectionRow'

export function YourCollectionTradePanel() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm shadow-sm">
      <h2 className="mb-1 text-center text-sm font-semibold">Your Collection</h2>
      <p className="mb-3 text-center text-[11px] text-slate-400">
        (select albums to list for trade)
      </p>

      <div className="space-y-2 text-xs">
        {Array.from({ length: 4 }).map((_, i) => (
          <TradeCollectionRow key={i} />
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="w-full rounded-full border border-emerald-500 bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
        >
          List (n) Records for Trade
        </button>
      </div>
    </aside>
  )
}
