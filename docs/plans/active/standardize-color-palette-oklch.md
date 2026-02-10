# Standardize Color Palette to OKLCH with Bell-Curve Chroma

## Overview

**Status:** In Progress
**Created:** 2026-02-10
**Last Updated:** 2026-02-10

Overhaul all Dialtone color primitives to use a consistent, algorithmically generated OKLCH palette with bell-curve chroma distribution. Eliminates irregular stop numbering, removes muddy mid-tones, provides independently tuned dark mode colors (punchier/saturated) vs light mode (understated/flatter), and shifts green toward blue-green in light mode for better pairing with purple.

## Goals

- Standardize all color families to a consistent 12-stop scale on clean 50/100 boundaries
- Generate colors algorithmically in OKLCH with bell-curve chroma to avoid muddy grays
- Create independently tuned dark mode palettes instead of simple light mode inversion
- Shift light mode green toward emerald/blue-green for better pairing with purple brand color
- Decouple brand colors from palette stops so each can evolve independently

## Non-Goals

- Removing or merging the Indigo palette (flagged for future review)
- Redesigning the semantic token layer or theme architecture
- Changing brand color hex values (brand tokens remain independent)
- Updating the 140+ numbered theme overrides (those inherit from base)
- Migrating token storage format away from hex (OKLCH is used for generation only)

## Success Criteria

- All 13 chromatic families + 2 neutrals use identical stop set: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000
- Zero references to non-standard stops (250, 350, 425, 450, 475, 550) remain in token files
- Dark mode colors have measurably higher chroma than light mode at equivalent stops
- No gamut clipping artifacts (all generated colors within sRGB at 92% of gamut boundary)
- Token build pipeline produces valid output for all platforms (CSS, LESS, JSON, Kotlin, Swift, XML)

## Constraints & Guardrails

**Technical Constraints:**

- Token source format must remain hex in JSON (OKLCH used at generation time, not storage)
- Brand tokens (brand.purple `#7C52FF`, brand.magenta `#FF1BA4`, brand.red `#FF1356`, brand.gold `#FF9E0E`) must not change
- Shadow focus tokens (`shadow.focus`, `shadow.focus-inset`) must reference a valid blue stop
- The `oklch(from ...)` relative color syntax in `dialtone-generators.cjs` must continue to work with new values

**Business Constraints:**

- 140+ theme variants inherit from base palette; changes propagate automatically
- Accessibility themes (high-contrast, prota-deuter, trita) must be verified post-change

**Documentation Principle:**

- After completion, update color palette documentation page and any design guidelines referencing specific stop numbers

**Key Risks:**

- Visual regression across all themed products: Mitigate with before/after screenshots and design review
- Brand color disconnect from palette: Mitigate by documenting that semantic tokens should reference `color.brand.*` not `color.purple.400` for brand intent
- Accessibility contrast regressions: Mitigate by verifying WCAG contrast ratios for semantic foreground/background pairings

## Implementation Steps

### Phase 1: Palette Generation Infrastructure

1. **Create OKLCH color generation script**
   - What: Build `scripts/generate-color-palette.mjs` with OKLCH-to-sRGB conversion, bell-curve chroma algorithm, and per-hue configuration
   - Why: Reproducible, tunable palette generation from a single source of truth
   - Considerations: Implement gamut clamping at 92% of sRGB boundary to avoid edge artifacts

2. **Define per-hue parameters for all color families**
   - What: Configure base hue, hue shift gradient, peak chroma, bell-curve center, and sigma for each of the 11 chromatic colors in both light and dark modes
   - Why: Each hue has different gamut limits and perceptual properties requiring individual tuning
   - Considerations: Green uses hue 158 (emerald) in light mode vs 145 (lime) in dark mode; dark mode peak chroma is 1.3-1.6x higher than light mode across all colors

3. **Generate and validate all palettes**
   - What: Run the generator, inspect output for monotonic lightness, gamut safety, and perceptual quality
   - Why: Catch issues before committing to token files
   - Considerations: Brand color analysis shows brand colors are 1.6-2.2x more saturated than palette stops at equivalent lightness, confirming they should remain independent tokens

