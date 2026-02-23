---
name: shaping
description: Shape a feature before building it. Iterate on both the problem (requirements) and solution (shapes) before committing to implementation. Use when facing new features, ambiguous requests, or multiple valid approaches. Produces fit checks, breadboards, and vertical slices. Enhances Claude's planning mode with structured problem-solution exploration.
---

# Shaping Methodology

A structured approach for collaboratively defining problems and exploring solution options — adapted for Dialtone's monorepo design system architecture (tokens, CSS utilities, Vue components, documentation, and tooling).

**When to use:** Before implementation, when requirements are unclear, when multiple valid approaches exist, or when the user invokes `/shaping`.

**When NOT to use:** Simple bug fixes, single-file edits, obvious implementations with one clear approach.

**Relationship to planning mode:** Shaping happens _before_ or _during_ planning mode. Use `/shaping` to explore problem-solution space, then exit to planning mode with a selected shape for implementation planning.

---

## Multi-Level Consistency (Critical)

Shaping produces documents at different levels of abstraction. **Truth must stay consistent across all levels.**

### The Document Hierarchy (high to low)

1. **Shaping doc** — ground truth for R's, shapes, parts, fit checks
2. **Slices doc** — ground truth for slice definitions, breadboards
3. **Individual slice plans** (V1-plan, etc.) — ground truth for implementation details

### The Principle

Each level summarizes or provides a view into the level(s) below it. Lower levels contain more detail; higher levels are designed views that help acquire context quickly.

**Changes ripple in both directions:**

- **Change at high level -> trickles down:** If you change the shaping doc's parts table, update the slices doc too.
- **Change at low level -> trickles up:** If a slice plan reveals a new mechanism or changes the scope of a slice, the Slices doc and shaping doc must reflect that.

### The Practice

Whenever making a change:

1. **Identify which level you're touching**
2. **Ask: "Does this affect documents above or below?"**
3. **Update all affected levels in the same operation**
4. **Never let documents drift out of sync**

---

## Starting a Session

When kicking off a new shaping session, offer the user both entry points:

- **Start from R (Requirements)** — Describe the problem, pain points, or constraints. Build up requirements and let shapes emerge.
- **Start from S (Shapes)** — Sketch a solution already in mind. Capture it as a shape and extract requirements as you go.

There is no required order. Shaping is iterative — R and S inform each other throughout.

### Dialtone-Specific Context Gathering

Before shaping, gather context about the Dialtone area being affected:

1. **Check existing components** — Does a component in `packages/dialtone-vue/components/` already handle this?
2. **Check tokens** — Are there existing tokens in `packages/dialtone-tokens/` that apply?
3. **Check CSS utilities** — Does `packages/dialtone-css/` already provide utility classes for this?
4. **Check documentation** — Review existing docs in `apps/dialtone-documentation/docs/`
5. **Identify cross-package impact** — Dialtone's dependency chain means changes often cascade: `tokens → CSS → Vue → docs → MCP server`

## Working with an Existing Shaping Doc

When the shaping doc already has a selected shape:

1. **Display the fit check for the selected shape only** — Show R x [selected shape], not all shapes
2. **Summarize what is unsolved** — Call out any requirements that are Undecided, or where the selected shape has a fail

---

## Core Concepts

### R: Requirements

A numbered set defining the problem space.

- **R0, R1, R2...** are members of the requirements set
- Requirements are negotiated collaboratively — not filled in automatically
- Track status: Core goal, Undecided, Leaning yes/no, Must-have, Nice-to-have, Out
- Requirements extracted from fit checks should be made standalone (not dependent on any specific shape)
- **R states what's needed, not what's satisfied** — satisfaction is always shown in a fit check (R x S)
- **Chunking policy:** Never have more than 9 top-level requirements. When R exceeds 9, group related requirements into chunks with sub-requirements (R3.1, R3.2, etc.)

### S: Shapes (Solution Options)

Letters represent mutually exclusive solution approaches.

- **A, B, C...** are top-level shape options (you pick one)
- **C1, C2, C3...** are components/parts of Shape C (they combine)
- **C3-A, C3-B, C3-C...** are alternative approaches to component C3 (you pick one)

### Shape Titles

Give shapes a short descriptive title that characterizes the approach:

- Good: "B: Composition API with provide/inject"
- Good: "C: Token-driven with CSS custom properties"
- Bad: "B: The solution" (too vague)
- Bad: "B: Add a new component that..." (too long)

### Notation Hierarchy

