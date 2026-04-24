import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'

type PostRow = {
  id: string
  topicName: string
  createdAt: string
}

export function TrendingTopics() {
  const [posts, setPosts] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api<PostRow[]>('/api/posts')
      .then((rows) => {
        if (!cancelled) setPosts(rows)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load trending topics')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const topics = useMemo(() => {
    const out: string[] = []
    const seen = new Set<string>()
    for (const p of posts) {
      const t = (p.topicName ?? '').trim()
      if (!t || seen.has(t)) continue
      seen.add(t)
      out.push(t)
      if (out.length >= 3) break
    }
    return out
  }, [posts])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="mb-2 text-center text-base font-semibold">Trending Topics</h2>
      <div className="flex flex-col gap-2 text-xs">
        {loading ? (
          <p className="text-center text-[11px] text-slate-400">Loading…</p>
        ) : error ? (
          <p className="text-center text-[11px] text-rose-600">{error}</p>
        ) : topics.length === 0 ? (
          <p className="text-center text-[11px] text-slate-500">Nothing trending yet.</p>
        ) : (
          topics.map((t) => (
            <button
              key={t}
              type="button"
              className="w-full rounded-full border border-slate-300 bg-white px-3 py-1.5 text-center text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
            >
              {t}
            </button>
          ))
        )}
      </div>
    </section>
  )
}
