---
paths:
  - "packages/dialtone-tokens/**"
---

# Design Token Rules

## Hierarchy

```
tokens/base/default.json + dark.json  →  tokens/components/<name>/  →  tokens/theme/<brand>/
```

Build order defined in `$metadata.json` (137 token sets). Do not modify without understanding the dependency chain.

## Naming

camelCase with category prefix: `dtColor*`, `dtSpace*`, `dtFontSize*`, `dtFontWeight*`, `dtShadow*`, `dtRadius*`, `dtSize*`.

These produce CSS custom properties: `--dt-color-foreground-primary`, `--dt-space-400`, etc.

## Color Scale

Chromatic base colors use a standard 12-stop scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000. Irregular chromatic stops (250, 350, 425, etc.) were removed in the Feb 2026 migration.
`color.black` and the `material.*` palettes in `tokens/base/refs/` keep 50-step stops (50, 100, 150 … 1000); `color.black` references them (for example `{material.sandstone.250}`) and theme files reference `color.black` (for example `{color.black.750}`).

## Color Space

Base color token values use OKLCH format: `oklch(L C H)` (e.g., `oklch(0.6464 0.1985 289.97)`). Previous hex/HSL values were refactored to OKLCH in Feb 2026. HSL channel decomposition variables (`-h`, `-s`, `-l`, `-hsl`, `-hsla` suffixes) no longer exist — do not reference them.

## Dark Mode

Values in `dark.json` override `default.json`. When adding/editing a token, check dark mode and add the `dark.json` override, with the appropriate dark palette reference, wherever the dark value differs.

## Token References

Use curly-brace syntax to reference other tokens:

```json
{
  "color": {
    "foreground": {
      "primary": { "value": "{color.black.900}", "type": "color" }
    }
  }
}
```

Ensure: all references resolve, no circular references, dark mode references point to valid dark-mode base values.

## Component Tokens

Reference semantic tokens (e.g., `dtColorForegroundPrimary`), not base palette tokens directly, to ensure theme compatibility.

## Build & Verify

- Build: `pnpm nx run dialtone-tokens:build`
- Verify CSS output, docs JSON, iOS/Android platform outputs
- Use `search_tokens` MCP tool to check for duplicates and verify discoverability
- After editing tokens, `pnpm sync:variables` (in `packages/dialtone-tokens`) pushes them to the Figma variables collection. Code is the source of truth; the Figma-to-code direction is not authoritative
