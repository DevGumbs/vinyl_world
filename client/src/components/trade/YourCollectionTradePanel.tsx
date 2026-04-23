import { Link } from 'react-router-dom'
import type { RecordRow } from '../../records/recordTypes'
import { TradeCollectionRow, type TradeCondition } from './TradeCollectionRow'

type YourCollectionTradePanelProps = {
  signedIn: boolean
  records: RecordRow[]
  selected: Record<string, TradeCondition>
  onToggle: (recordId: string, checked: boolean) => void
  onConditionChange: (recordId: string, condition: TradeCondition) => void
  onListSelected: () => void
  listing: boolean
}

export function YourCollectionTradePanel({
  signedIn,
  records,
  selected,
  onToggle,
  onConditionChange,
  onListSelected,
  listing,
}: YourCollectionTradePanelProps) {
  const selectedCount = Object.keys(selected).length
  const disabled = !signedIn || selectedCount === 0 || listing

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm shadow-sm">
      <h2 className="mb-1 text-center text-sm font-semibold">Your Collection</h2>
      <p className="mb-3 text-center text-[11px] text-slate-400">
        (select albums to list for trade)
      </p>

      {!signedIn ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs text-slate-600">
          <Link to="/sign-in" className="font-semibold text-emerald-600 underline">
            Sign in
          </Link>{' '}
          to list records for trade.
        </p>
      ) : records.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs text-slate-600">
          <Link to="/collection" className="font-semibold text-emerald-600 underline">
            Add a record to your collection
          </Link>{' '}
          to start trading.
        </p>
      ) : (
        <div className="space-y-2 text-xs">
          {records.map((r) => {
            const checked = Boolean(selected[r.id])
            const condition = selected[r.id] ?? 'VG'
            return (
              <TradeCollectionRow
                key={r.id}
                record={r}
                checked={checked}
                condition={condition}
                onCheckedChange={(c) => onToggle(r.id, c)}
                onConditionChange={(c) => onConditionChange(r.id, c)}
              />
            )
          })}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          disabled={disabled}
          onClick={onListSelected}
          className={[
            'w-full rounded-full px-3 py-2 text-xs font-semibold transition',
            disabled
              ? 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500'
              : 'border border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600',
          ].join(' ')}
        >
          List ({selectedCount}) Records for Trade
        </button>
      </div>
    </aside>
  )
}
