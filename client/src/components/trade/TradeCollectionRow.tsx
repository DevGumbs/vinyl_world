import type { RecordRow } from '../../records/recordTypes'
import { coverSrc } from '../../records/cover'

export type TradeCondition = 'N' | 'VG' | 'G' | 'P'

type TradeCollectionRowProps = {
  record: RecordRow
  checked: boolean
  condition: TradeCondition
  onCheckedChange: (checked: boolean) => void
  onConditionChange: (condition: TradeCondition) => void
}

export function TradeCollectionRow({
  record,
  checked,
  condition,
  onCheckedChange,
  onConditionChange,
}: TradeCollectionRowProps) {
  const src = coverSrc(record.coverImg)
  const listed = Boolean(record.isForTrade)

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
        listed
          ? 'border-slate-200 bg-slate-100 text-slate-400'
          : 'border-slate-200 bg-slate-50 text-slate-900'
      }`}
    >
      <img
        src={src}
        alt=""
        className={`h-12 w-10 rounded border bg-white object-cover ${
          listed ? 'border-slate-200 grayscale opacity-70' : 'border-slate-300'
        }`}
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-xs font-semibold ${listed ? 'text-slate-500' : ''}`}>
          {record.albumTitle}
        </p>
        <p className="truncate text-[11px] text-slate-400">{record.artistName}</p>
        {listed ? (
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Listed for trade
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {listed ? null : checked ? (
          <select
            value={condition}
            onChange={(e) => onConditionChange(e.target.value as TradeCondition)}
            className="h-8 rounded-full border border-slate-300 bg-white px-3 text-[11px] text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            aria-label="Condition"
          >
            <option value="N">N</option>
            <option value="VG">VG</option>
            <option value="G">G</option>
            <option value="P">P</option>
          </select>
        ) : null}
        <input
          type="checkbox"
          checked={listed ? false : checked}
          disabled={listed}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={listed ? 'Already listed for trade' : 'Select record'}
        />
      </div>
    </div>
  )
}
