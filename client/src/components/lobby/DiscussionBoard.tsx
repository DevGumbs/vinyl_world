import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'
import { DiscussionPost } from './DiscussionPost'
import { PostDetailModal } from './PostDetailModal'

type PostRow = {
  id: string
  authorUsername: string
  title: string
  topicName: string
  createdAt: string
  commentCount: number
}

type DiscussionBoardProps = {
  refreshToken?: number
  topicNameFilter?: string | null
}

function timeAgoLabel(iso: string) {
  const date = new Date(iso)
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

export function DiscussionBoard({ refreshToken = 0, topicNameFilter = null }: DiscussionBoardProps) {
  const [posts, setPosts] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openPostId, setOpenPostId] = useState<string | null>(null)
  const [nowTick, setNowTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setNowTick((v) => v + 1), 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api<PostRow[]>('/api/posts')
      .then((rows) => {
        if (!cancelled) setPosts(rows)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load posts')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshToken])

  const filteredPosts = useMemo(() => {
    if (!topicNameFilter) return posts
    return posts.filter((p) => p.topicName === topicNameFilter)
  }, [posts, topicNameFilter])

  const content = useMemo(() => {
    if (loading) return <p className="text-center text-xs text-slate-400">Loading…</p>
    if (error) return <p className="text-center text-xs text-rose-600">{error}</p>
    if (filteredPosts.length === 0) {
      return <p className="text-center text-sm text-slate-500">No current posts.</p>
    }
    return (
      <div className="space-y-3 text-sm">
        {filteredPosts.map((p) => (
          <DiscussionPost
            key={p.id}
            postId={p.id}
            userLabel={p.authorUsername}
            title={p.title}
            topic={p.topicName}
            timePostedLabel={timeAgoLabel(p.createdAt)}
            commentCount={p.commentCount}
            onOpen={(id) => setOpenPostId(id)}
          />
        ))}
        <PostDetailModal
          open={Boolean(openPostId)}
          postId={openPostId}
          onClose={() => setOpenPostId(null)}
        />
      </div>
    )
  }, [filteredPosts, loading, error, openPostId, nowTick])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-center text-base font-semibold tracking-wide text-slate-900">
        Discussion Board
      </h2>
      {content}
    </div>
  )
}
