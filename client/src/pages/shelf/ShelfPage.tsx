import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShelfScene } from '../../components/shelf/ShelfScene'
import { ShelfViewHeader } from '../../components/shelf/ShelfViewHeader'
import { useAuth } from '../../auth/AuthProvider'
import { api } from '../../lib/api'
import type { RecordRow } from '../../records/recordTypes'

type ShelfMode = 'vintage' | 'modern' | 'retro'

const BG: Record<ShelfMode, string> = {
  vintage: '/imgs/vintageBG.png',
  modern: '/imgs/modernBG.png',
  retro: '/imgs/retroBG.png',
}

export default function ShelfPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [records, setRecords] = useState<RecordRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mode = useMemo((): ShelfMode => {
    const bg = searchParams.get('bg')
    return bg === 'modern' || bg === 'retro' ? bg : 'vintage'
  }, [searchParams])

  function setMode(next: ShelfMode) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set('bg', next)
      return p
    })
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setRecords([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    api<RecordRow[]>(`/api/records/user/${encodeURIComponent(user.username)}`)
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
  }, [user, authLoading])

  return (
    <main className="flex-1 space-y-6">
      <ShelfViewHeader mode={mode} onModeChange={setMode} />

      {authLoading ? (
        <p className="text-center text-sm text-slate-500">Loading…</p>
      ) : !user ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <p className="text-sm text-slate-600">
            <Link to="/sign-in" className="font-semibold text-emerald-600 underline">
              Sign in
            </Link>{' '}
            to view your shelf.
          </p>
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <p className="text-sm text-rose-600">{error}</p>
        </section>
      ) : loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <p className="text-sm text-slate-500">Loading records…</p>
        </section>
      ) : (
        <>
          <ShelfScene backgroundImage={BG[mode]} records={records.slice(0, 12)} />
          {records.length === 0 ? (
            <p className="text-center text-sm text-slate-600">
              <Link to="/collection" className="font-semibold text-emerald-600 underline">
                Add a record to your collection
              </Link>{' '}
              to see it on your shelf.
            </p>
          ) : null}
        </>
      )}
    </main>
  )
}
