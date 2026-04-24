import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { CollectionDetailsSection } from '../../components/dashboard/CollectionDetailsSection'
import { CollectionStats } from '../../components/dashboard/CollectionStats'
import { ManagementPanel } from '../../components/dashboard/ManagementPanel'
import { ProfileBanner } from '../../components/dashboard/ProfileBanner'
import { api } from '../../lib/api'

type UserRecordStats = {
  totalRecords: number
  mostCollectedArtist: string | null
  mostCollectedGenre: string | null
  mostCollectedEra: string | null
  collectionSpan: { minYear: number; maxYear: number } | null
  mostRecentAddition:
    | { albumTitle: string; artistName: string; year: number; createdAt: string }
    | null
  uniqueArtists: number
  distinctGenres: number
  recordsForTrade: number
}

export default function UserPage() {
  const { username } = useParams()
  const { user, loading } = useAuth()

  const handle = (username ?? '').trim()
  if (!handle) return <Navigate to="/" replace />

  const isMe = Boolean(user) && user?.username === handle
  const [stats, setStats] = useState<UserRecordStats | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setStats(null)
    setStatsError(null)
    api<UserRecordStats>(`/api/records/user/${encodeURIComponent(handle)}/stats`)
      .then((s) => {
        if (!cancelled) setStats(s)
      })
      .catch((e) => {
        if (!cancelled) setStatsError(e instanceof Error ? e.message : 'Failed to load stats')
      })
    return () => {
      cancelled = true
    }
  }, [handle])

  const statItems = useMemo(() => {
    const total = stats?.totalRecords ?? 0
    const span =
      stats?.collectionSpan && total > 0
        ? `${stats.collectionSpan.minYear} - ${stats.collectionSpan.maxYear}`
        : 'N/A'
    const mostRecent =
      stats?.mostRecentAddition && total > 0
        ? `${stats.mostRecentAddition.albumTitle} - ${stats.mostRecentAddition.artistName}`
        : 'N/A'

    return [
      { label: 'Total Records:', value: String(total) },
      { label: 'Most Collected Artist:', value: stats?.mostCollectedArtist ?? 'N/A' },
      { label: 'Most Collected Genre:', value: stats?.mostCollectedGenre ?? 'N/A' },
      { label: 'Estimated Collection Value:', value: 'N/A' },
      { label: 'Most Active Era:', value: stats?.mostCollectedEra ?? 'N/A' },
      { label: 'Collection Spans:', value: span },
      { label: 'Most Recent Addition:', value: mostRecent },
      { label: 'Records Marked for Trade:', value: String(stats?.recordsForTrade ?? 0) },
      { label: 'Unique Artists Collected:', value: String(stats?.uniqueArtists ?? 0) },
      { label: 'Different Genres Collected:', value: String(stats?.distinctGenres ?? 0) },
    ]
  }, [stats])

  return (
    <main className="flex-1 space-y-6">
      <ProfileBanner username={handle} />
      {statsError ? <p className="text-center text-sm text-rose-600">{statsError}</p> : null}
      <CollectionStats stats={statItems} />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)]">
        <CollectionDetailsSection username={handle} isMe={isMe} />
        {!loading && isMe ? <ManagementPanel /> : null}
      </section>
    </main>
  )
}

