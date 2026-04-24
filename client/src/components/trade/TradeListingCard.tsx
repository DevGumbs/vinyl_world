import { Link } from 'react-router-dom'
import type { RecordRow } from '../../records/recordTypes'
import { coverSrc } from '../../records/cover'

type TradeListingCardProps = {
  record: RecordRow
  onViewDiscussion: (record: RecordRow) => void
}

export function TradeListingCard({ record, onViewDiscussion }: TradeListingCardProps) {
  const src = coverSrc(record.coverImg)
  return (
    <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <img
        src={src}
        alt=""
        className="h-16 w-16 rounded border border-slate-300 bg-white object-cover"
        loading="lazy"
      />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold">{record.albumTitle}</p>
        <p className="text-[11px] text-slate-500">{record.artistName}</p>
        <p className="text-[11px] text-slate-500">
          Listed by:{' '}
          <Link
            to={`/u/${encodeURIComponent(record.ownerUsername)}`}
            className="text-slate-800 underline underline-offset-2 hover:text-emerald-600"
          >
            {record.ownerUsername}
          </Link>
        </p>
        <p className="text-[11px] text-slate-500">
          {record.vinylCondition} |{' '}
          <span className="text-slate-800">
            {record.tradeCommentCount ?? 0}{' '}
            {(record.tradeCommentCount ?? 0) === 1 ? 'comment' : 'comments'}
          </span>
        </p>
      </div>
      <div className="flex flex-col items-end justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDiscussion(record)}
          className="rounded-full border border-emerald-500 bg-emerald-500 px-3 py-1 text-[11px] text-white hover:bg-emerald-600"
        >
          View Discussion
        </button>
      </div>
    </article>
  )
}