| Level        | Notation      | Meaning                   | Relationship           |
| ------------ | ------------- | ------------------------- | ---------------------- |
| Requirements | R0, R1, R2... | Problem constraints       | Members of set R       |
| Shapes       | A, B, C...    | Solution options          | Pick one from S        |
| Components   | C1, C2, C3... | Parts of a shape          | Combine within shape   |
| Alternatives | C3-A, C3-B... | Approaches to a component | Pick one per component |

### Notation Persistence

Keep notation throughout as an audit trail. When finalizing, compose new options by referencing prior components (e.g., "Shape E = C1 + C2 + C3-A").

## Phases

Shaping moves through two phases:

```
Shaping -> Slicing
```

| Phase       | Purpose                                                           | Output                                             |
| ----------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| **Shaping** | Explore the problem and solution space, select and detail a shape | Shaping doc with R, shapes, fit checks, breadboard |
| **Slicing** | Break down for implementation                                     | Vertical slices with demo-able UI                  |

### Phase Transition

**Shaping -> Slicing** happens when:

- A shape is selected (passes fit check, feels right)
- The shape has been breadboarded into concrete affordances
- We need to plan implementation order

You can't slice without a breadboarded shape.

### Phase Transition to Implementation

After slicing, transition to existing tools:

- Create plan documents in `/docs/plans/` for tracking implementation
- Implement incrementally via feature branches, one slice per PR
- Each vertical slice maps to a PR or a set of commits

---

## Fit Check (Decision Matrix)

THE fit check is the single table comparing all shapes against all requirements. Requirements are rows, shapes are columns. This is how we decide which shape to pursue.

### Format

```markdown
## Fit Check

| Req | Requirement                 | Status    | A    | B    | C    |
| --- | --------------------------- | --------- | ---- | ---- | ---- |
| R0  | Works with all theme modes  | Core goal | pass | pass | pass |
| R1  | No breaking API changes     | Must-have | pass | fail | pass |
| R2  | Tokens remain platform-agnostic | Must-have | fail | pass | pass |

**Notes:**

- A fails R2: [brief explanation]
- B fails R1: [brief explanation]
```

### Conventions

- **Always show full requirement text** — never abbreviate or summarize requirements in fit checks
- **Fit check is BINARY** — Use pass for pass, fail for fail. No other values.
- **Shape columns contain only pass or fail** — no inline commentary; explanations go in Notes section
- **Never use warning symbols in fit check** — warnings belong only in the Parts table's flagged column
- Keep notes minimal — just explain failures

### Comparing Alternatives Within a Component

When comparing alternatives for a specific component (e.g., C3-A vs C3-B), use the same format but scoped to that component.

### Missing Requirements

If a shape passes all checks but still feels wrong, there's a missing requirement. Articulate the implicit constraint as a new R, then re-run the fit check.

### Macro Fit Check

A separate tool from the standard fit check, used when working at a high level with chunked requirements and early-stage shapes where most mechanisms are still flagged. Use when explicitly requested.

The macro fit check has two columns per shape instead of one:

- **Addressed?** — Does some part of the shape seem to speak to this requirement at a high level?
- **Answered?** — Can you trace the concrete how? Is the mechanism actually spelled out?

## Possible Actions

These can happen in any order:

- **Populate R** — Gather requirements as they emerge
- **Sketch a shape** — Propose a high-level approach (A, B, C...)
- **Detail (components)** — Break a shape into components (B1, B2...)
- **Detail (affordances)** — Expand a selected shape into concrete UI/Non-UI affordances and wiring
- **Explore alternatives** — For a component, identify options (C3-A, C3-B...)
- **Check fit** — Build a fit check (decision matrix) playing options against R
- **Extract Rs** — When fit checks reveal implicit requirements, add them to R as standalone items
- **Breadboard** — Map the system to understand where changes happen (use `/breadboarding` skill)
- **Spike** — Investigate unknowns to identify concrete steps (explore the codebase or use subagents)
- **Decide** — Pick alternatives, compose final solution
- **Slice** — Break a breadboarded shape into vertical slices for implementation

## Communication

### Show Full Tables

When displaying R (requirements) or any S (shapes), always show every row — never summarize or abbreviate. The full table is the artifact; partial views lose information and break the collaborative process.

### Mark Changes

When re-rendering a requirements table or shape table after making changes, mark every changed or added line so the user can instantly spot what's different. Place a marker at the start of the changed cell content. This makes iterative refinement easy to follow.

## Spikes

A spike is an investigation task to learn how the existing system works and what concrete steps are needed to implement a component. Use spikes when there's uncertainty about mechanics or feasibility.

### Spike Execution in Dialtone

For Dialtone spikes, investigate using:

