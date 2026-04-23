import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import DashboardPage from './pages/dashboard/DashboardPage'
import CollectionPage from './pages/collection/CollectionPage'
import UserCollectionPage from './pages/collection/UserCollectionPage'
import LobbyPage from './pages/index/LobbyPage'
import ShelfPage from './pages/shelf/ShelfPage'
import TradePage from './pages/trade/TradePage'
import SignInPage from './pages/auth/SignInPage'
import SignUpPage from './pages/auth/SignUpPage'
import UserPage from './pages/user/UserPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<LobbyPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="collection" element={<CollectionPage />} />
            <Route path="collection/:username" element={<UserCollectionPage />} />
            <Route path="shelf" element={<ShelfPage />} />
            <Route path="trade" element={<TradePage />} />
            <Route path="u/:username" element={<UserPage />} />
            <Route path="sign-in" element={<SignInPage />} />
            <Route path="sign-up" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
