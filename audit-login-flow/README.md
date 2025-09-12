# Practice Challenge: Debug a Leaky Auth Flow

This exercise explores common mistakes in AI-generated authentication flows.  
Your task: **audit, identify risks, and suggest fixes**.

---

## 🚩 Insecure Snippet

```js
// AI-generated login function (intentionally leaky)
async function login(email, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  localStorage.setItem("user", JSON.stringify(data.user)); // 🚩 Token not stored securely
  return data;
}

## 🔍 Security Analysis

### Critical Vulnerabilities Identified

1. **Insecure Token Storage**
   - Tokens stored in `localStorage` are vulnerable to XSS attacks
   - No encryption or secure storage mechanism implemented

2. **Missing Security Headers**
   - No `Content-Type: application/json` header specified
   - Credentials transmitted without proper content negotiation

3. **Inadequate Error Handling**
   - No validation for failed authentication attempts
   - Missing checks for malformed server responses
   - No handling of network failures or timeouts

4. **Session Management Gaps**
   - No token expiration handling
   - Missing refresh token mechanism
   - No logout/revocation capabilities

5. **Transport Security Dependencies**
   - Relies solely on TLS for credential protection
   - No additional encryption layers for sensitive data

## 🧠 AI-Assisted Review Strategies

### Inline Code Review Prompts

When using AI development tools (Cursor, GitHub Copilot, etc.), try these focused prompts:

- *"Analyze the security implications of storing authentication tokens in localStorage"*
- *"What are the risks of missing Content-Type headers in authentication requests?"*
- *"How should this function handle authentication failures and error states?"*
- *"What session management features are missing from this login flow?"*

### Comprehensive Security Audit Prompt

*"Perform a complete security audit of this authentication function. Identify vulnerabilities, suggest secure alternatives, and recommend best practices for token storage, error handling, and session management."*

This approach encourages systematic analysis beyond surface-level code review.

## ✅ Key Takeaways

### Security-First Development Principles

- **Defense in Depth**: Implement multiple security layers beyond basic TLS
- **Secure Storage**: Use `httpOnly` cookies or secure token storage mechanisms
- **Comprehensive Error Handling**: Validate all inputs and handle failure scenarios
- **Session Lifecycle Management**: Implement proper token expiration and refresh logic

### AI Code Review Best Practices

- **Targeted Analysis**: Use specific prompts for focused security reviews
- **Holistic Assessment**: Request comprehensive security audits for critical functions
- **Continuous Learning**: Treat AI tools as security education opportunities

⚠️ **Critical Reminder**: Functional code does not equal secure code. Security requires intentional design and thorough validation at every layer.