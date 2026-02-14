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
All base colors use a standard 12-stop scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000.
Irregular stops (250, 350, 425, etc.) were removed in the Feb 2026 migration. Do not create tokens referencing irregular stops.

## Dark Mode
Values in `dark.json` override `default.json`. When adding/editing a token, ensure `dark.json` has the corresponding override with the appropriate dark palette reference.

## Token References
Use curly-brace syntax to reference other tokens:
```json
{ "dtColorForegroundPrimary": { "value": "{dtColor.neutral.900}", "type": "color" } }
```
Ensure: all references resolve, no circular references, dark mode references point to valid dark-mode base values.

## Component Tokens
Reference semantic tokens (e.g., `dtColorForegroundPrimary`), not base palette tokens directly, to ensure theme compatibility.

## Build & Verify
- Build: `pnpm nx run dialtone-tokens:build`
- Verify CSS output, docs JSON, iOS/Android platform outputs
- Use `search_tokens` MCP tool to check for duplicates and verify discoverability
- If edited manually (not via Figma sync), `sync:tokens-to-figma` may be needed
