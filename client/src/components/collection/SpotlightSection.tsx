import type { RecordRow } from '../../records/recordTypes'
import { coverSrc } from '../../records/cover'

type SpotlightSectionProps = {
  record: RecordRow
}

export function SpotlightSection({ record }: SpotlightSectionProps) {
  const src = coverSrc(record.coverImg)

  return (
    <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="flex items-center justify-center">
        <div className="relative flex h-56 w-[18rem] items-center justify-center md:w-[20rem]">
          <img
            src={src}
            alt=""
            className="absolute left-0 z-10 h-56 w-56 rounded border border-slate-200 bg-white object-cover shadow-md shadow-slate-400/40"
            loading="lazy"
          />

          <div className="absolute right-0 hidden h-52 w-52 rounded-full bg-black md:block">
            <div className="absolute inset-6 rounded-full border border-slate-900/60 bg-slate-900" />
            <div className="absolute inset-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center text-left md:text-left">
        <h2 className="text-2xl font-semibold tracking-wide">{record.albumTitle}</h2>
        <p className="mt-3 text-sm font-semibold">{record.artistName}</p>
        <p className="mt-2 text-sm text-slate-300">
          {record.year} | {record.genre} | {record.vinylCondition}
        </p>

        <p className="mt-6 text-xs text-slate-400">
          Click a record in the gallery row to spotlight it here and see more details about the
          release.
        </p>
      </div>
    </section>
  )
}
