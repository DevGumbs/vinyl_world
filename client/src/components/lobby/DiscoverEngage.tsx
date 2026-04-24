import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { api } from '../../lib/api'

type DiscoverResponse = {
  mode: 'public' | 'private'
  block1: {
    albumTitle: string
    artistName: string
    ownerUsername: string
    createdAt: string
  }[]
  block2: {
    subjectType: 'artist' | 'album'
    subjectName: string
    topicName: string
    createdAt: string
  }[]
  block3:
    | {
        subjectType: 'artist' | 'album'
        subjectName: string
        collectionCount: number
      }[]
    | {
        subjectType: 'artist' | 'album'
        subjectName: string
        otherUsername: string
        sharedCount: number
      }[]
}

function subjectLabel(subjectType: 'artist' | 'album') {
  return subjectType === 'artist' ? 'Artist' : 'Album'
}

function privateBlock3OtherUsername(x: {
  otherUsername?: string
  otherusername?: string
}): string {
  const v = x.otherUsername ?? x.otherusername
  return typeof v === 'string' && v.trim() ? v.trim() : ''
}

export function DiscoverEngage() {
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<DiscoverResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setData(null)
    api<DiscoverResponse>('/api/discover')
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load discover')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user?.username, authLoading])

  const block3Title = useMemo(() => {
    if (!data) return 'Discover'
    return data.mode === 'public' ? 'Popular in collections' : 'Shared in common'
  }, [data])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-center text-base font-semibold tracking-wide text-slate-900">
        Discover & Engage
      </h2>

      {loading ? (
        <p className="text-center text-xs text-slate-400">Loading…</p>
      ) : null}

      {error ? (
        <p className="text-center text-xs text-rose-600">{error}</p>
      ) : null}

      {!loading && !error && data ? (
        <div className="grid gap-3 text-xs md:grid-cols-3">
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <p className="text-[11px] font-semibold tracking-wide text-slate-700">
              Recent adds
            </p>
            {data.block1.length === 0 ? (
              <p className="mt-2 text-slate-500">No new adds yet.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {data.block1.map((x, i) => (
                  <div key={`${x.ownerUsername}-${x.albumTitle}-${x.artistName}-${x.createdAt}-${i}`}>
                    <p className="font-semibold text-slate-900">
                      {x.albumTitle}
                    </p>
                    <p className="text-slate-600">{x.artistName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <p className="text-[11px] font-semibold tracking-wide text-slate-700">Recent discussions</p>
            {data.block2.length === 0 ? (
              <p className="mt-2 text-slate-500">No posts yet.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {data.block2.map((x, i) => (
                  <div key={`${x.subjectType}-${x.subjectName}-${x.createdAt}-${i}`}>
                    <p className="font-semibold text-slate-900">
                      New post: {x.subjectName}
                    </p>
                    <p className="text-slate-600">{x.topicName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <p className="text-[11px] font-semibold tracking-wide text-slate-700">{block3Title}</p>
            {data.block3.length === 0 ? (
              <p className="mt-2 text-slate-500">Nothing to show yet.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {data.mode === 'public'
                  ? (data.block3 as { subjectType: 'artist' | 'album'; subjectName: string; collectionCount: number }[]).map(
                      (x, i) => (
                        <div key={`${x.subjectType}-${x.subjectName}-${i}`}>
                          <p className="font-semibold text-slate-900">
                            {subjectLabel(x.subjectType)}: {x.subjectName}
                          </p>
                          <p className="text-slate-600">
                            popular in {x.collectionCount} collection{x.collectionCount === 1 ? '' : 's'}
                          </p>
                        </div>
                      )
                    )
                  : (
                      data.block3 as {
                        subjectType: 'artist' | 'album'
                        subjectName: string
                        otherUsername?: string
                        otherusername?: string
                        sharedCount: number
                      }[]
                    ).map((x, i) => {
                      const otherUser = privateBlock3OtherUsername(x)
                      return (
                        <div key={`${x.subjectType}-${x.subjectName}-${otherUser}-${i}`}>
                          <p className="font-semibold text-slate-900">
                            {subjectLabel(x.subjectType)}: {x.subjectName}
                          </p>
                          {otherUser ? (
                            <>
                              <p className="text-slate-600">
                                You share this album with{' '}
                                <Link
                                  to={`/u/${encodeURIComponent(otherUser)}`}
                                  className="font-semibold text-slate-800 underline underline-offset-2 hover:text-emerald-600"
                                >
                                  {otherUser}
                                </Link>
                                {x.sharedCount > 1 ? ` · ${x.sharedCount} matching copies` : ''}.
                              </p>
                              <p className="mt-1">
                                <Link
                                  to={`/collection/${encodeURIComponent(otherUser)}`}
                                  className="font-semibold text-emerald-600 underline"
                                >
                                  {`${otherUser}'s collection`}
                                </Link>
                              </p>
                            </>
                          ) : (
                            <p className="text-slate-600">Another member has this album too.</p>
                          )}
                        </div>
                      )
                    })}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
