export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
export type UrgencyLevel = 'low' | 'medium' | 'high'

export interface User {
  id: string
  email: string
  full_name: string
  is_active: boolean
  created_at: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface Pet {
  id: string
  name: string
  species: Species
  breed: string | null
  age_years: number | null
  weight_kg: number | null
  notes: string | null
  created_at: string
}

export interface PetCreate {
  name: string
  species: Species
  breed?: string
  age_years?: number
  weight_kg?: number
  notes?: string
}

export interface Symptom {
  id: number
  name: string
  description: string | null
  species: Species | null
}

export interface DiagnosisCreate {
  pet_id: string
  symptom_ids: number[]
  additional_notes?: string
}

export interface DiagnosisOut {
  id: string
  pet_id: string
  additional_notes: string | null
  ai_response: string
  probable_disease: string
  urgency_level: UrgencyLevel
  recommendation: string
  groq_model_used: string
  created_at: string
  symptoms: Symptom[]
}

export interface DiagnosisSummary {
  id: string
  pet_id: string
  probable_disease: string
  urgency_level: UrgencyLevel
  created_at: string
}
