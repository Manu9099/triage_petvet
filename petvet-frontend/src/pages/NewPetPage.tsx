import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import { petsApi } from '../api/resources'
import type { PetCreate } from '../types'
import { ALL_SPECIES, SPECIES_EMOJI, SPECIES_LABEL } from '../components/pets/speciesConfig'

export default function NewPetPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState<PetCreate>({ name: '', species: 'dog' })

  const mutation = useMutation({
    mutationFn: (data: PetCreate) => petsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pets'] })
      toast.success('Mascota agregada')
      navigate('/')
    },
    onError: (e: any) => toast.error(e?.response?.data?.detail ?? 'Error al guardar'),
  })

  const set = (k: keyof PetCreate, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: PetCreate = {
      ...form,
      age_years: form.age_years ? Number(form.age_years) : undefined,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : undefined,
    }
    mutation.mutate(payload)
  }

  return (
    <div className="fade-in max-w-md">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6"
              style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={16} /> Volver
      </button>

      <h1 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>Nueva mascota</h1>

      <form onSubmit={submit} className="space-y-5">
        {/* Species */}
        <div>
          <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--muted)' }}>Especie</label>
          <div className="grid grid-cols-5 gap-2">
            {ALL_SPECIES.map((s) => (
              <button key={s} type="button" onClick={() => set('species', s)}
                className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: form.species === s ? 'var(--accent-dim)' : 'var(--surface)',
                  border: `1px solid ${form.species === s ? 'var(--accent)' : 'var(--border)'}`,
                  color: form.species === s ? 'var(--accent)' : 'var(--muted)',
                }}>
                <span className="text-xl">{SPECIES_EMOJI[s]}</span>
                {SPECIES_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>Nombre *</label>
          <input required value={form.name} onChange={(e) => set('name', e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            placeholder="¿Cómo se llama?"
          />
        </div>

        {/* Breed */}
        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>Raza</label>
          <input value={form.breed ?? ''} onChange={(e) => set('breed', e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            placeholder="Opcional"
          />
        </div>

        {/* Age + Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>Edad (años)</label>
            <input type="number" min={0} max={50} step={0.5}
              value={form.age_years ?? ''} onChange={(e) => set('age_years', e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="Ej: 3"
            />
          </div>
          <div>
            <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>Peso (kg)</label>
            <input type="number" min={0} max={500} step={0.1}
              value={form.weight_kg ?? ''} onChange={(e) => set('weight_kg', e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="Ej: 8.5"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>Notas adicionales</label>
          <textarea rows={2} value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            placeholder="Condiciones pre-existentes, alergias, etc."
          />
        </div>

        <button type="submit" disabled={mutation.isPending}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-50"
          style={{ background: 'var(--accent)', color: '#0F1A14' }}>
          {mutation.isPending ? 'Guardando...' : 'Guardar mascota'}
        </button>
      </form>
    </div>
  )
}
