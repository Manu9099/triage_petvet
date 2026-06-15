import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { diagnosesApi } from '../api/resources'
import type { DiagnosisOut } from '../types'
import UrgencyBadge from '../components/ui/UrgencyBadge'

export default function DiagnosisDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: diagnosis, isLoading } = useQuery<DiagnosisOut>({
    queryKey: ['diagnoses', id],
    queryFn: () => diagnosesApi.get(id!).then((r) => r.data),
    enabled: !!id,
  })

  if (isLoading) return (
    <div className="space-y-4 animate-pulse max-w-lg">
      <div className="h-8 w-40 rounded-lg" style={{ background: 'var(--surface)' }} />
      <div className="h-48 rounded-2xl" style={{ background: 'var(--surface)' }} />
    </div>
  )

  if (!diagnosis) return <p style={{ color: 'var(--muted)' }}>Diagnóstico no encontrado</p>

  let parsed: any = {}
  try { parsed = JSON.parse(diagnosis.ai_response) } catch { parsed = {} }

  return (
    <div className="fade-in max-w-lg space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Diagnóstico</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {new Date(diagnosis.created_at).toLocaleDateString('es-PE', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <UrgencyBadge level={diagnosis.urgency_level} size="sm" />
      </div>

      {/* Main */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Diagnóstico probable</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{diagnosis.probable_disease}</p>
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
        background: diagnosis.urgency_level === 'high' ? '#3D0E08' : diagnosis.urgency_level === 'medium' ? '#3D2900' : 'var(--accent-dim)',
        border: `1px solid ${diagnosis.urgency_level === 'high' ? 'var(--danger)' : diagnosis.urgency_level === 'medium' ? 'var(--warn)' : 'var(--accent)'}`,
      }}>
        <p className="text-xs font-medium mb-1" style={{
          color: diagnosis.urgency_level === 'high' ? 'var(--danger)' : diagnosis.urgency_level === 'medium' ? 'var(--warn)' : 'var(--accent)',
        }}>Recomendación</p>
        <p className="text-sm" style={{ color: 'var(--text)' }}>{diagnosis.recommendation}</p>
      </div>

      {/* Differentials */}
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
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--warn)' }}>⚠ Señales de alarma</p>
          <ul className="space-y-1">
            {parsed.warning_signs.map((w: string) => (
              <li key={w} className="text-sm flex items-start gap-2" style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--warn)' }}>·</span> {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Symptoms */}
      {diagnosis.symptoms.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Síntomas analizados</p>
          <div className="flex flex-wrap gap-2">
            {diagnosis.symptoms.map((s) => (
              <span key={s.id} className="px-3 py-1 rounded-full text-xs"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {diagnosis.additional_notes && (
        <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Notas del dueño</p>
          <p className="text-sm" style={{ color: 'var(--text)' }}>{diagnosis.additional_notes}</p>
        </div>
      )}

      <p className="text-xs rounded-xl p-3" style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
        Diagnóstico orientativo. No reemplaza consulta veterinaria profesional. Modelo: {diagnosis.groq_model_used}
      </p>
    </div>
  )
}
