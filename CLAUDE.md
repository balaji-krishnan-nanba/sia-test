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

### Phase 5: DOCUMENT (MANDATORY - After Every Task)
```
Update all relevant .md documentation files:
- SESSION_LOG.md - What was done this session
- CHANGELOG.md - All changes made
- DECISIONS.md - Why decisions were made
- TODO.md - Remaining work
- ARCHITECTURE.md - If structure changed
```

---

## 📚 SESSION CONTINUITY & DOCUMENTATION SYSTEM

**CRITICAL: Maintain comprehensive documentation for all work to enable seamless continuation across sessions.**

### 📁 Required Documentation Files

Maintain these files in the `/docs` directory (create if not exists):
```
project-root/
├── CLAUDE.md                 # This file - project rules
├── docs/
│   ├── SESSION_LOG.md        # Current session activity log
│   ├── CHANGELOG.md          # All changes with dates
│   ├── DECISIONS.md          # Architecture/design decisions & rationale
│   ├── TODO.md               # Pending tasks & backlog
│   ├── WORK_IN_PROGRESS.md   # Unfinished work details
│   ├── ARCHITECTURE.md       # System architecture overview
│   ├── API.md                # API documentation
│   └── BUGS.md               # Known issues & bugs
```

### 📝 SESSION_LOG.md Format

Update at the START and END of every session, and after each significant change:
```markdown
# Session Log

## Session: [DATE] [TIME]

### 🎯 Session Goals
- [What was planned for this session]

### ✅ Completed
- [Task 1]: [Brief description] - Files: [files modified]
- [Task 2]: [Brief description] - Files: [files modified]

### 🔄 In Progress
- [Task]: [Current state, what's done, what remains]
  - Files touched: [list]
  - Blockers: [any issues]
  - Next steps: [specific next actions]

### ❌ Not Started / Deferred
- [Task]: [Reason for deferral]

### 🐛 Issues Encountered
- [Issue]: [How it was resolved or current status]

### 💡 Notes for Next Session
- [Important context for continuation]
- [Decisions that need to be made]
- [Dependencies or blockers]

### 📁 Files Modified This Session
- `path/to/file1.ts` - [what changed]
- `path/to/file2.tsx` - [what changed]

---
[Previous sessions below...]
```

### 📋 CHANGELOG.md Format
```markdown
# Changelog

## [DATE]

### Added
- [New feature/file]: [Description]

### Changed
- [Modified feature/file]: [What changed and why]

### Fixed
- [Bug fix]: [What was broken and how it was fixed]

### Removed
- [Removed feature/file]: [Why it was removed]

### Technical Debt
- [Item]: [Description of debt incurred and why]

---
[Previous entries...]
```

### 🧠 DECISIONS.md Format
```markdown
# Architecture & Design Decisions

## [DATE] - [Decision Title]

### Context
[What situation prompted this decision]

### Options Considered
1. [Option 1]: Pros/Cons
2. [Option 2]: Pros/Cons
3. [Option 3]: Pros/Cons

### Decision
[What was decided]

### Rationale
[Why this option was chosen - ULTRATHINK analysis]

### Consequences
- [Expected positive outcomes]
- [Potential risks or tradeoffs]

### Related Files
- [Files affected by this decision]

---
[Previous decisions...]
```

### 📌 TODO.md Format
```markdown
# TODO & Backlog

## 🔴 High Priority
- [ ] [Task]: [Description] - [Estimated effort]
  - Context: [Why it's important]
  - Files: [Likely files to modify]

## 🟡 Medium Priority
- [ ] [Task]: [Description]

## 🟢 Low Priority / Nice to Have
- [ ] [Task]: [Description]

## 💡 Ideas & Future Enhancements
- [ ] [Idea]: [Description]

## ✅ Recently Completed (move here when done)
- [x] [DATE] - [Task]: [Brief summary]
```

### 🚧 WORK_IN_PROGRESS.md Format
```markdown
# Work In Progress

## 🔄 Currently Active

### [Feature/Task Name]
**Status**: [percentage or stage]
**Started**: [date]
**Last Updated**: [date]

#### What's Done
- [Completed subtask 1]
- [Completed subtask 2]

#### What Remains
- [ ] [Remaining subtask 1]
- [ ] [Remaining subtask 2]

#### Current State
[Detailed description of where things stand]

#### How to Continue
1. [Step 1 to resume work]
2. [Step 2]
3. [Step 3]

#### Files in Progress
- `path/to/file.ts` - [State: complete/partial/not started]
  - [What's done in this file]
  - [What still needs to be done]

#### Dependencies & Blockers
- [Any blockers or dependencies]

#### Context & Notes
- [Important information for whoever continues this]
- [Decisions made during implementation]
- [Gotchas or tricky parts]

---
[Other WIP items...]
```

### 🔄 DOCUMENTATION UPDATE RULES

**MANDATORY: Update documentation at these points:**

| Event | Files to Update |
|-------|-----------------|
| Session Start | SESSION_LOG.md (new entry) |
| After each task completion | SESSION_LOG.md, CHANGELOG.md, TODO.md |
| Design decision made | DECISIONS.md |
| Bug found | BUGS.md |
| Architecture change | ARCHITECTURE.md, DECISIONS.md |
| Session End | SESSION_LOG.md, WORK_IN_PROGRESS.md |
| Leaving work incomplete | WORK_IN_PROGRESS.md (detailed handoff) |

### 📤 END OF SESSION CHECKLIST

