import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, ArrowRight, Loader2, Search } from 'lucide-react'
import { petsApi, symptomsApi, diagnosesApi } from '../api/resources'
import type { DiagnosisOut, Pet, Symptom } from '../types'
import { SPECIES_EMOJI, SPECIES_LABEL } from '../components/pets/speciesConfig'
import UrgencyBadge from '../components/ui/UrgencyBadge'

type Step = 'select-pet' | 'select-symptoms' | 'result'

export default function DiagnosePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const preselectedPetId = location.state?.petId as string | undefined

  const [step, setStep] = useState<Step>(preselectedPetId ? 'select-symptoms' : 'select-pet')
  const [selectedPetId, setSelectedPetId] = useState<string>(preselectedPetId ?? '')
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<number[]>([])
  const [notes, setNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [result, setResult] = useState<DiagnosisOut | null>(null)

  const { data: pets = [] } = useQuery<Pet[]>({
    queryKey: ['pets'],
    queryFn: () => petsApi.list().then((r) => r.data),
  })

  const selectedPet = pets.find((p) => p.id === selectedPetId)

  const { data: symptoms = [] } = useQuery<Symptom[]>({
    queryKey: ['symptoms', selectedPet?.species],
    queryFn: () => symptomsApi.list(selectedPet?.species).then((r) => r.data),
    enabled: !!selectedPet,
  })

  const filteredSymptoms = searchQuery
    ? symptoms.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : symptoms

  const toggleSymptom = (id: number) =>
    setSelectedSymptomIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const diagnoseMutation = useMutation({
    mutationFn: () =>
      diagnosesApi.create({ pet_id: selectedPetId, symptom_ids: selectedSymptomIds, additional_notes: notes || undefined }),
    onSuccess: ({ data }) => {
      setResult(data)
      setStep('result')
    },
    onError: (e: any) => toast.error(e?.response?.data?.detail ?? 'Error al consultar IA'),
  })

  // ── STEP 1: Select pet ─────────────────────────────────────────────────────
  if (step === 'select-pet') return (
    <div className="fade-in max-w-lg">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6"
              style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={16} /> Volver
      </button>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>Nuevo diagnóstico</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>¿Para cuál mascota?</p>

      {pets.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
          <p className="text-3xl mb-2">🐾</p>
          <p className="font-medium mb-3" style={{ color: 'var(--text)' }}>Primero agrega una mascota</p>
          <button onClick={() => navigate('/pets/new')}
            className="px-5 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'var(--accent)', color: '#0F1A14' }}>
            Agregar mascota
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {pets.map((pet) => (
            <button key={pet.id}
              onClick={() => { setSelectedPetId(pet.id); setStep('select-symptoms') }}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                   style={{ background: 'var(--surface2)' }}>
                {SPECIES_EMOJI[pet.species]}
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>{pet.name}</p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {SPECIES_LABEL[pet.species]}{pet.breed ? ` · ${pet.breed}` : ''}
                </p>
              </div>
              <ArrowRight size={16} className="ml-auto" style={{ color: 'var(--border)' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )

  // ── STEP 2: Select symptoms ────────────────────────────────────────────────
  if (step === 'select-symptoms') return (
    <div className="fade-in max-w-lg">
      <button onClick={() => setStep('select-pet')} className="flex items-center gap-2 text-sm mb-6"
              style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={16} /> Cambiar mascota
      </button>

      {/* Pet header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
             style={{ background: 'var(--surface2)' }}>
          {selectedPet && SPECIES_EMOJI[selectedPet.species]}
        </div>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            Síntomas de {selectedPet?.name}
          </h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Selecciona los síntomas que observas
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          placeholder="Buscar síntoma..."
        />
      </div>

      {/* Symptoms grid */}
      <div className="grid gap-2 max-h-72 overflow-y-auto pr-1 mb-4">
        {filteredSymptoms.map((s) => {
          const selected = selectedSymptomIds.includes(s.id)
          return (
            <button key={s.id} onClick={() => toggleSymptom(s.id)}
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{
                background: selected ? 'var(--accent-dim)' : 'var(--surface)',
                border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
              }}>
              <div className="w-4 h-4 rounded mt-0.5 flex-shrink-0 flex items-center justify-center"
                   style={{
                     background: selected ? 'var(--accent)' : 'transparent',
                     border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                   }}>
                {selected && <span style={{ color: '#0F1A14', fontSize: 10, lineHeight: 1 }}>✓</span>}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: selected ? 'var(--accent)' : 'var(--text)' }}>
                  {s.name}
                </p>
                {s.description && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.description}</p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>
          Notas adicionales (opcional)
        </label>
        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          placeholder="Cuándo empezaron, comportamiento, etc."
        />
      </div>

      {/* Selected count + CTA */}
      {selectedSymptomIds.length > 0 && (
        <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
          {selectedSymptomIds.length} síntoma{selectedSymptomIds.length > 1 ? 's' : ''} seleccionado{selectedSymptomIds.length > 1 ? 's' : ''}
        </p>
      )}
      <button
        onClick={() => diagnoseMutation.mutate()}
        disabled={selectedSymptomIds.length === 0 || diagnoseMutation.isPending}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
        style={{ background: 'var(--accent)', color: '#0F1A14' }}>
        {diagnoseMutation.isPending ? (
          <><Loader2 size={16} className="animate-spin" /> Analizando con IA...</>
        ) : (
          'Obtener diagnóstico'
        )}
      </button>
    </div>
  )

  // ── STEP 3: Result ─────────────────────────────────────────────────────────
  if (step === 'result' && result) {
    let parsed: any = {}
    try { parsed = JSON.parse(result.ai_response) } catch { parsed = {} }

    return (
      <div className="fade-in max-w-lg space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Resultado del diagnóstico</h1>
          <UrgencyBadge level={result.urgency_level} size="sm" />
        </div>

        {/* Main diagnosis */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Diagnóstico probable</p>
            <p className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{result.probable_disease}</p>
          </div>

          {parsed.confidence && (
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Confianza</p>
              <p className="text-sm" style={{ color: 'var(--text)' }}>{parsed.confidence}</p>
            </div>
          )}

          {parsed.explanation && (
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Explicación</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{parsed.explanation}</p>
            </div>
          )}
        </div>

        {/* Recommendation */}
        <div className="rounded-2xl p-4" style={{
          background: result.urgency_level === 'high' ? '#3D0E08' : result.urgency_level === 'medium' ? '#3D2900' : 'var(--accent-dim)',
          border: `1px solid ${result.urgency_level === 'high' ? 'var(--danger)' : result.urgency_level === 'medium' ? 'var(--warn)' : 'var(--accent)'}`,
        }}>
          <p className="text-xs font-medium mb-1" style={{
            color: result.urgency_level === 'high' ? 'var(--danger)' : result.urgency_level === 'medium' ? 'var(--warn)' : 'var(--accent)',
          }}>Recomendación</p>
          <p className="text-sm" style={{ color: 'var(--text)' }}>{result.recommendation}</p>
        </div>

        {/* Differential */}
        {parsed.differential_diagnoses?.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Otros diagnósticos posibles</p>
            <div className="flex flex-wrap gap-2">
              {parsed.differential_diagnoses.map((d: string) => (
                <span key={d} className="px-3 py-1 rounded-full text-xs"
                      style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Warning signs */}
        {parsed.warning_signs?.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--warn)' }}>⚠ Señales de alarma a vigilar</p>
            <ul className="space-y-1">
              {parsed.warning_signs.map((w: string) => (
                <li key={w} className="text-sm flex items-start gap-2" style={{ color: 'var(--text)' }}>
                  <span style={{ color: 'var(--warn)' }}>·</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Symptoms used */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Síntomas analizados</p>
          <div className="flex flex-wrap gap-2">
            {result.symptoms.map((s) => (
              <span key={s.id} className="px-3 py-1 rounded-full text-xs"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs leading-relaxed rounded-xl p-3"
           style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          Este diagnóstico es orientativo y no reemplaza la consulta con un veterinario profesional.
          Modelo: {result.groq_model_used}
        </p>

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <button onClick={() => { setStep('select-symptoms'); setSelectedSymptomIds([]); setResult(null) }}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            Nuevo diagnóstico
          </button>
          <button onClick={() => navigate(`/pets/${result.pet_id}`)}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'var(--accent)', color: '#0F1A14' }}>
            Ver mascota
          </button>
        </div>
      </div>
    )
  }

  return null
}
