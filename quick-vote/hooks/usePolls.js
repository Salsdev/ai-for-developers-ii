"use client";

import { useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/contexts/AuthContext";

export function usePolls() {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: pollsData, error: pollsError } = await supabase
        .from("polls")
        .select(
          `
          *,
          poll_options (
            id,
            text,
            created_at
          )
        `,
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (pollsError) throw pollsError;

      // Get vote counts for each option using a more efficient approach
      const pollsWithVotes = await Promise.all(
        pollsData.map(async (poll) => {
          // Get all votes for this poll at once
          const { data: pollVotes, error: votesError } = await supabase
            .from("votes")
            .select("option_id")
            .eq("poll_id", poll.id);

          if (votesError) {
            console.error("Error fetching votes:", votesError);
          }

          // Count votes per option
          const voteCounts = {};
          if (pollVotes) {
            pollVotes.forEach((vote) => {
              voteCounts[vote.option_id] =
                (voteCounts[vote.option_id] || 0) + 1;
            });
          }

          const optionsWithVotes = poll.poll_options.map((option) => ({
            ...option,
            votes: voteCounts[option.id] || 0,
          }));

          return {
            ...poll,
            options: optionsWithVotes,
            createdBy: poll.created_by,
            createdAt: new Date(poll.created_at),
            isActive: poll.is_active,
          };
        }),
      );

      setPolls(pollsWithVotes);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createPoll = async (pollData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("You must be logged in to create a poll");
      }

      // Create the poll
      const { data: poll, error: pollError } = await supabase
        .from("polls")
        .insert({
          title: pollData.title,
          description: pollData.description,
          created_by: user.id,
          expires_at: pollData.expiresAt || null,
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Create the poll options
      const optionsToInsert = pollData.options.map((text) => ({
        poll_id: poll.id,
        text: text.trim(),
      }));

      const { data: options, error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionsToInsert)
        .select();

      if (optionsError) throw optionsError;

      const newPoll = {
        ...poll,
        options: options.map((option) => ({
          ...option,
          votes: 0,
        })),
        createdBy: poll.created_by,
        createdAt: new Date(poll.created_at),
        isActive: poll.is_active,
      };

      setPolls((prev) => [newPoll, ...prev]);
      return { success: true, poll: newPoll };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const voteOnPoll = async (pollId, optionId) => {
    try {
      setError(null);

      if (!user) {
        throw new Error("You must be logged in to vote");
      }

      // Check if user has already voted on this poll
      const { data: existingVote, error: voteCheckError } = await supabase
        .from("votes")
        .select("id")
        .eq("poll_id", pollId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (voteCheckError && voteCheckError.code !== "PGRST116") {
        throw voteCheckError;
      }

      if (existingVote) {
        throw new Error("You have already voted on this poll");
      }

      // Cast the vote
      const { error: voteError } = await supabase.from("votes").insert({
        poll_id: pollId,
        user_id: user.id,
        option_id: optionId,
      });

      if (voteError) throw voteError;

      // Refresh polls to get accurate vote counts
      await fetchPolls();

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const editPoll = async (pollId, updatedPollData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("You must be logged in to edit a poll");
      }

      // Use API route for editing polls
      const response = await fetch(`/api/polls/${pollId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedPollData.title,
          description: updatedPollData.description,
          options: updatedPollData.options,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update poll");
      }

      // Update local state with the updated poll
      setPolls((prev) =>
        prev.map((poll) => {
          if (poll.id === pollId) {
            return {
              ...poll,
              title: data.poll.title,
              description: data.poll.description,
              options: data.poll.options
                ? data.poll.options.map((option) => ({
                    ...option,
                    votes: option.votes || 0,
                  }))
                : poll.options,
            };
          }
          return poll;
        }),
      );

      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getPollById = (pollId) => {
    return polls.find((poll) => poll.id === pollId);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return {
    polls,
    isLoading,
    error,
    fetchPolls,
    createPoll,
    voteOnPoll,
    editPoll,
    getPollById,
  };
}
