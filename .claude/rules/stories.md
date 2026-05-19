---
paths:
  - "packages/dialtone-vue/**/*.stories.js"
  - "packages/dialtone-vue/**/*.story.vue"
  - "packages/dialtone-vue/**/*.mdx"
---

# Storybook Story Rules

## File Structure

Per component:
- `component_name.stories.js` — story definitions (this rules file)
- `component_name_default.story.vue` — default template
- `component_name_variants.story.vue` — variants template (when applicable)
- `component_name.mdx` — long-form Storybook docs (optional)

## Required Exports

Every `.stories.js` exports:

```javascript
export const argsData = { /* default prop values + action handlers */ };
export const argTypesData = { /* per-prop config */ };

export default {
  title: 'Components/<Component Name>',
  component: DtComponentName,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};
```

- `title` uses Title Case with spaces: `'Components/Button Group'`, not `'Components/button_group'`.
- `excludeStories: /.*Data$/` prevents `argsData` / `argTypesData` from being treated as stories.

## Templates

Use `createTemplateFromVueFile` from `@/common/storybook_utils` to wrap `.story.vue` templates. Never inline template strings.

```javascript
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtComponentDefaultTemplate from './component_default.story.vue';

const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtComponentDefaultTemplate);
```

## argTypes — Per-Prop Config

Every prop, slot, event, and HTML attribute should have an entry in `argTypesData`. At minimum, declare the `control` type so Storybook renders an input.

### Options from constants

Never hardcode the valid values for a `select` control. Import from `*_constants.js`:

```javascript
options: Object.keys(SELECT_SIZE_MODIFIERS),
options: Object.values(AVATAR_PRESENCE_STATES),
```

### Grouping with `table.category`

Group entries to keep the controls panel readable:

```javascript
size: {
  table: { category: 'props', type: { summary: 'string' } },
  control: { type: 'select' },
  options: Object.keys(SIZE_MODIFIERS),
},
```

Categories: `'slots'`, `'props'`, `'html attributes'`, `'directives'`, `'events'`.

### Slot entries

```javascript
header: {
  control: 'text',
  table: {
    category: 'slots',
    type: { summary: 'VNode' },
  },
},
```

### Hide action handlers

Action handlers exposed for Storybook's actions panel must be hidden from the controls UI:

```javascript
onClick: { table: { disable: true } },
onInput: { table: { disable: true } },
```

## Stories

At minimum export a `Default` story. Components with multiple visual states should also export a `Variants` story that renders all variations at once.

### Default

```javascript
export const Default = {
  render: DefaultTemplate,
  args: {},
};
```

### Variants

```javascript
export const Variants = {
  render: VariantsTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
```

- `options.showPanel: false` hides the addon panel so the variants page reads as a gallery.
- `controls: { disable: true }` is optional but recommended when controls don't apply to a multi-variant view.

### Percy visual regression

Use `parameters.percy.args` to seed deterministic state for visual regression snapshots:

```javascript
parameters: {
  percy: {
    args: {
      seed: 'seed',     // deterministic randomness
      show: true,       // force visible state for overlays
    },
  },
},
```

### Accessibility rule overrides

Disable a specific WCAG rule only when justified (e.g., a variants overview page intentionally shows low-contrast color combos). Always scope the override to the story it applies to:

```javascript
parameters: {
  a11y: {
    config: {
      rules: [
        { id: 'color-contrast', enabled: false },
      ],
    },
  },
},
```

## Deprecation

Deprecated props or stories must be visually marked in the story so consumers see the warning in Storybook. Use a badge addon entry or surface the deprecation in the `description` field of the prop.

## Decorators

When a story needs layout context, wrap it in `dt-stack` via a decorator:

```javascript
export const Default = {
  render: DefaultTemplate,
  decorators: [
    () => ({
      template: `<dt-stack direction="row"><story /></dt-stack>`,
    }),
  ],
};
```

## MDX Docs Pages

When a component has a `.mdx` file, it uses `@storybook/addon-docs/blocks` primitives:

```mdx
import { Canvas, Subtitle, Controls, Meta } from '@storybook/addon-docs/blocks';
import * as ComponentStories from './component.stories';

<Meta of={ComponentStories} />

# Component Name

<Subtitle>One-sentence summary of what the component does.</Subtitle>

## Base Style

<Canvas of={ComponentStories.Default} />
```

Reference stories via `<Canvas of={ComponentStories.StoryName} />` — never duplicate render code.

## Anti-Patterns

- Hardcoding `options: ['sm', 'md', 'lg']` instead of `Object.keys(SIZE_MODIFIERS)` — drifts when constants change.
- Inline template strings instead of `*.story.vue` files — harder to maintain, no IDE support.
- Action handlers exposed in the controls panel (missing `table: { disable: true }`) — clutters the UI.
- Stories without `excludeStories: /.*Data$/` — `argsData` shows up as a broken story.
- Title using underscores or kebab-case (`'Components/button_group'`) — should be Title Case with spaces.
