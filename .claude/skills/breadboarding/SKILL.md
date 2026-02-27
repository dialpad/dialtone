---
name: breadboarding
description: Transform a workflow description into affordance tables showing UI and Code affordances with their wiring. Use to map existing Dialtone systems, design new features from shaped parts, or slice breadboards into vertical implementation increments. Tables are the truth; Mermaid diagrams are optional visualizations.
---

# Breadboarding

Breadboarding transforms a workflow description into a complete map of affordances and their relationships. The output is always a set of tables showing numbered UI and Code affordances with their Wires Out and Returns To relationships. The tables are the truth. Mermaid diagrams are optional visualizations for humans.

---

## Use Cases

### 1. Mapping an Existing Dialtone System

You don't understand how an existing Dialtone feature works in its concrete details. You have a workflow you're trying to understand.

**Input:**

- Dialtone source files to analyze
- Workflow description (from the perspective of a consumer or contributor trying to accomplish something)

**Output:**

- UI Affordances table (Vue components, props, slots, events, CSS classes)
- Code Affordances table (composables, validators, build scripts, token transforms)
- (Optional) Mermaid visualization

**Dialtone-specific guidance:** Trace through Dialtone's package layers:

```
DOCUMENTATION LAYER (VuePress pages, Storybook stories)
    |
COMPONENT LAYER (Vue 3 SFCs, composables, validators)
    |
CSS LAYER (Less utilities, component styles)
    |
TOKEN LAYER (JSON → CSS custom properties → platform outputs)
```

### 2. Designing from Shaped Parts

You have a new feature sketched as an assembly of parts (mechanisms) per `/shaping`. You need to detail out the concrete mechanism and show how those parts interact as a system.

**Input:**

- Parts list (mechanisms from shaping)
- The R (requirement/outcome) the parts are meant to achieve
- Existing Dialtone system (optional) — if the new parts must interoperate with existing code

**Output:**

- UI Affordances table
- Code Affordances table
- (Optional) Mermaid visualization

### Mixtures

Often you have both: an existing Dialtone system that must remain as-is, plus new pieces or changes defined in a shape. In this case, breadboard both together — the existing affordances and the new ones — showing how they connect.

---

## Core Concepts

### Places

A Place is a **bounded context of interaction**. While you're in a Place:

- You have a specific set of affordances available to you
- You **cannot** interact with affordances outside that boundary
- You must take an action to leave

**Place is perceptual, not technical.** It's not about Vue routes or package boundaries — it's about what the user experiences as their current context.

#### The Blocking Test

The simplest test for whether something is a different Place: **Can you interact with what's behind?**

| Answer  | Meaning                              |
| ------- | ------------------------------------ |
| **No**  | You're in a different Place          |
| **Yes** | Same Place, with local state changes |

#### Dialtone-Specific Place Examples

| UI Element           | Blocking? | Place?  | Why                                          |
| -------------------- | --------- | ------- | -------------------------------------------- |
| DtModal              | Yes       | Yes     | Can't interact with page behind              |
| DtPopover            | No        | No      | Can click away, non-blocking                 |
| DtDropdown           | No        | No      | Can click away, non-blocking                 |
| DtToast              | No        | No      | Overlays page, doesn't block interaction     |
| DtModal (fullscreen) | Yes       | Yes     | Entire viewport changes, blocks all content  |
| Storybook canvas     | No        | No      | Controls panel coexists                      |
| VuePress doc page    | No        | No      | Sidebar and content coexist                  |

#### Labeling Conventions

| Pattern                   | Use                            |
| ------------------------- | ------------------------------ |
| `PLACE: Component`        | Vue component boundary         |
| `PLACE: Component (Mode)` | Mode-based variant             |
| `PLACE: Modal Name`       | DtModal dialog                 |
| `PLACE: Build Pipeline`   | Build-time processing boundary |
| `PLACE: Token Transform`  | Token build stage              |

### Place IDs

Each Place gets an ID:

| #   | Place           | Description                             |
| --- | --------------- | --------------------------------------- |
| P1  | Component API   | Props, slots, events surface            |
| P2  | Component Style | Less/CSS class output                   |
| P3  | Token Build     | JSON → style-dictionary → CSS variables |
| P4  | Doc Page        | VuePress markdown + live examples       |

### Affordances

Things you can act upon:

- **UI affordances (U)**: Vue component props, slots, events, CSS classes, Storybook controls
- **Code affordances (N)**: Composables, validators, build scripts, token transforms, computed properties

### Wiring

How affordances connect to each other:

**Wires Out** — What an affordance triggers or calls (control flow):

