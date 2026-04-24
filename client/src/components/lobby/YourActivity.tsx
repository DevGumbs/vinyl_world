import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { api } from '../../lib/api'
import { ACTIVITY_REFRESH_EVENT } from '../../lib/activityRefresh'

type ActivityItem = {
  kind: string
  createdAt: string
  postId?: string
  postTitle?: string
  recordId?: string
  albumTitle?: string
  artistName?: string
  actorUsername?: string
  listingOwnerUsername?: string
}

function timeAgoLabel(iso: string) {
  const date = new Date(String(iso).replace(' ', 'T'))
  const diffMs = Date.now() - date.getTime()
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'just now'
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function activityCopy(item: ActivityItem, username: string): { text: ReactNode; to: string } {
  switch (item.kind) {
    case 'post_created':
      return {
        text: (
          <>
            You started a discussion: <span className="font-medium text-slate-800">{item.postTitle}</span>
          </>
        ),
        to: '/',
      }
    case 'record_added':
      return {
        text: (
          <>
            You added <span className="font-medium text-slate-800">{item.albumTitle}</span> to your collection
          </>
        ),
        to: '/collection',
      }
    case 'post_commented':
      return {
        text: (
          <>
            You commented on <span className="font-medium text-slate-800">{item.postTitle}</span>
          </>
        ),
        to: '/',
      }
    case 'trade_listed':
      return {
        text: (
          <>
            You listed <span className="font-medium text-slate-800">{item.albumTitle}</span> for trade
          </>
        ),
        to: '/trade',
      }
    case 'trade_commented': {
      const own = item.listingOwnerUsername === username
      return {
        text: own ? (
          <>
            You commented on your trade listing <span className="font-medium text-slate-800">{item.albumTitle}</span>
          </>
        ) : (
          <>
            You commented on a listing by{' '}
            <Link
              to={`/u/${encodeURIComponent(item.listingOwnerUsername ?? '')}`}
              className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
            >
              {item.listingOwnerUsername}
            </Link>
            : <span className="font-medium text-slate-800">{item.albumTitle}</span>
          </>
        ),
        to: '/trade',
      }
    }
    case 'post_comment_received':
      return {
        text: (
          <>
            <Link
              to={`/u/${encodeURIComponent(item.actorUsername ?? '')}`}
              className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
            >
              {item.actorUsername}
            </Link>{' '}
            commented on your post <span className="font-medium text-slate-800">{item.postTitle}</span>
          </>
        ),
        to: '/',
      }
    case 'trade_comment_received':
      return {
        text: (
          <>
            <Link
              to={`/u/${encodeURIComponent(item.actorUsername ?? '')}`}
              className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
            >
              {item.actorUsername}
            </Link>{' '}
            commented on your trade listing <span className="font-medium text-slate-800">{item.albumTitle}</span>
          </>
        ),
        to: '/trade',
      }
    default:
      return { text: <span className="text-slate-500">Activity</span>, to: '/' }
  }
}

export function YourActivity() {
  const { user, loading } = useAuth()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)

  const load = useCallback(async () => {
    if (!user) return
    setFetching(true)
    setLoadError(null)
    try {
      const res = await api<{ items: ActivityItem[] }>('/api/activity')
      setItems(res.items ?? [])
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not load activity')
      setItems([])
    } finally {
      setFetching(false)
    }
  }, [user])

  useEffect(() => {
    if (loading || !user) {
      setItems([])
      setLoadError(null)
      return
    }
    void load()
  }, [user, loading, load])

  useEffect(() => {
    if (!user) return
    const onRefresh = () => void load()
    window.addEventListener(ACTIVITY_REFRESH_EVENT, onRefresh)
    return () => window.removeEventListener(ACTIVITY_REFRESH_EVENT, onRefresh)
  }, [user, load])

  useEffect(() => {
    if (!user) return
    const onVis = () => {
      if (document.visibilityState === 'visible') void load()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [user, load])

  useEffect(() => {
    if (!user) return
    const id = window.setInterval(() => void load(), 60_000)
    return () => window.clearInterval(id)
  }, [user, load])

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="mb-2 text-center text-base font-semibold">Your Activity</h2>
        <p className="text-center text-xs text-slate-400">Loading…</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="mb-2 text-center text-base font-semibold">Your Activity</h2>
        <p className="text-center text-sm text-slate-600">
          <Link to="/sign-in" className="font-semibold text-emerald-600 underline">
            Sign in
          </Link>{' '}
          to see notifications and updates here.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="mb-2 text-center text-base font-semibold">Your Activity</h2>
      {fetching && items.length === 0 ? (
        <p className="text-center text-xs text-slate-400">Loading…</p>
      ) : loadError ? (
        <p className="text-center text-xs text-rose-600">{loadError}</p>
      ) : items.length === 0 ? (
        <p className="text-center text-xs text-slate-500">
          Nothing recent yet — start a discussion, add a record, or list something for trade.
        </p>
      ) : (
        <ul className="space-y-2 text-left text-xs text-slate-600">
          {items.map((item, i) => {
            const { text, to } = activityCopy(item, user.username)
            return (
              <li key={`${item.kind}-${item.createdAt}-${i}`}>
                <Link
                  to={to}
                  className="block rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <span className="block leading-snug">{text}</span>
                  <span className="mt-1 block text-[10px] text-slate-400">{timeAgoLabel(item.createdAt)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
