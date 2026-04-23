import { useEffect, useId, useMemo, useState } from 'react'
import { api } from '../../lib/api'

type Topic = {
  id: string
  name: string
  parentId: string | null
  sortOrder: number
}

type NewPostModalProps = {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

export function NewPostModal({ open, onClose, onCreated }: NewPostModalProps) {
  const titleId = useId()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [topicId, setTopicId] = useState<string>('')
  const [subtopicId, setSubtopicId] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setImageFile(null)
      setTitle('')
      setBody('')
      setTopicId('')
      setSubtopicId('')
      setSubmitting(false)
      setError(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setTopicsLoading(true)
    api<Topic[]>('/api/topics')
      .then((rows) => {
        if (!cancelled) setTopics(rows)
      })
      .finally(() => {
        if (!cancelled) setTopicsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const rootTopics = useMemo(
    () => topics.filter((t) => t.parentId === null),
    [topics]
  )
  const genreRoot = rootTopics.find((t) => t.name.toLowerCase() === 'genres')
  const genreSubtopics = useMemo(
    () => topics.filter((t) => t.parentId === (genreRoot?.id ?? '')),
    [topics, genreRoot?.id]
  )

  const showGenreSubtopic = genreRoot && topicId === genreRoot.id

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const selectedTopicId = showGenreSubtopic ? subtopicId : topicId
      const form = new FormData()
      form.set('topicId', selectedTopicId)
      form.set('title', title)
      form.set('body', body)
      if (imageFile) form.set('image', imageFile)

      await api<{ id: string }>('/api/posts', { method: 'POST', body: form })
      onCreated?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
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
        <h2 id={titleId} className="text-lg font-semibold text-slate-900">
          New post
        </h2>
        <p className="mt-1 text-sm text-slate-500">Share a topic with the community.</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Topic
            <select
              value={topicId}
              onChange={(e) => {
                setTopicId(e.target.value)
                setSubtopicId('')
              }}
              required
              disabled={topicsLoading}
              className="mt-1.5 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-70"
            >
              <option value="" disabled>
                {topicsLoading ? 'Loading topics…' : 'Select a topic'}
              </option>
              {rootTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          {showGenreSubtopic ? (
            <label className="block text-sm font-medium text-slate-700">
              Genre
              <select
                value={subtopicId}
                onChange={(e) => setSubtopicId(e.target.value)}
                required
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="" disabled>
                  Select a genre
                </option>
                {genreSubtopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <label className="block text-sm font-medium text-slate-700">
            Image (optional)
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="mt-1.5 block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border file:border-slate-300 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:border-emerald-500 hover:file:text-emerald-600"
            />
            <p className="mt-1 text-[11px] text-slate-500">PNG, JPG, or JPEG (max 5MB)</p>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Body
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={5}
              className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || topicsLoading}
              className="rounded-full border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
