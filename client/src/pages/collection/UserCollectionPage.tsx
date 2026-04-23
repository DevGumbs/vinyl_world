import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../lib/api'

type RecordRow = {
  id: string
  albumTitle: string
  artistName: string
  year: number
  genre: string
  vinylCondition: string
  isForTrade: boolean
  ownerUsername: string
}

export default function UserCollectionPage() {
  const { username } = useParams()
  const [records, setRecords] = useState<RecordRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const owner = useMemo(() => (username ? String(username) : ''), [username])

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
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load collection')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [owner])

  return (
    <main className="flex-1 space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-slate-900">
              {owner}&apos;s Collection
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {loading ? 'Loading…' : `${records.length} record${records.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <Link to="/collection" className="text-sm font-semibold text-emerald-600 underline">
            Back to yours
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : loading ? (
          <p className="text-sm text-slate-500">Loading records…</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-slate-500">No records yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
              >
                <p className="font-semibold text-slate-900">{r.albumTitle}</p>
                <p className="text-slate-600">{r.artistName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {r.year} • {r.genre} • {r.vinylCondition}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

