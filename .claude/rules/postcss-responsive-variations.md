---
paths:
  - "packages/postcss-responsive-variations/**"
---

# PostCSS Responsive Variations Plugin Rules

A PostCSS plugin that generates responsive variations (`.sm:foo`, `.md:foo`, etc.) of selected utility classes wrapped in `@media` queries.

## Package Type

- CommonJS (`"type": "commonjs"` in `package.json`)
- Single source file: `index.js`
- Published to npm as `@dialpad/postcss-responsive-variations`
- Peer dep on `postcss ^8.4.1`

## Plugin Convention

Follow the standard PostCSS plugin shape:

```javascript
module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-responsive-variations',
    Once (root) {
      // mutate root in-place
    },
  };
};

module.exports.postcss = true;
```

- `postcssPlugin` name MUST match the npm package name
- The `module.exports.postcss = true` flag tells PostCSS this is a plugin (not legacy)
- Prefer `Once` over per-node visitors — this plugin builds aggregate `@media` blocks and walks the tree itself

## API Surface

Public options (via `opts`):
- `breakpoints` — array of `{ prefix, mediaQuery }` objects. Default exported as `defaultBreakpoints`.
- `classes` — array of class selectors or regex objects. Selectors must start with `.`; regexes must come back as `/\\.<pattern>/`.

Backward compatibility: NEVER change the shape of `opts.breakpoints[*]` or `opts.classes[*]` without a major version bump and a coordinated rollout — downstream consumers (dialtone-css, third-party users via npm) configure these in build scripts.

## Naming Conventions

- Public functions: no underscore prefix (`processBreakpoints`, `processClasses`)
- Private helpers: leading underscore (`_prefixRule`, `_escapeRegex`, `_validateRegex`, `_validateString`)
- Keep helpers in the same file — this plugin is intentionally single-file

## Testing

- Jest (`"test": "jest"`)
- Tests live in `index.test.js`
- Use the canonical `async run(input, output, opts)` helper:

```javascript
async function run (input, output, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}
```

- Every test should assert both the CSS output AND that there are zero warnings — silent warnings indicate plugin bugs
- Use `{ from: undefined }` to suppress PostCSS's source map warnings during testing

## Test Coverage Targets

When changing logic, add cases for:
1. **Default breakpoints** — verify the four-breakpoint default (sm/md/lg/xl) still works without `opts.breakpoints`
2. **Custom breakpoints** — single, partial, and reordered sets
3. **Class filtering** — confirm non-matching classes aren't wrapped
4. **Regex selectors** — confirm `_validateRegex` accepts `/\\.foo.*/` patterns
5. **Idempotency** — running the plugin twice should not double-prefix selectors

## Anti-Patterns

- `console.log` for debugging in published code — breaks downstream PostCSS pipelines that capture stdout
- Mutating `opts` in place — opts is consumer-owned config; treat as read-only
- Adding new options without updating both the README and the default `defaultBreakpoints` example
- ESM syntax (`import`/`export`) — this package is intentionally CommonJS so PostCSS configs in older toolchains can require it
- Using PostCSS 7 APIs — the peer dep is `^8.4.1`, write against the v8 plugin spec
