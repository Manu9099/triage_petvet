import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, name, password)
      }
      navigate('/')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? 'Error al ingresar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
               style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
            <span className="text-2xl">🐾</span>
          </div>
          <h1 className="text-3xl font-light italic" style={{ fontFamily: 'Fraunces, serif', color: 'var(--accent)' }}>
            PetVet AI
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Diagnóstico inteligente para tu mascota
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl p-1 mb-6" style={{ background: 'var(--surface)' }}>
          {(['login', 'register'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#0F1A14' : 'var(--muted)',
              }}>
              {m === 'login' ? 'Ingresar' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Nombre completo</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                placeholder="Tu nombre"
              />
            </div>
          )}
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm mt-2 transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)', color: '#0F1A14' }}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
