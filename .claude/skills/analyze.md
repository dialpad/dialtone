---
description: "Pattern audit and consistency checking across the Dialtone codebase. Use '/analyze' to run full audit, or '/analyze <area>' to focus on specific areas (components, tokens, utilities, docs)."
context: fork
---

# Dialtone Codebase Analyzer

Run a comprehensive audit of the Dialtone monorepo for consistency, correctness, and completeness. This skill checks for known bugs, pattern violations, documentation drift, and test gaps.

## Usage

- `/analyze` — Full audit across all areas
- `/analyze components` — Component source, props, events, slots, tests, docs
- `/analyze tokens` — Token reference chains, dark mode, naming
- `/analyze utilities` — Duplicate classes, missing token refs, naming conventions
- `/analyze docs` — Documentation-code drift, missing pages, broken sidebar links

## Full Audit Checks

### 1. `validate` vs `validator` Bug

Search all `.vue` files in `packages/dialtone-vue/components/` for `validate:` used in prop definitions. The correct Vue API key is `validator:`. Vue silently ignores `validate:`, so these are invisible bugs.

```bash
# Find instances of the bug
grep -rn "validate:" --include="*.vue" packages/dialtone-vue/components/ | grep -v "validator:"
```

Report each instance with file path and line number.

### 2. Missing `compatConfig`

All Options API components must have `compatConfig: { MODE: 3 }` for Vue 2/3 compatibility. Skip components using `<script setup>` (Composition API).

```bash
# Find Options API components missing compatConfig
for f in $(find packages/dialtone-vue/components -name "*.vue"); do
  if grep -q "export default {" "$f" && ! grep -q "compatConfig" "$f"; then
    echo "$f"
  fi
done
```

### 3. Prop Naming Consistency

Check these conventions:

- **Visibility toggles**: Should use `hideX` (negative polarity) pattern, not `showX`
- **Event naming**: Popover/Collapsible/ImageViewer/FilterPill use `update:open`; Modal/Tooltip/Toast use `update:show`
- **Slot naming**: Popover/Hovercard use `headerContent`/`footerContent`; Card/Modal use `header`/`footer`

Flag any deviations from these established patterns.

### 4. Constants Coverage

Each component with enum-like props (size, kind, type, etc.) should have a `*_constants.js` file that exports the valid values.

- Check that constants files exist for components with enum props
- Verify constants are imported and used in prop validators (not hardcoded strings)
- Check for inline arrays in validators that should reference constants

### 5. Documentation-Code Drift

Compare the Vue source (props, events, slots) against the generated `component-documentation.json`:

- Props in source but not in docs JSON
- Props in docs JSON but removed from source
- Mismatched types or default values
- Missing event or slot documentation

### 6. Separation of Concerns Violations

Scan Vue templates and styles for anti-patterns:

- **Template complexity**: Ternaries with function calls, inline array filtering, complex computed expressions inlined in templates
- **Inline styles**: `style="..."` attributes in templates (should use classes)
- **Raw values in styles**: Hex colors (`#xxx`), pixel values (`12px`), or spacing values in `<style>` sections that should use design tokens (`var(--dt-*)`)

### 7. Test Coverage Gaps

For each component, compare its props/events/slots against its test file:

- Props without any test assertion
- Events that are never tested for emission
- Named slots that are never rendered in tests
- Components with no test file at all

### 8. CSS Token Usage

Scan `.less` and `.css` files for:

- Raw hex color values that should use token variables
- Raw pixel values for spacing/sizing that should use token variables
- `!important` usage outside of utility class definitions
- Hardcoded font families or font sizes

## Area-Specific Analysis

### `/analyze components`

Runs checks 1-5 above, focused on Vue component source code quality.

### `/analyze tokens`

- Token reference chains: verify token aliases resolve correctly
- Missing dark mode counterparts: find tokens without dark theme values
- Naming consistency: check token names follow the `--dt-{category}-{property}-{variant}` convention
- Unused tokens: cross-reference token definitions against usage in CSS and Vue files

### `/analyze utilities`

- Duplicate utility classes: find classes with identical CSS output
- Missing token references: utilities using raw values instead of tokens
- Naming convention violations: classes not following `d-{property}{value}` pattern
- Responsive variant gaps: utilities that should have responsive variants but don't

### `/analyze docs`

- Documentation-code drift (check 5 above)
- Missing component pages: components in source without a docs page
- Broken sidebar links: entries in `site-nav.json` pointing to nonexistent pages
- Missing frontmatter: pages without required fields (`status`, `title`, `description`)
- Stale planned flags: components marked `"planned": true` in sidebar that are now implemented

## Output Format

Group findings by severity:

### Critical

Bugs that cause silent failures or broken functionality:

- `validate` vs `validator` instances
- Broken token references
- Missing exports that break consumers

### Warning

Inconsistencies and gaps that should be addressed:

- Naming pattern violations
- Missing documentation
- Test coverage gaps
- Missing `compatConfig`

### Info

Style suggestions and potential improvements:

- Separation of concerns suggestions
- Token usage opportunities
- Potential redundancies

Format each finding as:

```text
[SEVERITY] file/path:line — Description of issue
  Context: relevant code snippet
  Fix: suggested remediation
```
