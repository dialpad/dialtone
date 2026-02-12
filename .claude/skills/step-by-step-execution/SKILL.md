---
name: step-by-step-execution
description: Structured workflow for complex tasks requiring deliberate planning, step-by-step execution with pros/cons analysis, and built-in testing. Use when tasks involve multiple interdependent steps, code modifications, file operations, or any work where incremental validation prevents cascading errors. Particularly valuable for debugging, refactoring, system integration, or building complex features. Includes explicit triggers for consistent application across conversations and Claude Code.
---

# Step-by-Step Execution Skill

Structured approach for executing complex tasks through deliberate planning, incremental changes, and continuous validation. **This skill is designed to be consistently applied—Claude should treat it as the default workflow for complex tasks, not something to use only when explicitly named.**

## CRITICAL: Automatic Skill Application

**Claude should apply this skill automatically when:**

- Planning multi-step code changes or refactoring
- Working on debugging or troubleshooting
- Building features with dependencies
- File operations affecting multiple files
- Tasks where mistakes are difficult to reverse
- ANY request that contains phrases like: "fix", "build", "implement", "refactor", "integrate", "set up", "configure", "troubleshoot"

**This is the DEFAULT workflow.** Do not wait to be asked to use it—recognize the task pattern and apply it.

---

## Natural Language Trigger Phrases

Claude will recognize these as signals to apply this skill immediately:

**Direct triggers:**

- "Here's what I need done..."
- "I need to [action] this code"
- "Can you fix/build/implement..."
- "Help me set up..."
- "Let me do this carefully"
- "Walk me through this step by step"
- "Let's be methodical about this"

**Implicit triggers (recognize these as requiring the skill):**

- User asks for code changes or modifications
- User asks to debug or troubleshoot something
- User asks to build a feature or integrate systems
- User asks to set up or configure something
- User's request involves multiple interdependent actions
- User mentions they want to avoid breaking things or need careful execution

**Claude Code specific triggers:**

- User provides a task that involves file modifications
- User asks to refactor, fix, or enhance code
- User asks to integrate multiple components
- User provides what looks like a complex requirement

**When conversation is compacted or history is truncated:**

- Claude should assume this skill is STILL ACTIVE for that session
- Even if the skill hasn't been mentioned recently, maintain the step-by-step discipline
- When resuming after compaction, explicitly note: "I'm continuing to apply the step-by-step execution workflow"

---

## When to Use This Skill

Apply this workflow for:

