import api from './client'
import type { TokenPair, User } from '../types'

export const authApi = {
  register: (email: string, full_name: string, password: string) =>
    api.post<User>('/auth/register', { email, full_name, password }),

  login: (email: string, password: string) =>
    api.post<TokenPair>('/auth/login', { email, password }),

  me: () => api.get<User>('/auth/me'),
}
