# Vue Test Rules

Apply to `packages/dialtone-vue/**/*.test.js`.

## Framework

- Tests use Vitest and `@vue/test-utils`.
- Prefer observable behavior: rendered output, emitted events, attributes, keyboard behavior, and focus behavior.
- Avoid testing implementation details such as private state or incidental mock call counts.

## Setup

- Use the local `updateWrapper` pattern when the file already follows it.
- Reset mock props, attrs, and slots between tests.
- Unmount components with teleports/portals in `afterEach`.

## Selectors And Fixtures

- Prefer `data-qa` selectors.
- Import valid values from `*_constants.js`; do not duplicate valid-value arrays.
- Use `it.each` for repeated behavior across value sets.

## Test Shape

- Each `it` block should prove one behavior. Multiple assertions are fine when they are one observable.
- Cover presentation, interactivity, and accessibility when the component behavior includes them.
