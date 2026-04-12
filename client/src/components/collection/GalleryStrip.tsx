export function GalleryStrip() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-lg text-slate-300 hover:border-rose-400 hover:text-rose-300 md:flex"
          aria-label="Previous"
        >
          ←
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[11px]"
            >
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded border border-slate-300 text-[11px] text-slate-700">
                Vinyl
              </div>
              <span className="text-[11px] text-slate-600">Artist</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-lg text-slate-300 hover:border-rose-400 hover:text-rose-300 md:flex"
          aria-label="Next"
        >
          →
        </button>
      </div>
    </section>
  )
}
