import { useState } from 'react'
import { emitActivityRefresh } from '../../lib/activityRefresh'
import { DiscussionBoard } from '../../components/lobby/DiscussionBoard'
import { DiscoverEngage } from '../../components/lobby/DiscoverEngage'
import { MyCollectionPreview } from '../../components/lobby/MyCollectionPreview'
import { TopicSidebar } from '../../components/lobby/TopicSidebar'
import { TrendingTopics } from '../../components/lobby/TrendingTopics'
import { YourActivity } from '../../components/lobby/YourActivity'

export default function LobbyPage() {
  const [postsRefreshToken, setPostsRefreshToken] = useState(0)
  const [selectedTopicName, setSelectedTopicName] = useState<string | null>(null)

  return (
    <main className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[220px_minmax(0,1fr)_260px]">
      <TopicSidebar
        onPostCreated={() => {
          setPostsRefreshToken((v) => v + 1)
          emitActivityRefresh()
        }}
        selectedTopicName={selectedTopicName}
        onSelectTopicName={setSelectedTopicName}
      />

      <section className="flex flex-col gap-4">
        <DiscussionBoard refreshToken={postsRefreshToken} topicNameFilter={selectedTopicName} />
        <DiscoverEngage />
      </section>

      <aside className="flex flex-col gap-4 text-sm md:rounded-2xl md:border-0 md:bg-transparent md:p-0">
        <MyCollectionPreview />
        <YourActivity />
        <TrendingTopics />
      </aside>
    </main>
  )
}
