import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { api, API_BASE_URL } from '../../lib/api'
import type { RecordRow } from '../../records/recordTypes'

export function MyCollectionPreview() {
  const { user, loading: authLoading } = useAuth()
  const [count, setCount] = useState<number | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [recent, setRecent] = useState<RecordRow[]>([])

  const tiles = useMemo(() => {
    return recent.map((r) => {
      const src =
        r.coverImg && /^https?:\/\//i.test(r.coverImg)
          ? r.coverImg
          : r.coverImg
            ? `${API_BASE_URL}${r.coverImg}`
            : '/imgs/default-cover.svg'
      return { id: r.id, src }
    })
  }, [recent])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setCount(null)
      setRecent([])
      return
    }
    let cancelled = false
    setLoadError(false)
    api<{ count: number }>('/api/records/me/summary')
      .then((res) => {
        if (!cancelled) setCount(res.count)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true)
          setCount(0)
        }
      })
    api<RecordRow[]>(`/api/records/user/${encodeURIComponent(user.username)}`)
      .then((rows) => {
        if (!cancelled) setRecent(rows.slice(0, 4))
      })
      .catch(() => {
        if (!cancelled) setRecent([])
      })
    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  if (authLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="text-center text-base font-semibold text-slate-900">My Collection</h2>
        <p className="mt-2 text-center text-xs text-slate-400">Loading…</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="text-center text-base font-semibold text-slate-900">My Collection</h2>
        <p className="mt-2 text-center text-xs text-slate-500">
          <Link to="/sign-in" className="font-semibold text-emerald-600 underline">
            Sign in
          </Link>{' '}
          to track your collection.
        </p>
      </section>
    )
  }

  const c = count ?? 0
  const showEmpty = c === 0 && !loadError

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-center text-base font-semibold text-slate-900">My Collection</h2>
      <p className="mt-1 text-center text-xs text-slate-500">
        You have {c} record{c === 1 ? '' : 's'}
      </p>

      {c > 0 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {tiles.map((t) => (
            <img
              key={t.id}
              src={t.src}
              alt=""
              className="aspect-square w-full rounded border border-slate-300 bg-slate-50 object-cover"
              loading="lazy"
            />
          ))}
        </div>
      ) : null}

      {showEmpty ? (
        <p className="mt-3 text-center text-sm">
          <Link to="/collection" className="font-semibold text-emerald-600 underline">
            Click to add a record
          </Link>
        </p>
      ) : null}

      {c > 0 || loadError ? (
        <div className="mt-3 flex justify-center">
          <Link
            to="/collection"
            className="w-full rounded-full border border-emerald-500 bg-emerald-500 px-3 py-1.5 text-center text-xs font-semibold text-white transition hover:bg-emerald-600"
          >
            View Collection
          </Link>
        </div>
      ) : null}
    </section>
  )
}
