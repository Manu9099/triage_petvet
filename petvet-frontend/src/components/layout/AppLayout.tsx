import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, PlusCircle, Stethoscope, LayoutDashboard, Menu, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { petsApi } from '../../api/resources'
import type { Pet } from '../../types'
import { SPECIES_EMOJI } from '../pets/speciesConfig'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: pets = [] } = useQuery<Pet[]>({
    queryKey: ['pets'],
    queryFn: () => petsApi.list().then((r) => r.data),
  })

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🐾</span>
          <span className="text-lg font-light italic" style={{ fontFamily: 'Fraunces, serif', color: 'var(--accent)' }}>
            PetVet AI
          </span>
        </div>
        <p className="text-xs mt-1 truncate" style={{ color: 'var(--muted)' }}>{user?.full_name}</p>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 space-y-1">
        <NavLink to="/" end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? 'font-medium' : ''}`
          }
          style={({ isActive }) => ({
            background: isActive ? 'var(--accent-dim)' : 'transparent',
            color: isActive ? 'var(--accent)' : 'var(--muted)',
          })}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/diagnose"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? 'font-medium' : ''}`
          }
          style={({ isActive }) => ({
            background: isActive ? 'var(--accent-dim)' : 'transparent',
            color: isActive ? 'var(--accent)' : 'var(--muted)',
          })}>
          <Stethoscope size={16} /> Nuevo diagnóstico
        </NavLink>
      </nav>

      {/* Pets list */}
      <div className="px-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Mis mascotas
          </span>
          <button onClick={() => navigate('/pets/new')}
            style={{ color: 'var(--accent)' }}>
            <PlusCircle size={15} />
          </button>
        </div>
        {pets.length === 0 ? (
          <p className="text-xs px-3 py-2" style={{ color: 'var(--muted)' }}>
            Agrega tu primera mascota →
          </p>
        ) : (
          <div className="space-y-1">
            {pets.map((pet) => (
              <NavLink key={pet.id} to={`/pets/${pet.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${isActive ? 'font-medium' : ''}`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'var(--surface2)' : 'transparent',
                  color: isActive ? 'var(--text)' : 'var(--muted)',
                })}>
                <span>{SPECIES_EMOJI[pet.species]}</span>
                <span className="truncate">{pet.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{ color: 'var(--muted)' }}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 flex-col flex-shrink-0"
             style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <SidebarContent />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 z-50"
                 style={{ background: 'var(--surface)' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b"
             style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: 'var(--muted)' }}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-light italic" style={{ fontFamily: 'Fraunces, serif', color: 'var(--accent)' }}>
            PetVet AI
          </span>
        </div>
        <div className="p-4 md:p-8 max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
