import axios from 'axios'
import type { TokenPair } from '../types'

const api = axios.create({ baseURL: '/api/v1' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (!refresh) {
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }
      try {
        const { data } = await axios.post<TokenPair>('/api/v1/auth/refresh', {
          refresh_token: refresh,
        })
        saveTokens(data)
        original.headers.Authorization = `Bearer ${data.access_token}`
        return api(original)
      } catch {
        clearTokens()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export function saveTokens(pair: TokenPair) {
  localStorage.setItem('access_token', pair.access_token)
  localStorage.setItem('refresh_token', pair.refresh_token)
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export default api
