import { NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

const navInactive =
  'text-slate-700 transition hover:text-emerald-600 hover:underline'
const navActive = 'text-emerald-600 underline'

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${navInactive} ${navActive}` : navInactive
}

export function SiteHeader() {
  const { user, loading, logout } = useAuth()

  return (
    <header className="mb-6 flex w-full items-stretch gap-6">
      <div className="flex w-[220px] items-center justify-start">
        <img
          src="/imgs/VinylWorldLogo_LG.png"
          alt="Vinyl World logo"
          className="h-32 w-auto drop-shadow-[0_10px_24px_rgba(0,0,0,0.7)]"
        />
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-between gap-6 rounded-2xl border border-slate-200 border-t-emerald-100 bg-white bg-gradient-to-br from-white via-white to-emerald-50/40 px-6 py-4 shadow-sm shadow-slate-200/80 ring-1 ring-emerald-900/[0.04]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="h-9 w-1 shrink-0 self-center rounded-full bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_0_14px_rgba(16,185,129,0.35)] sm:h-10"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium italic leading-snug tracking-wide text-transparent sm:text-base sm:leading-relaxed">
              <span className="bg-gradient-to-r from-emerald-800 to-teal-600 bg-clip-text drop-shadow-sm">
                {'\u201C'}
                Music on vinyl is meant to be experienced, not just heard.
                {'\u201D'}
              </span>
            </p>
            <p className="mt-1 text-[10px] font-normal not-italic tracking-normal text-slate-500 sm:text-xs">
              {'\u2014'} Anonymous
            </p>
          </div>
        </div>
        <nav className="flex shrink-0 flex-wrap items-center gap-6 text-sm sm:gap-8">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/collection" className={navClass}>
            My Collection
          </NavLink>
          <NavLink
            to="/trade"
            className={({ isActive }) =>
              `${navInactive} text-center leading-snug ${isActive ? navActive : ''}`
            }
          >
            <span className="block">Trade</span>
            <span className="-mt-1 block">Center</span>
          </NavLink>
          {!loading && !user ? (
            <NavLink
              to="/sign-in"
              className="rounded-full border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Sign in
            </NavLink>
          ) : null}

          {!loading && user ? (
            <div className="flex items-center">
              <div className="text-right leading-tight">
                <NavLink
                  to={`/u/${encodeURIComponent(user.username)}`}
                  className={({ isActive }) =>
                    `block text-slate-800 hover:text-emerald-600 hover:underline ${isActive ? 'text-emerald-600 underline' : ''}`
                  }
                >
                  <span className="block text-sm font-semibold">
                    {user.username}
                  </span>
                </NavLink>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="mt-1 text-[11px] text-slate-400 hover:text-emerald-600 hover:underline"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
