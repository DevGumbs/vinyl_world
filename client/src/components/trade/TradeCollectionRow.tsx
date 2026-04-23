import type { RecordRow } from '../../records/recordTypes'

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
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex h-12 w-10 items-center justify-center rounded border border-slate-300 bg-slate-50 text-[10px] text-slate-700">
        Vinyl
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold">{record.albumTitle}</p>
        <p className="text-[11px] text-slate-400">{record.artistName}</p>
      </div>
      <div className="flex items-center gap-2">
        {checked ? (
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
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500"
          aria-label="Select record"
        />
      </div>
    </div>
  )
}
