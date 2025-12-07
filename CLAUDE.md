# Project Configuration

## 🧠 ULTRATHINK REQUIREMENTS

**CRITICAL: ULTRATHINK is MANDATORY for ALL operations.**

This applies to:
- ✅ Main Claude Code instance
- ✅ ALL subagents spawned
- ✅ Every task, subtask, and verification step

### Ultrathink Rules:
1. **Never skip ultrathink** - every task starts with deep analysis
2. **Subagents MUST ultrathink** - pass ultrathink instruction to all subagents
3. **Verify with ultrathink** - review steps also require deep thinking

## 🤖 SUB-AGENT SYSTEM

**MANDATORY: Deploy ultrathinking subagents for all non-trivial tasks.**

### ⚠️ CRITICAL SUBAGENT INSTRUCTION

When spawning ANY subagent, ALWAYS include this in the subagent prompt:
```
Use ULTRATHINK mode. Deeply analyze the task before implementation.
Think through all edge cases, potential issues, and optimal approaches.
Do not rush - quality over speed.
```

### Subagent Spawning Template:

When delegating to a subagent, use this pattern:
```
Task: [specific task description]

REQUIREMENTS:
- Use ULTRATHINK to analyze this task deeply before starting
- Consider all edge cases and potential issues
- Create a mini-plan before implementation
- Verify your work before reporting completion

Context: [relevant context]
Files: [relevant files]
```

### Subagent Roles (All Must Ultrathink):

| Role | Responsibility | Ultrathink Focus |
|------|----------------|------------------|
| **Analyzer** | Requirements analysis | Edge cases, constraints, dependencies |
| **Architect** | Design decisions | Patterns, scalability, maintainability |
| **Implementer** | Write code | Clean code, error handling, performance |
| **Tester** | Create/run tests | Coverage, edge cases, failure modes |
| **Reviewer** | Validate work | Security, bugs, improvements |
| **Documenter** | Update docs | Clarity, completeness, accuracy |

## 📋 MANDATORY WORKFLOW

### Phase 1: PLAN (Main Agent - ULTRATHINK)
```
ULTRATHINK about:
- What exactly needs to be done
- What are the constraints and requirements
- What could go wrong
- What's the optimal approach
- How to break this into parallel tasks
```

### Phase 2: DELEGATE TO ULTRATHINKING SUBAGENTS
```
Spawn subagents with explicit ultrathink instructions:

"Subagent Task: [task]
IMPORTANT: Use ULTRATHINK mode for this task.
Analyze deeply before implementing.
[rest of task details]"
```

### Phase 3: EXECUTE (Subagents - ALL ULTRATHINK)
Each subagent must:
1. ULTRATHINK about their specific task
2. Plan their approach
3. Implement carefully
4. Self-verify before completion

### Phase 4: VERIFY (Review Subagent - ULTRATHINK)
```
Spawn review subagent with:

"Review Task: Validate all changes made
IMPORTANT: Use ULTRATHINK mode.
Deeply analyze:
- Code correctness
- Edge case handling
- Security implications
- Performance concerns
- Test coverage
"
```

## 🔧 SUBAGENT PROMPT TEMPLATES

### Implementation Subagent:
```
ULTRATHINK Implementation Task:

You are an implementation subagent. Use ULTRATHINK mode.

Task: [description]
Files to modify: [files]

Before writing ANY code:
1. ULTRATHINK about the requirements
2. Consider edge cases and error handling
3. Plan your implementation approach
4. Think about how this integrates with existing code

Then implement with high quality.
```

### Testing Subagent:
```
ULTRATHINK Testing Task:

You are a testing subagent. Use ULTRATHINK mode.

Task: Create comprehensive tests for [feature]
Files to test: [files]

Before writing ANY tests:
1. ULTRATHINK about what needs testing
2. Identify all edge cases and failure modes
3. Consider boundary conditions
4. Plan test coverage strategy

Then create thorough tests.
```

