# Session Handling Practice

This exercise is about auditing an AI-generated session handler.

## Prompt

- What security or semantic assumptions does this function make?  
- Can it be abused via race conditions or repeated token renewals?  
- What happens if the system clock shifts or the token isn’t tied to user identity?  

## Outcome
- Documented issues in [`AUDIT.md`](./AUDIT.md).
- Wrote a fixed version in [`secureHandler.js`](./secureHandler.js).

