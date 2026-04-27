import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

type PublicUserRow = {
  city: string
  state: string
}

export function ProfileBanner({ username }: { username: string }) {
  const [location, setLocation] = useState<PublicUserRow | null>(null)
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    let cancelled = false
    setFetched(false)
    setLocation(null)
    api<{ city: string; state: string }>(
      `/api/users/${encodeURIComponent(username)}/collection`
    )
      .then((d) => {
        if (!cancelled) setLocation({ city: d.city, state: d.state })
      })
      .catch(() => {
        if (!cancelled) setLocation(null)
      })
      .finally(() => {
        if (!cancelled) setFetched(true)
      })
    return () => {
      cancelled = true
    }
  }, [username])

  const locationLine = (() => {
    if (!fetched) return '…'
    if (!location) return '—'
    const city = location.city
    const st = location.state
    if (city && st) return `${city}, ${st}`
    if (city) return city
    if (st) return st
    return '—'
  })()

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-1 text-sm">
        <span className="text-lg font-semibold">{username}</span>
        <p className="text-xs text-slate-500">({locationLine})</p>
      </div>
    </section>
  )
}
