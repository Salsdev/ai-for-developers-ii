"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * @typedef {Object} PollOption
 * @property {string} id
 * @property {string} text
 * @property {number} votes
 */

/**
 * @typedef {Object} Poll
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {PollOption[]} options
 * @property {string} [createdBy]
 * @property {string} [created_by]
 * @property {string} [createdAt]
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} PollResultChartProps
 * @property {Poll} poll
 * @property {boolean} [showTitle]
 * @property {string} [className]
 */

/**
 * @typedef {'bar' | 'pie' | 'donut' | 'list'} ChartType
 */

const COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
  "#F97316", // orange-500
  "#EC4899", // pink-500
  "#6366F1", // indigo-500
];

export default function PollResultChart({
  poll,
  showTitle = true,
  className = "",
}) {
  const [chartType, setChartType] = useState("bar");

  const totalVotes = useMemo(
    () => poll.options.reduce((sum, option) => sum + option.votes, 0),
    [poll.options],
  );

  const optionsWithPercentage = useMemo(
    () =>
      poll.options
        .map((option, index) => ({
          ...option,
          percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0,
          color: COLORS[index % COLORS.length],
        }))
        .sort((a, b) => b.votes - a.votes),
    [poll.options, totalVotes],
  );

  const BarChart = () => {
    const maxVotes = Math.max(...optionsWithPercentage.map((o) => o.votes), 1);

    return (
      <div className="space-y-4">
        {optionsWithPercentage.map((option) => (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 truncate flex-1 mr-2">
                {option.text}
              </span>
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-semibold text-gray-700">
                  {option.votes}
                </span>
                <span className="text-gray-500">
                  ({option.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(option.votes / maxVotes) * 100}%`,
                  backgroundColor: option.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const PieChart = () => {
    const size = 200;
    const center = size / 2;
    const radius = 80;

    let cumulativePercentage = 0;

    const slices = optionsWithPercentage.map((option) => {
      const startAngle = cumulativePercentage * 3.6; // Convert to degrees
      const endAngle = (cumulativePercentage + option.percentage) * 3.6;
      cumulativePercentage += option.percentage;

      const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
      const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

      const largeArcFlag = option.percentage > 50 ? 1 : 0;

      const x1 = center + radius * Math.cos(startAngleRad);
      const y1 = center + radius * Math.sin(startAngleRad);
      const x2 = center + radius * Math.cos(endAngleRad);
      const y2 = center + radius * Math.sin(endAngleRad);

      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      return { ...option, pathData };
    });

    return (
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <svg width={size} height={size} className="drop-shadow-sm">
            {slices.map((slice) => (
              <path
                key={slice.id}
                d={slice.pathData}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </svg>
        </div>
        <div className="space-y-2 flex-1">
          {optionsWithPercentage.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: option.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {option.text}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    {option.votes} ({option.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DonutChart = () => {
    const size = 200;
    const center = size / 2;
    const radius = 80;
    const innerRadius = 50;

    let cumulativePercentage = 0;

    const slices = optionsWithPercentage.map((option) => {
      const startAngle = cumulativePercentage * 3.6;
      const endAngle = (cumulativePercentage + option.percentage) * 3.6;
      cumulativePercentage += option.percentage;

      const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
      const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

      const largeArcFlag = option.percentage > 50 ? 1 : 0;

      const x1 = center + radius * Math.cos(startAngleRad);
      const y1 = center + radius * Math.sin(startAngleRad);
      const x2 = center + radius * Math.cos(endAngleRad);
      const y2 = center + radius * Math.sin(endAngleRad);

      const ix1 = center + innerRadius * Math.cos(startAngleRad);
      const iy1 = center + innerRadius * Math.sin(startAngleRad);
      const ix2 = center + innerRadius * Math.cos(endAngleRad);
      const iy2 = center + innerRadius * Math.sin(endAngleRad);

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${ix2} ${iy2}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
        "Z",
      ].join(" ");

      return { ...option, pathData };
    });

    return (
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-shrink-0 relative">
          <svg width={size} height={size} className="drop-shadow-sm">
            {slices.map((slice) => (
              <path
                key={slice.id}
                d={slice.pathData}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {totalVotes}
              </div>
              <div className="text-sm text-gray-500">Total Votes</div>
            </div>
          </div>
        </div>
        <div className="space-y-2 flex-1">
          {optionsWithPercentage.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: option.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {option.text}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    {option.votes} ({option.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ListView = () => (
    <div className="space-y-3">
      {optionsWithPercentage.map((option, index) => (
        <div
          key={option.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-gray-200 text-sm font-semibold text-gray-600">
              #{index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {option.text}
              </div>
              <div className="text-sm text-gray-500">
                {option.percentage.toFixed(1)}% of total votes
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-gray-900">
              {option.votes}
            </div>
            <div className="text-sm text-gray-500">votes</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <BarChart />;
      case "pie":
        return <PieChart />;
      case "donut":
        return <DonutChart />;
      case "list":
        return <ListView />;
      default:
        return <BarChart />;
    }
  };

  const chartButtons = [
    { type: "bar", label: "Bar Chart", icon: "📊" },
    { type: "pie", label: "Pie Chart", icon: "🥧" },
    { type: "donut", label: "Donut Chart", icon: "🍩" },
    { type: "list", label: "List View", icon: "📋" },
  ];

  if (totalVotes === 0) {
    return (
      <Card className={`border-0 shadow-sm ${className}`}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {poll.title} - Results
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No votes yet
            </h3>
            <p className="text-gray-500">
              Be the first to vote on this poll to see the results!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-0 shadow-sm ${className}`}>
      {showTitle && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {poll.title} - Results
            </CardTitle>
            <div className="text-sm text-gray-500">
              {totalVotes} total votes
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-6">
          {/* Chart Type Selector */}
          <div className="flex flex-wrap gap-2">
            {chartButtons.map((button) => (
              <Button
                key={button.type}
                variant={chartType === button.type ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType(button.type)}
                className="text-xs"
              >
                <span className="mr-1">{button.icon}</span>
                {button.label}
              </Button>
            ))}
          </div>

          {/* Chart Content */}
          <div className="min-h-[200px]">{renderChart()}</div>

          {/* Summary Stats */}
          <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {totalVotes}
              </div>
              <div className="text-sm text-gray-500">Total Votes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {poll.options.length}
              </div>
              <div className="text-sm text-gray-500">Options</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {optionsWithPercentage[0]?.percentage.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-gray-500">Leading Option</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {optionsWithPercentage[0]?.votes || 0}
              </div>
              <div className="text-sm text-gray-500">Top Votes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
