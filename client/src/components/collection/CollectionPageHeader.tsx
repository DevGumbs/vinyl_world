import { Link } from 'react-router-dom'

type CollectionPageHeaderProps = {
  count: number
}

export function CollectionPageHeader({ count }: CollectionPageHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col items-start gap-3 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold tracking-wide">Collection Name</h1>
            <button
              type="button"
              className="text-xs text-emerald-600 underline underline-offset-2 hover:text-emerald-600"
            >
              edit
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">(My Collection)</p>
        </div>

        <div className="flex w-full items-center justify-between gap-4 md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/shelf" className="text-slate-600 hover:text-emerald-600 hover:underline">
              Shelf
            </Link>
            <span>/</span>
            <span className="font-semibold text-emerald-600 underline">Gallery</span>
          </div>
          <p className="text-xs text-slate-400 md:ml-4">
            {count} vinyl{count === 1 ? '' : 's'}
          </p>
        </div>
      </div>
    </section>
  )
}
