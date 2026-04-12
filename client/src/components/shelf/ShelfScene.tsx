import { ShelfAlbumSlot } from './ShelfAlbumSlot'

type ShelfSceneProps = {
  backgroundImage: string
}

export function ShelfScene({ backgroundImage }: ShelfSceneProps) {
  return (
    <section className="flex">
      <div
        className="relative max-h-[70vh] min-h-[420px] w-full rounded-3xl border border-slate-800 bg-cover bg-center bg-no-repeat shadow-[0_32px_80px_rgba(0,0,0,1)]"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 rounded-3xl bg-slate-950/35" />

        <div className="relative flex h-full flex-col justify-center gap-8 px-8 py-8">
          {Array.from({ length: 3 }).map((_, row) => (
            <div key={row} className="space-y-3">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((__, col) => (
                  <ShelfAlbumSlot key={`${row}-${col}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
