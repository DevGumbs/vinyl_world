const STATS: { label: string; value: string }[] = [
  { label: 'Total Records:', value: '60' },
  { label: 'Most Collected Artist:', value: 'The Beatles' },
  { label: 'Most Collected Genre:', value: 'Jazz' },
  { label: 'Estimated Collection Value:', value: '$1625' },
  { label: 'Most Active Era:', value: '1980s' },
  { label: 'Collection Spans:', value: '1982 - 2022' },
  { label: 'Most Recent Addition:', value: 'Be - Common' },
  { label: 'Records Marked for Trade:', value: '9' },
  { label: 'Unique Artists Collected:', value: '34' },
  { label: 'Different Genres Collected:', value: '18' },
]

export function CollectionStats() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <h2 className="mb-4 text-center text-sm font-semibold tracking-wide">
        Collection Stats
      </h2>

      <div className="grid gap-3 text-xs sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center"
          >
            <p className="text-[11px] text-slate-300">{s.label}</p>
            <p className="mt-1 text-sm font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
