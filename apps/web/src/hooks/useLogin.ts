import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'

interface LoginData {
  email: string
  password: string
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error)
      // TODO: Show error toast
    },
  })
}
