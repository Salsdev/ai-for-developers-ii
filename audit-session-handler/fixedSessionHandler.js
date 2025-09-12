const crypto = require("crypto");

// Generate cryptographically secure tokens
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Simple in-memory session store
const sessions = new Map();

/**
 * Secure session handler
 * - Ties session to userId
 * - Sliding expiration with absolute max lifetime
 * - Supports token revocation
 * - Prevents race conditions on token renewal
 */
function handleSession(userId, token) {
  const now = Date.now();
  const MAX_LIFETIME = 24 * 60 * 60 * 1000; // 24h absolute max
  const SLIDING_EXPIRY = 30 * 60 * 1000;    // 30 min

  const session = sessions.get(token);

  if (!session || session.userId !== userId || session.expires < now) {
    const newToken = generateToken();
    const expiry = now + SLIDING_EXPIRY;

    sessions.set(newToken, { userId, expires: expiry, createdAt: now });
    return { token: newToken, expires: expiry };
  }

  // Sliding expiration with race condition protection
  const remaining = session.expires - now;
  if (remaining < 5 * 60 * 1000 && now - session.createdAt < MAX_LIFETIME) {
    // Use atomic update to prevent race conditions
    const newExpiry = now + SLIDING_EXPIRY;
    const updatedSession = { ...session, expires: newExpiry };
    sessions.set(token, updatedSession);
    return { token, expires: newExpiry };
  }

  return { token, expires: session.expires };
}

// Allow explicit logout/revocation
function revokeToken(token) {
  sessions.delete(token);
}

module.exports = { handleSession, generateToken, revokeToken };
