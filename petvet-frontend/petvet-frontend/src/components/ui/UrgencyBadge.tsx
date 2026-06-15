import type { UrgencyLevel } from '../../types'

const CONFIG: Record<UrgencyLevel, { label: string; color: string; bg: string; pulse: boolean }> = {
  low:    { label: 'Urgencia baja',   color: '#2ECC71', bg: '#1A7A44', pulse: false },
  medium: { label: 'Urgencia media',  color: '#F0A500', bg: '#7A5200', pulse: true  },
  high:   { label: 'Urgencia alta',   color: '#E05C4B', bg: '#7A1A10', pulse: true  },
}

interface Props {
  level: UrgencyLevel
  size?: 'sm' | 'md' | 'lg'
}

export default function UrgencyBadge({ level, size = 'md' }: Props) {
  const { label, color, bg, pulse } = CONFIG[level]

  const dotSize = size === 'sm' ? 8 : size === 'md' ? 10 : 14
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
  const px = size === 'sm' ? 'px-2 py-0.5' : size === 'md' ? 'px-3 py-1' : 'px-4 py-1.5'

  return (
    <span className={`inline-flex items-center gap-2 rounded-full font-medium ${px} ${textSize}`}
          style={{ background: bg, color }}>
      <span
        className={pulse ? 'pulse-vital' : ''}
        style={{
          display: 'inline-block',
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          color,
        }}
      />
      {label}
    </span>
  )
}
