import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Stethoscope, ChevronRight } from 'lucide-react'
import { petsApi } from '../api/resources'
import type { Pet } from '../types'
import { SPECIES_EMOJI, SPECIES_LABEL } from '../components/pets/speciesConfig'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: pets = [], isLoading } = useQuery<Pet[]>({
    queryKey: ['pets'],
    queryFn: () => petsApi.list().then((r) => r.data),
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{greeting}</p>
        <h1 className="text-2xl font-semibold mt-0.5" style={{ color: 'var(--text)' }}>
          {user?.full_name?.split(' ')[0]}
        </h1>
      </div>

      {/* Quick action */}
      <button onClick={() => navigate('/diagnose')}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-opacity hover:opacity-90"
        style={{ background: 'var(--accent)', color: '#0F1A14' }}>
        <div className="flex items-center gap-3">
          <Stethoscope size={20} />
          <div className="text-left">
            <p className="font-semibold text-sm">Nuevo diagnóstico</p>
            <p className="text-xs opacity-70">Analiza los síntomas con IA</p>
          </div>
        </div>
        <ChevronRight size={18} />
      </button>

      {/* Pets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Mis mascotas</h2>
          <button onClick={() => navigate('/pets/new')}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: 'var(--accent)' }}>
            <PlusCircle size={15} /> Agregar
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2].map((i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'var(--surface)' }} />
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-14 rounded-2xl" style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
            <p className="text-3xl mb-3">🐾</p>
            <p className="font-medium" style={{ color: 'var(--text)' }}>Aún no tienes mascotas</p>
            <p className="text-sm mt-1 mb-4" style={{ color: 'var(--muted)' }}>Agrega una para comenzar</p>
            <button onClick={() => navigate('/pets/new')}
              className="px-5 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'var(--accent)', color: '#0F1A14' }}>
              Agregar mascota
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {pets.map((pet) => (
              <button key={pet.id} onClick={() => navigate(`/pets/${pet.id}`)}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all hover:border-opacity-100"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                     style={{ background: 'var(--surface2)' }}>
                  {SPECIES_EMOJI[pet.species]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: 'var(--text)' }}>{pet.name}</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    {SPECIES_LABEL[pet.species]}{pet.breed ? ` · ${pet.breed}` : ''}
                  </p>
                  {pet.age_years && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{pet.age_years} años</p>
                  )}
                </div>
                <ChevronRight size={16} className="ml-auto flex-shrink-0" style={{ color: 'var(--border)' }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
