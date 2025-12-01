# Claude AI Instructions for App Development

## 🎯 Core Principles for All Tasks

### 1. Session Continuity & Documentation

**ALWAYS maintain session logs for future AI sessions:**

After EVERY significant task, create/update markdown documentation in `docs/sessions/`:

```
docs/sessions/
├── YYYY-MM-DD_feature-name.md          # Feature implementation logs
├── YYYY-MM-DD_bugfix-description.md    # Bug fix logs
├── YYYY-MM-DD_refactor-area.md         # Refactoring logs
└── session-index.md                     # Index of all sessions
```

**Each session log MUST include:**
```markdown
# [Task Name] - YYYY-MM-DD

## Context
- Branch: [current branch]
- Triggered by: [user request or issue]
- Related files: [list all modified files with line numbers]

## Problem Statement
[Clear description of what needed to be done]

## Analysis Performed
- [What you investigated]
- [What you discovered]
- [Key decisions made]

## Changes Made
### File: path/to/file.js
- Lines X-Y: [What changed and why]

## Testing Performed
- [ ] Unit tests added/updated
- [ ] Manual testing steps: [list steps]
- [ ] Edge cases tested: [list cases]
- [ ] Platform testing (if applicable): iOS ✓/✗ | Android ✓/✗ | Web ✓/✗

## Security Considerations
- [Any security implications]
- [Validation added]
- [Data exposure concerns addressed]

## Next Steps / Open Questions
- [ ] [Item 1]
- [ ] [Item 2]

## Commands Run
```bash
# List all terminal commands executed
npm run build
npm test
```

## Related Documentation
- [Link to related session logs]
- [Link to external docs/issues]
```

**Update session index after each task:**
```markdown
# Session Index

## 2025-12-01
- [Feature Implementation](2025-12-01_feature-name.md) - Description
- [Bug Fix](2025-12-01_bugfix-name.md) - Description
```

---

### 2. Mandatory Testing Protocol

**NEVER commit code without testing. ALWAYS follow this sequence:**

#### Before Starting Any Implementation:
1. **Read relevant files completely** (NEVER edit without reading first)
2. Understand current behavior and data flow
3. Identify affected components and dependencies
4. Ask clarifying questions if requirements are ambiguous

#### During Implementation:
5. Write/update tests BEFORE or ALONGSIDE implementation
6. Run existing tests to ensure no regressions
7. Test on all target platforms when applicable

#### After Implementation:
8. **Run all test suites:**
   ```bash
   npm test                    # Run all tests
   npm run test:unit          # Unit tests
   npm run test:integration   # Integration tests
   npm run test:e2e           # End-to-end tests
   ```

9. **Manual testing checklist:**
   ```markdown
   - [ ] Happy path works as expected
   - [ ] Error cases handled gracefully
   - [ ] Edge cases tested (empty states, null values, large datasets)
   - [ ] UI/UX is intuitive
   - [ ] Performance is acceptable
   - [ ] Cross-browser/cross-platform compatibility (if applicable)
   ```

10. **Platform-specific testing (if applicable):**
    - Web: Test on Chrome, Safari, Firefox
    - Mobile: Test on iOS simulator/device and Android emulator/device
    - Desktop: Test on macOS, Windows, Linux

#### Test File Conventions:
- Place tests alongside code or in `__tests__/` directory
- Name tests: `feature.test.js` or `feature.spec.js`
- Test both success and failure paths
- Include edge cases and validation
- Aim for meaningful test coverage (not just 100% for the sake of it)

---

### 3. Security Standards (MANDATORY)

**Every code change MUST be evaluated for security implications:**

#### Input Validation
```javascript
// ALWAYS validate user input
function validateInput(data) {
  if (!data || typeof data !== 'string') {
    throw new Error('Invalid input format');
  }
  if (data.length > MAX_LENGTH) {
    throw new Error('Input exceeds maximum length');
  }
  return sanitize(data);
}
```

#### Data Storage Security
```javascript
// NEVER store sensitive data in plain text
// Use encryption for sensitive data
// Use environment variables for secrets

// GOOD: Secrets in environment variables
const apiKey = process.env.API_KEY;

// BAD: Hardcoded secrets
const apiKey = 'sk_live_12345'; // ❌ NEVER DO THIS
```

#### API Security Checklist
- [ ] HTTPS enforced for all API calls
- [ ] API keys stored in `.env` (NEVER hardcoded in source)
- [ ] Authentication tokens handled securely
- [ ] CORS configured properly
- [ ] Rate limiting implemented (if applicable)
- [ ] Input validation on all endpoints

