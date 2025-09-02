"use client";

import PollResultChart from "@/components/polls/PollResultChart";

// Sample poll data for demonstration
const samplePolls = {
  programming: {
    id: "prog-poll-1",
    title: "What's your favorite programming language?",
    description: "Help us understand the most popular programming languages in our community.",
    options: [
      { id: "js", text: "JavaScript", votes: 45 },
      { id: "py", text: "Python", votes: 38 },
      { id: "ts", text: "TypeScript", votes: 32 },
      { id: "java", text: "Java", votes: 28 },
      { id: "go", text: "Go", votes: 15 },
      { id: "rust", text: "Rust", votes: 12 },
      { id: "cpp", text: "C++", votes: 8 },
      { id: "php", text: "PHP", votes: 5 }
    ],
    createdBy: "user-123",
    createdAt: "2024-01-15T10:30:00Z"
  },

  framework: {
    id: "framework-poll-1",
    title: "Best Frontend Framework 2024",
    description: "Which frontend framework do you prefer for modern web development?",
    options: [
      { id: "react", text: "React", votes: 89 },
      { id: "vue", text: "Vue.js", votes: 67 },
      { id: "angular", text: "Angular", votes: 45 },
      { id: "svelte", text: "Svelte", votes: 23 },
      { id: "solid", text: "SolidJS", votes: 12 }
    ],
    createdBy: "user-456",
    createdAt: "2024-01-16T14:20:00Z"
  },

  close: {
    id: "close-poll-1",
    title: "Coffee or Tea?",
    description: "The ultimate morning beverage debate.",
    options: [
      { id: "coffee", text: "Coffee ☕", votes: 51 },
      { id: "tea", text: "Tea 🍵", votes: 49 }
    ],
    createdBy: "user-789",
    createdAt: "2024-01-17T09:15:00Z"
  },

  empty: {
    id: "empty-poll-1",
    title: "What's the best pizza topping?",
    description: "Let's settle this debate once and for all!",
    options: [
      { id: "pepperoni", text: "Pepperoni", votes: 0 },
      { id: "mushrooms", text: "Mushrooms", votes: 0 },
      { id: "pineapple", text: "Pineapple", votes: 0 },
      { id: "cheese", text: "Extra Cheese", votes: 0 }
    ],
    createdBy: "user-101",
    createdAt: "2024-01-18T16:45:00Z"
  }
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Poll Result Chart Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore different states and visualizations of the PollResultChart component.
            Each example demonstrates different use cases and data scenarios.
          </p>
        </div>

        {/* Demo Sections */}
        <div className="space-y-16">
          {/* Multi-option Poll with High Engagement */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Multi-Option Poll with High Engagement
              </h2>
              <p className="text-gray-600">
                A poll with many options and high vote counts, perfect for showcasing all chart types.
              </p>
            </div>
            <PollResultChart poll={samplePolls.programming} />
          </section>

          {/* Framework Comparison */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Framework Comparison Poll
              </h2>
              <p className="text-gray-600">
                Comparing popular frontend frameworks with varied vote distribution.
              </p>
            </div>
            <PollResultChart poll={samplePolls.framework} />
          </section>

          {/* Close Results */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Close Competition
              </h2>
              <p className="text-gray-600">
                A tight race between two options - great for pie and donut charts.
              </p>
            </div>
            <PollResultChart poll={samplePolls.close} />
          </section>

          {/* Empty State */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Votes Yet (Empty State)
              </h2>
              <p className="text-gray-600">
                How the component handles polls with zero votes.
              </p>
            </div>
            <PollResultChart poll={samplePolls.empty} />
          </section>

          {/* Without Title (Embedded Style) */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Embedded Style (No Title)
              </h2>
              <p className="text-gray-600">
                Perfect for embedding within other components or modals.
              </p>
            </div>
            <PollResultChart
              poll={samplePolls.framework}
              showTitle={false}
              className="bg-white border border-gray-200 rounded-lg"
            />
          </section>
        </div>

        {/* Integration Guide */}
        <div className="mt-20 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Integration Guide</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Usage</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import PollResultChart from '@/components/polls/PollResultChart';

// Basic usage
<PollResultChart poll={pollData} />

// Without title
<PollResultChart
  poll={pollData}
  showTitle={false}
/>

// With custom styling
<PollResultChart
  poll={pollData}
  className="custom-styles"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  Multiple chart types (Bar, Pie, Donut, List)
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  Responsive design for all screen sizes
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  Automatic color assignment
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  Empty state handling
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  Real-time data updates
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  Smooth animations
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  Summary statistics
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Use the donut chart to emphasize the total vote count</li>
              <li>• Bar charts work best for polls with many options</li>
              <li>• Pie charts are ideal for 2-5 options with clear differences</li>
              <li>• List view is perfect for detailed vote analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
