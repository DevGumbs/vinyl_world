export function YourActivity() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="mb-2 text-center text-base font-semibold">Your Activity</h2>
      <ul className="space-y-2 text-xs text-slate-700">
        <li>
          <button
            type="button"
            className="underline decoration-emerald-400 decoration-2 underline-offset-2 hover:text-emerald-600"
          >
            User1
          </button>
          <span> commented on your post, </span>
          <button
            type="button"
            className="underline decoration-emerald-400 decoration-2 underline-offset-2 hover:text-emerald-600"
          >
            post title
          </button>
        </li>
        <li>
          <button
            type="button"
            className="underline decoration-emerald-400 decoration-2 underline-offset-2 hover:text-emerald-600"
          >
            User31
          </button>
          <span> listed </span>
          <button
            type="button"
            className="underline decoration-emerald-400 decoration-2 underline-offset-2 hover:text-emerald-600"
          >
            Kind of Blue
          </button>
          <span>, which you&apos;re looking for</span>
        </li>
        <li>
          <button
            type="button"
            className="underline decoration-emerald-400 decoration-2 underline-offset-2 hover:text-emerald-600"
          >
            User22
          </button>
          <span> commented on your collection</span>
        </li>
      </ul>
    </section>
  )
}
