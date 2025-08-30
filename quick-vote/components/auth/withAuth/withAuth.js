'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push('/auth/login')
      }
    }, [user, loading, router])

    if (loading) {
      return <div>Loading...</div>
    }

    if (!user) {
      return null
    }

    return <WrappedComponent {...props} />
  }

  return Wrapper
}

export default withAuth
