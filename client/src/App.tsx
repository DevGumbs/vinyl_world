import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import DashboardPage from './pages/dashboard/DashboardPage'
import CollectionPage from './pages/collection/CollectionPage'
import LobbyPage from './pages/index/LobbyPage'
import ShelfPage from './pages/shelf/ShelfPage'
import TradePage from './pages/trade/TradePage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<LobbyPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="collection" element={<CollectionPage />} />
            <Route path="shelf" element={<ShelfPage />} />
            <Route path="trade" element={<TradePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
