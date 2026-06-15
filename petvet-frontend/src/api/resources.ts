import api from './client'
import type { DiagnosisCreate, DiagnosisOut, DiagnosisSummary, Pet, PetCreate, Species, Symptom } from '../types'

export const petsApi = {
  list: () => api.get<Pet[]>('/pets'),
  get: (id: string) => api.get<Pet>(`/pets/${id}`),
  create: (data: PetCreate) => api.post<Pet>('/pets', data),
  update: (id: string, data: Partial<PetCreate>) => api.patch<Pet>(`/pets/${id}`, data),
  delete: (id: string) => api.delete(`/pets/${id}`),
}

export const symptomsApi = {
  list: (species?: Species) =>
    api.get<Symptom[]>('/symptoms', { params: species ? { species } : undefined }),
}

export const diagnosesApi = {
  create: (data: DiagnosisCreate) => api.post<DiagnosisOut>('/diagnoses', data),
  get: (id: string) => api.get<DiagnosisOut>(`/diagnoses/${id}`),
  byPet: (petId: string) => api.get<DiagnosisSummary[]>(`/diagnoses/pet/${petId}`),
}
