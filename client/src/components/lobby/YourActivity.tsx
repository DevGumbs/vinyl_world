import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

export function YourActivity() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="mb-2 text-center text-base font-semibold">Your Activity</h2>
        <p className="text-center text-xs text-slate-400">Loading…</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="mb-2 text-center text-base font-semibold">Your Activity</h2>
        <p className="text-center text-sm text-slate-600">
          <Link to="/sign-in" className="font-semibold text-emerald-600 underline">
            Sign in
          </Link>{' '}
          to see notifications and updates here.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="mb-2 text-center text-base font-semibold">Your Activity</h2>
      <p className="text-center text-sm text-slate-500">
        Get active — join a discussion, add a record, or list something for trade.
      </p>
    </section>
  )
}
