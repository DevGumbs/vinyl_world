export type StatItem = { label: string; value: string }

const DEFAULT_STATS: StatItem[] = [
  { label: 'Total Records:', value: '0' },
  { label: 'Most Collected Artist:', value: 'N/A' },
  { label: 'Most Collected Genre:', value: 'N/A' },
  { label: 'Estimated Collection Value:', value: 'N/A' },
  { label: 'Most Active Era:', value: 'N/A' },
  { label: 'Collection Spans:', value: 'N/A' },
  { label: 'Most Recent Addition:', value: 'N/A' },
  { label: 'Records Marked for Trade:', value: '0' },
  { label: 'Unique Artists Collected:', value: '0' },
  { label: 'Different Genres Collected:', value: '0' },
]

export function CollectionStats({ stats = DEFAULT_STATS }: { stats?: StatItem[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <h2 className="mb-4 text-center text-sm font-semibold tracking-wide">
        Collection Stats
      </h2>

      <div className="grid gap-3 text-xs sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center"
          >
            <p className="text-[11px] text-slate-500">{s.label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
