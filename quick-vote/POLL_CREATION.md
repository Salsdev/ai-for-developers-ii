# Poll Creation Functionality

This document explains how to create polls in the Quick Vote application.

## Overview

The poll creation functionality allows authenticated users to create new polls with multiple options that other users can vote on.

## Database Schema

The poll creation uses three main tables:

### `polls` table
- `id` - UUID primary key
- `title` - Poll title (required)
- `description` - Poll description (required)
- `created_by` - References auth.users(id)
- `created_at` - Timestamp
- `expires_at` - Optional expiration date
- `is_active` - Boolean flag (default: true)

### `poll_options` table
- `id` - UUID primary key
- `poll_id` - References polls(id)
- `text` - Option text (required)
- `created_at` - Timestamp

### `votes` table
- `id` - UUID primary key
- `poll_id` - References polls(id)
- `user_id` - References auth.users(id)
- `option_id` - References poll_options(id)
- `created_at` - Timestamp
- **Constraint**: One vote per user per poll

## How to Create a Poll

### 1. Using the Web Interface

1. Navigate to `/polls/create`
2. Fill in the poll title and description
3. Add at least 2 options (up to 10 options allowed)
4. Click "Create Poll"

### 2. Using the usePolls Hook

```javascript
import { usePolls } from '@/hooks/usePolls'

const { createPoll, isLoading } = usePolls()

const handleCreatePoll = async () => {
  const result = await createPoll({
    title: 'Your poll title',
    description: 'Your poll description',
    options: ['Option 1', 'Option 2', 'Option 3']
  })
  
  if (result.success) {
    console.log('Poll created:', result.poll)
  } else {
    console.error('Error:', result.error)
  }
}
```

### 3. Using the API Route

```javascript
const response = await fetch('/api/polls', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Your poll title',
    description: 'Your poll description',
    options: ['Option 1', 'Option 2', 'Option 3'],
    expiresAt: null // Optional expiration date
  })
})

const data = await response.json()
```

## Validation Rules

### Client-side Validation
- Title is required and cannot be empty
- Description is required and cannot be empty
- At least 2 valid options are required
- Maximum 10 options allowed
- Empty options are filtered out

### Server-side Validation
- User must be authenticated
- Title and description are trimmed of whitespace
- Options are validated and trimmed
- Database constraints prevent invalid data

## Error Handling

Common errors and their meanings:

- `"You must be logged in to create a poll"` - User is not authenticated
- `"Please enter a poll title"` - Title is empty
- `"Please enter a poll description"` - Description is empty  
- `"Please add at least 2 options"` - Less than 2 valid options provided
- `"At least 2 valid options are required"` - Server-side validation failed

## Security Features

- Row Level Security (RLS) ensures users can only create polls when authenticated
- Users can only edit/delete their own polls
- Input sanitization prevents XSS attacks
- Foreign key constraints maintain data integrity

## Components Involved

### `CreatePollForm.jsx`
- React form component for poll creation
- Handles form state and validation
- Integrates with usePolls hook

### `usePolls.js`
- Custom hook for poll operations
- Handles API calls to Supabase
- Manages loading and error states

### `/api/polls/route.js`
- Next.js API route for poll creation
- Server-side validation and error handling
- Direct Supabase integration

## Usage Example

```jsx
'use client'

import { useState } from 'react'
import { usePolls } from '@/hooks/usePolls'

export default function CreatePollExample() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', '']
  })
  
  const { createPoll, isLoading } = usePolls()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await createPoll({
      title: formData.title,
      description: formData.description,
      options: formData.options.filter(opt => opt.trim() !== '')
    })
    
    if (result.success) {
      // Reset form or redirect
      setFormData({ title: '', description: '', options: ['', ''] })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Poll title"
        required
      />
      {/* More form fields... */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Poll'}
      </button>
    </form>
  )
}
```

## Next Steps

After creating a poll:
- The poll appears in the polls list immediately
- Users can vote on the poll
- Poll creator can edit the poll (title/description only)
- Vote counts are updated in real-time
- Poll can be deactivated by the creator

## Troubleshooting

### Poll not appearing after creation
- Check if user is authenticated
- Verify database connection
- Check browser console for errors
- Ensure RLS policies are properly configured

### Validation errors
- Ensure all required fields are filled
- Check that at least 2 options are provided
- Verify options are not empty strings
- Check character limits if any are implemented

### Database errors
- Verify Supabase connection
- Check that tables exist with correct schema
- Ensure RLS policies allow the operation
- Check foreign key constraints