- Emit wires: component emits event to parent
- Build wires: token JSON feeds into CSS build
- Prop wires: parent passes prop to child component
- Slot wires: parent injects content into child slot

**Returns To** — Where an affordance's output flows (data flow):

- Computed wires: computed property returns to template
- Token wires: CSS custom property consumed by utility class
- Expose wires: component exposes method via `defineExpose`

---

## The Output: Affordance Tables

The tables are the truth. Every breadboard produces these:

### Places Table

| #   | Place         | Description                             |
| --- | ------------- | --------------------------------------- |
| P1  | Component API | Props, slots, events surface            |
| P2  | Token Build   | JSON → style-dictionary → CSS variables |

### UI Affordances Table

| #   | Place | Component  | Affordance       | Control | Wires Out | Returns To |
| --- | ----- | ---------- | ---------------- | ------- | --------- | ---------- |
| U1  | P1    | DtButton   | `size` prop      | render  | —         | —          |
| U2  | P1    | DtButton   | click event      | click   | -> N1     | —          |
| U3  | P1    | DtButton   | default slot     | render  | —         | —          |

### Code Affordances Table

| #   | Place | Component         | Affordance               | Control  | Wires Out | Returns To |
| --- | ----- | ----------------- | ------------------------ | -------- | --------- | ---------- |
| N1  | P1    | useButton         | `handleClick()`          | call     | —         | -> U1      |
| N2  | P2    | gulpfile          | `compileLess()`          | build    | -> N3     | —          |
| N3  | P2    | style-dictionary  | `transformTokens()`      | build    | —         | —          |

### Data Stores Table

| #   | Place | Store                | Description                        |
| --- | ----- | -------------------- | ---------------------------------- |
| S1  | P2    | `tokens.json`        | Source token definitions           |
| S2  | P2    | `variables.less`     | Generated Less variables from build|

### Column Definitions

| Column         | Description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| **#**          | Unique ID (P for Places, U for UI, N for Code, S for Stores)             |
| **Place**      | Which Place this affordance belongs to (containment)                      |
| **Component**  | Which Vue component, composable, or build tool owns this                  |
| **Affordance** | The specific thing you can act upon                                       |
| **Control**    | The triggering event: click, type, call, observe, build, render, computed |
| **Wires Out**  | What this triggers (control flow, including navigation)                   |
| **Returns To** | Where output flows (data flow)                                            |

---

## Procedures

### For Mapping an Existing Dialtone System

**Step 1: Identify the flow to analyze**

Pick a specific journey:

- "Consumer adds DtButton to their app, sets size and kind props, handles click"
- "Contributor adds a new token, builds, sees it appear as a CSS variable and utility class"
- "User visits docs page, sees live component example, copies code snippet"

**Step 2: List all places involved**

Walk through the journey and identify each distinct Place.

**Step 3: Trace through the code to find components**

Starting from the entry point, trace through:

1. **Vue component** (template + script setup, props, emits)
2. **Composables** used by the component
3. **CSS classes** applied (from dialtone-css)
4. **Tokens consumed** (CSS custom properties)
5. **Build pipeline** steps (gulp, style-dictionary, Nx)

**Step 4: For each component, list its affordances**

Read the code. Identify:

- UI: What props, slots, and events does the component expose?
- Code: What composables, validators, computed properties are involved?

**Step 5: Name the actual thing, not an abstraction**

If you write "STYLE", stop. What's the actual class? (`.d-btn--primary`). Every affordance name must be something real you can point to in the code.

**Step 6-8: Fill in Control, Wires Out, Returns To**

For each affordance, trace the actual code paths.

**Step 9: Add data stores as affordances**

In Dialtone, data stores include:

- Token JSON files (source of truth)
- Generated CSS/Less variables
- Component documentation JSON (`component-documentation.json`)
- MCP server data (`packages/dialtone-mcp-server/src/data.ts`)

**Step 10: Add framework mechanisms as affordances**

Include Vue reactivity mechanisms that bridge code and UI:

- `computed()` properties that transform props
- `watch()` / `watchEffect()` that trigger side effects
- `provide()` / `inject()` that pass context down the tree

**Step 11: Verify against the code**

Read the code again. Confirm every affordance exists and the wiring matches reality.

### For Designing from Shaped Parts

**Step 1: List each part from the shape**

Take each mechanism/part identified in `/shaping` and write it down.

**Step 2: Translate parts into Dialtone affordances**

For each part, identify:

- What Vue components does this part require? (new or existing)
- What composables implement this part?
- What CSS classes or tokens are needed?
- What documentation pages need to exist?

