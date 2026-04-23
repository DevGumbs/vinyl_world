import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import type { RecordRow } from '../../records/recordTypes'
import { AlbumCard } from './AlbumCard'

type CollectionDetailsSectionProps = {
  username: string
  isMe: boolean
}

export function CollectionDetailsSection({ username, isMe }: CollectionDetailsSectionProps) {
  const owner = useMemo(() => username.trim(), [username])
  const [records, setRecords] = useState<RecordRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!owner) return
    let cancelled = false
    setLoading(true)
    setError(null)
    api<RecordRow[]>(`/api/records/user/${encodeURIComponent(owner)}`)
      .then((rows) => {
        if (!cancelled) setRecords(rows)
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
  }, [owner])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold tracking-wide">
        <h2>Collection Details</h2>
        <Link
          to="/shelf"
          className="text-xs font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-600"
        >
          Grid View
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : loading ? (
          <p className="text-sm text-slate-500">Loading records…</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-slate-500">
            {isMe ? (
              <>
                No records yet.{' '}
                <Link to="/collection" className="font-semibold text-emerald-600 underline">
                  Add a record to your collection
                </Link>
                .
              </>
            ) : (
              <>No records yet.</>
            )}
          </p>
        ) : (
          records.slice(0, 6).map((r) => (
            <AlbumCard key={r.id} album={r.albumTitle} artist={r.artistName} />
          ))
        )}
      </div>

      <div className="mt-4 flex flex-col justify-between gap-3 text-xs text-emerald-600 sm:flex-row">
        {isMe ? (
          <Link
            to="/collection"
            className="underline underline-offset-2 hover:text-emerald-600"
          >
            Add/Edit
          </Link>
        ) : (
          <span />
        )}
        <Link
          to={`/collection/${encodeURIComponent(owner)}`}
          className="underline underline-offset-2 hover:text-emerald-600"
        >
          View Full Collection
        </Link>
      </div>
    </div>
  )
}
