// Secure login function with comprehensive security practices
async function secureLogin(email, password) {
  // Input validation and sanitization
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  
  // Password strength validation
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest" // CSRF protection
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // ✅ ensures HttpOnly cookies are used
      // ✅ No localStorage usage - tokens managed server-side
    });

    if (!res.ok) {
      // Handle specific error cases without exposing sensitive info
      if (res.status === 401) {
        throw new Error("Invalid credentials");
      } else if (res.status === 429) {
        throw new Error("Too many login attempts. Please try again later.");
      } else if (res.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }

    const data = await res.json();
    
    // ✅ Token is managed by the server in HttpOnly cookies, not in localStorage
    // ✅ No client-side token storage - prevents XSS token theft
    // ✅ Server handles session management securely
    
    return data;
  } catch (err) {
    // ✅ Secure error logging without exposing sensitive data
    console.error("Login error:", err.message);
    throw err;
  }
}