Before ending ANY session, MUST complete:
```markdown
## End of Session Checklist

- [ ] SESSION_LOG.md updated with all completed work
- [ ] CHANGELOG.md updated with all changes
- [ ] TODO.md updated (completed items checked, new items added)
- [ ] WORK_IN_PROGRESS.md updated if anything is incomplete
- [ ] DECISIONS.md updated if any decisions were made
- [ ] All code changes committed with descriptive messages
- [ ] Any blockers or issues documented in BUGS.md
- [ ] "Notes for Next Session" section filled out
```

### 🚀 START OF SESSION CHECKLIST

At the START of every session:
```markdown
## Start of Session Checklist

- [ ] Read SESSION_LOG.md - last session's notes
- [ ] Read WORK_IN_PROGRESS.md - any unfinished work
- [ ] Read TODO.md - understand priorities
- [ ] Check BUGS.md - any critical issues
- [ ] Create new session entry in SESSION_LOG.md
- [ ] ULTRATHINK about session goals based on above
```

---

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

IMPORTANT: Report back what files you modified and what changes you made for documentation.
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

IMPORTANT: Report back test files created and coverage for documentation.
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

Provide detailed findings for documentation.
```

### Documentation Subagent:
```
ULTRATHINK Documentation Task:

You are a documentation subagent. Use ULTRATHINK mode.

Task: Update project documentation after [changes made]

Files to update:
- SESSION_LOG.md
- CHANGELOG.md
- [other relevant .md files]

ULTRATHINK about:
1. What information is essential for future sessions
2. How to clearly explain what was done and why
3. What context someone would need to continue this work
4. Any decisions or tradeoffs that should be recorded

Create clear, comprehensive documentation.
```

---

## ⚙️ DEFAULT BEHAVIORS

### Main Agent:
- [ ] ULTRATHINK before any action
- [ ] Create detailed plan before execution
- [ ] Spawn subagents with ultrathink instructions
- [ ] Coordinate subagent work
- [ ] Final verification with ultrathink
- [ ] **UPDATE DOCUMENTATION after every significant change**
- [ ] **Complete end-of-session checklist before stopping**

### All Subagents:
- [ ] ULTRATHINK upon receiving task
- [ ] Plan before implementation
- [ ] Consider edge cases
- [ ] Self-verify work
- [ ] Report issues found during ultrathink analysis
- [ ] **Report changes made for documentation**

---

## 🚫 FORBIDDEN BEHAVIORS

**NEVER:**
- Skip ultrathink for "simple" tasks
- Spawn subagents without ultrathink instruction
- Rush to implementation without planning
- Skip the review/verification phase
- Assume subagents will ultrathink without being told
- **End a session without updating documentation**
- **Leave work incomplete without detailed WORK_IN_PROGRESS.md entry**
- **Make changes without logging them in CHANGELOG.md**
- **Make design decisions without recording in DECISIONS.md**

---

## 💡 AUTOMATIC EXPANSION

When I give ANY instruction, internally expand it to include ultrathink for all agents AND documentation:

| I say | Main Agent does | Subagents do | Documentation |
|-------|-----------------|--------------|---------------|
| "Add X" | ULTRATHINK → Plan → Spawn ultrathinking subagents | Each ULTRATHINK → Plan → Implement → Verify | Update CHANGELOG, SESSION_LOG |
| "Fix Y" | ULTRATHINK → Analyze → Spawn ultrathinking investigators | Each ULTRATHINK → Investigate → Report | Update BUGS.md, CHANGELOG |
| "Refactor Z" | ULTRATHINK → Strategy → Spawn ultrathinking refactorers | Each ULTRATHINK → Analyze → Refactor → Test | Update DECISIONS, ARCHITECTURE, CHANGELOG |
| "Continue" | Read all .md files → ULTRATHINK about state → Resume | Continue with full context | Update SESSION_LOG |

---

## 📝 EXAMPLE: Session Continuity

### Ending Session (User says "I need to stop for today"):
```
Main Agent:
1. ULTRATHINK about current state
2. Identify all incomplete work
3. Update WORK_IN_PROGRESS.md with detailed handoff
4. Update SESSION_LOG.md with session summary
5. Update TODO.md with remaining tasks
6. Commit all documentation changes
7. Provide summary to user
```

### Starting New Session (User says "Let's continue"):
```
Main Agent:
1. Read SESSION_LOG.md (last session)
2. Read WORK_IN_PROGRESS.md (unfinished work)
3. Read TODO.md (priorities)
4. ULTRATHINK about what to do next
5. Create new session entry
6. Present summary and proposed plan to user
```

---

## 🎯 SUMMARY
```
┌─────────────────────────────────────────────────────────────────┐
│                        GOLDEN RULES                              │
│                                                                  │
│   1. ULTRATHINK EVERYTHING. EVERY AGENT. EVERY TASK.            │
│                                                                  │
│   2. DOCUMENT EVERYTHING. EVERY CHANGE. EVERY DECISION.         │
│                                                                  │
│   Main Agent: ULTRATHINK → Plan → Delegate → Document           │
│   Subagents:  ULTRATHINK → Plan → Execute → Verify → Report     │
│   Reviewer:   ULTRATHINK → Analyze → Report                     │
│                                                                  │
│   No exceptions. No shortcuts. Quality first.                   │
│   Future you (or another session) will thank you.               │
└─────────────────────────────────────────────────────────────────┘
```
```

---

## 📁 Initial Documentation Files to Create

When you start using this, ask Claude Code to:
```
"Create the documentation structure in /docs with all the required .md files from CLAUDE.md"