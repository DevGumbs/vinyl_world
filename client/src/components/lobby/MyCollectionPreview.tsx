import { Link } from 'react-router-dom'

export function MyCollectionPreview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-center text-base font-semibold text-slate-900">My Collection</h2>
      <p className="mt-1 text-center text-xs text-slate-500">You have 22 records</p>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded border border-slate-300 bg-slate-50 text-[10px] text-slate-700"
          >
            Vinyl
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center">
        <Link
          to="/collection"
          className="w-full rounded-full border border-emerald-500 bg-emerald-500 px-3 py-1.5 text-center text-xs font-semibold text-white transition hover:bg-emerald-600"
        >
          View Collection
        </Link>
      </div>
    </section>
  )
}
