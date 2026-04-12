type ListedItem = { album: string; artist: string; comments: string }

const COL_A: ListedItem[] = [
  { album: 'Album Name', artist: 'Artist Name', comments: '0 Comments' },
  { album: 'Album Name', artist: 'Artist Name', comments: '3 Comments' },
]

const COL_B: ListedItem[] = [
  { album: 'Album Name', artist: 'Artist Name', comments: '1 Comment' },
  { album: 'Album Name', artist: 'Artist Name', comments: '10 Comments' },
]

function ListedRow({ album, artist, comments }: ListedItem) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <div>
        <p className="text-xs font-semibold">{album}</p>
        <p className="text-[11px] text-slate-400">{artist}</p>
      </div>
      <button type="button" className="text-[11px] text-emerald-600 underline">
        {comments}
      </button>
    </div>
  )
}

export function YourListedVinyls() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-xs shadow-sm">
      <h2 className="mb-3 text-center text-sm font-semibold tracking-wide">Your Listed Vinyls</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          {COL_A.map((row, i) => (
            <ListedRow key={`a-${i}`} {...row} />
          ))}
        </div>
        <div className="space-y-2">
          {COL_B.map((row, i) => (
            <ListedRow key={`b-${i}`} {...row} />
          ))}
        </div>
      </div>
    </section>
  )
}
