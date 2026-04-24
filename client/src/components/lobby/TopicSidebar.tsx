import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { NewPostModal } from './NewPostModal'
import { api } from '../../lib/api'

type TopicNode = {
  id: string
  name: string
  count: number
  children: TopicNode[]
}

function TopicRow({
  label,
  count,
  onClick,
  labelRight,
  active,
}: {
  label: string
  count: number
  onClick?: () => void
  labelRight?: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between text-left transition hover:text-emerald-600 hover:underline ${active ? 'font-semibold text-emerald-600 underline' : 'text-slate-700'}`}
    >
      <span className="inline-flex min-w-0 items-center gap-1 truncate">
        <span className="truncate">{label}</span>
        {labelRight ? <span className="text-xs">{labelRight}</span> : null}
      </span>
      <span className="ml-3 flex shrink-0 items-center gap-2">
        <span className="text-xs text-slate-400">({count})</span>
      </span>
    </button>
  )
}

export function TopicSidebar({
  onPostCreated,
  selectedTopicName,
  onSelectTopicName,
}: {
  onPostCreated?: () => void
  selectedTopicName: string | null
  onSelectTopicName: (name: string | null) => void
}) {
  const { user, loading } = useAuth()
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [expandedGenres, setExpandedGenres] = useState(false)
  const [topics, setTopics] = useState<TopicNode[]>([])
  const [topicsLoading, setTopicsLoading] = useState(true)

  async function loadTopics() {
    setTopicsLoading(true)
    try {
      const res = await api<{ topics: TopicNode[] }>('/api/topics/summary')
      setTopics(res.topics)
    } finally {
      setTopicsLoading(false)
    }
  }

  useEffect(() => {
    void loadTopics()
  }, [])

  const genreNode = useMemo(
    () => topics.find((t) => t.name.toLowerCase() === 'genres') ?? null,
    [topics]
  )

  const nonGenreTopics = useMemo(
    () => topics.filter((t) => t.id !== genreNode?.id),
    [topics, genreNode?.id]
  )

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm md:self-start">
      <h2 className="mb-3 border-b border-slate-200 pb-2 text-center text-base font-semibold tracking-wide text-slate-900">
        Topics
      </h2>
      {topicsLoading ? (
        <p className="text-center text-xs text-slate-400">Loading…</p>
      ) : (
        <ul className="space-y-2">
          <li>
            <TopicRow
              label="All"
              count={topics.reduce((sum, t) => sum + (t.count ?? 0), 0)}
              onClick={() => onSelectTopicName(null)}
              active={selectedTopicName === null}
            />
          </li>
          {nonGenreTopics.map((t) => (
            <li key={t.id}>
              <TopicRow
                label={t.name}
                count={t.count}
                onClick={() => onSelectTopicName(t.name)}
                active={selectedTopicName === t.name}
              />
            </li>
          ))}

          {genreNode ? (
            <li>
              <TopicRow
                label={genreNode.name}
                count={genreNode.count}
                onClick={() => setExpandedGenres((v) => !v)}
                labelRight={expandedGenres ? '△' : '▽'}
                active={selectedTopicName === genreNode.name}
              />
              {expandedGenres ? (
                <ul className="mt-2 space-y-2 pl-4">
                  {genreNode.children.map((c) => (
                    <li key={c.id}>
                      <TopicRow
                        label={c.name}
                        count={c.count}
                        onClick={() => onSelectTopicName(c.name)}
                        active={selectedTopicName === c.name}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ) : null}
        </ul>
      )}

      <div className="mt-6 flex flex-col items-stretch justify-center gap-2">
        {!loading && user ? (
          <>
            <button
              type="button"
              onClick={() => setNewPostOpen(true)}
              className="w-full rounded-full border border-emerald-500 bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
            >
              + New Post
            </button>
            <NewPostModal
              open={newPostOpen}
              onClose={() => setNewPostOpen(false)}
              onCreated={() => {
                void loadTopics()
                onPostCreated?.()
              }}
            />
          </>
        ) : null}
        {!loading && !user ? (
          <p className="text-center text-xs text-slate-500">
            <Link to="/sign-in" className="font-semibold text-emerald-600 underline">
              Sign in
            </Link>{' '}
            to start a new post
          </p>
        ) : null}
      </div>
    </aside>
  )
}
