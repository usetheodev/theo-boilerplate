import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  })

  useEffect(() => {
    // Check for access token in localStorage
    const token = localStorage.getItem('accessToken')

    if (token) {
      // TODO: Validate token with backend
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: null, // TODO: Fetch user data
      })
    } else {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      })
    }
  }, [])

  return state
}
