'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setIsLoading(true)

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setError('Please enter your email address.')
      setIsLoading(false)
      inputRef.current?.focus()
      return
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      setIsLoading(false)
      inputRef.current?.focus()
      return
    }

    // Check if user exists
    const { data, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)

    if (userError) {
      setError('Error checking user. Please try again.')
      setIsLoading(false)
      return
    }

    if (data.length === 0) {
      setMessage('If an account with this email exists, a password reset link has been sent.')
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('A password reset link has been sent to your email address.')
      setEmail('')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm mx-auto shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6 px-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="block mb-1">Email</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  ref={inputRef}
                  autoComplete="email"
                  className="pl-10"
                  disabled={isLoading}
                  aria-invalid={!!error}
                  aria-describedby={error ? "email-error" : undefined}
                />
              </div>
            </div>
            {error && (
              <div
                id="email-error"
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2"
                role="alert"
              >
                {error}
              </div>
            )}
            {message && (
              <div
                className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2"
                role="status"
              >
                {message}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{' '}
            <a
              href="/auth/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