### Phase 2: Token File Updates

4. **Update `tokens/base/default.json` with light mode palette**
   - What: Replace all color family entries with standardized 12-stop generated values, preserving neutral, gradient, brand, and all non-color content (fonts, sizes, shadows, opacity)
   - Considerations: Verify color key ordering matches original structure

5. **Update `tokens/base/dark.json` with independently tuned dark mode palette**
   - What: Replace dark mode colors with reversed-lightness, higher-chroma generated values
   - Why: Dark mode should not be a simple inversion; it needs punchier, more saturated colors optimized for dark backgrounds
   - Considerations: Dark mode lightness reversal maps stop 50 to L=0.090 and stop 1000 to L=0.975

6. **Fix shadow focus token references**
   - What: Update `shadow.focus` and `shadow.focus-inset` from `{color.blue.425}` to `{color.blue.400}`
   - Why: blue.425 no longer exists in the standardized palette
   - Dependencies: Step 4

### Phase 3: Reference Migration

7. **Map all non-standard stop references to standard stops**
   - What: Define mapping: 250->300, 350->400, 425->400, 450->500, 475->500, 550->600
   - Why: Ensure no broken token references after palette standardization
   - Considerations: Mapping is by nearest standard stop with bias toward maintaining semantic intent

8. **Update `$themes.json` references**
   - What: Replace all non-standard color stop references in the 387KB themes metadata file
   - Considerations: File contains Figma style hashes; only update color.*.STOP patterns, not space/size stops

