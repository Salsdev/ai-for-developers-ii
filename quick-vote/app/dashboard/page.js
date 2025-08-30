'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePolls } from '@/hooks/usePolls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { polls } = usePolls()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-gray-400 text-6xl mb-6">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h1>
          <p className="text-gray-600 mb-6">Sign in to view your polls and statistics</p>
          <Link href="/auth/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const userPolls = polls.filter(poll => poll.createdBy === user?.id)
  const totalVotes = polls.reduce((sum, poll) => 
    sum + poll.options.reduce((pollSum, option) => pollSum + option.votes, 0), 0
  )
  const userTotalVotes = userPolls.reduce((sum, poll) => 
    sum + poll.options.reduce((pollSum, option) => pollSum + option.votes, 0), 0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left Section - Navigation & Title */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200"
                  title="Back to Home"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 text-sm">Welcome back, {user?.name}</p>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center space-x-3">
              <Link href="/polls">
                <Button 
                  variant="outline" 
                  className="text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  View Polls
                </Button>
              </Link>
              <Link href="/polls/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200">
                  Create Poll
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Polls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-gray-900">{polls.length}</div>
                <div className="ml-2 text-sm text-gray-500">polls</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Your Polls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-blue-600">{userPolls.length}</div>
                <div className="ml-2 text-sm text-gray-500">created</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-gray-900">{totalVotes}</div>
                <div className="ml-2 text-sm text-gray-500">votes</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Your Poll Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-green-600">{userTotalVotes}</div>
                <div className="ml-2 text-sm text-gray-500">received</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/polls/create" className="block">
                  <Button className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white">
                    + Create New Poll
                  </Button>
                </Link>
                <Link href="/polls" className="block">
                  <Button variant="outline" className="w-full h-12 text-base font-medium border-gray-300 text-gray-700 hover:bg-gray-50">
                    Browse All Polls
                  </Button>
                </Link>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center">
                    Need help? Check out our guide on creating engaging polls.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Polls */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Your Recent Polls</CardTitle>
                    <CardDescription className="text-gray-600">
                      Polls you've created recently
                    </CardDescription>
                  </div>
                  {userPolls.length > 0 && (
                    <Link href="/polls">
                      <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                        View All
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {userPolls.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-5xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No polls yet</h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      You haven't created any polls yet. Start by creating your first poll!
                    </p>
                    <Link href="/polls/create">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Create Your First Poll
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPolls.slice(0, 5).map((poll) => {
                      const pollVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
                      return (
                        <div key={poll.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{poll.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {pollVotes} votes • {poll.options.length} options
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                            <Link href={`/polls/${poll.id}/edit`}>
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2" title="Edit Poll">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Button>
                            </Link>
                            <Link href={`/polls/${poll.id}`}>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Summary */}
        {userPolls.length > 0 && (
          <div className="mt-8">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Activity Summary</CardTitle>
                <CardDescription className="text-gray-600">
                  Your polling activity this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userPolls.length}</div>
                    <div className="text-sm text-gray-500">Polls Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userTotalVotes}</div>
                    <div className="text-sm text-gray-500">Total Votes Received</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {userPolls.length > 0 ? Math.round(userTotalVotes / userPolls.length) : 0}
                    </div>
                    <div className="text-sm text-gray-500">Avg. Votes per Poll</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
