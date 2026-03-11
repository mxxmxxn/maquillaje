import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Admin from '@/pages/Admin'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import { useAuth } from '@/hooks/useAuth'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <main className="grid min-h-screen place-items-center">Cargando panel de administracion...</main>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={(
            <RequireAuth>
              <Admin />
            </RequireAuth>
          )}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
