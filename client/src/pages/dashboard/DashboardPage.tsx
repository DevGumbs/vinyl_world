import { CollectionDetailsSection } from '../../components/dashboard/CollectionDetailsSection'
import { CollectionStats } from '../../components/dashboard/CollectionStats'
import { ManagementPanel } from '../../components/dashboard/ManagementPanel'
import { ProfileBanner } from '../../components/dashboard/ProfileBanner'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  if (!loading && !user) return <Navigate to="/sign-in" replace />
  if (!loading && user) return <Navigate to={`/u/${encodeURIComponent(user.username)}`} replace />

  return (
    <main className="flex-1 space-y-6">
      <ProfileBanner username="Loading…" />
      <CollectionStats />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)]">
        <CollectionDetailsSection username="Loading…" isMe={true} />
        <ManagementPanel />
      </section>
    </main>
  )
}
