import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { api } from '../../lib/api'

export function MyCollectionPreview() {
  const { user, loading: authLoading } = useAuth()
  const [count, setCount] = useState<number | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setCount(null)
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
          {Array.from({ length: Math.min(4, c) }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded border border-slate-300 bg-slate-50 text-[10px] text-slate-700"
            >
              Vinyl
            </div>
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
