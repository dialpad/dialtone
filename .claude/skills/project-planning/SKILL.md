---
name: project-planning
description: Create standardized, structured project plan documents with consistent formatting, appropriate detail levels, and clear implementation steps. Use when creating technical plans, feature specifications, refactoring plans, or any project documentation requiring structured implementation steps. Plans are stored in /docs/plans/ organized by status (active/future/archive) with kebab-case naming and include executive summaries after phase completion.
---

# Project Planning

Create consistent, scannable project plan documents that focus on outcomes, guardrails, and implementation steps rather than verbose explanations or code examples.

## When to Use This Skill

Create a plan document when:

- Implementing new features or systems
- Refactoring existing code
- Planning technical migrations
- Documenting architectural decisions
- User explicitly requests a "plan" or "plan document"

Do NOT create plans for:

- Simple, single-step tasks
- Exploratory analysis or research questions
- Quick bug fixes without architectural impact
- General documentation (use appropriate doc type instead)
- Feature tracking documents (use separate tracking doc, link in References)

## Plan Document Structure

ALL plan documents MUST follow this exact structure:

```markdown
# [Project Name]

## Overview

**Status:** [Draft/In Progress/Complete]
**Created:** [YYYY-MM-DD]
**Last Updated:** [YYYY-MM-DD]

[2-3 sentence description of what this plan accomplishes and why it matters]

## Goals

- [Primary goal 1]
- [Primary goal 2]
- [Primary goal 3]

## Non-Goals

- [What this plan explicitly does NOT cover]
- [Scope limitations]

## Success Criteria

- [Measurable outcome 1]
- [Measurable outcome 2]

## Constraints & Guardrails

**Technical Constraints:**

- [Constraint 1]

**Business Constraints:**

- [Constraint 2]

**Documentation Principle:**

- ⚠️ **CRITICAL**: After ANY significant code change, implementation, or refactoring, the plan MUST include explicit steps to identify and update affected markdown files, README files, and documentation
- This includes: component READMEs, feature docs in `/docs/features/`, architecture docs in `/docs/architecture/`, and project guidance files (CLAUDE.md, AGENTS.md)
- Documentation updates are not optional follow-ups; they are required completion steps

**Key Risks:**

- [Risk 1]: [Mitigation approach]

## Implementation Steps

[See Implementation Steps section below for detailed format]

## Phase Completion Summaries

[Added after each phase completes - see Phase Completion section below]

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]

## References

- [Related docs, tickets, or resources]
```

## Implementation Steps Format

Implementation steps MUST follow these rules:

### Step Numbering Rules

**Simple projects (< 10 steps):**

```markdown
## Implementation Steps

1. [Step name]
2. [Step name]
3. [Step name]
```

**Complex projects (10+ steps or logical groupings):**

```markdown
## Implementation Steps

### Phase 1: [Phase Name]

1. [Step name]
2. [Step name]
3. [Step name]

### Phase 2: [Phase Name]

4. [Step name]
5. [Step name]
```

**CRITICAL RULES:**

