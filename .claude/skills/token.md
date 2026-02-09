---
description: "Design token creation and updates. Use when adding, modifying, or checking Dialtone design tokens (--dt-* CSS variables). Covers token hierarchy, dark mode, and build verification."
---

# Design Token Skill

## Token Hierarchy

```
packages/dialtone-tokens/tokens/
  base/
    default.json     # Light mode base tokens
    dark.json         # Dark mode base tokens
  components/
    <name>/           # Component-specific tokens
  theme/
    <brand>/          # Brand override tokens
  $metadata.json      # 137 token sets, defines build order
```

The build order is defined in `$metadata.json`. Token resolution flows from base tokens to component tokens to theme overrides.

## Creating or Updating a Token

### 1. Determine the Correct Location

| Token Purpose | File Location |
|---|---|
| Global color, space, font, shadow | `tokens/base/default.json` + `tokens/base/dark.json` |
| Component-specific (e.g., button background) | `tokens/components/<component>/` |
| Brand theming (e.g., Dialpad vs TalkDesk) | `tokens/theme/<brand>/` |

### 2. Follow Naming Conventions

Tokens use camelCase with category prefixes:

| Category | Pattern | Example |
|---|---|---|
| Colors | `dtColor<Category><Variant>` | `dtColorForegroundPrimary` |
| Spacing | `dtSpace<Scale>` | `dtSpace400` |
| Typography (size) | `dtFontSize<Variant>` | `dtFontSizeBodyMd` |
| Typography (weight) | `dtFontWeight<Variant>` | `dtFontWeightBold` |
| Typography (family) | `dtFontFamily<Variant>` | `dtFontFamilyMono` |
| Shadows | `dtShadow<Variant>` | `dtShadowMd` |
| Border radius | `dtRadius<Variant>` | `dtRadiusMd` |
| Sizes | `dtSize<Scale>` | `dtSize500` |

These produce CSS custom properties like `--dt-color-foreground-primary`, `--dt-space-400`, etc.

### 3. Always Maintain Dark Mode

When adding or editing a token in `default.json`, you MUST also add or update the dark mode equivalent in `dark.json`. Dark mode tokens may reference different base palette values but should use the same token name.

### 4. Token References

Tokens can reference other tokens using curly-brace syntax:

```json
{
  "dtColorForegroundPrimary": {
    "value": "{dtColor.neutral.900}",
    "type": "color"
  }
}
```

In dark mode, the same semantic token references a different base value:

```json
{
  "dtColorForegroundPrimary": {
    "value": "{dtColor.neutral.100}",
    "type": "color"
  }
}
```

### 5. Validate Reference Chains

Before committing, ensure:
- All referenced tokens (inside `{}`) exist and resolve correctly
- No circular references
- Dark mode references point to valid dark-mode base values
- Use `search_tokens` MCP tool to verify token names and existing values

### 6. Check for Duplicates

Search existing tokens for conflicting names or redundant values:
- Use `search_tokens` MCP tool to find similar tokens
- Check both `default.json` and `dark.json` for the token name
- Review `$metadata.json` to understand which token sets are in scope

## Token Value Guidelines

### Colors
- Never use raw hex colors — always reference base palette tokens
- Base palette is defined in `tokens/base/` and contains the full color spectrum
- Semantic tokens (foreground, surface, border) reference palette tokens

### Spacing Scale
The spacing scale maps token names to pixel values:

| Token | Value |
|---|---|
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

### Typography
- Font sizes follow a modular scale similar to spacing
- Font weights: normal (400), medium (500), semi-bold (600), bold (700)
- Font families: default sans-serif, monospace

### Shadows
- Shadows compose multiple values: offset-x, offset-y, blur, spread, color
- Multi-layer box shadows are supported (handled correctly by the PostCSS plugin)
- Shadow color tokens should use alpha transparency

## Verification

After creating or updating tokens:

1. **Build tokens**: `pnpm nx run dialtone-tokens:build`
2. **Check CSS output**: Verify CSS custom properties are generated correctly (e.g., `--dt-color-foreground-primary: #1C1C1C`)
3. **Check docs JSON**: Ensure the new token appears in documentation output
4. **Check platform outputs**: iOS (Swift) and Android (Kotlin/XML) outputs are generated alongside CSS
5. **Check MCP discoverability**: Use `search_tokens` to confirm the token is findable

## Important Notes

- Tokens are the single source of truth for all design values across platforms (Web, iOS, Android)
- If tokens are edited manually (not via Figma sync), `sync:tokens-to-figma` may be needed to push changes back to Figma
- The `$metadata.json` file defines the build order for 137 token sets — do not modify this without understanding the dependency chain
- Component tokens should reference semantic tokens (e.g., `dtColorForegroundPrimary`), not base palette tokens directly, to ensure theme compatibility
