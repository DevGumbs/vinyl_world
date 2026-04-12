import { CollectionDetailsSection } from '../../components/dashboard/CollectionDetailsSection'
import { CollectionStats } from '../../components/dashboard/CollectionStats'
import { ManagementPanel } from '../../components/dashboard/ManagementPanel'
import { ProfileBanner } from '../../components/dashboard/ProfileBanner'

export default function DashboardPage() {
  return (
    <main className="flex-1 space-y-6">
      <ProfileBanner />
      <CollectionStats />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)]">
        <CollectionDetailsSection />
        <ManagementPanel />
      </section>
    </main>
  )
}
