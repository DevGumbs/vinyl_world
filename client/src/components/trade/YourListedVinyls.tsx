import type { RecordRow } from '../../records/recordTypes'

function ListedRow({ record }: { record: RecordRow }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <div>
        <p className="text-xs font-semibold">{record.albumTitle}</p>
        <p className="text-[11px] text-slate-400">{record.artistName}</p>
      </div>
      <button type="button" className="text-[11px] text-emerald-600 underline">
        0 Comments
      </button>
    </div>
  )
}

export function YourListedVinyls({ records }: { records: RecordRow[] }) {
  const left = records.filter((_, i) => i % 2 === 0)
  const right = records.filter((_, i) => i % 2 === 1)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-xs shadow-sm">
      <h2 className="mb-3 text-center text-sm font-semibold tracking-wide">Your Listed Vinyls</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          {left.length === 0 ? (
            <p className="text-center text-xs text-slate-500">No listings yet.</p>
          ) : null}
          {left.map((r) => (
            <ListedRow key={r.id} record={r} />
          ))}
        </div>
        <div className="space-y-2">
          {right.map((r) => (
            <ListedRow key={r.id} record={r} />
          ))}
        </div>
      </div>
    </section>
  )
}
