import { Link } from 'react-router-dom'

type ShelfMode = 'vintage' | 'modern' | 'retro'

type ShelfViewHeaderProps = {
  mode: ShelfMode
  onModeChange: (mode: ShelfMode) => void
}

export function ShelfViewHeader({ mode, onModeChange }: ShelfViewHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold tracking-wide">View</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600 underline">Shelf</span>
              <span>/</span>
              <Link to="/collection" className="text-slate-600 hover:text-emerald-600 hover:underline">
                Gallery
              </Link>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Browse your collection as if it were on a physical shelf.
          </p>
        </div>

        <div className="flex flex-col gap-1 text-xs text-slate-700">
          <span className="font-semibold">Select Shelf</span>
          <div className="flex flex-wrap items-center gap-4">
            {(
              [
                ['vintage', 'Vintage (default)'],
                ['modern', 'Modern'],
                ['retro', 'Retro'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="shelfBackground"
                  checked={mode === value}
                  onChange={() => onModeChange(value)}
                  className="h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
