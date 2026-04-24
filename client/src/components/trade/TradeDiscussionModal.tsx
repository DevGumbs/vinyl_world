import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import type { RecordRow, TradeListingComment } from '../../records/recordTypes'

type TradeDiscussionModalProps = {
  open: boolean
  record: RecordRow | null
  signedIn: boolean
  onClose: () => void
  onCommentsChanged?: () => void
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

export function TradeDiscussionModal({
  open,
  record,
  signedIn,
  onClose,
  onCommentsChanged,
}: TradeDiscussionModalProps) {
  const titleId = useId()
  const [comments, setComments] = useState<TradeListingComment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [commentsOpen, setCommentsOpen] = useState(false)

  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setComments([])
      setBody('')
      setSubmitting(false)
      setError(null)
      setCommentError(null)
      setCommentsOpen(false)
      return
    }
    if (!record) return

    let cancelled = false
    setLoading(true)
    setError(null)
    api<{ comments: TradeListingComment[] }>(
      `/api/records/trades/${encodeURIComponent(record.id)}/comments`
    )
      .then((res) => {
        if (!cancelled) {
          setComments(res.comments)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load comments')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, record?.id])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !record) return null

  const listingRecord = record

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!signedIn) return
    const text = body.trim()
    if (!text) return
    setCommentError(null)
    setSubmitting(true)
    try {
      await api<{ comment: TradeListingComment }>(
        `/api/records/trades/${encodeURIComponent(listingRecord.id)}/comments`,
        { method: 'POST', body: JSON.stringify({ body: text }) }
      )
      setBody('')
      const next = await api<{ comments: TradeListingComment[] }>(
        `/api/records/trades/${encodeURIComponent(listingRecord.id)}/comments`
      )
      setComments(next.comments)
      onCommentsChanged?.()
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Failed to post')
    } finally {
      setSubmitting(false)
    }
  }

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
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-slate-900">
              Trade discussion
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">{listingRecord.albumTitle}</span>
              <span className="text-slate-400"> · </span>
              <span>{listingRecord.artistName}</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Listed by{' '}
              <Link
                to={`/u/${encodeURIComponent(listingRecord.ownerUsername)}`}
                className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
              >
                {listingRecord.ownerUsername}
              </Link>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setCommentsOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:border-emerald-500"
            aria-expanded={commentsOpen}
          >
            <span>
              Comments{' '}
              <span className="text-xs font-medium text-slate-500">({comments.length})</span>
            </span>
            <span className="text-xs text-slate-600">{commentsOpen ? '▴' : '▾'}</span>
          </button>

          {commentsOpen ? (
            loading ? (
              <p className="mt-2 text-sm text-slate-500">Loading comments…</p>
            ) : comments.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No comments yet.</p>
            ) : (
              <div className="mt-3 max-h-[40vh] space-y-3 overflow-y-auto">
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

          {signedIn ? (
            <form onSubmit={handlePost} className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Leave a comment
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  maxLength={4000}
                  required
                  placeholder="Ask about condition, shipping, trades…"
                  className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </label>
              {commentError ? <p className="text-sm text-rose-600">{commentError}</p> : null}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Posting…' : 'Post comment'}
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-4 text-center text-sm text-slate-600">
              <Link to="/sign-in" className="font-semibold text-emerald-600 underline">
                Sign in
              </Link>{' '}
              to join the discussion.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
