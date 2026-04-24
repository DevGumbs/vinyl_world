type AlbumCardProps = {
  album?: string
  artist?: string
  coverSrc: string
}

export function AlbumCard({
  album = 'Album Name',
  artist = 'Artist Name',
  coverSrc,
}: AlbumCardProps) {
  return (
    <article className="flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs">
      <img
        src={coverSrc}
        alt=""
        className="mb-3 h-16 w-16 rounded border border-slate-300 bg-white object-cover"
        loading="lazy"
      />
      <p className="text-sm font-semibold">{album}</p>
      <p className="mt-1 text-[11px] text-slate-400">{artist}</p>
    </article>
  )
}
