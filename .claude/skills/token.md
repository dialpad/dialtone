---
description: "Design token creation and updates. Use when adding, modifying, or checking Dialtone design tokens (--dt-* CSS variables). Covers token hierarchy, dark mode, and build verification."
---

# Design Token Skill

## Creating or Updating a Token

Token hierarchy, naming conventions, dark mode requirements, and reference syntax are defined in the path-scoped rules (auto-loaded when editing token files). This skill covers the workflow.

### 1. Determine the Correct Location

| Token Purpose | File Location |
| --- | --- |
| Global color, space, font, shadow | `tokens/base/default.json` + `tokens/base/dark.json` |
| Component-specific (e.g., button background) | `tokens/components/<component>/` |
| Brand theming (e.g., Dialpad vs TalkDesk) | `tokens/theme/<brand>/` |

### 2. Token References

Tokens reference other tokens using curly-brace syntax: `"{dtColor.neutral.900}"`. Validate all reference chains resolve correctly with no circular references.

### 3. Check for Duplicates

- Use `search_tokens` MCP tool to find similar tokens
- Check both `default.json` and `dark.json` for the token name
- Review `$metadata.json` to understand which token sets are in scope

## Spacing Scale Reference

| Token | Value |
| --- | --- |
| `dtSpace0` | 0px |
| `dtSpace100` | 2px |
| `dtSpace200` | 4px |
| `dtSpace300` | 6px |
| `dtSpace400` | 8px |
| `dtSpace450` | 10px |
| `dtSpace500` | 12px |
| `dtSpace550` | 14px |
| `dtSpace600` | 16px |
| `dtSpace650` | 20px |
| `dtSpace700` | 24px |
| `dtSpace750` | 32px |
| `dtSpace800` | 48px |

## Verification

After creating or updating tokens:

1. **Build tokens**: `pnpm nx run dialtone-tokens:build`
2. **Check CSS output**: Verify CSS custom properties are generated correctly
3. **Check platform outputs**: iOS (Swift) and Android (Kotlin/XML) outputs are generated alongside CSS
4. **Check MCP discoverability**: Use `search_tokens` to confirm the token is findable

## Important Notes

- Tokens are the single source of truth for all design values across platforms (Web, iOS, Android)
- If tokens are edited manually (not via Figma sync), `sync:tokens-to-figma` may be needed to push changes back to Figma
- The `$metadata.json` file defines the build order for 137 token sets — do not modify this without understanding the dependency chain
- Component tokens should reference semantic tokens, not base palette tokens directly, to ensure theme compatibility
