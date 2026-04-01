---
paths:
  - "packages/dialtone-vue/**"
  - "packages/dialtone-css/**"
  - "packages/dialtone-tokens/**"
  - "packages/dialtone-icons/**"
---

# Code Review Rules

Dialtone code review checklist. Each rule is a verification question to check against changed code. See DLT-3049 for context.

## 1. Reuse & Duplication

- Is the component too similar to another component in the system?
- Can any code or functions already written in the system be used in this change?
- Is there any repeated code that should be extracted into a function?

## 2. Code Quality & Readability

- Is the code written in a way that is easily human readable?
- Is the code maintainable? If we have to add on more, or change the functionality in the future is it easy to do that or do we have to rewrite the entire thing?
- Does the code have comments for any complex code that is not immediately easy to understand by looking at it?

## 3. Vue Correctness

- Is the component reactive on both initialization, and when props are changed after initialization?
- Does the component avoid using `$slots` in computed properties? (`$slots` is not reactive in computed.)
- Is object syntax used for conditional classes in the template?

See `.claude/rules/vue-components.md` for detailed Vue conventions (props, events, slots, file structure).

## 4. CSS / Styling

- Does the code use Dialtone design tokens everywhere possible for CSS/LESS values?
- Does the code use flat CSS selectors as much as possible?
- Does the CSS follow BEM (Block Element Modifier) principles?

See `.claude/rules/css-utilities.md` for token reference and naming conventions.

## 5. API & Library Design

- Is the component, function, or const exported as part of the library?
- Are there any breaking changes for consumers of the library?
- Do class props support all possible class types: `String`, `Object`, `Array`?

## 6. Testing

- Do the tests have one assertion per test?
- Do the tests take advantage of using `beforeAll` and `beforeEach` as much as possible to cut down on repetition?
- Have we used `it.each` for tests with a very similar process, but different values?

See `.claude/rules/vue-tests.md` for test framework details and patterns.

## 7. Storybook

- Is the change correctly rendered and easy to change parameters for in Storybook?

## 8. Internationalization & Assets

- Are all English language strings in the design system components translated via i18n?
- Are all images stored locally? (no external URLs)

## 9. Accessibility

- Will the component read correctly on a screenreader?
- Does it meet contrast requirements?
- Is it keyboard navigable?
- Does it meet WCAG 2.1 AA accessibility guidelines?
