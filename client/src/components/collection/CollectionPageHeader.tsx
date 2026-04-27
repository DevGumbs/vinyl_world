import { useState } from 'react'
import { Link } from 'react-router-dom'

type CollectionPageHeaderProps = {
  username: string
  collectionName: string | null
  count: number
  shelfTo?: string
  showEdit?: boolean
  onCollectionNameSave?: (name: string | null) => Promise<void>
}

function defaultTitle(username: string) {
  return `${username}'s collection`
}

export function CollectionPageHeader({
  username,
  collectionName,
  count,
  shelfTo = '/shelf',
  showEdit = false,
  onCollectionNameSave,
}: CollectionPageHeaderProps) {
  const displayTitle = collectionName?.trim() || defaultTitle(username)
  const canEdit = Boolean(showEdit && onCollectionNameSave)

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  function openEdit() {
    setDraft(collectionName?.trim() ?? '')
    setSaveError(null)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setSaveError(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!onCollectionNameSave) return
    setSaving(true)
    setSaveError(null)
    try {
      const t = draft.trim()
      await onCollectionNameSave(t === '' ? null : t)
      setEditing(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col items-start gap-3 text-sm md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          {editing && canEdit ? (
            <form onSubmit={handleSave} className="space-y-2">
              <label className="block text-xs font-medium text-slate-600">
                Collection name
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={200}
                  placeholder="Optional custom name"
                  className="mt-1 block w-full min-w-[12rem] max-w-md rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </label>
              <p className="text-[10px] text-slate-400">
                Leave empty to use &quot;{defaultTitle(username)}&quot;
              </p>
              {saveError ? <p className="text-xs text-rose-600">{saveError}</p> : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full border border-emerald-500 bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-lg font-semibold tracking-wide text-slate-900">{displayTitle}</h1>
                {canEdit ? (
                  <button
                    type="button"
                    onClick={openEdit}
                    className="text-xs text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
                  >
                    edit
                  </button>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-slate-500">@{username}</p>
            </div>
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-4 md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to={shelfTo} className="text-slate-600 hover:text-emerald-600 hover:underline">
              Shelf
            </Link>
            <span>/</span>
            <span className="font-semibold text-emerald-600 underline">Gallery</span>
          </div>
          <p className="text-xs text-slate-400 md:ml-4">
            {count} vinyl{count === 1 ? '' : 's'}
          </p>
        </div>
      </div>
    </section>
  )
}
