export function TopicSidebar() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm md:self-start">
      <h2 className="mb-3 border-b border-slate-200 pb-2 text-center text-base font-semibold tracking-wide text-slate-900">
        Topics
      </h2>
      <ul className="space-y-2">
        <li>
          <button
            type="button"
            className="w-full text-left text-slate-700 transition hover:text-emerald-600 hover:underline"
          >
            General
          </button>
        </li>
        <li>
          <button
            type="button"
            className="w-full text-left text-slate-700 transition hover:text-emerald-600 hover:underline"
          >
            New Releases
          </button>
        </li>
        <li>
          <button
            type="button"
            className="flex w-full items-center justify-between text-slate-700 transition hover:text-emerald-600 hover:underline"
          >
            <span>Genres</span>
            <span className="text-xs">▽</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="w-full text-left text-slate-700 transition hover:text-emerald-600 hover:underline"
          >
            Trades
          </button>
        </li>
      </ul>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="w-full rounded-full border border-emerald-500 bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
        >
          + New Post
        </button>
      </div>
    </aside>
  )
}