9. **Update theme-specific token files**
   - What: Fix references in dp/default.json, dp/dark.json, ceruleo/dark.json, prota-deuter/default.json, botany/dark.json, aegean/*.json
   - Dependencies: Step 7 mapping defined

10. **Update component token files**
    - What: Fix references in presence (default, dark, prota-deuter variants) and badge (default) component tokens
    - Dependencies: Step 7 mapping defined

### Phase 4: Documentation & Validation

11. **Create project plan document**
    - What: Document analysis, design decisions, algorithm parameters, and migration mapping for future reference

12. **Run token build pipeline**
    - What: Execute the full build to verify CSS, LESS, JSON, Kotlin, Swift, and XML outputs generate without errors
    - Dependencies: Steps 4-10 complete

13. **Visual regression review**
    - What: Compare generated color swatches before and after for all families in both modes
    - Considerations: Focus on green (hue shifted), purple (brand-adjacent), and neutral families

## Phase Completion Summaries

### Phase 1 Complete (2026-02-10)

**Completed:**

- Created `scripts/generate-color-palette.mjs` with full OKLCH math, bell-curve chroma, gamut clamping
- Created `scripts/update-token-files.mjs` for automated token file updates
- Defined all 11 chromatic + 2 neutral color configurations for light and dark modes
- Validated brand color analysis confirming palette/brand independence

**Deviations from Plan:**

- None

### Phase 2 Complete (2026-02-10)

**Completed:**

- Updated default.json with standardized light mode palette (all 13 families)
- Updated dark.json with independently tuned dark mode palette
- Fixed shadow.focus and shadow.focus-inset references from blue.425 to blue.400

**Modified:**

- Color key ordering now groups neutrals (black, tan) before chromatic colors
- Reason: Script output natural ordering; functionally equivalent

### Phase 3 Complete (2026-02-10)

**Completed:**

- Migrated all non-standard stop references across 11 files
- Files updated: $themes.json, dp/default.json, dp/dark.json, ceruleo/dark.json, prota-deuter/default.json, botany/dark.json, presence (4 files), badge/default.json
- Final grep verification: zero remaining non-standard color stop references

**Deviations from Plan:**

- aegean/default.json and aegean/dark.json had no non-standard color stops (only standard indigo stops)

## Open Questions

- [ ] Should Indigo be merged into Blue? Currently both exist with similar hue ranges (Indigo ~260, Blue ~248). Indigo is primarily used for chart accent colors and a few theme overrides (~51 total references). Recommend reviewing after visual regression testing.
- [ ] Should semantic tokens that reference `color.purple.400` for brand-intent purposes be migrated to `color.brand.purple`? Currently ~17 semantic references use `color.purple.400` where the intent is "brand primary."
- [ ] Do the 140+ numbered themes (101-137) and named themes need individual color adjustments, or do they inherit cleanly from the updated base?
- [ ] Should the token build pipeline be updated to store OKLCH values natively for platforms that support it?

## References

- Generation script: `scripts/generate-color-palette.mjs`
- Token update script: `scripts/update-token-files.mjs`
- Light mode tokens: `packages/dialtone-tokens/tokens/base/default.json`
- Dark mode tokens: `packages/dialtone-tokens/tokens/base/dark.json`
- OKLCH CSS usage: `packages/dialtone-css/postcss/dialtone-generators.cjs`
- Token build config: `packages/dialtone-tokens/build.js`

## Appendix: Color Configuration Parameters

### Light Mode (understated, flatter)

| Color   | Hue  | Peak Chroma | Peak L | Sigma | Hue Shift     |
|---------|------|-------------|--------|-------|---------------|
| Purple  | 295  | 0.16        | 0.53   | 0.20  | +4 to -4      |
| Blue    | 248  | 0.12        | 0.52   | 0.20  | +8 to -4      |
| Magenta | 348  | 0.16        | 0.55   | 0.20  | +4 to -2      |
| Gold    | 78   | 0.14        | 0.62   | 0.22  | +8 to -8      |
| Green   | 158  | 0.14        | 0.55   | 0.20  | +4 to -6      |
| Red     | 25   | 0.16        | 0.53   | 0.20  | +6 to -4      |
| Berry   | 322  | 0.18        | 0.52   | 0.20  | +3 to -3      |
| Coral   | 38   | 0.14        | 0.56   | 0.20  | +5 to -4      |
| Olive   | 108  | 0.11        | 0.58   | 0.20  | +4 to -4      |
| Teal    | 182  | 0.09        | 0.56   | 0.20  | +4 to -4      |
| Indigo  | 262  | 0.08        | 0.54   | 0.20  | +4 to -2      |

### Dark Mode (punchier, more saturated)

| Color   | Hue  | Peak Chroma | Peak L | Sigma | Hue Shift     |
|---------|------|-------------|--------|-------|---------------|
| Purple  | 293  | 0.22        | 0.60   | 0.24  | +3 to -3      |
| Blue    | 245  | 0.17        | 0.58   | 0.24  | +8 to -4      |
| Magenta | 350  | 0.23        | 0.60   | 0.24  | +4 to -2      |
| Gold    | 74   | 0.18        | 0.68   | 0.24  | +8 to -6      |
| Green   | 145  | 0.22        | 0.65   | 0.24  | +6 to -4      |
| Red     | 22   | 0.22        | 0.58   | 0.24  | +6 to -4      |
| Berry   | 320  | 0.24        | 0.58   | 0.24  | +3 to -3      |
| Coral   | 36   | 0.20        | 0.62   | 0.24  | +5 to -4      |
| Olive   | 105  | 0.15        | 0.64   | 0.24  | +4 to -3      |
| Teal    | 180  | 0.13        | 0.62   | 0.24  | +4 to -3      |
| Indigo  | 260  | 0.11        | 0.60   | 0.24  | +4 to -2      |

### Stop-to-Lightness Mapping

| Stop | Chromatic L | Neutral L |
|------|-------------|-----------|
| 50   | 0.975       | 0.993     |
| 100  | 0.945       | 0.965     |
| 200  | 0.890       | 0.920     |
| 300  | 0.800       | 0.845     |
| 400  | 0.700       | 0.710     |
| 500  | 0.600       | 0.580     |
| 600  | 0.500       | 0.450     |
| 700  | 0.400       | 0.355     |
| 800  | 0.300       | 0.265     |
| 900  | 0.210       | 0.195     |
| 950  | 0.150       | 0.155     |
| 1000 | 0.090       | 0.000     |
