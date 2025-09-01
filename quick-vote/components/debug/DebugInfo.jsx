'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePolls } from '@/hooks/usePolls'
import { useState } from 'react'

export default function DebugInfo() {
  const { user } = useAuth()
  const { polls } = usePolls()
  const [testResult, setTestResult] = useState(null)

  const testAPI = async () => {
    try {
      const response = await fetch('/api/polls')
      const data = await response.json()
      setTestResult({ success: true, data })
    } catch (error) {
      setTestResult({ success: false, error: error.message })
    }
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-4">Debug Information</h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Authentication Status:</h4>
          <pre className="bg-white p-2 rounded text-sm overflow-auto">
            {JSON.stringify({
              isAuthenticated: !!user,
              userId: user?.id,
              userEmail: user?.email,
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold">Polls Data:</h4>
          <pre className="bg-white p-2 rounded text-sm overflow-auto max-h-40">
            {JSON.stringify(polls.map(poll => ({
              id: poll.id,
              title: poll.title,
              created_by: poll.created_by || poll.createdBy,
              isOwner: (poll.created_by === user?.id || poll.createdBy === user?.id)
            })), null, 2)}
          </pre>
        </div>

        <div>
          <button
            onClick={testAPI}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test API
          </button>
          {testResult && (
            <pre className="bg-white p-2 rounded text-sm overflow-auto max-h-40 mt-2">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