**Step 3: Verify every U has a supporting N**

For each UI affordance, check: what Code affordance provides its data or behavior? If none exists, add the missing N.

**Step 4: Classify places as existing or new**

For each affordance, determine whether it lives in an existing Dialtone package or requires new additions.

**Step 5: Wire the affordances**

Fill in Wires Out and Returns To. Trace the intended behavior through Dialtone's package layers.

**Step 6: Connect to existing system**

Identify existing Dialtone components and utilities the new affordances must connect to. Add those existing affordances to your tables.

**Step 7: Check for completeness**

- Every U should have an N that feeds it
- Every N should have either Wires Out or Returns To (or both)
- Every new token should flow through the build to a CSS variable
- Every new component should have corresponding docs and stories
- Cross-package dependencies should follow the dependency graph: tokens → CSS → Vue → docs

---

## Key Principles

### Never use memory — always check the data

When tracing a flow, scan the Wires Out column for ALL affordances that wire to your target. The tables are the source of truth.

### Every affordance name must exist (when mapping)

When mapping existing Dialtone code, never invent abstractions. Every name must point to something real — a Vue component, a CSS class, a token name, a build script.

### Mechanisms aren't affordances

An affordance is something you can **act upon** with meaningful identity. Skip:

- Layout wrappers (DtStack used purely for spacing)
- Internal build intermediaries (temporary generated files)
- Import/export boilerplate

### Dialtone-Specific: The Build Pipeline Is the Bridge

The build pipeline (Nx tasks, gulp, style-dictionary) is the critical bridge between tokens and consumable output. Always show build steps explicitly — they're where token values become CSS custom properties and utility classes.

### Two flows: Consumer and Contributor

| Flow              | What it tracks                   | Wiring                        |
| ----------------- | -------------------------------- | ----------------------------- |
| **Consumer**      | Using components/utilities       | Props -> Component -> Renders |
| **Contributor**   | Adding/modifying design system   | Source -> Build -> Output     |

### Every component prop that renders needs a style source

A UI affordance that renders styled content must trace back to a CSS class or token. If a prop changes visual appearance but has no CSS backing, something is missing.

---

## Visualization (Mermaid)

### Line Conventions

| Line Style      | Mermaid Syntax | Use                                         |
| --------------- | -------------- | ------------------------------------------- |
| Solid (`-->`)   | `A --> B`      | Wires Out: calls, triggers, builds          |
| Dashed (`-.->`) | `A -.-> B`     | Returns To: return values, data store reads |

### ID Prefixes

| Prefix | Type             | Example |
| ------ | ---------------- | ------- |
| **P**  | Places           | P1, P2  |
| **U**  | UI affordances   | U1, U2  |
| **N**  | Code affordances | N1, N2  |
| **S**  | Data stores      | S1, S2  |

### Color Conventions

| Type               | Color             | Hex       |
| ------------------ | ----------------- | --------- |
| Places (subgraphs) | White/transparent | —         |
| UI affordances     | Pink              | `#ffb6c1` |
| Code affordances   | Grey              | `#d3d3d3` |
| Data stores        | Lavender          | `#e6e6fa` |
| Chunks             | Light blue        | `#b3e5fc` |

```
classDef ui fill:#ffb6c1,stroke:#d87093,color:#000
classDef nonui fill:#d3d3d3,stroke:#808080,color:#000
classDef store fill:#e6e6fa,stroke:#9370db,color:#000
classDef chunk fill:#b3e5fc,stroke:#0288d1,color:#000,stroke-width:2px
```

---

## Slicing a Breadboard

Slicing takes a breadboard and groups its affordances into **vertical implementation slices**.

### What is a Vertical Slice?

A vertical slice is a group of UI and Code affordances that does something demo-able. It cuts through all Dialtone layers (tokens, CSS, Vue component, docs) to deliver a working increment.

The opposite is a horizontal slice — doing work on one layer (e.g., "define all the tokens first") that isn't visible as a usable component.

### The Key Constraint

**Every slice must have visible UI that can be demoed.** A slice without UI is a horizontal layer, not a vertical slice.

- Good: "Button renders with size variants in Storybook" (demo: open story, see sizes)
- Bad: "Add all token values" (no demo possible in isolation)

### Slice Size

- **Too small:** Only 1-2 UI affordances, no meaningful demo -> merge with related slice
- **Too big:** 15+ affordances or multiple unrelated journeys -> split
- **Right size:** A coherent journey with a clear "watch me do this" demo
- **Max 9 slices.** If you need more, the shape may be too large for one cycle.

### Procedure