- Multi-step code modifications or refactoring
- System integration or configuration tasks
- Debugging complex issues with multiple potential causes
- Building features with interdependent components
- File operations affecting multiple files or systems
- Any task where mistakes compound or are difficult to reverse
- Claude Code tasks (almost always—it's the default there)

Do NOT use for:

- Simple, single-operation tasks (1 step, no testing needed)
- Exploratory analysis or research
- Creative writing or content generation (unless structural)
- Straightforward file reading or viewing

---

## Core Workflow

Execute tasks following this four-phase cycle:

### Phase 1: Plan Creation

Before making any changes, create a comprehensive execution plan:

1. **Analyze the request** - Break down what needs to be accomplished
2. **Identify dependencies** - Note what must happen before what
3. **Define discrete steps** - Each step should be independently testable
4. **Specify tests** - Define how to verify each step works
5. **Present the plan** - Show the user the complete plan before starting

**CRITICAL - Plan File Location:**

- **ALL plan files MUST be saved in `/docs/plans/` directory**
- Use descriptive filenames like `feature-name-implementation-plan.md`
- **DO NOT save plans in `.claude/skills/` or any other directory**
- The user may override this location for specific cases

**Plan template:**

```
## Execution Plan

**Goal:** [Clear statement of what will be accomplished]

**Steps:**
1. [Step name]
   - Action: [What will be done]
   - Test: [How to verify it worked]
   - Dependencies: [What must be complete first]

2. [Step name]
   - Action: [What will be done]
   - Test: [How to verify it worked]
   - Dependencies: [What must be complete first]

[Continue for all steps...]

**Estimated complexity:** [Simple/Moderate/Complex]
**Risk factors:** [Any concerns about the approach]
```

### Phase 2: Update Proposal

Before executing each step, present a proposal with analysis:

**Proposal template:**

```
## Step [N]: [Step Name]

**Proposed changes:**
- [Specific change 1]
- [Specific change 2]

**Pros:**
- [Benefit 1]
- [Benefit 2]

**Cons:**
- [Risk or limitation 1]
- [Risk or limitation 2]

**Testing approach:**
- [How this step will be validated]

Ready to proceed with this step?
```

**Wait for user approval before executing the step.** The user may want to modify the approach or skip ahead.

### Phase 3: Execute Single Step

After approval, execute ONLY the current step:

1. Make the proposed changes
2. Document what was actually done
3. Note any deviations from the plan
4. DO NOT proceed to the next step automatically

### Phase 4: Test and Verify

Immediately after execution, validate the change:

1. **Run the defined test** - Execute the specific test for this step
2. **Report results** - Show output, errors, or success indicators
3. **Assess impact** - Confirm this step works as intended
4. **Document learnings** - Note anything unexpected

**Test result template:**

```
## Step [N] Test Results

**Test performed:** [What was tested]
**Result:** [Pass/Fail/Partial]
**Evidence:** [Output, file state, behavior observed]
**Issues found:** [Any problems discovered]
**Next step status:** [Ready to proceed / Needs fixing]
```

Only after successful testing, move to Phase 2 for the next step.

---

## User Control Commands

Once a plan is presented, the user can control execution with these natural language commands:

### Single Step Execution

- **"Go ahead"** or **"Proceed"** → Execute the current proposed step, then present the next proposal
- **"Yes"** → Same as "Go ahead"
- **"Do step 1"** or **"Execute step 2"** → Jump to a specific step

### Batch Execution

- **"Proceed with all"** → Execute all remaining steps without stopping (user assumes responsibility for validation)
- **"Complete all steps"** → Same as above
- **"Let's do this"** → Same as above
- **"Go full speed"** → Same as above

### Partial Batch Execution (Stop at a specific step)

- **"Proceed through testing"** → Execute all steps up to and including the step named "testing", then stop
- **"Complete until step 5"** → Execute steps 1-5, then stop for user review
- **"Do everything except testing"** → Execute all steps except the testing step
- **"Run all setup steps"** → Execute steps that are tagged as "setup" in their description

### Conditional Execution

- **"Proceed if [condition]"** → Execute the step, but only if the condition is met
- **"Do this but don't modify [file]"** → Execute with restrictions
- **"Proceed cautiously"** → Execute the step, but with extra validation checks

### Plan Modifications

- **"Skip step 3"** → Don't execute that step
- **"Swap steps 2 and 3"** → Reorder the plan
- **"What if we [alternative]?"** → Propose a modified approach
- **"Can you add a step for [X]?"** → Extend the plan

### Feedback

- **"Why step 4?"** or **"Explain the approach for step 2"** → Claude explains reasoning
- **"I'm worried about [issue]"** → Claude addresses concerns
- **"This doesn't look right"** → Stop execution, analyze, propose fix

---

## Handling Failures

When a test fails:

1. **Stop immediately** - Do not proceed to subsequent steps
2. **Analyze the failure** - Determine root cause
3. **Propose fix** - Present pros/cons of remediation approach
4. **Wait for approval** - Let user decide whether to fix or revise plan
5. **Test the fix** - Verify the correction before continuing

---

## Handling Plan Changes

If during execution you discover:

- The original plan won't work
- A better approach exists
- Prerequisites are missing
- Steps need reordering

**Stop and replan:**

1. Explain what you discovered
2. Propose an updated plan
3. Show how it differs from the original
4. Get user approval before continuing

---

## Progress Tracking

Throughout execution, maintain awareness of:

- **Current step** - Which step is active
- **Completed steps** - What has been tested and works
- **Remaining steps** - What still needs to be done
- **Blockers** - Any issues preventing progress

Periodically remind the user of progress:

```
**Progress:** [X/Y steps complete]
**Current:** Step [N] - [Name]
**Next:** Step [N+1] - [Name]
**Status:** Waiting for approval to proceed
```

---

## Claude Code Integration

**Claude Code should apply this skill by default** for nearly all non-trivial tasks. Specific guidance:

### When Claude Code gets a task:

1. **Recognize the pattern** - If it involves code changes, file operations, or multiple dependencies, this skill applies
2. **Create the plan first** - Do not jump into implementation
3. **Present it to the user** - Show the full plan before making any changes
4. **Wait for feedback** - Even if the user seems to want "just do it", present the plan first
5. **Remember across turns** - If the conversation continues, maintain the step-by-step discipline

### Claude Code should recognize these as automatic skill triggers:

- "Can you help me with my [project]?"
- "I need to fix a bug in..."
- "Build me a..."
- "Refactor this code"
- "Set up a [system]"
- "Debug why [thing] isn't working"
- "Integrate [component] with [system]"

### Conversation Compaction Awareness:

When Claude detects that a conversation has been compacted or a new session begins:

1. **Explicitly state:** "I'm continuing to apply the step-by-step execution approach for this task"
2. **Resume from where you left off** in the plan, or create a new plan if context is unclear
3. **Do not assume the skill is no longer active** just because time has passed

---

## Example Interactions

### Example 1: Direct Task Request

```
User: "Can you refactor the authentication module to support OAuth2?"

Claude (immediately): "I'll create a step-by-step plan for this refactoring to ensure we don't break existing functionality.

## Execution Plan

**Goal:** Refactor authentication module to support OAuth2 while maintaining backward compatibility

**Steps:**
1. Analyze current authentication architecture
   - Action: Review existing auth code, identify components
   - Test: Document current flow and dependencies
   - Dependencies: None

2. Design OAuth2 integration points
   - Action: Plan where OAuth2 fits, what components need changes
   - Test: Validate design doesn't require rewriting everything
   - Dependencies: Step 1

3. Create OAuth2 handler
   - Action: Build new OAuth2 provider class
   - Test: Unit tests for OAuth2 flows
   - Dependencies: Step 2

4. Update login endpoint
   - Action: Modify login to support both old and new auth
   - Test: Test both paths work
   - Dependencies: Step 3

5. Migrate existing sessions (optional)
   - Action: Plan and implement session migration if needed
   - Test: Verify no sessions lost
   - Dependencies: Step 4

6. Integration testing
   - Action: Full E2E test of auth flow
   - Test: All authentication scenarios work
   - Dependencies: Step 5

**Estimated complexity:** Complex
**Risk factors:** Auth is critical; any break affects all users

Shall I proceed with Step 1?"
```

### Example 2: User Control - Batch Execution

```
User: "Complete until integration testing"

Claude: [Executes steps 1-5, running tests after each]
[After step 5 completes and tests pass]

"I've completed steps 1-5 as requested. All tests passed. I'm stopping here before Step 6 (Integration Testing) as you specified.

**Progress:** 5/6 steps complete
**Current:** Ready for integration testing
**Next:** Step 6 - Full E2E testing

The OAuth2 handler is built and integrated. Ready for you to review before I run the full integration test suite?"
```

### Example 3: Issue During Execution

```
Claude: "## Step 3 Test Results

**Test performed:** Unit tests for OAuth2 handler
**Result:** Fail
**Evidence:** Token refresh test failed - refresh token expiration not handled

**Issue found:** OAuth2 handler doesn't implement token refresh expiration logic
**Next step status:** Needs fixing before proceeding

## Proposed Fix

Should I:
A) Add token expiration handling to the OAuth2 handler (5 min fix), or
B) Skip token refresh for now and mark as "TODO" (delay feature, but faster)

Which approach do you prefer?"
```

### Example 4: Conversation Compaction Resume

```
[New message after conversation was compacted/history truncated]

User: "Keep going with the refactoring"

Claude: "I'm continuing to apply the step-by-step execution approach for this refactoring task.

Based on our prior work, we were at:
**Progress:** 5/6 steps complete
**Last completed:** Step 5 - Integrated OAuth2 into login endpoint, all tests passed
**Next:** Step 6 - Integration testing

## Step 6: Integration Testing

**Proposed changes:**
- Set up E2E test suite
- Test OAuth2 flow with real provider
- Test fallback to legacy auth
- Verify no regression in existing functionality

**Pros:**
- Comprehensive validation before deployment
- Catches integration issues
- Validates both auth paths work together

**Cons:**
- Takes 10-15 minutes to run
- Requires test OAuth provider credentials

**Testing approach:**
- Run full E2E suite
- Report results and coverage

Ready to proceed?"
```

---

## Key Principles

**One step at a time (by default):** Never execute multiple steps in sequence without intermediate testing and approval, unless the user explicitly requests it.

**Always test:** Every step must include a concrete test that proves it works.

**Propose before executing:** Show pros/cons before making changes, allowing the user to course-correct.

**Document continuously:** Keep the user informed of what's done, what's next, and any discoveries.

**Fail safely:** When something goes wrong, stop, analyze, and get direction rather than attempting automatic recovery.

**Stay flexible:** Plans are guides, not constraints. Adapt when you learn new information.

**This is the default for complex tasks:** Don't wait to be asked—recognize when a task warrants this approach and apply it automatically. It's especially important in Claude Code.

**Remember across conversation compaction:** Even if the conversation history gets truncated, continue applying this skill. Explicitly acknowledge that you're still using the step-by-step approach.

---

## Troubleshooting

### "Claude keeps skipping the plan and just coding"

- Claude Code may not be recognizing the skill trigger
- Try: "Let's be methodical about this" or "Walk me through the plan first"
- The skill should activate automatically, but these phrases reinforce it

### "Claude forgot the plan after a few messages"

- Conversation compaction may have occurred
- Claude should explicitly state it's resuming the step-by-step approach
- If it doesn't, remind Claude: "Keep using the step-by-step execution approach"

### "I want it to go faster"

- Say: "Proceed with all" and Claude will execute all steps without stopping
- Say: "Proceed through [step name]" to batch-execute up to that point
- You can mix approaches—detailed for risky changes, fast for straightforward ones

### "Claude proposed a bad approach"

- During the planning phase, you can say: "I'd rather [alternative approach]"
- Claude will update the plan and wait for approval again
- Better to catch issues in planning than after execution

---

## Quick Reference for Users

| What you want           | What to say                                            |
| ----------------------- | ------------------------------------------------------ |
| Next step only          | "Go ahead" or "Proceed"                                |
| All steps at once       | "Proceed with all"                                     |
| All steps up to a point | "Proceed through testing" or "Complete until step 5"   |
| Skip a step             | "Skip step 3"                                          |
| Change the plan         | "Can we do this differently?" or "I don't like step 2" |
| More details on a step  | "Explain step 3" or "Why that approach?"               |
| Execute anyway (risky)  | "Proceed even if" or "Force proceed"                   |
| Stop everything         | "Stop" or "Hold up, let's revise"                      |

---

## Integration Notes for Claude Code Users

Claude Code should treat this skill as **always-on** for non-trivial tasks. The skill actively prevents the "start changing code immediately" problem by:

1. Forcing a planning phase before any modifications
2. Giving you explicit control over execution pace
3. Ensuring tests happen after each step
4. Surviving conversation compaction
5. Making it easy to batch-execute when you're confident

If Claude Code isn't using it, it means:

- The task was simple enough not to warrant it (1 discrete step)
- Claude didn't recognize it as a complex task (try reinforcing: "Let's plan this carefully")
- The skill recommendation didn't survive conversation compaction (explicitly request it resume)
