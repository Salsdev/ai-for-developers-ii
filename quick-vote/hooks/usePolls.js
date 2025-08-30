'use client'

import { useState, useEffect } from 'react'

export function usePolls() {
  const [polls, setPolls] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPolls = async () => {
    try {
      setIsLoading(true)
      // Mock data for now
      const mockPolls = [
        {
          id: '1',
          title: 'What\'s your favorite programming language?',
          description: 'Let\'s see what the community prefers',
          options: [
            { id: '1', text: 'JavaScript', votes: 45 },
            { id: '2', text: 'Python', votes: 38 },
            { id: '3', text: 'TypeScript', votes: 32 },
            { id: '4', text: 'C', votes: 32 }
          ],
          createdBy: '1',
          createdAt: new Date(),
          isActive: true
        },
        {
          id: '2',
          title: '🌍 Which weekend activity do you enjoy the most?',
          description: 'Let\'s find out how everyone in the community prefers to spend their free time.',
          options: [
            { id: '4', text: 'Going for a hike 🥾', votes: 28 },
            { id: '5', text: 'Watching movies 🎬', votes: 42 },
            { id: '6', text: 'Playing video games 🎮', votes: 35 },
            { id: '7', text: 'Reading books 📚', votes: 23 }
        
          ],
          createdBy: '1',
          createdAt: new Date('2024-01-20'),
          isActive: true
        },
        {
          id: '3',
          title: '🍕 What\'s your go-to pizza topping?',
          description: 'The age-old debate: pineapple or no pineapple? Let\'s settle this once and for all!',
          options: [
            { id: '9', text: 'Pepperoni 🍖', votes: 67 },
            { id: '10', text: 'Margherita 🍅', votes: 34 },
            { id: '11', text: 'Hawaiian 🍍', votes: 19 },
            { id: '12', text: 'BBQ Chicken 🍗', votes: 28 }
            
          ],
          createdBy: '1',
          createdAt: new Date('2024-01-18'),
          isActive: true
        }
      ]
      setPolls(mockPolls)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const createPoll = async (pollData) => {
    try {
      setIsLoading(true)
      const newPoll = {
        id: Date.now().toString(),
        ...pollData,
        options: pollData.options.map((text, index) => ({
          id: (Date.now() + index).toString(),
          text,
          votes: 0
        })),
        createdBy: 'current-user',
        createdAt: new Date(),
        isActive: true
      }
      setPolls(prev => [newPoll, ...prev])
      return { success: true, poll: newPoll }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const voteOnPoll = async (pollId, optionId) => {
    try {
      setPolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option => 
              option.id === optionId 
                ? { ...option, votes: option.votes + 1 }
                : option
            )
          }
        }
        return poll
      }))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const editPoll = async (pollId, updatedPollData) => {
    try {
      setIsLoading(true)
      setPolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            title: updatedPollData.title,
            description: updatedPollData.description,
            options: updatedPollData.options.map((text, index) => ({
              id: poll.options[index]?.id || (Date.now() + index).toString(),
              text,
              votes: poll.options[index]?.votes || 0
            }))
          }
        }
        return poll
      }))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const getPollById = (pollId) => {
    return polls.find(poll => poll.id === pollId)
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  return {
    polls,
    isLoading,
    error,
    fetchPolls,
    createPoll,
    voteOnPoll,
    editPoll,
    getPollById
  }
}
