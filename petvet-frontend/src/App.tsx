import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ui/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import NewPetPage from './pages/NewPetPage'
import PetDetailPage from './pages/PetDetailPage'
import DiagnosePage from './pages/DiagnosePage'
import DiagnosisDetailPage from './pages/DiagnosisDetailPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="pets/new" element={<NewPetPage />} />
              <Route path="pets/:id" element={<PetDetailPage />} />
              <Route path="diagnose" element={<DiagnosePage />} />
              <Route path="diagnoses/:id" element={<DiagnosisDetailPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#2ECC71', secondary: '#0F1A14' } },
            error:   { iconTheme: { primary: '#E05C4B', secondary: '#0F1A14' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
