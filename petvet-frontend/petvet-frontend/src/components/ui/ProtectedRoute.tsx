import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <span className="text-3xl">🐾</span>
        <p className="text-sm mt-3" style={{ color: 'var(--muted)' }}>Cargando...</p>
      </div>
    </div>
  )

  return user ? <>{children}</> : <Navigate to="/login" replace />
}
