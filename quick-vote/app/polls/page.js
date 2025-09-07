"use client";

import { usePolls } from "@/hooks/usePolls";
import PollCard from "@/components/polls/PollCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PollsPage() {
  const { polls, isLoading, error, fetchPolls, voteOnPoll, deletePoll } =
    usePolls();

  const handleRefresh = async () => {
    await fetchPolls();
  };

  if (isLoading && polls.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading polls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Polls
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Polls</h1>
                <p className="text-gray-600 text-sm">
                  {polls.length} polls available
                </p>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={isLoading}
                className="text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
              <Link href="/polls/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200">
                  Create New Poll
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {polls.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-6">📊</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No polls yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Be the first to create a poll and start gathering opinions from
              the community!
            </p>
            <Link href="/polls/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Create Your First Poll
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Refreshing polls...</p>
              </div>
            )}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  voteOnPoll={voteOnPoll}
                  deletePoll={deletePoll}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
