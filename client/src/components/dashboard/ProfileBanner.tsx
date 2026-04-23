export function ProfileBanner({ username }: { username: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-2 text-sm md:flex-row md:items-center">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold">{username}</span>
          <span className="text-sm text-slate-400">- Bio / User Description</span>
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-400">(Location N/A)</p>
    </section>
  )
}
