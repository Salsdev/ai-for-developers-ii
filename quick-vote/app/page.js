'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <span className="text-xl font-bold text-blue-600">
                QuickVote
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/polls">
                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                      View Polls
                    </Button>
                  </Link>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <Button 
                    onClick={logout} 
                    variant="ghost" 
                    className="w-10 h-10 p-0 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
                    title="Logout"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 p-0"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block">
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/polls" className="block">
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                      View Polls
                    </Button>
                  </Link>
                  <div className="border-t border-gray-200 pt-2">
                    <Button 
                      onClick={logout} 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block">
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create and Vote on Polls
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          QuickVote is a modern polling platform that makes it easy to create engaging polls, 
            gather opinions, and make decisions together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link href="/polls">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                    View Polls
                  </Button>
                </Link>
                <Link href="/polls/create">
                  <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-3 transition-all duration-200">
                    Create Poll
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-3 transition-all duration-200">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose QuickVote?
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to create engaging polls and gather insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>
                Create polls in seconds with our intuitive interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No complicated setup required. Just enter your question, add options, and share with your audience.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Real-time Results</CardTitle>
              <CardDescription>
                See votes and results as they happen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Watch your poll results update in real-time with beautiful charts and statistics.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is safe with us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We take security seriously. Your polls and votes are protected with industry-standard security.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who are already creating and voting on polls
          </p>
          {isAuthenticated ? (
            <Link href="/polls/create">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                Create Your First Poll
              </Button>
            </Link>
          ) : (
            <Link href="/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 QuickVote. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
