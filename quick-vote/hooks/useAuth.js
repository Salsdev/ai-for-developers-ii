'use client'

import { useState, useEffect, createContext, useContext } from 'react'

const AuthContext = createContext()

/**
 * Authentication provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for existing session/token
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // TODO: Implement actual authentication check
      // For now, we'll simulate a loading state
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check localStorage for token
      const token = localStorage.getItem('authToken')
      if (token) {
        // TODO: Validate token with backend
        // For now, we'll just set a mock user
        setUser({
          id: '1',
          email: 'user@example.com',
          name: 'Saleh',
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      // TODO: Implement actual login API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login
      const mockUser = {
        id: '1',
        email,
        name: 'Saleh',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem('authToken', 'mock-token')
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email, password, name) => {
    try {
      setIsLoading(true)
      // TODO: Implement actual registration API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful registration
      const mockUser = {
        id: '1',
        email,
        name,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem('authToken', 'mock-token')
      
      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context value
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
