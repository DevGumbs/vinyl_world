import { useState } from 'react'
import type { RecordRow } from '../../records/recordTypes'

function ListedRow({
  record,
  onOpenDiscussion,
  onRemove,
  removing,
}: {
  record: RecordRow
  onOpenDiscussion: (record: RecordRow) => void
  onRemove: () => void
  removing: boolean
}) {
  const n = record.tradeCommentCount ?? 0
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{record.albumTitle}</p>
        <p className="truncate text-[11px] text-slate-400">{record.artistName}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onOpenDiscussion(record)}
          className="text-[11px] text-emerald-600 underline"
        >
          {n} {n === 1 ? 'comment' : 'comments'}
        </button>
        <button
          type="button"
          disabled={removing}
          onClick={onRemove}
          className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export function YourListedVinyls({
  records,
  onOpenDiscussion,
  onRemoveListing,
}: {
  records: RecordRow[]
  onOpenDiscussion: (record: RecordRow) => void
  onRemoveListing: (recordId: string) => Promise<void>
}) {
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleRemove(record: RecordRow) {
    if (removingId) return
    setRemovingId(record.id)
    try {
      await onRemoveListing(record.id)
    } finally {
      setRemovingId(null)
    }
  }

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
            <ListedRow
              key={r.id}
              record={r}
              onOpenDiscussion={onOpenDiscussion}
              onRemove={() => void handleRemove(r)}
              removing={removingId === r.id}
            />
          ))}
        </div>
        <div className="space-y-2">
          {right.map((r) => (
            <ListedRow
              key={r.id}
              record={r}
              onOpenDiscussion={onOpenDiscussion}
              onRemove={() => void handleRemove(r)}
              removing={removingId === r.id}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
