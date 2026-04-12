type DiscussionPostProps = {
  userLabel: string
  title: string
  meta: string
}

export function DiscussionPost({ userLabel, title, meta }: DiscussionPostProps) {
  return (
    <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/80 bg-slate-900 text-xs text-emerald-600">
        {userLabel}
      </div>
      <div className="flex-1">
        <button
          type="button"
          className="text-sm font-semibold text-slate-900 underline underline-offset-2 hover:text-emerald-600"
        >
          {title}
        </button>
        <p className="mt-1 text-xs text-slate-500">{meta}</p>
      </div>
    </article>
  )
}
