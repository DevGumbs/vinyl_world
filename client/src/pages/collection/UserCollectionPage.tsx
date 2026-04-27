import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { CollectionPageHeader } from '../../components/collection/CollectionPageHeader'
import { GalleryStrip } from '../../components/collection/GalleryStrip'
import { SpotlightSection } from '../../components/collection/SpotlightSection'
import { ShelfScene } from '../../components/shelf/ShelfScene'
import { ShelfViewHeader } from '../../components/shelf/ShelfViewHeader'
import type { RecordRow } from '../../records/recordTypes'
import { useAuth } from '../../auth/AuthProvider'

type ShelfMode = 'vintage' | 'modern' | 'retro'

const BG: Record<ShelfMode, string> = {
  vintage: '/imgs/vintageBG.png',
  modern: '/imgs/modernBG.png',
  retro: '/imgs/retroBG.png',
}

export default function UserCollectionPage() {
  const { username } = useParams()
  const { user, loading: authLoading, refresh: refreshAuth } = useAuth()
  const [records, setRecords] = useState<RecordRow[]>([])
  const [collectionMeta, setCollectionMeta] = useState<{
    collectionName: string | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const owner = useMemo(() => (username ? String(username) : ''), [username])
  const view = useMemo(() => (searchParams.get('view') === 'shelf' ? 'shelf' : 'gallery'), [searchParams])
  const mode = useMemo((): ShelfMode => {
    const bg = searchParams.get('bg')
    return bg === 'modern' || bg === 'retro' ? bg : 'vintage'
  }, [searchParams])

  function setMode(next: ShelfMode) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set('bg', next)
      p.set('view', 'shelf')
      return p
    })
  }

  const isMe = !authLoading && Boolean(user) && user?.username === owner

  const loadCollectionMeta = useCallback(() => {
    if (!owner) return Promise.resolve()
    return api<{ collectionName: string | null }>(
      `/api/users/${encodeURIComponent(owner)}/collection`
    )
      .then((d) => setCollectionMeta({ collectionName: d.collectionName }))
      .catch(() => setCollectionMeta({ collectionName: null }))
  }, [owner])

  useEffect(() => {
    void loadCollectionMeta()
  }, [loadCollectionMeta])

  useEffect(() => {
    if (!owner) return
    let cancelled = false
    setLoading(true)
    setError(null)
    api<RecordRow[]>(`/api/records/user/${encodeURIComponent(owner)}`)
      .then((rows) => {
        if (cancelled) return
        setRecords(rows)
        setSelectedId(rows[0]?.id ?? null)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load collection')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [owner])

  const selected = useMemo(
    () => records.find((r) => r.id === selectedId) ?? null,
    [records, selectedId]
  )

  return (
    <main className="flex-1 space-y-6">
      {view === 'shelf' ? (
        <div>
          <ShelfViewHeader mode={mode} onModeChange={setMode} galleryTo={`/collection/${encodeURIComponent(owner)}`} />
        </div>
      ) : (
        <CollectionPageHeader
          username={owner}
          collectionName={collectionMeta?.collectionName ?? null}
          count={records.length}
          showEdit={isMe}
          onCollectionNameSave={
            isMe
              ? async (name) => {
                  await api('/auth/collection-name', {
                    method: 'PATCH',
                    body: JSON.stringify({ collectionName: name }),
                  })
                  await refreshAuth()
                  await loadCollectionMeta()
                }
              : undefined
          }
          shelfTo={`/collection/${encodeURIComponent(owner)}?view=shelf&bg=${encodeURIComponent(mode)}`}
        />
      )}

      {error ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <p className="text-sm text-rose-600">{error}</p>
        </section>
      ) : loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <p className="text-sm text-slate-500">Loading records…</p>
        </section>
      ) : records.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <p className="text-sm text-slate-500">No records yet.</p>
        </section>
      ) : view === 'shelf' ? (
        <ShelfScene backgroundImage={BG[mode]} records={records.slice(0, 12)} />
      ) : (
        <>
          <GalleryStrip records={records} selectedId={selectedId} onSelect={(id) => setSelectedId(id)} />
          {selected ? <SpotlightSection record={selected} /> : null}
        </>
      )}
    </main>
  )
}

