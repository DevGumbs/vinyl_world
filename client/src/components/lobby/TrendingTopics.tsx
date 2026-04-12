const TOPICS = ['Jazz', 'New Releases', 'Hip-Hop']

export function TrendingTopics() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="mb-2 text-center text-base font-semibold">Trending Topics</h2>
      <div className="flex flex-col gap-2 text-xs">
        {TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            className="w-full rounded-full border border-slate-300 bg-white px-3 py-1.5 text-center text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  )
}
