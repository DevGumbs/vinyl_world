import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../auth/AuthProvider'
import { emitActivityRefresh } from '../../lib/activityRefresh'
import { TradeCenterIntro } from '../../components/trade/TradeCenterIntro'
import { TradeDiscussionModal } from '../../components/trade/TradeDiscussionModal'
import { TradeListingsPanel } from '../../components/trade/TradeListingsPanel'
import { YourCollectionTradePanel } from '../../components/trade/YourCollectionTradePanel'
import { YourListedVinyls } from '../../components/trade/YourListedVinyls'
import { api } from '../../lib/api'
import type { RecordRow } from '../../records/recordTypes'
import type { TradeCondition } from '../../components/trade/TradeCollectionRow'

export default function TradePage() {
  const { user, loading: authLoading } = useAuth()
  const signedIn = Boolean(user) && !authLoading

  const [tradeRecords, setTradeRecords] = useState<RecordRow[]>([])
  const [yourRecords, setYourRecords] = useState<RecordRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [listing, setListing] = useState(false)
  const [selected, setSelected] = useState<Record<string, TradeCondition>>({})
  const [discussionRecord, setDiscussionRecord] = useState<RecordRow | null>(null)

  const refresh = useCallback(async () => {
    const trades = await api<RecordRow[]>('/api/records/trades')
    setTradeRecords(trades)
    if (user) {
      const yours = await api<RecordRow[]>(`/api/records/user/${encodeURIComponent(user.username)}`)
      setYourRecords(yours)
    } else {
      setYourRecords([])
    }
  }, [user])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setError(null)
        await refresh()
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load trades')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user, authLoading, refresh])

  const yourListed = useMemo(
    () => (user ? tradeRecords.filter((r) => r.ownerUsername === user.username) : []),
    [tradeRecords, user]
  )

  useEffect(() => {
    setSelected((prev) => {
      let changed = false
      const next = { ...prev }
      for (const id of Object.keys(next)) {
        const r = yourRecords.find((x) => x.id === id)
        if (r?.isForTrade) {
          delete next[id]
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [yourRecords])

  function onToggle(recordId: string, checked: boolean) {
    const rec = yourRecords.find((r) => r.id === recordId)
    if (rec?.isForTrade) return
    setSelected((prev) => {
      const next = { ...prev }
      if (checked) next[recordId] = next[recordId] ?? 'VG'
      else delete next[recordId]
      return next
    })
  }

  function onConditionChange(recordId: string, condition: TradeCondition) {
    const rec = yourRecords.find((r) => r.id === recordId)
    if (rec?.isForTrade) return
    setSelected((prev) => ({ ...prev, [recordId]: condition }))
  }

  async function onListSelected() {
    if (!user) return
    const items = Object.entries(selected).map(([recordId, condition]) => ({
      recordId,
      condition,
    }))
    if (items.length === 0) return

    setListing(true)
    try {
      await api<{ ok: boolean; updated: number }>('/api/records/trades/list', {
        method: 'POST',
        body: JSON.stringify({ items }),
      })
      setSelected({})
      await refresh()
      emitActivityRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to list records')
    } finally {
      setListing(false)
    }
  }

  async function onUnlistRecord(recordId: string) {
    try {
      setError(null)
      await api<{ ok: boolean; updated: number }>('/api/records/trades/unlist', {
        method: 'POST',
        body: JSON.stringify({ recordIds: [recordId] }),
      })
      await refresh()
      setDiscussionRecord((prev) => (prev?.id === recordId ? null : prev))
      emitActivityRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to remove listing')
    }
  }

  return (
    <main className="flex-1 space-y-6">
      <TradeCenterIntro />

      <section className="grid gap-4 lg:grid-cols-[minmax(230px,0.95fr)_minmax(0,2.1fr)]">
        <YourCollectionTradePanel
          signedIn={signedIn}
          records={yourRecords}
          selected={selected}
          onToggle={onToggle}
          onConditionChange={onConditionChange}
          onListSelected={onListSelected}
          listing={listing}
        />
        <TradeListingsPanel records={tradeRecords} onOpenDiscussion={setDiscussionRecord} />
      </section>

      {error ? (
        <p className="text-center text-sm text-rose-600">{error}</p>
      ) : null}

      {signedIn ? (
        <YourListedVinyls
          records={yourListed}
          onOpenDiscussion={setDiscussionRecord}
          onRemoveListing={onUnlistRecord}
        />
      ) : null}

      <TradeDiscussionModal
        open={discussionRecord !== null}
        record={discussionRecord}
        signedIn={signedIn}
        onClose={() => setDiscussionRecord(null)}
        onCommentsChanged={() => {
          void refresh()
          emitActivityRefresh()
        }}
      />
    </main>
  )
}