**Step 1: Identify the minimal demo-able increment**

Ask: "What's the smallest subset that demonstrates the core mechanism working?"

Usually: basic component rendering with one key prop. No variants, no edge cases yet.

This becomes V1.

**Step 2: Layer additional capabilities as slices**

Each slice demonstrates a mechanism working:

- V2: Prop variants (demonstrates the configuration surface)
- V3: Interactive behavior (demonstrates event handling)
- V4: Accessibility (demonstrates keyboard/screen-reader support)
- V5: Documentation (demonstrates consumer guidance)
- etc.

**Step 3: Assign affordances to slices**

Go through every affordance and assign it to the slice where it's first needed.

**Step 4: Create per-slice affordance tables**

For each slice, extract just the affordances being added.

**Step 5: Write a demo statement for each slice**

Each slice needs a concrete demo:

- V1: "Component renders with default props in Storybook"
- V2: "All size and kind variants visible in stories"
- V3: "Click handler fires, keyboard navigation works"
- V4: "Screen reader announces component role and state"
- V5: "Docs page shows usage, props table, and live examples"

### Mapping Slices to Dialtone PRs

Each slice should correspond to one PR:

| #   | Slice           | Mechanism           | Demo                      | Branch                           |
| --- | --------------- | ------------------- | ------------------------- | -------------------------------- |
| V1  | Core component  | Basic render        | "Renders in Storybook"    | `feat/DLT-XXXX-component-v1`    |
| V2  | Variants        | Props + styles      | "All variants visible"    | `feat/DLT-XXXX-component-v2`    |
| V3  | Interaction     | Events + a11y       | "Click and keyboard work" | `feat/DLT-XXXX-component-v3`    |
| V4  | Documentation   | VuePress + examples | "Docs page complete"      | `docs/DLT-XXXX-component-v4`    |

### Visualizing Slices in Mermaid

Show the complete breadboard in every slice diagram, but use styling to distinguish scope:

| Category          | Style                      | Description             |
| ----------------- | -------------------------- | ----------------------- |
| **This slice**    | Bright color               | Affordances being added |
| **Already built** | Solid grey                 | Previous slices         |
| **Future**        | Transparent, dashed border | Not yet built           |

---

## Dialtone Architecture Mapping Reference

When breadboarding Dialtone features, map affordances to these layers:

### Component Layer (U + N affordances)

| Dialtone Pattern                        | Affordance Type                |
| --------------------------------------- | ------------------------------ |
| Vue `<template>` elements               | render, click, type, scroll    |
| Component props                         | render (reactive)              |
| Component events (emits)                | click, call                    |
| Component slots                         | render (injection)             |
| Composables (`use*()`)                  | call, computed                 |
| Validators (prop validators)            | call                           |
| `computed()` properties                 | computed                       |
| `watch()` / `watchEffect()`            | observe                        |
| `provide()` / `inject()`              | call, observe                  |

### CSS Layer (N affordances)

| Dialtone Pattern                        | Affordance Type                |
| --------------------------------------- | ------------------------------ |
| Utility classes (`.d-*`)                | render (class binding)         |
| Component classes (`.d-btn`, etc.)      | render                         |
| Less mixins                             | build                          |
| CSS custom properties (`--dt-*`)        | render (consumed by classes)   |
| Responsive variations                   | render (media query)           |

### Token Layer (N + S affordances)

| Dialtone Pattern                        | Affordance Type                |
| --------------------------------------- | ------------------------------ |
| Token JSON source files                 | source (S)                     |
| style-dictionary transforms             | build                          |
| Generated CSS variables                 | build output (S)               |
| Generated Less variables                | build output (S)               |
| Platform outputs (iOS, Android)         | build output (S)               |

### Build Pipeline (N affordances)

| Dialtone Pattern                        | Affordance Type                |
| --------------------------------------- | ------------------------------ |
| Nx task orchestration                   | build                          |
| gulp tasks (dialtone-css)               | build                          |
| style-dictionary (dialtone-tokens)      | build                          |
| PostCSS plugins                         | build                          |
| `build-dialtone-vue-docs.mjs`           | build                          |

### Documentation Layer (U + S affordances)

| Dialtone Pattern                        | Affordance Type                |
| --------------------------------------- | ------------------------------ |
| VuePress markdown pages                 | render                         |
| Live component examples                 | render, click, type            |
| Props/events tables (auto-generated)    | render                         |
| Storybook stories                       | render, click, type            |
| `site-nav.json` sidebar entries         | render (navigation)            |
| MCP server data (`data.ts`)             | source (S)                     |
