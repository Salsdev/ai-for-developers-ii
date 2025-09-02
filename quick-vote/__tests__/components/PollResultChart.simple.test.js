import { render, screen, fireEvent } from "@testing-library/react";
import PollResultChart from "../../components/polls/PollResultChart";

// Mock data for testing
const mockPollWithVotes = {
  id: "poll-1",
  title: "Favorite Programming Language",
  description: "Choose your favorite programming language",
  options: [
    { id: "js", text: "JavaScript", votes: 45 },
    { id: "py", text: "Python", votes: 38 },
    { id: "ts", text: "TypeScript", votes: 32 },
  ],
  createdBy: "user-123",
  createdAt: "2024-01-15T10:30:00Z",
};

const mockPollNoVotes = {
  id: "poll-2",
  title: "Empty Poll",
  description: "A poll with no votes yet",
  options: [
    { id: "opt1", text: "Option 1", votes: 0 },
    { id: "opt2", text: "Option 2", votes: 0 },
    { id: "opt3", text: "Option 3", votes: 0 },
  ],
  createdBy: "user-456",
  createdAt: "2024-01-16T14:20:00Z",
};

describe("PollResultChart Component", () => {
  describe("Basic Rendering", () => {
    it("should render poll title and basic information", () => {
      render(<PollResultChart poll={mockPollWithVotes} />);

      expect(
        screen.getByText("Favorite Programming Language - Results"),
      ).toBeInTheDocument();
      expect(screen.getByText("115 total votes")).toBeInTheDocument();
    });

    it("should render without title when showTitle is false", () => {
      render(<PollResultChart poll={mockPollWithVotes} showTitle={false} />);

      expect(
        screen.queryByText("Favorite Programming Language - Results"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <PollResultChart poll={mockPollWithVotes} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Empty State", () => {
    it("should show empty state when no votes exist", () => {
      render(<PollResultChart poll={mockPollNoVotes} />);

      expect(screen.getByText("No votes yet")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Be the first to vote on this poll to see the results!",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Chart Type Switching", () => {
    it("should render all chart type buttons", () => {
      render(<PollResultChart poll={mockPollWithVotes} />);

      expect(
        screen.getByRole("button", { name: /Bar Chart/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Pie Chart/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Donut Chart/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /List View/i }),
      ).toBeInTheDocument();
    });

    it("should switch to list view when clicked", () => {
      render(<PollResultChart poll={mockPollWithVotes} />);

      const listViewButton = screen.getByRole("button", {
        name: /List View/i,
      });
      fireEvent.click(listViewButton);

      expect(screen.getByText("#1")).toBeInTheDocument();
      expect(screen.getByText("#2")).toBeInTheDocument();
    });
  });

  describe("Data Display", () => {
    it("should display all poll options with vote counts", () => {
      render(<PollResultChart poll={mockPollWithVotes} />);

      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getAllByText("45")).toHaveLength(2); // Appears in chart and summary
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("38")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("32")).toBeInTheDocument();
    });

    it("should display correct percentages", () => {
      render(<PollResultChart poll={mockPollWithVotes} />);

      // JavaScript: 45/115 = 39.1%
      expect(screen.getByText("(39.1%)")).toBeInTheDocument();
      // Python: 38/115 = 33.0%
      expect(screen.getByText("(33.0%)")).toBeInTheDocument();
    });
  });

  describe("Summary Statistics", () => {
    it("should display correct summary statistics", () => {
      render(<PollResultChart poll={mockPollWithVotes} />);

      // Total votes
      expect(screen.getByText("115")).toBeInTheDocument();
      expect(screen.getByText("Total Votes")).toBeInTheDocument();

      // Number of options
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("Options")).toBeInTheDocument();

      // Leading option percentage (JavaScript: 39.1%)
      expect(screen.getByText("39.1%")).toBeInTheDocument();
      expect(screen.getByText("Leading Option")).toBeInTheDocument();

      // Top votes count
      expect(screen.getByText("Top Votes")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle single option polls", () => {
      const singleOptionPoll = {
        id: "single-poll",
        title: "Single Option Poll",
        description: "Only one choice",
        options: [{ id: "only", text: "Only Option", votes: 10 }],
      };

      render(<PollResultChart poll={singleOptionPoll} />);

      expect(screen.getByText("Only Option")).toBeInTheDocument();
      expect(screen.getAllByText("10")).toHaveLength(3); // Appears in chart, summary, and header
      expect(screen.getByText("(100.0%)")).toBeInTheDocument();
    });

    it("should handle very long option text", () => {
      const longTextPoll = {
        id: "long-text-poll",
        title: "Long Text Poll",
        description: "Options with very long text",
        options: [
          {
            id: "long1",
            text: "This is a very long option text that should be handled gracefully",
            votes: 5,
          },
          { id: "short", text: "Short", votes: 3 },
        ],
      };

      render(<PollResultChart poll={longTextPoll} />);

      expect(
        screen.getByText(
          "This is a very long option text that should be handled gracefully",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Short")).toBeInTheDocument();
    });
  });
});
