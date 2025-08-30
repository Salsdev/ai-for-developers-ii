import CreatePollForm from '@/components/polls/CreatePollForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CreatePollPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left Section - Navigation & Title */}
            <div className="flex items-center space-x-4">
              <Link href="/polls">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200"
                  title="Back to Polls"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Poll</h1>
                <p className="text-gray-600 text-sm">Share your question with the community</p>
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
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreatePollForm />
      </div>
    </div>
  )
}