- **Codebase exploration** — Search for specific patterns with Grep, Glob, and Read tools
- **Subagents** — Launch Explore or general-purpose subagents for deeper analysis
- **Web research** — Use web-research-specialist subagent for external libraries or patterns

### File Management

**Always create spikes in their own file** (e.g., `docs/spikes/spike-[topic].md`). Spikes are standalone investigation documents that may be shared or worked on independently from the shaping doc.

### Structure

```markdown
## [Component] Spike: [Title]

### Context

Why we need this investigation. What problem we're solving.

### Goal

What we're trying to learn or identify.

### Questions

| #         | Question                          |
| --------- | --------------------------------- |
| **X1-Q1** | Specific question about mechanics |
| **X1-Q2** | Another specific question         |

### Acceptance

Spike is complete when all questions are answered and we can describe [the understanding we'll have].
```

### Acceptance Guidelines

Acceptance describes the **information/understanding** we'll have, not a conclusion or decision:

- Good: "...we can describe how the token build pipeline transforms JSON to CSS custom properties"
- Good: "...we can describe the steps to add a new component with tests, stories, and docs"
- Bad: "...we can decide if we should proceed" (decision comes after the spike)

### Question Guidelines

Good spike questions ask about mechanics:

- "Where does the [X] logic live in the build pipeline?"
- "What changes are needed to add [token category] to the token schema?"
- "How does the CSS build consume tokens from dialtone-tokens?"
- "Are there existing Vue composables that handle [this pattern]?"

Avoid: effort estimates, vague questions, yes/no questions that don't reveal mechanisms.

## Breadboards

Use the `/breadboarding` skill to map existing systems or detail a shape into concrete affordances. Breadboarding produces:

- UI Affordances table (Vue components, Dialtone CSS classes, props/slots/events)
- Code Affordances table (composables, build scripts, token transforms, validators)
- Wiring diagram grouped by Place

### Tables Are the Source of Truth

The affordance tables define the breadboard. The Mermaid diagram renders them.

When receiving feedback on a breadboard:

1. **First** — update the affordance tables
2. **Then** — update the Mermaid diagram to reflect those changes

Never treat the diagram as the primary artifact.

### CURRENT as Reserved Shape Name

Use **CURRENT** to describe the existing system. This provides a baseline for understanding where proposed changes fit. Reference existing Dialtone packages and files by their actual names.

## Shape Parts

### Flagged Unknown

A mechanism can be described at a high level without being concretely understood. The **Flag** column tracks this:

| Part   | Mechanism                                            |  Flag   |
| ------ | ---------------------------------------------------- | :-----: |
| **F1** | Add new token set to `$metadata.json` build order    |         |
| **F2** | Responsive utility class generation via PostCSS      | flagged |

- **Empty** = mechanism is understood — we know concretely how to build it
- **flagged** = flagged unknown — we've described WHAT but don't yet know HOW

**Why flagged unknowns fail the fit check:** A pass is a claim of knowledge. A flag means we don't know how. You can't claim what you don't know.

### Parts Must Be Mechanisms

Shape parts describe what we BUILD or CHANGE — not intentions or constraints:

- Good: "Add `useOverlay()` composable returning reactive `isOpen` ref with focus-trap management" (mechanism)
- Bad: "Handle overlays" (too vague)
- Bad: "Make it accessible" (intention, not mechanism)

### Avoid Tautologies Between R and S

R states the need/constraint (what outcome). S describes the mechanism (how to achieve it). If they say the same thing, the shape part isn't adding information.

### Parts Should Be Vertical Slices

Each part should cut through all Dialtone layers:

- Good: "Add `--dt-color-surface-overlay` token → `.d-bgc-overlay` utility class → `overlayBackground` prop on DtModal → document in VuePress"
- Bad: "Add token" (only one layer, not vertical)

### Extract Shared Logic

If multiple shapes share the same component, extract it once rather than repeating.

### Hierarchical Notation

Start flat (E1, E2, E3...). Only introduce hierarchy (E1.1, E1.2...) when needed for clarity.

## Detailing a Shape

When a shape is selected, expand it into concrete affordances using "Detail X" notation (not a new letter):

```markdown
## A: First approach

(shape table)

## B: Token-driven with CSS custom properties

(shape table)

## Detail B: Concrete affordances

(affordance tables + wiring via /breadboarding)
```

## Documents

Shaping produces up to four documents:

| Document        | Contains                                   | Purpose                                              |
| --------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Frame**       | Source, Problem, Outcome                   | The "why" — concise, stakeholder-level               |
| **Shaping doc** | R's, Shapes, Parts, Fit Check, Breadboard  | The working document — exploration happens here      |
| **Slices doc**  | Slice details, affordance tables per slice | The implementation plan — how to build incrementally |
| **Slice plans** | V1-plan.md, V2-plan.md, etc.               | Individual implementation plans per slice            |

