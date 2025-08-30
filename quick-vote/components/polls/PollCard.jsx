'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePolls } from '@/hooks/usePolls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function PollCard({ poll }) {
  const { user } = useAuth()
  const { voteOnPoll } = usePolls()
  const [selectedOption, setSelectedOption] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
  const isOwner = poll.createdBy === user?.id

  const handleVote = async () => {
    if (!selectedOption) return

    setIsVoting(true)
    try {
      const result = await voteOnPoll(poll.id, selectedOption)
      if (result.success) {
        setHasVoted(true)
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {poll.title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {poll.description}
            </CardDescription>
          </div>
          {isOwner && (
            <div className="flex items-center space-x-2 ml-4">
              <Link href={`/polls/${poll.id}/edit`}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2"
                  title="Edit Poll"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>{totalVotes} votes</span>
          <span>{poll.options.length} options</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = getPercentage(option.votes)
            const isSelected = selectedOption === option.id
            
            return (
              <div key={option.id} className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name={`poll-${poll.id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => setSelectedOption(option.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={hasVoted}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {option.text}
                      </span>
                      {hasVoted && (
                        <span className="text-sm font-semibold text-blue-600">
                          {percentage}%
                        </span>
                      )}
                    </div>
                    {hasVoted && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{option.votes} votes</span>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )
          })}
        </div>

        {!hasVoted && (
          <Button
            onClick={handleVote}
            disabled={!selectedOption || isVoting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isVoting ? 'Voting...' : 'Vote'}
          </Button>
        )}

        {hasVoted && (
          <div className="text-center py-2">
            <span className="text-sm text-green-600 font-medium">
              ✓ Vote submitted successfully!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
