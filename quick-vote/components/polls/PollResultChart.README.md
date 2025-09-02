# PollResultChart Component

A comprehensive React component for displaying poll results with multiple visualization options.

## Overview

The `PollResultChart` component provides an interactive way to display poll results with multiple chart types including bar charts, pie charts, donut charts, and list views. It automatically calculates percentages, sorts results by vote count, and provides a responsive design that works across all device sizes.

## Features

- 📊 **Multiple Chart Types**: Bar, Pie, Donut, and List views
- 🎨 **Automatic Color Assignment**: Beautiful color palette with consistent theming
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- 🔄 **Real-time Updates**: Seamlessly updates when poll data changes
- 📈 **Smart Statistics**: Automatic percentage calculations and summary stats
- 🎯 **Empty State Handling**: Graceful handling of polls with no votes
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🚀 **Performance Optimized**: Efficient rendering with useMemo hooks

## Installation & Usage

### Basic Usage

```jsx
import PollResultChart from '@/components/polls/PollResultChart';

const pollData = {
  id: 'poll-1',
  title: 'Favorite Programming Language',
  description: 'Choose your favorite language',
  options: [
    { id: 'js', text: 'JavaScript', votes: 45 },
    { id: 'py', text: 'Python', votes: 38 },
    { id: 'ts', text: 'TypeScript', votes: 32 }
  ]
};

function MyComponent() {
  return <PollResultChart poll={pollData} />;
}
```

### Without Title (for embedding)

```jsx
<PollResultChart 
  poll={pollData} 
  showTitle={false}
  className="custom-styling"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `poll` | `Poll` | Required | Poll data object with options and votes |
| `showTitle` | `boolean` | `true` | Whether to display the poll title header |
| `className` | `string` | `""` | Additional CSS classes for styling |

### Poll Data Structure

```typescript
interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdBy?: string;
  created_by?: string;
  createdAt?: string;
  created_at?: string;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}
```

## Chart Types

### 1. Bar Chart (Default)
- Horizontal bars showing relative vote distribution
- Perfect for comparing multiple options
- Shows both vote counts and percentages
- Responsive bar widths based on highest vote count

### 2. Pie Chart
- Traditional pie chart with colored segments
- Great for showing proportional relationships
- Includes color-coded legend
- Hover effects for better interaction

### 3. Donut Chart
- Modern donut-style visualization
- Displays total votes in the center
- Clean, minimalist appearance
- Color-coded legend on the side

### 4. List View
- Ranked list format with position numbers
- Shows detailed statistics for each option
- Easy to scan and understand
- Great for mobile devices

## Visual Examples

### Bar Chart View
```
JavaScript    ████████████████████ 45 (39.1%)
Python        ████████████████     38 (33.0%)
TypeScript    █████████████        32 (27.8%)
```

### Summary Statistics
The component automatically displays:
- **Total Votes**: Sum of all votes cast
- **Options**: Number of available choices
- **Leading Option**: Percentage of the winning option
- **Top Votes**: Vote count of the most popular option

## Responsive Behavior

The component adapts to different screen sizes:

- **Mobile**: Stacked layout with simplified charts
- **Tablet**: Balanced layout with medium-sized charts
- **Desktop**: Full layout with large, detailed charts

## Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Clear focus indicators for all interactions

## Customization

### Color Palette

The component uses a predefined color palette that cycles through:
- Blue (#3B82F6)
- Emerald (#10B981) 
- Amber (#F59E0B)
- Red (#EF4444)
- Violet (#8B5CF6)
- Cyan (#06B6D4)
- Lime (#84CC16)
- Orange (#F97316)
- Pink (#EC4899)
- Indigo (#6366F1)

### Custom Styling

Add custom styles using the `className` prop:

```jsx
<PollResultChart 
  poll={pollData}
  className="my-custom-chart border-2 border-gray-300 rounded-xl"
/>
```

## Performance Considerations

The component is optimized for performance:

- **Memoized Calculations**: Vote totals and percentages are cached
- **Efficient Sorting**: Results are sorted once and cached
- **Conditional Rendering**: Charts only render when data is available
- **Minimal Re-renders**: Smart use of React.memo and useMemo

## Error Handling

The component gracefully handles various edge cases:

- **Empty Polls**: Shows encouraging empty state message
- **Single Option**: Displays 100% for the only option
- **Zero Votes**: Prevents division by zero errors
- **Long Text**: Truncates long option names appropriately
- **Invalid Data**: Fails gracefully with sensible defaults

## Integration Examples

### With Real-time Updates

```jsx
function LivePollResults({ pollId }) {
  const [pollData, setPollData] = useState(null);
  
  useEffect(() => {
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('poll-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'votes',
        filter: `poll_id=eq.${pollId}`
      }, (payload) => {
        // Update poll data
        fetchUpdatedPoll();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [pollId]);

  return pollData ? <PollResultChart poll={pollData} /> : <Loading />;
}
```

### In a Modal Dialog

```jsx
<Dialog>
  <DialogContent className="max-w-4xl">
    <PollResultChart 
      poll={selectedPoll} 
      showTitle={false}
      className="border-none shadow-none"
    />
  </DialogContent>
</Dialog>
```

### Dashboard Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {polls.map(poll => (
    <PollResultChart 
      key={poll.id}
      poll={poll}
      className="h-96"
    />
  ))}
</div>
```

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- React 18+
- Tailwind CSS
- Radix UI components (Card, Button)
- Modern JavaScript (ES2020+)

## Contributing

When contributing to this component:

1. Maintain responsive design principles
2. Test across all chart types
3. Verify accessibility with screen readers
4. Add appropriate tests for new features
5. Follow the existing code style and patterns

## Testing

The component includes comprehensive tests covering:

- Basic rendering with different data sets
- Chart type switching functionality
- Empty state handling
- Edge cases (single option, long text, etc.)
- Responsive behavior
- Accessibility features

Run tests with:
```bash
npm test PollResultChart
```

## Changelog

### v1.0.0
- Initial release with four chart types
- Full responsive design
- Comprehensive accessibility support
- Empty state handling
- Performance optimizations