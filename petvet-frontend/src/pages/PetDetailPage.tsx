import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Stethoscope, ChevronRight } from 'lucide-react'
import { petsApi, diagnosesApi } from '../api/resources'
import type { DiagnosisSummary, Pet } from '../types'
import { SPECIES_EMOJI, SPECIES_LABEL } from '../components/pets/speciesConfig'
import UrgencyBadge from '../components/ui/UrgencyBadge'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: pet, isLoading: petLoading } = useQuery<Pet>({
    queryKey: ['pets', id],
    queryFn: () => petsApi.get(id!).then((r) => r.data),
    enabled: !!id,
  })

  const { data: diagnoses = [] } = useQuery<DiagnosisSummary[]>({
    queryKey: ['diagnoses', 'pet', id],
    queryFn: () => diagnosesApi.byPet(id!).then((r) => r.data),
    enabled: !!id,
  })

  if (petLoading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-32 rounded-lg" style={{ background: 'var(--surface)' }} />
      <div className="h-32 rounded-2xl" style={{ background: 'var(--surface)' }} />
    </div>
  )

  if (!pet) return <p style={{ color: 'var(--muted)' }}>Mascota no encontrada</p>

  return (
    <div className="fade-in space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={16} /> Volver
      </button>

      {/* Pet card */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
               style={{ background: 'var(--surface2)' }}>
            {SPECIES_EMOJI[pet.species]}
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>{pet.name}</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {SPECIES_LABEL[pet.species]}{pet.breed ? ` · ${pet.breed}` : ''}
            </p>
          </div>
        </div>

        {(pet.age_years || pet.weight_kg) && (
          <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            {pet.age_years && (
              <div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Edad</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{pet.age_years} años</p>
              </div>
            )}
            {pet.weight_kg && (
              <div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Peso</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{pet.weight_kg} kg</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diagnose CTA */}
      <button onClick={() => navigate('/diagnose', { state: { petId: pet.id } })}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl"
        style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}>
        <div className="flex items-center gap-3">
          <Stethoscope size={18} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            Nuevo diagnóstico para {pet.name}
          </span>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--accent)' }} />
      </button>

      {/* History */}
      <div>
        <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
          Historial de diagnósticos
        </h2>
        {diagnoses.length === 0 ? (
          <p className="text-sm py-4" style={{ color: 'var(--muted)' }}>
            Sin diagnósticos aún.
          </p>
        ) : (
          <div className="space-y-2">
            {diagnoses.map((d) => (
              <button key={d.id} onClick={() => navigate(`/diagnoses/${d.id}`)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{d.probable_disease}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {new Date(d.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <UrgencyBadge level={d.urgency_level} size="sm" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
