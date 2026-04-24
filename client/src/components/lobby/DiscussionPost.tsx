import { Link } from 'react-router-dom'

type DiscussionPostProps = {
  postId: string
  userLabel: string
  title: string
  topic: string
  timePostedLabel: string
  commentCount: number
  onOpen: (postId: string) => void
}

export function DiscussionPost({
  postId,
  userLabel,
  title,
  topic,
  timePostedLabel,
  commentCount,
  onOpen,
}: DiscussionPostProps) {
  const initials = userLabel
    .trim()
    .slice(0, 2)
    .toUpperCase()

  return (
    <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <Link
        to={`/u/${encodeURIComponent(userLabel)}`}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-900 shadow-sm hover:border-emerald-500 hover:text-emerald-700"
        aria-label={`View ${userLabel} profile`}
        title={userLabel}
      >
        {initials}
      </Link>
      <div className="flex-1">
        <button
          type="button"
          onClick={() => onOpen(postId)}
          className="text-sm font-semibold text-slate-900 underline underline-offset-2 hover:text-emerald-600"
        >
          {title}
        </button>
        <p className="mt-1 text-xs text-slate-500">
          {topic} • {timePostedLabel} • {commentCount} comment
          {commentCount === 1 ? '' : 's'}
        </p>
      </div>
    </article>
  )
}
