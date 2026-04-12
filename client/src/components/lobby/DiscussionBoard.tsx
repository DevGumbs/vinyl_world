import { DiscussionPost } from './DiscussionPost'

const POSTS = [
  { userLabel: 'User2', title: 'Post Title', meta: 'Topic • Time Posted • # of comments' },
  { userLabel: 'User7', title: 'Post Title', meta: 'Topic • Time Posted • # of comments' },
  { userLabel: 'User4', title: 'Post Title', meta: 'Topic • Time Posted • # of comments' },
  { userLabel: 'User9', title: 'Post Title', meta: 'Topic • Time Posted • # of comments' },
]

export function DiscussionBoard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-center text-base font-semibold tracking-wide text-slate-900">
        Discussion Board
      </h2>

      <div className="space-y-3 text-sm">
        {POSTS.map((p) => (
          <DiscussionPost key={p.userLabel} {...p} />
        ))}
      </div>
    </div>
  )
}