#### XSS Prevention
```javascript
// ALWAYS sanitize user-generated content
// Use framework built-in protections

// For React:
function DisplayContent({ userText }) {
  // React automatically escapes - this is safe
  return <p>{userText}</p>;

  // NEVER use dangerouslySetInnerHTML without sanitization
  // return <p dangerouslySetInnerHTML={{ __html: userText }} />; // ❌
}

// For vanilla JS, use textContent instead of innerHTML
element.textContent = userInput; // Safe
// element.innerHTML = userInput; // ❌ Dangerous
```

#### Authentication & Authorization
```javascript
// ALWAYS verify user permissions before granting access
function AccessProtectedResource({ user, resource }) {
  if (!user.isAuthenticated) {
    return <LoginPrompt />;
  }

  if (!user.hasPermission(resource)) {
    return <AccessDenied />;
  }

  return <Resource />;
}

// WRONG: Trusting client-side state alone
// if (localStorage.getItem('isAdmin')) { ... } // ❌
```

#### Security Review Checklist (run before every commit):
```markdown
- [ ] No hardcoded secrets, API keys, or tokens
- [ ] All user input validated and sanitized
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention in place
- [ ] HTTPS enforced for all network requests
- [ ] Sensitive data encrypted at rest and in transit
- [ ] No sensitive data logged to console
- [ ] Authentication/authorization verified
- [ ] Dependencies up to date (run `npm audit`)
- [ ] No eval() or Function() constructors used
- [ ] CSRF protection implemented (for web apps)
```

---

### 4. Software Engineering Best Practices

#### Code Quality Standards

**General Guidelines:**
```javascript
// GOOD: Clear, descriptive names
function calculateUserAgeFromBirthdate(birthdate) {
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();
  return age;
}

// BAD: Unclear, abbreviated names
function calc(d) {
  return new Date().getFullYear() - d.getFullYear();
}
```

**Error Handling:**
```javascript
// ALWAYS handle errors gracefully
async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    // Show user-friendly error message
    showErrorNotification('Unable to load data. Please try again.');
    // Return fallback or throw
    return null;
  }
}
```

