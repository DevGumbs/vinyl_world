import { ShelfAlbumSlot } from './ShelfAlbumSlot'
import type { RecordRow } from '../../records/recordTypes'

type ShelfSceneProps = {
  backgroundImage: string
  records: RecordRow[]
}

export function ShelfScene({ backgroundImage, records }: ShelfSceneProps) {
  return (
    <section className="flex">
      <div
        className="relative max-h-[70vh] min-h-[420px] w-full rounded-3xl border border-slate-800 bg-cover bg-center bg-no-repeat shadow-[0_32px_80px_rgba(0,0,0,1)]"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 rounded-3xl bg-slate-950/35" />

        <div className="relative flex h-full flex-col justify-center gap-8 px-8 py-8">
          {records.length === 0 ? null : (
            <div className="space-y-8">
              {Array.from({ length: Math.ceil(Math.min(records.length, 12) / 4) }).map(
                (_, row) => (
                  <div key={row} className="space-y-3">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                      {records.slice(row * 4, row * 4 + 4).map((r) => (
                        <ShelfAlbumSlot key={r.id} record={r} />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
