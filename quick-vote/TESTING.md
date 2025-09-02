# Testing Guide

This document provides comprehensive information about the testing setup and practices for the Quick Vote application.

## Overview

The project uses Jest as the testing framework with React Testing Library for component testing. Tests are configured to run in a jsdom environment to simulate browser behavior.

## Setup

### Dependencies

The following testing dependencies are installed:

- `jest` - JavaScript testing framework
- `jest-environment-jsdom` - Browser environment simulation
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers for DOM nodes
- `@testing-library/user-event` - User interaction simulation

### Configuration

#### Jest Configuration (`jest.config.js`)

```javascript
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFiles: ["<rootDir>/jest.env.js"],
  // ... coverage and other configs
}
```

#### Environment Setup (`jest.env.js`)

Loads test environment variables and mocks necessary for testing:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`

#### Test Setup (`jest.setup.js`)

Global mocks and configurations:

- Next.js router mocking
- Next.js navigation mocking
- ResizeObserver and IntersectionObserver mocks
- Window.matchMedia mocking
- Console method cleanup

## Test Structure

```
__tests__/
├── components/          # Component tests
│   └── PollResultChart.simple.test.js
├── hooks/              # Hook tests
│   └── usePolls.simple.test.js
└── smoke.test.js       # Basic smoke tests
```

## Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Coverage Thresholds

Current coverage requirements:
- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

## Testing Patterns

### Component Testing

Example component test structure:

```javascript
describe("ComponentName", () => {
  describe("Basic Rendering", () => {
    it("should render with correct props", () => {
      render(<Component prop="value" />);
      expect(screen.getByText("Expected Text")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should handle click events", async () => {
      const user = userEvent.setup();
      render(<Component />);
      
      const button = screen.getByRole("button");
      await user.click(button);
      
      expect(/* assertion */).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty data", () => {
      render(<Component data={[]} />);
      expect(screen.getByText("No data")).toBeInTheDocument();
    });
  });
});
```

### Hook Testing

Example hook test structure:

```javascript
describe("useCustomHook", () => {
  beforeEach(() => {
    // Setup mocks
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.someValue).toBe(expectedValue);
  });

  it("should handle async operations", async () => {
    const { result } = renderHook(() => useCustomHook());
    
    await act(async () => {
      await result.current.someAsyncFunction();
    });
    
    expect(result.current.someValue).toBe(expectedValue);
  });
});
```

### Mock Patterns

#### Supabase Mocking

```javascript
jest.mock("../../lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// In test
const { supabase } = require("../../lib/supabase");
supabase.from.mockImplementation((table) => {
  if (table === "polls") {
    return {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockData,
        error: null,
      }),
    };
  }
});
```

#### Context Mocking

```javascript
jest.mock("../../contexts/AuthContext", () => ({
  AuthContext: {
    _currentValue: { user: { id: "test-id", email: "test@test.com" } },
  },
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: () => ({ user: { id: "test-id", email: "test@test.com" } }),
}));
```

## Test Categories

### 1. Smoke Tests (`smoke.test.js`)

Basic tests to ensure the testing environment is working:
- Jest configuration
- Environment setup
- Basic DOM operations

### 2. Component Tests

#### PollResultChart Component

Tests cover:
- **Basic Rendering**: Title display, data presentation
- **Empty State**: No votes scenario handling
- **Chart Type Switching**: Bar, pie, donut, list views
- **Data Display**: Vote counts, percentages, sorting
- **Summary Statistics**: Totals, leading options
- **Edge Cases**: Single options, long text, tied results

Key test cases:
- Renders poll title and vote counts correctly
- Shows empty state when no votes exist
- Switches between different chart types
- Handles edge cases like long text and tied votes
- Displays accurate percentages and statistics

### 3. Hook Tests

#### usePolls Hook

Tests cover:
- **fetchPolls**: Successful data fetching and error handling
- **createPoll**: Poll creation with validation and error cases
- **voteOnPoll**: Voting functionality and duplicate prevention
- **editPoll**: Poll modification via API
- **deletePoll**: Poll removal with state updates
- **getPollById**: Finding specific polls in state

Authentication scenarios:
- Authenticated user operations
- Unauthenticated user restrictions
- User logout during operations

## Best Practices

### 1. Test Organization

- Group related tests with `describe` blocks
- Use descriptive test names that explain the behavior
- Follow the Arrange-Act-Assert pattern
- Keep tests focused on single behaviors

### 2. Mocking Strategy

- Mock external dependencies (APIs, databases)
- Use minimal mocking to keep tests realistic
- Mock at the module boundary, not implementation details
- Reset mocks between tests

### 3. Assertions

- Use specific matchers from `@testing-library/jest-dom`
- Test user-visible behavior, not implementation
- Handle async operations with `waitFor` or `act`
- Use `getAllBy*` when multiple elements are expected

### 4. Common Pitfalls

- **Multiple element matches**: Use `getAllBy*` or be more specific
- **Async operations**: Always await or use `waitFor`
- **Mock timing**: Ensure mocks are set up before importing modules
- **State updates**: Use `act` for state changes in hooks

## Coverage Analysis

Current coverage focuses on:
- Core business logic (usePolls hook): ~83%
- Key UI components (PollResultChart): ~38%
- Utility functions: 100%

Areas needing more coverage:
- Authentication components
- Form components (CreatePollForm, EditPollForm)
- PollCard component interactions

## Debugging Tests

### Common Issues

1. **Module not found errors**
   - Check path mappings in `moduleNameMapper`
   - Ensure imports use correct relative/absolute paths

2. **Mock hoisting issues**
   - Use `jest.mock()` at the top level
   - Avoid variable references in mock factories

3. **Async test failures**
   - Use `waitFor` for async operations
   - Check that promises are properly awaited

4. **Environment variable issues**
   - Verify `jest.env.js` is loading correctly
   - Check `.env.test` file exists and contains required vars

### Debugging Commands

```bash
# Run specific test file
npm test -- __tests__/hooks/usePolls.simple.test.js

# Run tests in verbose mode
npm test -- --verbose

# Run single test case
npm test -- --testNamePattern="should create poll successfully"

# Debug test with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand --no-cache
```

## Future Improvements

### Planned Enhancements

1. **Integration Tests**
   - End-to-end user workflows
   - API integration testing
   - Database interaction tests

2. **Performance Tests**
   - Component rendering performance
   - Large dataset handling
   - Memory leak detection

3. **Visual Regression Tests**
   - Chart rendering consistency
   - Responsive layout testing
   - Cross-browser compatibility

4. **Accessibility Tests**
   - Screen reader compatibility
   - Keyboard navigation
   - WCAG compliance

### Test Data Management

Consider implementing:
- Test data factories for consistent mock data
- Snapshot testing for complex UI components
- Property-based testing for edge cases
- Mock service worker for API mocking

## Contributing

When adding new tests:

1. Follow existing naming conventions
2. Add tests for both happy path and error cases
3. Include edge case testing
4. Update coverage thresholds if needed
5. Document any new testing patterns or utilities

### Test Checklist

- [ ] Component renders without errors
- [ ] Props are handled correctly
- [ ] User interactions work as expected
- [ ] Error states are handled gracefully
- [ ] Loading states are tested
- [ ] Accessibility requirements are met
- [ ] Edge cases are covered

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)