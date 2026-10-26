# Documentation Writing Rules

Apply to `packages/dialtone-docs/**` and user-facing documentation.

## Accuracy

- Document only behavior that exists in the source.
- Read source and existing docs before editing.
- Use exact package, component, prop, event, token, and command names.

## Examples

- Code examples should be complete enough to be useful.
- Avoid placeholders and invented APIs.
- Keep public docs free of private Dialpad context.

## Documentation Site Examples

For live VuePress examples, use a `vue demo` fence:

````md
```vue demo
<dt-button>Save</dt-button>
```
````

Use `vue demo-only` for a preview without a code tab, or `vue code-only` for
code without a live preview. Plain language fences remain appropriate for
ordinary non-live snippets. Preserve required imports, registration and state;
a demo fence alone does not make a snippet a complete application.

See the [fenced-demo renderer](../../../apps/dialtone-documentation/docs/.vuepress/plugins/markdown-it-fenced-demo.js)
for supported directives and the [Button page](../../../apps/dialtone-documentation/docs/components/button.md)
for authored examples. Keep renderer-specific details there rather than copying
the full client-specific documentation rule.

## AI Docs

- Preserve frontmatter and update `last_updated` when changing `packages/dialtone-docs/src/content/**`.
- Keep content concise, technical, and grep-friendly.
