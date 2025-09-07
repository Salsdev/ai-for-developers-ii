"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function usePolls() {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);

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

      const pollsWithVotes = await Promise.all(
        pollsData.map(async (poll) => {
          const { data: pollVotes, error: votesError } = await supabase
            .from("votes")
            .select("option_id")
            .eq("poll_id", poll.id);

          if (votesError) console.error("Error fetching votes:", votesError);

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
    // This function is now also used for "undo"
    try {
      setIsLoading(true);
      setError(null);

      if (!user) throw new Error("You must be logged in to create a poll");

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

      const optionsToInsert = pollData.options.map((option) => ({
        poll_id: poll.id,
        text: option.trim(),
      }));

      const { data: options, error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionsToInsert)
        .select();

      if (optionsError) throw optionsError;

      const newPoll = {
        ...poll,
        options: options.map((option) => ({ ...option, votes: 0 })),
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
      if (!user) throw new Error("You must be logged in to vote");

      const { data: existingVote, error: voteCheckError } = await supabase
        .from("votes")
        .select("id")
        .eq("poll_id", pollId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (voteCheckError && voteCheckError.code !== "PGRST116") {
        throw voteCheckError;
      }
      if (existingVote) throw new Error("You have already voted on this poll");

      const { error: voteError } = await supabase.from("votes").insert({
        poll_id: pollId,
        user_id: user.id,
        option_id: optionId,
      });

      if (voteError) throw voteError;

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

  const deletePoll = async (pollId) => {
    if (!user) {
      toast.error("You must be logged in to delete a poll");
      return { success: false, error: "User not authenticated" };
    }

    const originalPolls = [...polls];
    const pollToDelete = polls.find((p) => p.id === pollId);

    if (!pollToDelete) return;

    // Optimistic update
    setPolls((prev) => prev.filter((p) => p.id !== pollId));
    setRecentlyDeleted(pollToDelete);

    const toastId = toast.loading("Deleting poll...");

    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to delete poll");

      toast.success("Poll deleted.", {
        id: toastId,
        action: {
          label: "Undo",
          onClick: () => restorePoll(pollToDelete),
        },
        duration: 5000,
      });

      return { success: true };
    } catch (err) {
      toast.error("Failed to delete poll. Restoring.", { id: toastId });
      setPolls(originalPolls); // Revert optimistic update
      setRecentlyDeleted(null);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const restorePoll = async (pollToRestore) => {
    if (!pollToRestore) return;

    setRecentlyDeleted(null); // Clear the recently deleted state

    // Optimistically add the poll back to the UI
    setPolls((prev) =>
      [pollToRestore, ...prev].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    );

    toast.loading("Restoring poll...");

    try {
      // Re-create the poll by calling createPoll
      const result = await createPoll({
        title: pollToRestore.title,
        description: pollToRestore.description,
        options: pollToRestore.options.map((opt) => opt.text), // createPoll expects an array of strings
      });

      if (result.success) {
        // The poll is already in the UI, but now it has a new ID.
        // To avoid duplicates, we'll remove the old one and rely on the new one from createPoll.
        setPolls((prev) => prev.filter((p) => p.id !== pollToRestore.id));
        toast.success("Poll restored.");
      } else {
        throw new Error(result.error || "Failed to restore poll");
      }
    } catch (err) {
      toast.error("Could not restore poll.");
      // If restore fails, remove the optimistic addition
      setPolls((prev) => prev.filter((p) => p.id !== pollToRestore.id));
      setError(err.message);
    }
  };

  const fetchPollById = useCallback(async (pollId) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: pollData, error: pollError } = await supabase
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
        .eq("id", pollId)
        .eq("is_active", true)
        .single();

      if (pollError) throw pollError;
      if (!pollData) return null;

      // Get vote counts for this poll
      const { data: pollVotes, error: votesError } = await supabase
        .from("votes")
        .select("option_id")
        .eq("poll_id", pollData.id);

      if (votesError) console.error("Error fetching votes:", votesError);

      const voteCounts = {};
      if (pollVotes) {
        pollVotes.forEach((vote) => {
          voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
        });
      }

      const optionsWithVotes = pollData.poll_options.map((option) => ({
        ...option,
        votes: voteCounts[option.id] || 0,
      }));

      const pollWithVotes = {
        ...pollData,
        options: optionsWithVotes,
        createdBy: pollData.created_by,
        createdAt: new Date(pollData.created_at),
        isActive: pollData.is_active,
      };

      return pollWithVotes;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPollById = useCallback(
    (pollId) => {
      return polls.find((poll) => poll.id === pollId);
    },
    [polls],
  );

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
    deletePoll,
    getPollById,
    fetchPollById,
  };
}
