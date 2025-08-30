/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User's email address
 * @property {string} name - User's display name
 * @property {string} [avatar] - User's avatar URL
 * @property {Date} createdAt - Account creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Poll
 * @property {string} id - Unique poll identifier
 * @property {string} title - Poll title
 * @property {string} description - Poll description
 * @property {Array<PollOption>} options - Available poll options
 * @property {string} createdBy - User ID who created the poll
 * @property {Date} createdAt - Poll creation date
 * @property {Date} expiresAt - Poll expiration date
 * @property {boolean} isActive - Whether the poll is currently active
 * @property {boolean} isPublic - Whether the poll is public
 * @property {Array<string>} [allowedVoters] - Array of user IDs allowed to vote (if not public)
 */

/**
 * @typedef {Object} PollOption
 * @property {string} id - Unique option identifier
 * @property {string} text - Option text
 * @property {number} votes - Number of votes for this option
 */

/**
 * @typedef {Object} Vote
 * @property {string} id - Unique vote identifier
 * @property {string} pollId - Poll ID being voted on
 * @property {string} userId - User ID who voted
 * @property {string} optionId - Selected option ID
 * @property {Date} createdAt - Vote timestamp
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user - Current authenticated user
 * @property {boolean} isLoading - Authentication loading state
 * @property {boolean} isAuthenticated - Whether user is authenticated
 */

/**
 * @typedef {Object} CreatePollData
 * @property {string} title - Poll title
 * @property {string} description - Poll description
 * @property {Array<string>} options - Array of option texts
 * @property {Date} [expiresAt] - Optional expiration date
 * @property {boolean} [isPublic] - Whether poll is public (default: true)
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {any} [data] - Response data
 * @property {string} [error] - Error message
 */