- ❌ NEVER use decimal numbering (1.1, 1.2, 2.1, etc.)
- ✅ Use sequential integers (1, 2, 3, 4...)
- ✅ Use phases ONLY to group related steps in large efforts
- ✅ Number sequentially across all phases (don't restart at 1)

### Step Content Format

Each step should be concise and outcome-focused:

```markdown
1. **[Action verb] [component/area]**
   - What: [One sentence describing what will be done]
   - Why: [Brief rationale if not obvious]
   - Considerations: [Guardrails, edge cases, or risks]
   - Dependencies: [What must be complete first, if any]
```

**Example:**

```markdown
1. **Update authentication middleware**
   - What: Add JWT token validation to auth middleware
   - Why: Enable stateless authentication for API clients
   - Considerations: Maintain backward compatibility with session auth; validate token expiry
   - Dependencies: Step 3 (JWT utility functions must exist)
```

## What to Include vs. Exclude

### ✅ DO Include:

- **Desired outcomes** - What the end state looks like
- **Guardrails** - Things that must NOT break or change
- **Edge cases** - Special conditions to handle
- **Dependencies** - Order of operations
- **Risks** - What could go wrong and how to mitigate
- **Validation points** - How to confirm success
- **Brief rationale** - Why this approach

### ❌ DO NOT Include:

- **Code examples** - Unless absolutely critical for understanding (rare)
- **Verbose explanations** - Keep descriptions to 1-2 sentences
- **Implementation details** - How to write specific functions
- **Tutorial content** - The plan is not a coding guide
- **Multiple alternative plans** - One clear plan per document
- **Excessive detail** - Focus on what and why, not how

## Phase Completion Summaries

After completing each phase (or major milestone), add an executive summary:

```markdown
## Phase Completion Summaries

### Phase 1 Complete (YYYY-MM-DD)

**Completed:**

- Added JWT authentication middleware
- Implemented token generation on login
- Updated user model with token fields

**Modified:**

- Changed login endpoint from session-based to hybrid (sessions + JWT)
- Reason: Maintain backward compatibility during migration

**Removed:**

- Deprecated old session validation helper functions
- Reason: Replaced by JWT validation

**Deviations from Plan:**

- Combined steps 2 and 3 as they shared implementation
- Added rate limiting to token endpoint (not originally planned but needed)

**Blockers/Issues:**

- None
```

**Format rules:**

- Keep each item to one line
- Include why for modifications/removals
- Note any deviations from original plan
- Document blockers even if resolved

## File Location and Naming

**ALL plan documents MUST:**

- Be stored in `/docs/plans/` directory with appropriate subdirectory
- Use lowercase kebab-case naming
- Have `.md` extension

**Subdirectory Organization:**

Plans are organized by status in three subdirectories:

- `/docs/plans/active/` - Plans currently being worked on
- `/docs/plans/future/` - Planned work not yet started
- `/docs/plans/archive/` - Completed plans for reference

**Examples:**

- ✅ `/docs/plans/active/authentication-refactor.md`
- ✅ `/docs/plans/future/database-migration-plan.md`
- ✅ `/docs/plans/archive/api-v2-implementation.md`
- ❌ `/docs/plans/Authentication_Refactor.md` (wrong case)
- ❌ `/docs/plans/active/api_v2_plan.md` (snake_case not kebab-case)
- ❌ `/authentication-plan.md` (not in /docs/plans/)
- ❌ `/docs/authentication-refactor.md` (missing subdirectory)

## Creating a Plan Document

Follow this workflow:

1. **Confirm scope** - Ensure the request warrants a plan document
2. **Ask clarifying questions** - Understand goals, constraints, context
3. **Create document structure** - Use the exact template above
4. **Fill in sections** - Focus on outcomes and guardrails
5. **Review for violations** - Check for code examples, decimal numbering, verbosity
6. **Save to appropriate subdirectory** - Use `/docs/plans/active/` for new work, `/docs/plans/future/` for planned work, with kebab-case name
7. **Confirm with user** - Show document location and ask if revisions needed

## Updating Existing Plans

When asked to update a plan:

1. **Read the existing plan** from `/docs/plans/` (search across `active/`, `future/`, `archive/` subdirectories if needed)
2. **Preserve structure** - Keep the same format
3. **Update relevant sections** - Don't rewrite unnecessarily
4. **Update "Last Updated" date**
5. **Update Status field** if plan status has changed
6. **Move to appropriate subdirectory** if status changed (e.g., move from `active/` to `archive/` when complete)
7. **Save back to same location** (or new location if moved)

## Adding Phase Completion Summaries

When a phase is completed:

1. **Read the plan** from `/docs/plans/` (typically in `active/` subdirectory)
2. **Add new summary** under "Phase Completion Summaries" section
3. **Follow the exact format** shown above
4. **Update "Last Updated" date**
5. **Move to `archive/` if plan is complete**
6. **Save back to appropriate location**

## Common Mistakes to Avoid

❌ **Including multiple plan options**

```markdown
## Option 1: Microservices approach

## Option 2: Monolith approach
```

→ Present ONE recommended approach. Discuss alternatives with user first.

❌ **Using decimal step numbering**

```markdown
1.1 Create database schema
1.2 Add migrations
```

→ Use sequential integers: 1, 2, 3

❌ **Including code examples**

````markdown
3. Add validation function
   ```python
   def validate_user(user):
       if not user.email:
           raise ValueError()
   ```
````

````
→ Describe what the function should do, not how to write it

❌ **Overly verbose descriptions**
```markdown
1. Update the authentication middleware by first examining the current implementation, then identifying the areas that need modification, specifically focusing on...
````

→ Be concise: "Add JWT validation to authentication middleware"

❌ **Phases without steps**

```markdown
### Phase 1: Setup

[No numbered steps]
```

→ Phases are only grouping mechanisms. Always include numbered steps.

## Multi-Document Plans

If a project genuinely requires multiple documents:

- Create a main plan: `/docs/plans/active/project-name-overview.md`
- Reference sub-plans: `/docs/plans/active/project-name-phase-1.md`
- Keep each document focused on one aspect
- Link between documents in References section
- Move all related documents together when archiving

## Quality Checklist

Before finalizing any plan, verify:

- [ ] Document is in `/docs/plans/` with appropriate subdirectory (`active/`, `future/`, or `archive/`)
- [ ] Filename is lowercase kebab-case
- [ ] All required sections present
- [ ] Steps numbered sequentially (no decimals)
- [ ] No code examples (unless critically necessary)
- [ ] Descriptions are concise (1-2 sentences)
- [ ] Only ONE implementation approach
- [ ] Phases used only for large efforts
- [ ] Success criteria are measurable
- [ ] Constraints and guardrails identified

## Example Plan

See below for a complete example following all guidelines:

```markdown
# API Rate Limiting Implementation

## Overview

**Status:** Draft
**Created:** 2025-10-22
**Last Updated:** 2025-10-22

Implement rate limiting across all API endpoints to prevent abuse and ensure fair resource allocation. This will protect the system from excessive requests and improve reliability for all users.

## Goals

- Prevent API abuse through request rate limiting
- Protect backend resources from overload
- Maintain response times under load

## Non-Goals

- User quota management (separate billing concern)
- Rate limiting for internal services
- Geographic-based access restrictions

## Success Criteria

- 99.9% of legitimate requests complete successfully
- No successful DoS attacks in testing
- Response times remain under 200ms at 90th percentile

## Constraints & Guardrails

**Technical Constraints:**

- Must work with existing Redis infrastructure
- Cannot add more than 2ms latency to requests
- Must preserve existing API contracts

**Business Constraints:**

- Free tier: 100 requests/minute
- Paid tier: 1000 requests/minute

**Key Risks:**

- False positives blocking legitimate users: Mitigate with exponential backoff headers
- Redis failure causing cascading issues: Implement fallback to memory-based limiting

## Implementation Steps

### Phase 1: Core Infrastructure

1. **Add Redis rate limit counter**
   - What: Create Redis key structure for tracking request counts per user
   - Why: Centralized counting across all API servers
   - Considerations: Use sliding window algorithm to prevent boundary gaming
   - Dependencies: None

2. **Create rate limit middleware**
   - What: Add Express middleware to check and enforce limits
   - Why: Single enforcement point for all routes
   - Considerations: Must handle Redis failures gracefully; return 429 status with Retry-After header
   - Dependencies: Step 1

3. **Add rate limit headers**
   - What: Include X-RateLimit-\* headers in all API responses
   - Why: Help clients implement proper backoff strategies
   - Considerations: Include limit, remaining, and reset timestamp
   - Dependencies: Step 2

### Phase 2: Testing & Rollout

4. **Create rate limit test suite**
   - What: Add integration tests for various limit scenarios
   - Why: Ensure limits work correctly without blocking legitimate users
   - Considerations: Test boundary conditions, Redis failures, concurrent requests
   - Dependencies: Steps 1-3

5. **Enable shadow mode monitoring**
   - What: Log rate limit violations without enforcing
   - Why: Identify false positives before full enforcement
   - Considerations: Run for 1 week, analyze patterns
   - Dependencies: Steps 1-3

6. **Roll out to production**
   - What: Enable enforcement for all endpoints
   - Why: Protect production systems
   - Considerations: Start with paid tier (lower false positive risk), then free tier
   - Dependencies: Steps 4-5 complete with no major issues

## Phase Completion Summaries

[Will be added as phases complete]

## Open Questions

- [ ] Should websocket connections count against rate limits?
- [ ] How to handle rate limits for admin users?
- [ ] Should we implement per-endpoint limits or global only?

## References

- Existing Redis setup: `/docs/infrastructure/redis-architecture.md`
- API authentication docs: `/docs/api/authentication.md`
```
