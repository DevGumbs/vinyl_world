type AlbumCardProps = {
  album?: string
  artist?: string
}

export function AlbumCard({
  album = 'Album Name',
  artist = 'Artist Name',
}: AlbumCardProps) {
  return (
    <article className="flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded border border-slate-600 text-[11px] text-slate-200">
        Vinyl
      </div>
      <p className="text-sm font-semibold">{album}</p>
      <p className="mt-1 text-[11px] text-slate-400">{artist}</p>
    </article>
  )
}