### Document Lifecycle

```
Frame (problem/outcome)
    |
Shaping (explore, detail, breadboard)
    |
Slices (plan implementation)
    |
Implementation (via project-planning + step-by-step-execution skills)
```

### Capturing Source Material

When the user provides source material during framing (user requests, quotes, Jira tickets, Slack messages), **always capture it verbatim** in a Source section.

### File Management

- **Shaping doc**: `docs/shaping/[feature]-shaping.md`
- **Slices doc**: `docs/shaping/[feature]-slices.md`
- **Spike files**: `docs/spikes/spike-[topic].md`
- **Slice plans**: `docs/shaping/[feature]-V1-plan.md`, etc.

### Frontmatter

Every shaping document must include `shaping: true` in its YAML frontmatter. This enables the ripple-check hook.

```markdown
---
shaping: true
---

# [Feature Name] — Shaping

...
```

### Keeping Documents in Sync

See **Multi-Level Consistency** at the top. Changes at any level must ripple to affected levels above and below.

## Slicing

After a shape is breadboarded, slice it into vertical implementation increments. Use the `/breadboarding` skill for the slicing process.

**The flow:**

1. **Parts** -> high-level mechanisms in the shape
2. **Breadboard** -> concrete affordances with wiring (use `/breadboarding`)
3. **Slices** -> vertical increments that can each be demoed (use `/breadboarding` slicing section)

**Key principle:** Every slice must end in demo-able UI. A slice without visible output is a horizontal layer, not a vertical slice.

### Mapping Slices to Dialtone Workflow

Each vertical slice should map to:

- A feature branch from `staging`
- A PR with title following commit convention: `type(scope): DLT-XXXX description`
- Conventional commits within the branch

### Mapping Slices to Dialtone PRs

Each slice should correspond to one PR:

| #   | Slice          | Mechanism            | Demo                    | Branch                          |
| --- | -------------- | -------------------- | ----------------------- | ------------------------------- |
| V1  | Token layer    | Token definition     | "Token values in build" | `feat/DLT-XXXX-feature-v1`     |
| V2  | CSS utilities  | Utility class output | "Class works in CSS"    | `feat/DLT-XXXX-feature-v2`     |
| V3  | Vue component  | Component API        | "Component renders"     | `feat/DLT-XXXX-feature-v3`     |
| V4  | Documentation  | VuePress page        | "Docs page live"        | `docs/DLT-XXXX-feature-v4`     |

## Example

User is shaping a new overlay system for Dialtone:

```markdown
---
shaping: true
---

## Requirements (R)

| ID  | Requirement                                        | Status    |
| --- | -------------------------------------------------- | --------- |
| R0  | Overlays trap focus and restore on close           | Core goal |
| R1  | Works with both modal and non-modal patterns       | Must-have |
| R2  | No breaking changes to existing DtModal/DtPopover  | Must-have |
| R3  | Stacking context managed automatically             | Must-have |

---

## A: Per-component focus trap via directive

| Part | Mechanism                                           | Flag |
| ---- | --------------------------------------------------- | :--: |
| A1   | `v-focus-trap` directive with configurable options  |      |
| A2   | Each overlay component opts in via directive        |      |
| A3   | Stack managed via CSS `z-index` tokens              |      |

## B: Shared composable with centralized overlay manager

| Part | Mechanism                                                      | Flag |
| ---- | -------------------------------------------------------------- | :--: |
| B1   | `useOverlayManager()` composable tracks open overlays in stack |      |
| B2   | `useOverlay()` composable per instance with focus-trap logic   |      |
| B3   | Stacking context via CSS custom property set by manager        |      |
| B4   | Existing DtModal/DtPopover adopt composable internally         |      |

---

## Fit Check

| Req | Requirement                                        | Status    | A    | B    |
| --- | -------------------------------------------------- | --------- | ---- | ---- |
| R0  | Overlays trap focus and restore on close           | Core goal | pass | pass |
| R1  | Works with both modal and non-modal patterns       | Must-have | pass | pass |
| R2  | No breaking changes to existing DtModal/DtPopover  | Must-have | pass | pass |
| R3  | Stacking context managed automatically             | Must-have | fail | pass |

**Notes:**

- A fails R3: Per-component directives have no awareness of each other; z-index tokens alone can't handle dynamic stacking order
```

Shape B wins because centralized management solves the stacking problem that per-component directives can't.
