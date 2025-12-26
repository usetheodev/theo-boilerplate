import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'

interface RegisterData {
  email: string
  password: string
  name?: string
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
    },
    onError: (error: unknown) => {
      console.error('Registration failed:', error)
      // TODO: Show error toast
    },
  })
}
