import { useEffect, useId, useMemo, useState } from 'react'
import { api } from '../../lib/api'
import type { RecordRow } from '../../records/recordTypes'

type TopicNode = {
  id: string
  name: string
  count: number
  children: TopicNode[]
}

type EditRecordModalProps = {
  open: boolean
  records: RecordRow[]
  onClose: () => void
  onUpdated: () => void
}

export function EditRecordModal({ open, records, onClose, onUpdated }: EditRecordModalProps) {
  const titleId = useId()
  const [selectedId, setSelectedId] = useState<string>('')
  const selected = useMemo(
    () => records.find((r) => r.id === selectedId) ?? null,
    [records, selectedId]
  )

  const [cover, setCover] = useState<File | null>(null)
  const [albumTitle, setAlbumTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [year, setYear] = useState('')
  const [genre, setGenre] = useState('')
  const [vinylCondition, setVinylCondition] = useState('VG')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [genres, setGenres] = useState<string[]>([])
  const [genresLoading, setGenresLoading] = useState(false)
  const genreOptions = useMemo(() => genres, [genres])

  useEffect(() => {
    if (!open) {
      setSelectedId('')
      setCover(null)
      setAlbumTitle('')
      setArtistName('')
      setYear('')
      setGenre('')
      setVinylCondition('VG')
      setSubmitting(false)
      setError(null)
      setGenres([])
      setGenresLoading(false)
    } else {
      setSelectedId(records[0]?.id ?? '')
    }
  }, [open, records])

  useEffect(() => {
    if (!selected) return
    setCover(null)
    setAlbumTitle(selected.albumTitle)
    setArtistName(selected.artistName)
    setYear(String(selected.year))
    setGenre(selected.genre)
    setVinylCondition(selected.vinylCondition || 'VG')
    setError(null)
  }, [selected?.id])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setGenresLoading(true)
    api<{ topics: TopicNode[] }>('/api/topics/summary')
      .then((res) => {
        if (cancelled) return
        const genreRoot = res.topics.find((t) => t.name.toLowerCase() === 'genres') ?? null
        const names = (genreRoot?.children ?? []).map((c) => c.name).filter(Boolean)
        setGenres(names)
      })
      .catch(() => {
        if (!cancelled) setGenres([])
      })
      .finally(() => {
        if (!cancelled) setGenresLoading(false)
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

  if (!open) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedId) return
    setError(null)
    setSubmitting(true)
    try {
      const form = new FormData()
      form.set('albumTitle', albumTitle)
      form.set('artistName', artistName)
      form.set('year', year)
      form.set('genre', genre)
      form.set('vinylCondition', vinylCondition)
      if (cover) form.set('cover', cover)

      await api<{ ok: true }>(`/api/records/${encodeURIComponent(selectedId)}`, {
        method: 'PUT',
        body: form,
      })
      onUpdated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update record')
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
          Edit record
        </h2>
        <p className="mt-1 text-sm text-slate-500">Select a record, then update its details.</p>

        <form onSubmit={submit} className="mt-4 space-y-4">
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <label className="block text-sm font-medium text-slate-700">
            Record
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.albumTitle} — {r.artistName}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Replace cover image (optional)
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => setCover(e.target.files?.[0] ?? null)}
              className="mt-1.5 block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border file:border-slate-300 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:border-emerald-500 hover:file:text-emerald-600"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Album title
              <input
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Artist name
              <input
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              Year
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                inputMode="numeric"
                required
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
              Genre
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                disabled={genresLoading || genreOptions.length === 0}
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-70"
              >
                <option value="" disabled>
                  {genresLoading ? 'Loading genres…' : 'Select a genre'}
                </option>
                {genreOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Condition
            <select
              value={vinylCondition}
              onChange={(e) => setVinylCondition(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="N">N</option>
              <option value="VG">VG</option>
              <option value="G">G</option>
              <option value="P">P</option>
            </select>
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
              disabled={submitting || !selectedId}
              className="rounded-full border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

