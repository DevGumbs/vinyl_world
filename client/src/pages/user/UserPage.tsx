import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { CollectionDetailsSection } from '../../components/dashboard/CollectionDetailsSection'
import { CollectionStats } from '../../components/dashboard/CollectionStats'
import { ManagementPanel } from '../../components/dashboard/ManagementPanel'
import { ProfileBanner } from '../../components/dashboard/ProfileBanner'

export default function UserPage() {
  const { username } = useParams()
  const { user, loading } = useAuth()

  const handle = (username ?? '').trim()
  if (!handle) return <Navigate to="/" replace />

  const isMe = Boolean(user) && user?.username === handle

  return (
    <main className="flex-1 space-y-6">
      <ProfileBanner username={handle} />
      <CollectionStats
        stats={[
          { label: 'Total Records:', value: '0' },
          { label: 'Most Collected Artist:', value: 'N/A' },
          { label: 'Most Collected Genre:', value: 'N/A' },
          { label: 'Estimated Collection Value:', value: 'N/A' },
          { label: 'Most Active Era:', value: 'N/A' },
          { label: 'Collection Spans:', value: 'N/A' },
          { label: 'Most Recent Addition:', value: 'N/A' },
          { label: 'Records Marked for Trade:', value: '0' },
          { label: 'Unique Artists Collected:', value: '0' },
          { label: 'Different Genres Collected:', value: '0' },
        ]}
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)]">
        <CollectionDetailsSection username={handle} isMe={isMe} />
        {!loading && isMe ? <ManagementPanel /> : null}
      </section>
    </main>
  )
}

