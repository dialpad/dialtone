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

Search all `.vue` files for `validate:` in prop definitions (should be `validator:`). Vue silently ignores `validate:`.

```bash
grep -rn "validate:" --include="*.vue" packages/dialtone-vue/components/ | grep -v "validator:"
```

### 2. Missing `compatConfig`

Find Options API components missing `compatConfig: { MODE: 3 }`. Skip `<script setup>` components.

```bash
for f in $(find packages/dialtone-vue/components -name "*.vue"); do
  if grep -q "export default {" "$f" && ! grep -q "compatConfig" "$f"; then
    echo "$f"
  fi
done
```

### 3. Prop Naming Consistency

Check prop/event/slot naming against conventions defined in project rules (`.claude/rules/vue-components.md`). Flag deviations from established patterns.

### 4. Constants Coverage

Each component with enum-like props should have a `*_constants.js` file.

- Verify constants files exist and are imported in prop validators
- Check for inline arrays in validators that should reference constants

### 5. Documentation-Code Drift

Compare Vue source (props, events, slots) against `component-documentation.json`:

- Props/events/slots present in one but missing from the other
- Mismatched types or default values

### 6. Separation of Concerns Violations

Scan Vue templates and styles for anti-patterns per project conventions: complex template expressions (should be computed), inline styles (should use classes), raw CSS values (should use `var(--dt-*)` tokens).

### 7. Test Coverage Gaps

Compare each component's props/events/slots against its test file:

- Props, events, or slots without test coverage
- Components with no test file at all

### 8. CSS Token Usage

Scan `.less` and `.css` files for:

- Raw hex/pixel values that should use `var(--dt-*)` tokens
- `!important` usage outside of utility class definitions

## Area-Specific Analysis

- **`/analyze components`** — Runs checks 1-5 (validate bug, compatConfig, naming, constants, doc drift)
- **`/analyze tokens`** — Token alias resolution, missing dark mode counterparts, naming consistency, unused tokens
- **`/analyze utilities`** — Duplicate classes, missing token refs, naming violations, responsive variant gaps
- **`/analyze docs`** — Check 5 (doc drift) plus missing pages, broken sidebar links, stale planned flags

## Output Format

Group findings by severity:

- **Critical** — Silent failures or broken functionality (e.g., `validate` vs `validator`)
- **Warning** — Inconsistencies and gaps (e.g., missing documentation, test coverage gaps)
- **Info** — Style suggestions and improvements (e.g., token usage opportunities)

Format each finding as:

```text
[SEVERITY] file/path:line — Description of issue
  Context: relevant code snippet
  Fix: suggested remediation
```
