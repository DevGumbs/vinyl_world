import { Outlet } from 'react-router-dom'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function AppShell() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  )
}
