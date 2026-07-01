---
paths:
  - "packages/combinator/src/variants/**"
---

# Combinator Variant Rules

Combinator variants are part of the Dialtone Vue component contract. When a component prop, slot, valid value, visual default, or supported state changes, check its variant file:

```text
packages/combinator/src/variants/variants_<component>.js
```

Register new variant files in `packages/combinator/src/variants/variants.js`.

This checked-in rule supersedes any personal, repo-external `me_dialtone-variant` guidance. Do not rely on private skill copies for shared component work.

## Why variants matter

Variant files drive three downstream surfaces:

- Combinator preset behavior;
- documentation-site component playgrounds;
- component-wall thumbnails, unless an override exists in
  `apps/dialtone-documentation/thumbs/<slug>.vue`.

Component support is opt-out. Components with generated documentation are
eligible for the standalone app unless they appear in
`packages/combinator/src/unsupported_components.json` with a reason.

## File shape

Reserved top-level keys:

- `defaults`: metadata applied before every preset.
- `exclusions`: rules that disable, hide, clear, or disable values.
- `default`: the initial preset and reset target.

Every other top-level key is a named preset shown in the Combinator preset dropdown.

```js
export default {
  defaults: {
    props: {
      size: { tokenCategory: 'component-size:button' },
    },
  },

  exclusions: [
    {
      when: { kind: 'muted' },
      disableValues: { props: { importance: ['primary'] } },
    },
  ],

  default: {
    slots: {
      default: { initialValue: 'Label' },
    },
  },

  'with icon': {
    slots: {
      startIcon: { initialValue: '<dt-icon-phone :size="iconSize" />' },
      default: { initialValue: 'Call' },
    },
  },
};
```

## Member values

- Use `initialValue` for the value a preset applies to a prop, attribute, or slot.
- Slot values are Vue template strings.
- Token-numbered values are strings, for example `'200'`, not `200`.
- Match member names exactly to docgen output. Unknown names are silently ignored during variant merge.

## Defaults and token categories

Use `defaults` for metadata shared by every preset. Common use:

```js
defaults: {
  props: {
    size: { tokenCategory: 'component-size:avatar' },
    tone: { tokenCategory: 'color:d-text--:color' },
  },
},
```

`tokenCategory` enables token-aware value previews in controls. Verify category strings against `src/lib/tokens.js` and existing variant files before adding a new form.

## Search keywords

Use `searchKeywords` only when likely user search terms are not already covered
by the member name or the logical alias map. Prefer a short, stable list. Do not
add deprecated state here; deprecation comes from generated component docs.

## Exclusions

Use `exclusions` for invalid or misleading combinations, for example disabling a value that another prop's value makes invalid. Mutual exclusions need a rule in both directions.

See `packages/combinator/.github/documentation/internal/EXCLUSIONS.md` for the rule shape, the full effect list, and worked examples.

## Prop dependencies

Do not write exclusions for simple parent-off, child-disabled cases. The Combinator infers those from the component's prop names and JSDoc, so update the component API docs rather than the variant file. See `packages/combinator/.github/documentation/internal/EXCLUSIONS.md` for how inference works.

## Control type

Control type is inferred from the prop type and values by `src/lib/control.js`; you do not set it in the variant file. To change which values are selectable, edit the component's prop constants and JSDoc. See `packages/combinator/.github/documentation/internal/CONTROLS.md` for the inference rules.

## Logical naming

New props and slots use logical names. When you add a new logical axis, the option-bar search needs its alias map updated so physical-term searches still find the prop or slot. See `.claude/rules/logical-naming.md` ("Combinator Filter") for the alias map and how to extend it.

## Class and slot-class props

The native `class` attribute and props ending in `Class` appear in the Class tab. A new slot-class relationship needs its mapping updated in `src/lib/utils.js` plus a focused test. See `packages/combinator/.github/documentation/internal/EXCLUSIONS.md` ("Slot-class dependencies") for the current mappings.

## Unsupported components

Use `unsupported_components.json` only for components that cannot produce a
useful or stable Combinator preview without extra fixture work. Remove entries
when the component becomes viable, and keep the reason short and user-facing.

## Review checks

- Variant file exists when a component needs presets, defaults, exclusions, token
  metadata, or search keywords.
- Variant file is registered in `variants.js`.
- Components that should stay unavailable are listed in
  `unsupported_components.json` with a reason.
- `default` renders a useful component-wall thumbnail, or an override exists.
- Presets cover common states without becoming a storybook replacement.
- Exclusions prevent known invalid combinations.
- Names match component docgen output.
- Token-numbered values stay strings.