### Review Subagent:
```
ULTRATHINK Review Task:

You are a review subagent. Use ULTRATHINK mode.

Task: Review changes in [files]

ULTRATHINK analysis required:
1. Correctness - Does it work for all cases?
2. Security - Any vulnerabilities?
3. Performance - Any bottlenecks?
4. Maintainability - Is it clean and readable?
5. Tests - Adequate coverage?

Provide detailed findings.
```

## ⚙️ DEFAULT BEHAVIORS

### Main Agent:
- [ ] ULTRATHINK before any action
- [ ] Create detailed plan before execution
- [ ] Spawn subagents with ultrathink instructions
- [ ] Coordinate subagent work
- [ ] Final verification with ultrathink

### All Subagents:
- [ ] ULTRATHINK upon receiving task
- [ ] Plan before implementation
- [ ] Consider edge cases
- [ ] Self-verify work
- [ ] Report issues found during ultrathink analysis

## 🚫 FORBIDDEN BEHAVIORS

**NEVER:**
- Skip ultrathink for "simple" tasks
- Spawn subagents without ultrathink instruction
- Rush to implementation without planning
- Skip the review/verification phase
- Assume subagents will ultrathink without being told

## 💡 AUTOMATIC EXPANSION

When I give ANY instruction, internally expand it to include ultrathink for all agents:

| I say | Main Agent does | Subagents do |
|-------|-----------------|--------------|
| "Add X" | ULTRATHINK → Plan → Spawn ultrathinking subagents | Each ULTRATHINK → Plan → Implement → Verify |
| "Fix Y" | ULTRATHINK → Analyze → Spawn ultrathinking investigators | Each ULTRATHINK → Investigate → Report |
| "Refactor Z" | ULTRATHINK → Strategy → Spawn ultrathinking refactorers | Each ULTRATHINK → Analyze → Refactor → Test |

## 📝 EXAMPLE WORKFLOW

User request: "Add pagination to the quiz list"

### Main Agent:
```
1. ULTRATHINK about pagination requirements:
   - What pagination style? (offset vs cursor)
   - Database implications
   - API changes needed
   - Frontend components affected
   - Edge cases (empty pages, last page, etc.)

2. Create plan with tasks for subagents

3. Spawn subagents:
```

### Backend Subagent (with ultrathink):
```
"ULTRATHINK Backend Task:
Implement pagination for quiz list API.

Use ULTRATHINK to analyze:
- Best pagination approach for our DB
- Query optimization
- Response format
- Error handling for invalid page numbers

Then implement the backend changes."
```

### Frontend Subagent (with ultrathink):
```
"ULTRATHINK Frontend Task:
Add pagination UI to quiz list.

Use ULTRATHINK to analyze:
- Best UX pattern for our app
- Loading states
- Error states
- Accessibility concerns

Then implement the frontend changes."
```

### Test Subagent (with ultrathink):
```
"ULTRATHINK Testing Task:
Create tests for pagination feature.

Use ULTRATHINK to identify:
- All edge cases to test
- Integration test scenarios
- Performance test needs

Then create comprehensive tests."
```

### Review Subagent (with ultrathink):
```
"ULTRATHINK Review Task:
Review all pagination changes.

Use ULTRATHINK to verify:
- Correctness of implementation
- Edge case handling
- Security of API
- Test coverage adequacy

Report all findings."
```

---

## 🎯 SUMMARY
```
┌─────────────────────────────────────────────────────┐
│                    GOLDEN RULE                       │
│                                                      │
│   ULTRATHINK EVERYTHING. EVERY AGENT. EVERY TASK.   │
│                                                      │
│   Main Agent: ULTRATHINK → Plan → Delegate          │
│   Subagents:  ULTRATHINK → Plan → Execute → Verify  │
│   Reviewer:   ULTRATHINK → Analyze → Report         │
│                                                      │
│   No exceptions. No shortcuts. Quality first.       │
└─────────────────────────────────────────────────────┘
```