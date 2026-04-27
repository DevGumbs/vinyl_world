import { useEffect, useMemo, useState } from 'react'
import { emitActivityRefresh } from '../../lib/activityRefresh'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { CollectionPageHeader } from '../../components/collection/CollectionPageHeader'
import { AddRecordModal } from '../../components/collection/AddRecordModal'
import { EditRecordModal } from '../../components/collection/EditRecordModal'
import { GalleryStrip } from '../../components/collection/GalleryStrip'
import { SpotlightSection } from '../../components/collection/SpotlightSection'
import { api } from '../../lib/api'
import type { RecordRow } from '../../records/recordTypes'

export default function CollectionPage() {
  const { user, loading: authLoading, refresh: refreshAuth } = useAuth()
  const [records, setRecords] = useState<RecordRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  async function refresh() {
    if (!user) return
    const rows = await api<RecordRow[]>(`/api/records/user/${encodeURIComponent(user.username)}`)
    setRecords(rows)
    setSelectedId((prev) => prev ?? rows[0]?.id ?? null)
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setRecords([])
      setSelectedId(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    api<RecordRow[]>(`/api/records/user/${encodeURIComponent(user.username)}`)
      .then((rows) => {
        if (cancelled) return
        setRecords(rows)
        setSelectedId(rows[0]?.id ?? null)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load records')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  const selected = useMemo(
    () => records.find((r) => r.id === selectedId) ?? null,
    [records, selectedId]
  )

  if (authLoading) {
    return (
      <main className="flex-1">
        <p className="text-center text-sm text-slate-500">Loading…</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex-1">
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-sm text-slate-600">
            <Link to="/sign-in" className="font-semibold text-emerald-600 underline">
              Sign in
            </Link>{' '}
            or{' '}
            <Link to="/sign-up" className="font-semibold text-emerald-600 underline">
              sign up
            </Link>{' '}
            to view and manage your collection.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="flex-1 space-y-6">
      <CollectionPageHeader
        username={user.username}
        collectionName={user.collectionName ?? null}
        count={records.length}
        shelfTo="/shelf"
        showEdit
        onCollectionNameSave={async (name) => {
          await api('/auth/collection-name', {
            method: 'PATCH',
            body: JSON.stringify({ collectionName: name }),
          })
          await refreshAuth()
        }}
      />
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="rounded-full border border-emerald-500 bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          + Add Record
        </button>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
        >
          Edit record
        </button>
      </div>
      <AddRecordModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() =>
          void (async () => {
            await refresh()
            emitActivityRefresh()
          })()
        }
      />
      <EditRecordModal
        open={editOpen}
        records={records}
        onClose={() => setEditOpen(false)}
        onUpdated={() => void refresh()}
      />

      {error ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <p className="text-sm text-rose-600">{error}</p>
        </section>
      ) : loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <p className="text-sm text-slate-500">Loading records…</p>
        </section>
      ) : records.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <p className="text-sm text-slate-600">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="font-semibold text-emerald-600 underline"
            >
              Add a record to your collection
            </button>
          </p>
        </section>
      ) : (
        <>
          <GalleryStrip
            records={records}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
          />
          {selected ? <SpotlightSection record={selected} /> : null}
        </>
      )}
    </main>
  )
}
