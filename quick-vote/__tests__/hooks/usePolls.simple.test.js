import { renderHook, act, waitFor } from "@testing-library/react";
import { usePolls } from "../../hooks/usePolls";

// Mock AuthContext with inline values
jest.mock("../../contexts/AuthContext", () => ({
  AuthContext: {
    _currentValue: { user: { id: "test-user-id", email: "test@example.com" } },
  },
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: () => ({
    user: { id: "test-user-id", email: "test@example.com" },
  }),
}));

// Mock Supabase client
jest.mock("../../lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("usePolls Hook", () => {
  const mockUser = {
    id: "test-user-id",
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe("fetchPolls", () => {
    it("should fetch polls successfully", async () => {
      const mockPollsData = [
        {
          id: "poll-1",
          title: "Test Poll",
          description: "Test Description",
          created_by: "user-1",
          created_at: "2024-01-01T00:00:00.000Z",
          is_active: true,
          poll_options: [
            {
              id: "opt-1",
              text: "Option 1",
              created_at: "2024-01-01T00:00:00.000Z",
            },
            {
              id: "opt-2",
              text: "Option 2",
              created_at: "2024-01-01T00:00:00.000Z",
            },
          ],
        },
      ];

      const mockVotesData = [
        { option_id: "opt-1" },
        { option_id: "opt-1" },
        { option_id: "opt-2" },
      ];

      const { supabase } = require("../../lib/supabase");
      supabase.from.mockImplementation((table) => {
        if (table === "polls") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: mockPollsData,
              error: null,
            }),
          };
        }
        if (table === "votes") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({
              data: mockVotesData,
              error: null,
            }),
          };
        }
      });

      const { result } = renderHook(() => usePolls());

      await waitFor(() => {
        expect(result.current.polls).toHaveLength(1);
      });

      expect(result.current.polls[0]).toEqual(
        expect.objectContaining({
          id: "poll-1",
          title: "Test Poll",
          description: "Test Description",
          createdBy: "user-1",
          isActive: true,
        }),
      );
    });

    it("should handle fetch error", async () => {
      const mockError = new Error("Database error");

      const { supabase } = require("../../lib/supabase");
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockRejectedValue(mockError),
      });

      const { result } = renderHook(() => usePolls());

      await waitFor(() => {
        expect(result.current.error).toBe("Database error");
      });
    });
  });

  describe("createPoll", () => {
    it("should create poll successfully", async () => {
      const mockCreatedPoll = {
        id: "new-poll-id",
        title: "New Poll",
        description: "New Description",
        created_by: "test-user-id",
        created_at: "2024-01-01T00:00:00.000Z",
        is_active: true,
      };

      const mockCreatedOptions = [
        { id: "opt-a", poll_id: "new-poll-id", text: "Option A" },
        { id: "opt-b", poll_id: "new-poll-id", text: "Option B" },
      ];

      const { supabase } = require("../../lib/supabase");
      supabase.from.mockImplementation((table) => {
        if (table === "polls") {
          return {
            // For initial fetch
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null }),
            // For create
            insert: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockCreatedPoll,
              error: null,
            }),
          };
        }
        if (table === "poll_options") {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({
              data: mockCreatedOptions,
              error: null,
            }),
          };
        }
        if (table === "votes") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
      });

      const { result } = renderHook(() => usePolls());

      let createResult;
      await act(async () => {
        createResult = await result.current.createPoll({
          title: "New Poll",
          description: "New Description",
          options: ["Option A", "Option B"],
        });
      });

      expect(createResult.success).toBe(true);
      expect(createResult.poll.title).toBe("New Poll");
    });

    it("should handle create error when user not logged in", async () => {
      // Mock no user
      const useContextSpy = jest.spyOn(require("react"), "useContext");
      useContextSpy.mockReturnValue({ user: null });

      const { result } = renderHook(() => usePolls());

      let createResult;
      await act(async () => {
        createResult = await result.current.createPoll({
          title: "Test",
          description: "Test",
          options: ["A", "B"],
        });
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toBe("You must be logged in to create a poll");

      useContextSpy.mockRestore();
    });
  });

  describe("voteOnPoll", () => {
    it("should vote successfully", async () => {
      const { supabase } = require("../../lib/supabase");
      supabase.from.mockImplementation((table) => {
        if (table === "votes") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn().mockResolvedValue({
              data: null, // No existing vote
              error: null,
            }),
            insert: jest.fn().mockResolvedValue({
              data: {},
              error: null,
            }),
          };
        }
        if (table === "polls") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
      });

      const { result } = renderHook(() => usePolls());

      let voteResult;
      await act(async () => {
        voteResult = await result.current.voteOnPoll("poll-1", "option-1");
      });

      expect(voteResult.success).toBe(true);
    });

    it("should prevent duplicate voting", async () => {
      const { supabase } = require("../../lib/supabase");
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: { id: "existing-vote" }, // Existing vote
          error: null,
        }),
      });

      const { result } = renderHook(() => usePolls());

      let voteResult;
      await act(async () => {
        voteResult = await result.current.voteOnPoll("poll-1", "option-1");
      });

      expect(voteResult.success).toBe(false);
      expect(voteResult.error).toBe("You have already voted on this poll");
    });
  });

  describe("editPoll", () => {
    it("should edit poll successfully", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            poll: {
              id: "poll-1",
              title: "Updated Poll",
              description: "Updated Description",
              options: [{ id: "opt-1", text: "Updated Option", votes: 0 }],
            },
            message: "Poll updated successfully",
          }),
      });

      // Mock initial fetch
      const { supabase } = require("../../lib/supabase");
      supabase.from.mockImplementation((table) => {
        if (table === "polls") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        if (table === "votes") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
      });

      const { result } = renderHook(() => usePolls());

      let editResult;
      await act(async () => {
        editResult = await result.current.editPoll("poll-1", {
          title: "Updated Poll",
          description: "Updated Description",
          options: ["Updated Option"],
        });
      });

      expect(editResult.success).toBe(true);
      expect(editResult.message).toBe("Poll updated successfully");
    });
  });

  describe("deletePoll", () => {
    it("should delete poll successfully", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            message: "Poll deleted successfully",
          }),
      });

      // Mock initial fetch with one poll
      const { supabase } = require("../../lib/supabase");
      supabase.from.mockImplementation((table) => {
        if (table === "polls") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: "poll-1",
                  title: "Test Poll",
                  description: "Test",
                  created_by: "test-user-id",
                  created_at: "2024-01-01T00:00:00.000Z",
                  is_active: true,
                  poll_options: [],
                },
              ],
              error: null,
            }),
          };
        }
        if (table === "votes") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
      });

      const { result } = renderHook(() => usePolls());

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.polls).toHaveLength(1);
      });

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.deletePoll("poll-1");
      });

      expect(deleteResult.success).toBe(true);
      expect(deleteResult.message).toBe("Poll deleted successfully");
      expect(result.current.polls).toHaveLength(0);
    });
  });

  describe("getPollById", () => {
    it("should return poll by id", async () => {
      const mockPollsData = [
        {
          id: "poll-1",
          title: "Test Poll 1",
          description: "Test Description 1",
          created_by: "user-1",
          created_at: "2024-01-01T00:00:00.000Z",
          is_active: true,
          poll_options: [],
        },
        {
          id: "poll-2",
          title: "Test Poll 2",
          description: "Test Description 2",
          created_by: "user-2",
          created_at: "2024-01-01T00:00:00.000Z",
          is_active: true,
          poll_options: [],
        },
      ];

      const { supabase } = require("../../lib/supabase");
      supabase.from.mockImplementation((table) => {
        if (table === "polls") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: mockPollsData,
              error: null,
            }),
          };
        }
        if (table === "votes") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
      });

      const { result } = renderHook(() => usePolls());

      await waitFor(() => {
        expect(result.current.polls).toHaveLength(2);
      });

      const foundPoll = result.current.getPollById("poll-1");
      expect(foundPoll).toBeDefined();
      expect(foundPoll.id).toBe("poll-1");
      expect(foundPoll.title).toBe("Test Poll 1");

      const notFoundPoll = result.current.getPollById("non-existent");
      expect(notFoundPoll).toBeUndefined();
    });
  });
});
