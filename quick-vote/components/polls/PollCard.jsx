"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePolls } from "@/hooks/usePolls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PollCard({ poll }) {
  const { user } = useAuth();
  const { voteOnPoll, deletePoll } = usePolls();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollData, setPollData] = useState(poll);

  const totalVotes = pollData.options.reduce(
    (sum, option) => sum + option.votes,
    0,
  );
  const isOwner =
    pollData.createdBy === user?.id || pollData.created_by === user?.id;

  // Check if user has already voted
  useEffect(() => {
    const checkIfVoted = async () => {
      if (user) {
        const { data: existingVote } = await supabase
          .from("votes")
          .select("id")
          .eq("poll_id", poll.id)
          .eq("user_id", user.id)
          .single();

        setHasVoted(!!existingVote);
      }
    };

    checkIfVoted();
  }, [poll.id, user]);

  // Update local poll data when prop changes
  useEffect(() => {
    setPollData(poll);
  }, [poll]);

  const handleVote = async () => {
    if (!selectedOption) return;

    setIsVoting(true);
    try {
      const result = await voteOnPoll(poll.id, selectedOption);
      if (result.success) {
        setHasVoted(true);
        // Update local poll data to reflect the new vote
        setPollData((prevData) => ({
          ...prevData,
          options: prevData.options.map((option) =>
            option.id === selectedOption
              ? { ...option, votes: option.votes + 1 }
              : option,
          ),
        }));
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this poll? This action cannot be undone.",
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      await deletePoll(pollData.id);
      // The parent component should handle the removal from the UI.
    } catch (error) {
      console.error("Error deleting poll:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {pollData.title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {pollData.description}
            </CardDescription>
          </div>
          {isOwner && (
            <div className="flex items-center space-x-2 ml-4">
              <Link href={`/polls/${pollData.id}/edit`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2"
                  title="Edit Poll"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-2"
                title="Delete Poll"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>{totalVotes} votes</span>
          <span>{pollData.options.length} options</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {pollData.options.map((option) => {
            const percentage = getPercentage(option.votes);
            const isSelected = selectedOption === option.id;

            return (
              <div key={option.id} className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name={`poll-${pollData.id}`}
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
            );
          })}
        </div>

        {!hasVoted && (
          <Button
            onClick={handleVote}
            disabled={!selectedOption || isVoting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isVoting ? "Voting..." : "Vote"}
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
  );
}
