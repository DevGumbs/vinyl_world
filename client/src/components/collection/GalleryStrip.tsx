import type { RecordRow } from '../../records/recordTypes'
import { coverSrc } from '../../records/cover'

type GalleryStripProps = {
  records: RecordRow[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function GalleryStrip({ records, selectedId, onSelect }: GalleryStripProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-lg text-slate-300 hover:border-rose-400 hover:text-rose-300 md:flex"
          aria-label="Previous"
        >
          ←
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto pb-2">
          {records.map((r) => {
            const active = r.id === selectedId
            const src = coverSrc(r.coverImg)
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelect(r.id)}
                className={`flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-lg border bg-slate-50 text-[11px] transition ${
                  active ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="mb-2 h-14 w-14 rounded border border-slate-300 bg-white object-cover"
                  loading="lazy"
                />
                <span className="max-w-[6.5rem] truncate text-[11px] text-slate-600">
                  {r.artistName}
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-lg text-slate-300 hover:border-rose-400 hover:text-rose-300 md:flex"
          aria-label="Next"
        >
          →
        </button>
      </div>
    </section>
  )
}
