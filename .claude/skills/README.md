# Dialtone Claude Skills

This directory contains specialized Claude skills for working with the Dialtone design system monorepo.

## Available Skills

### Meta Skills

#### `skill-developer/`
A meta-skill for creating new skills. Use this when you need to create domain-specific skills tailored to Dialtone's development workflows.

**When to use:**
- Creating new component development patterns
- Establishing new conventions or workflows
- Building specialized debugging or testing skills

---

#### `project-planning/`
A structured approach to planning complex projects before execution. Breaks down large features into manageable phases with clear milestones.

**When to use:**
- Planning new component implementations
- Designing new features across multiple packages
- Refactoring large sections of the codebase
- Architectural changes to the monorepo

---

#### `step-by-step-execution/`
A methodical execution framework for implementing plans with careful verification at each step.

**When to use:**
- Executing complex multi-package changes
- Implementing features that affect multiple components
- Making changes that require careful coordination
- Following established implementation plans

---

## Dialtone-Specific Context

These skills are optimized for working with:

- **Monorepo Structure**: Multiple packages (dialtone-vue2, dialtone-vue3, dialtone-css, dialtone-tokens, dialtone-icons)
- **Dual Vue Support**: Components that work in both Vue 2 and Vue 3
- **Design System Patterns**: Component libraries, design tokens, utility CSS
- **Build Tools**: Nx for orchestration, Vite/Gulp for building
- **Documentation**: Storybook for components, VuePress for docs

## Creating New Skills

To create a new Dialtone-specific skill:

1. Use the `skill-developer` skill to scaffold the new skill
2. Define clear triggers relevant to Dialtone workflows
3. Include Dialtone-specific context (monorepo structure, component patterns, etc.)
4. Add the skill to `skill-rules.json` with appropriate triggers
5. Test the skill with real Dialtone development scenarios

## Skill Triggers

Skills are automatically activated based on:

- **Keywords**: Specific terms in user messages (e.g., "component", "token", "theme")
- **Intent Patterns**: Recognized patterns in requests (e.g., "create new component")
- **File Patterns**: When working with specific files (e.g., `*.vue`, `*.less`, `tokens/*.json`)

See `skill-rules.json` for the complete trigger configuration.