**DRY Principle (Don't Repeat Yourself):**
```javascript
// GOOD: Reusable function
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Use it everywhere
const price1 = formatCurrency(29.99);
const price2 = formatCurrency(149.99);

// BAD: Repeated logic
const price1 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(29.99);
const price2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(149.99);
```

**Single Responsibility Principle:**
```javascript
// GOOD: Each function does one thing
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sendEmail(email, subject, body) {
  // Email sending logic
}

function registerUser(email, password) {
  if (!validateEmail(email)) {
    throw new Error('Invalid email');
  }
  // Registration logic
  sendEmail(email, 'Welcome!', 'Thanks for registering');
}

// BAD: Function does too many things
function registerUser(email, password) {
  // Validates, registers, sends email all in one place
}
```

**Code Style:**
- Use a linter (ESLint, Prettier)
- Be consistent with existing codebase style
- Use meaningful variable and function names
- Keep functions small (ideally under 50 lines)
- Add comments only when necessary (code should be self-documenting)
- Avoid deep nesting (max 3-4 levels)

---

### 5. Requirement Clarification Protocol

**ALWAYS ask clarifying questions when:**

1. **Requirements are ambiguous:**
   ```
   User: "Make the app faster"

   Claude: "I'd like to clarify what aspects of performance concern you:
   - Page load time?
   - API response time?
   - UI responsiveness?
   - Database query performance?
   - Specific feature that's slow?

   Also, do you have metrics on current performance vs. desired performance?"
   ```

2. **Multiple implementation approaches exist:**
   ```
   User: "Add search functionality"

   Claude: "I can implement search, but I need to understand the scope:

   Option 1: Client-side search (fast, limited to loaded data)
   Option 2: Server-side search (slower, can search all data)
   Option 3: Full-text search engine (Elasticsearch, more complex)

   Questions:
   - What data needs to be searchable?
   - How much data are we searching (100 items vs 1 million)?
   - Real-time results as you type, or search on submit?
   - Any specific search features (filters, fuzzy matching, etc.)?"
   ```

3. **Impact on existing features:**
   ```
   User: "Change the database schema"

   Claude: "Before making this change, I want to confirm:
   - This will affect existing data - do we need a migration script?
   - Will this break any existing API endpoints?
   - How should we handle existing users' data?
   - Is this backwards compatible?
   - Should we test this on a staging environment first?"
   ```

4. **Security/privacy implications:**
   ```
   User: "Store user location data"

   Claude: "Storing location data has important implications:

   Privacy considerations:
   - Do we have user consent?
   - Privacy policy needs updating
   - GDPR/CCPA compliance required
   - Data retention policy needed

   Questions:
   - Why do we need location data?
   - How long should we keep it?
   - Who has access to this data?
   - Is it encrypted?
   - Can users delete their location history?"
   ```

5. **Breaking changes:**
   ```
   User: "Redesign the entire UI"

   Claude: "A complete UI redesign is a major change:

   Considerations:
   - Existing users will need to relearn the interface
   - Will affect all documentation/tutorials
   - Requires extensive testing
   - May impact accessibility

   Questions:
   - What's driving this redesign? (user feedback, branding, etc.)
   - Can we do it incrementally or all at once?
   - Do we have user testing/feedback planned?
   - Is there a timeline for this?
   - Should we keep the old UI as an option temporarily?"
   ```

**Question Template:**
```markdown
## Clarification Needed: [Feature/Change]

### What I understand:
- [List your understanding]

### What's unclear:
1. [Question 1]
2. [Question 2]

### Options I'm considering:
**Option A:** [Description]
- Pros: [List]
- Cons: [List]

**Option B:** [Description]
- Pros: [List]
- Cons: [List]

### Recommended approach:
I recommend [Option X] because [reasoning], but I'll wait for your input.

### Related concerns:
- [Any other considerations]
```

---

### 6. MCP Server Integration

**When to use MCP servers:**

MCP (Model Context Protocol) servers enhance capabilities. Use them when you need:

1. **Database operations** - Complex queries, multiple databases
2. **External API integrations** - Third-party services, APIs
3. **Advanced file operations** - Complex file processing, conversions
4. **Real-time features** - WebSockets, live updates, streaming
5. **Cloud service integration** - AWS, Azure, GCP services
6. **Development tools** - Linting, formatting, testing tools

**MCP Integration Checklist:**
```markdown
1. Identify specific MCP server needed
2. Document why it's necessary
3. Get user approval for external dependency
4. Install and configure MCP server
5. Update environment variables with required credentials
6. Document configuration in project README
7. Test integration thoroughly
8. Add to project dependencies documentation
```

**When NOT to use MCP:**
- For simple tasks that existing tools can handle
- When it adds unnecessary complexity
- If it duplicates existing functionality

---

### 7. Error Resolution Protocol

**When encountering errors, follow this escalation:**

#### Level 1: Standard Debugging (0-2 failed attempts)
1. Read error message carefully
2. Check relevant file(s) for obvious issues
3. Review recent changes
4. Check logs (console, server logs, error monitoring)
5. Verify environment variables and configuration
6. Try standard fix

#### Level 2: Deep Investigation (3-4 failed attempts)
```markdown
## Investigation Steps:
1. Reproduce error in isolation
2. Check dependency versions
3. Search for similar issues:
   - GitHub issues for the library/framework
   - Stack Overflow
   - Official documentation
4. Review project documentation for similar past issues
5. Check git history for related changes
6. Test in different environments (dev, staging, prod)
7. Verify all prerequisites are met
```

#### Level 3: Creative Problem Solving (5+ failed attempts)
**THINK OUTSIDE THE BOX:**

```markdown
## Alternative Approaches:

### 1. Question Assumptions
- Is this the right approach to the problem?
- Can we solve the underlying need differently?
- Is this dependency necessary?
- Are we using the right tool for the job?

### 2. Workarounds
- Can we achieve the same result without the failing code?
- Is there a simpler implementation?
- Can we use a different library/approach?
- Can we defer this to a future version?

### 3. Simplification
- Can we break this into smaller pieces?
- What's the minimal version that would work?
- Can we remove complexity?

### 4. Community Help
- Is this a known issue with a workaround?
- Should we ask for help (Stack Overflow, GitHub issues)?
- Is there a newer version that fixes this?
```

#### Error Documentation (MANDATORY after resolution):
```markdown
# Error: [Error name/description]
Date: YYYY-MM-DD
Environment: Development / Staging / Production

## Error Message
```
[Full error text]
```

## Context
- What were you trying to do?
- What changed recently?

## Attempts Made
1. [First attempt] - Failed because [reason]
2. [Second attempt] - Failed because [reason]
3. [Third attempt] - Failed because [reason]
4. [Creative approach] - ✓ Succeeded

## Root Cause
[What actually caused the error]

## Solution
[How it was fixed - include code snippets if helpful]

## Prevention
[How to avoid this in the future]

## Related Issues
[Links to similar issues, documentation, etc.]
```

Save to: `docs/errors/YYYY-MM-DD_error-description.md`

---

## 📋 Pre-Commit Checklist

**BEFORE EVERY COMMIT, verify:**

```markdown
## Code Quality
- [ ] Linter passes with no errors
- [ ] No commented-out code (remove dead code)
- [ ] No debug console.log statements
- [ ] Code follows project style guide
- [ ] Meaningful commit message prepared

## Functionality
- [ ] Code works as expected
- [ ] No regressions in existing features
- [ ] Edge cases handled

## Testing
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Security
- [ ] No hardcoded secrets or API keys
- [ ] .env updated if new env vars needed
- [ ] Input validation added where needed
- [ ] No security vulnerabilities introduced

## Documentation
- [ ] Session log created/updated in docs/sessions/
- [ ] README updated if needed
- [ ] Comments added for complex logic
- [ ] API documentation updated (if applicable)

## Dependencies
- [ ] No unnecessary dependencies added
- [ ] Package.json updated if dependencies changed
- [ ] npm audit shows no critical vulnerabilities
```

---

## 🔄 Git Workflow

**Branch Strategy:**
```
main/master            # Production-ready code
├── develop           # Development branch (optional)
├── feature/*         # Feature development
├── bugfix/*          # Bug fixes
├── hotfix/*          # Urgent production fixes
└── release/*         # Release preparation
```

**Commit Message Format:**
```
<type>: <short description>

[optional detailed body]

[optional footer with issue references]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring (no functional changes)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling
- `ci`: CI/CD configuration changes

**Examples:**
```
feat: add user authentication with JWT

Implemented JWT-based authentication system with
login, logout, and token refresh endpoints.

Closes #123

---

fix: resolve memory leak in data fetching

The useEffect hook was not cleaning up properly,
causing memory leaks on component unmount.

---

docs: update API documentation for v2 endpoints

Added examples and clarified authentication requirements.
```

---

## 📚 Best Practices Summary

### General Development
1. **Read before you write** - Understand existing code before modifying
2. **Test everything** - No commit without tests
3. **Security first** - Always consider security implications
4. **Ask when unclear** - Clarify requirements before implementation
5. **Document as you go** - Don't leave documentation for later
6. **Keep it simple** - Avoid over-engineering
7. **Be consistent** - Follow existing patterns and style

### Code Review (Self-Review)
Before committing, ask yourself:
- Is this code easy to understand?
- Would someone else understand this in 6 months?
- Have I handled all edge cases?
- Is this the simplest solution?
- Have I introduced any security vulnerabilities?
- Are there any performance implications?
- Does this follow DRY and SOLID principles?

### Problem-Solving Approach
1. **Understand the problem** - Don't jump to solutions
2. **Research existing solutions** - Don't reinvent the wheel
3. **Start simple** - Build incrementally
4. **Test early and often** - Catch issues early
5. **Iterate and improve** - Perfect is the enemy of done
6. **Learn from mistakes** - Document errors and solutions

---

## ✅ Final Reminders

1. **ALWAYS create session logs** - Future you (or future AI) will thank you
2. **ALWAYS test before committing** - No exceptions
3. **ALWAYS check security** - Input validation, no hardcoded secrets
4. **ALWAYS ask when unclear** - Better to clarify than assume wrong
5. **ALWAYS think creatively when stuck** - After 5 attempts, try a different approach
6. **ALWAYS document errors** - Help prevent future occurrences
7. **ALWAYS run linter** - Keep code clean and consistent
8. **ALWAYS read files before editing** - Understand context first
9. **ALWAYS consider the user** - Build for humans, not just machines
10. **ALWAYS update documentation** - Including this file as you learn

---

## 🎓 Continuous Improvement

This document should evolve with the project:

- When you discover a better practice, add it here
- When you solve a tricky problem, document it
- When you make a mistake, document how to prevent it
- When patterns emerge, formalize them here
- When team grows, update to reflect team standards

**This is a living document. Update it as you learn and grow.**

---

Last Updated: 2025-12-01
Project: Life in the UK 2026 - Videos App
Version: 1.0
