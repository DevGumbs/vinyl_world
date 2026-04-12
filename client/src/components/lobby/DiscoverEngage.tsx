export function DiscoverEngage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-center text-base font-semibold tracking-wide text-slate-900">
        Discover & Engage
      </h2>

      <div className="grid gap-3 text-xs md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
          <button
            type="button"
            className="text-emerald-600 underline hover:text-emerald-600"
          >
            Miles Davis - Kind of Blue
          </button>
          <p className="mt-2">
            is being discussed in 4{' '}
            <span className="text-emerald-600 underline hover:text-emerald-600">jazz</span>{' '}
            threads
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
          <button
            type="button"
            className="text-emerald-600 underline hover:text-emerald-600"
          >
            Hip-Hop
          </button>
          <p className="mt-2">had 5 new posts recently</p>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
          <p className="mt-2">
            You share 7 records in common with{' '}
            <span className="font-semibold text-slate-900">User12</span>
          </p>
        </div>
      </div>
    </div>
  )
}
