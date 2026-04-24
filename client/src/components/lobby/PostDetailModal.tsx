import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { api, API_BASE_URL } from '../../lib/api'
import { emitActivityRefresh } from '../../lib/activityRefresh'

type PostDetail = {
  id: string
  authorUsername: string
  title: string
  body: string
  imageUrl: string | null
  createdAt: string
  topicName: string
}

type CommentRow = {
  id: string
  authorUsername: string
  body: string
  createdAt: string
}

type PostDetailModalProps = {
  open: boolean
  postId: string | null
  onClose: () => void
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

export function PostDetailModal({ open, postId, onClose }: PostDetailModalProps) {
  const titleId = useId()
  const { user, loading: authLoading } = useAuth()
  const [, setNowTick] = useState(0)

  const [post, setPost] = useState<PostDetail | null>(null)
  const [comments, setComments] = useState<CommentRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [commentBody, setCommentBody] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)
  const [commentsOpen, setCommentsOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setPost(null)
      setComments([])
      setError(null)
      setLoading(false)
      setCommentBody('')
      setCommentSubmitting(false)
      setCommentError(null)
      setCommentsOpen(false)
    }
  }, [open])

  useEffect(() => {
    if (!open || !postId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      api<PostDetail>(`/api/posts/${encodeURIComponent(postId)}`),
      api<CommentRow[]>(`/api/posts/${encodeURIComponent(postId)}/comments`),
    ])
      .then(([p, c]) => {
        if (cancelled) return
        setPost(p)
        setComments(c)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load post')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, postId])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const id = window.setInterval(() => setNowTick((v) => v + 1), 60_000)
    return () => window.clearInterval(id)
  }, [open])

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!postId) return
    setCommentError(null)
    setCommentSubmitting(true)
    try {
      await api<{ id: string }>(`/api/posts/${encodeURIComponent(postId)}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body: commentBody }),
      })
      setCommentBody('')
      const next = await api<CommentRow[]>(
        `/api/posts/${encodeURIComponent(postId)}/comments`
      )
      setComments(next)
      emitActivityRefresh()
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Failed to comment')
    } finally {
      setCommentSubmitting(false)
    }
  }

  if (!open) return null

  const imageSrc =
    post?.imageUrl && /^https?:\/\//i.test(post.imageUrl)
      ? post.imageUrl
      : post?.imageUrl
        ? `${API_BASE_URL}${post.imageUrl}`
        : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 px-4 py-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        {authLoading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : !user ? (
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-slate-900">
              Sign up to view posts
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Create an account to read full posts and join the discussion.
            </p>
            <div className="mt-5 flex gap-2">
              <Link
                to="/sign-up"
                className="rounded-full border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                Sign up
              </Link>
              <Link
                to="/sign-in"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
              >
                Sign in
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="ml-auto text-sm text-slate-500 hover:text-slate-700 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-slate-900">
                  {post?.title ?? 'Post'}
                </h2>
                {post ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {post.topicName} • {timeAgoLabel(post.createdAt)} • by{' '}
                    <Link
                      to={`/u/${encodeURIComponent(post.authorUsername)}`}
                      className="font-semibold text-slate-700 underline underline-offset-2 hover:text-emerald-600"
                    >
                      {post.authorUsername}
                    </Link>
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
              >
                Close
              </button>
            </div>

            {loading ? (
              <p className="mt-4 text-sm text-slate-500">Loading post…</p>
            ) : error ? (
              <p className="mt-4 text-sm text-rose-600">{error}</p>
            ) : post ? (
              <>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                  {post.imageUrl ? (
                    <img
                      src={imageSrc ?? undefined}
                      alt=""
                      className="mb-3 mx-auto max-h-80 w-full rounded-xl border border-slate-200 object-contain"
                    />
                  ) : null}
                  <p className="mt-2 whitespace-pre-wrap leading-relaxed">{post.body}</p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setCommentsOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:border-emerald-500"
                    aria-expanded={commentsOpen}
                  >
                    <span>
                      Comments{' '}
                      <span className="text-xs font-medium text-slate-500">
                        ({comments.length})
                      </span>
                    </span>
                    <span className="text-xs text-slate-600">{commentsOpen ? '▴' : '▾'}</span>
                  </button>

                  {commentsOpen ? (
                    comments.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-500">No comments yet.</p>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {comments.map((c) => (
                          <div
                            key={c.id}
                            className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
                          >
                            <p className="text-xs text-slate-500">
                              <Link
                                to={`/u/${encodeURIComponent(c.authorUsername)}`}
                                className="font-semibold text-slate-700 underline underline-offset-2 hover:text-emerald-600"
                              >
                                {c.authorUsername}
                              </Link>{' '}
                              • {timeAgoLabel(c.createdAt)}
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-slate-800">{c.body}</p>
                          </div>
                        ))}
                      </div>
                    )
                  ) : null}

                  <form onSubmit={submitComment} className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Leave a comment
                      <textarea
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        rows={3}
                        required
                        className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </label>
                    {commentError ? <p className="text-sm text-rose-600">{commentError}</p> : null}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={commentSubmitting}
                        className="rounded-full border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {commentSubmitting ? 'Posting…' : 'Post comment'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

