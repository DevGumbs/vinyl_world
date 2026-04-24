import type { RecordRow } from '../../records/recordTypes'
import { coverSrc } from '../../records/cover'

type ShelfAlbumSlotProps = {
  record: RecordRow
}

export function ShelfAlbumSlot({ record }: ShelfAlbumSlotProps) {
  const src = coverSrc(record.coverImg)

  return (
    <div className="flex flex-col items-center text-[11px]">
      <div className="flex flex-col items-center">
        <img
          src={src}
          alt=""
          className="mb-2 h-24 w-24 rounded-md border border-slate-300 bg-white object-cover shadow-md shadow-black/70"
          loading="lazy"
        />
        <div className="h-2 w-24 rounded-full bg-black shadow-[0_8px_18px_rgba(0,0,0,0.9)]" />
      </div>
      <p className="max-w-[6.5rem] truncate font-semibold text-slate-50">
        {record.albumTitle}
      </p>
      <p className="max-w-[6.5rem] truncate text-[10px] text-slate-300">
        {record.artistName}
      </p>
    </div>
  )
}
