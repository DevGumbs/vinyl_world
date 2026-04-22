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

      <div className="flex flex-1 flex-wrap items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm shadow-slate-200">
        <div className="flex flex-1 justify-start">
          <div className="flex w-full max-w-xl items-center gap-2">
            <input
              type="search"
              placeholder="Search records, posts, or users"
              className="h-10 w-full rounded-full border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="button"
              className="h-10 shrink-0 rounded-full border border-emerald-500 bg-emerald-500 px-6 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Search
            </button>
          </div>
        </div>

        <nav className="ml-6 flex items-center gap-8 text-sm">
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
                  to="/dashboard"
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
