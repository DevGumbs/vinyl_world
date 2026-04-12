import { Link } from 'react-router-dom'
import { AlbumCard } from './AlbumCard'

export function CollectionDetailsSection() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold tracking-wide">
        <h2>Collection Details</h2>
        <Link
          to="/shelf"
          className="text-xs font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-600"
        >
          Grid View
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <AlbumCard key={i} />
        ))}
      </div>

      <div className="mt-4 flex flex-col justify-between gap-3 text-xs text-emerald-600 sm:flex-row">
        <button type="button" className="underline underline-offset-2 hover:text-emerald-600">
          Add/Edit
        </button>
        <button type="button" className="underline underline-offset-2 hover:text-emerald-600">
          View Full Collection
        </button>
      </div>
    </div>
  )
}
