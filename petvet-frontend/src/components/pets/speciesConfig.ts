import type { Species } from '../../types'

export const SPECIES_EMOJI: Record<Species, string> = {
  dog: '🐶',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  other: '🐾',
}

export const SPECIES_LABEL: Record<Species, string> = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  other: 'Otro',
}

export const ALL_SPECIES: Species[] = ['dog', 'cat', 'bird', 'rabbit', 'other']
