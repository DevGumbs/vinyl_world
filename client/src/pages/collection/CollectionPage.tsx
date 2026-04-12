import { CollectionPageHeader } from '../../components/collection/CollectionPageHeader'
import { GalleryStrip } from '../../components/collection/GalleryStrip'
import { SpotlightSection } from '../../components/collection/SpotlightSection'

export default function CollectionPage() {
  return (
    <main className="flex-1 space-y-6">
      <CollectionPageHeader />
      <GalleryStrip />
      <SpotlightSection />
    </main>
  )
}
