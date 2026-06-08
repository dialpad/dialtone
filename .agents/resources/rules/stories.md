# Storybook Rules

Apply to `packages/dialtone-vue/components/**/*.stories.js`, `*.story.vue`, and `*.mdx`.

## Story Coverage

- Include default usage and meaningful variants for public props, slots, and states.
- Use interactive controls for props where practical.
- Keep examples realistic and public-safe.

## Docs Pages

- MDX docs should explain usage, variants, accessibility notes, and API examples when the component API changes.
- Keep manually authored design guidance intact when updating existing docs.

## Anti-Patterns

- Do not add placeholder stories.
- Do not document behavior that does not exist in the source component.
- Do not rely on private Dialpad context in examples.
