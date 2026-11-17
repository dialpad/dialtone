---
title: Typography Utilities to DtText
description: Guide and migration tool for replacing legacy typography utility classes (d-headline--*, d-body--*, d-label--*, d-code--md, d-fw-*, d-fc-*, d-lh-*, d-truncate, d-ta-*, d-ff-mono) with DtText variant and modifier props. Covers automatic migration, edge cases, and class-to-prop mapping.
keywords: ["text utilities", "font", "type scale", "truncate", "d-headline", "d-body"]
status: ready
---

## TLDR

> [!WARNING] Deprecation
> Legacy typography utility classes on text elements are deprecated in favor of the [`<dt-text>` component](/components/text.html). Use the migration tool to convert them automatically.

- Replace `d-headline--*`, `d-body--*`, `d-label--*`, `d-code--md`, `d-helper--*` on `<p>`, `<span>`, `<div>`, `<h1>`–`<h6>`, and `<label>` with `<dt-text>`.
- The migration tool emits `variant="…"` for composed classes, plus `strength` or `density` when the class carries them. It never emits `kind` or a composition `size`.
- Raw font-size utilities like `d-fs-200` stay as classes with a review marker. Once the element has a variant, `size="200"` can replace the class.
- Override utilities like `d-fw-*`, `d-fc-*`, `d-lh-*`, `d-truncate`, `d-ta-*`, and `d-ff-mono` map to `strength`, `tone`, `density`, `truncate`, `align`, and `family` props.
- Run utility conversion with `npx dialtone-migrate --only typography`. The opt-in `text-variant` stage converts `kind + size` pairs already in your code.

## Overview

[DtText](/components/text.html) is Dialtone's semantic text component. It exposes typography intent through props (`variant`, `size`, `family`, `density`, `strength`, `tone`, `truncate`, `align`) rather than utility classes, making typography decisions explicit and easier to validate at build time.

For backward compatibility, `kind` remains supported and keeps the historical composed typography behavior when `variant` is not set. Earlier versions of the migration tool emitted `kind + size` pairs such as `<dt-text kind="body" size="300">`. That output is still valid, and the [`text-variant` stage](#convert-existing-kind-and-size-pairs) converts it to `variant`.

A [migration tool](#migration-tool) is available to replace typography utility classes with `<dt-text>` automatically, or you may do so [manually](#manual-migration).

## Why Use the Migration Tool?

The migration tool automates the conversion process with several key benefits:

- **Speed**: Migrate entire projects in minutes instead of hours
- **Consistency**: Ensures uniform conversion patterns across all files
- **Safety**: Flags patterns it cannot safely auto-migrate (dynamic `:class` bindings, unsupported tag types, font-size utilities)
- **Accuracy**: No manual transcription errors or missed conversions
- **Visibility**: Inline `dt-text-migrate` review markers flag cases that need a second look, and `--dry-run` previews which files would change before you write anything

The tool is ideal for projects with many text elements using utility classes. For small, one-off changes, manual migration may be faster.

## Examples

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before:**

```html
<p class="d-headline--md">Welcome back</p>

<span class="d-body--sm d-fc-secondary d-truncate">
  you@example.com
</span>

<label class="d-label--md d-fw-bold">
  Display name
</label>
```

</div>
<div>

**After:**

```html
<dt-text as="p" variant="headline-md">Welcome back</dt-text>

<dt-text variant="body-xs" tone="secondary" truncate>
  you@example.com
</dt-text>

<dt-text as="label" variant="label-md" strength="bold">
  Display name
</dt-text>
```

</div>
</div>

> [!INFO] The `as` prop
> The script omits `as="…"` when the original tag is `<span>` — that is DtText's default rendered element. For all other tags (`p`, `div`, `h1`–`h6`, `label`) it emits `as="…"` to preserve semantic meaning.

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before:**

```html
<h2 class="d-headline--lg-compact">
  Recent calls
</h2>

<div class="d-body--md-compact d-ta-right d-fc-muted">
  Last updated just now
</div>
```

</div>
<div>

**After:**

```html
<dt-text as="h2" variant="headline-xl" density="200">
  Recent calls
</dt-text>

<dt-text as="div" variant="body-md" density="300" tone="muted" align="end">
  Last updated just now
</dt-text>
```

</div>
</div>

> [!INFO] Logical alignment
> `d-ta-left` → `align="start"` and `d-ta-right` → `align="end"` follow Dialtone's [logical naming convention](/guides/migration/logical-naming/). Physical direction names are not used in props.

## Migration Tool

`dialtone-migrate --only typography` scans `.vue` and `.html` files for legacy typography utility classes and converts them to `<dt-text>`. The runner is included with both `@dialpad/dialtone` and `@dialpad/dialtone-css`.

> [!INFO] Why the tool never emits size
> Beside `variant`, `size` is a raw font-size override, not a composition step. The tool emits only `variant` for a composed class so the rendered font size stays the one the class produced.

### What the Tool Migrates

**Composed typography classes** on `<p>`, `<span>`, `<div>`, `<h1>`–`<h6>`, and `<label>` elements, and on `<dt-text>` elements with no `kind`, `size`, `variant`, or `family` of their own:

- `d-headline--*` (and legacy aliases like `d-headline-medium`) → `variant="headline-*"`, plus `strength` for soft and `density` for compact styles
- `d-body--*` / `d-body-*` → `variant="body-md"` or `variant="body-xs"`, plus `density` for compact styles
- `d-label--*` / `d-label-*` → `variant="label-md"` or `variant="label-xs"`, plus `strength` for plain and `density` for compact styles
- `d-code--md` / `d-code-base` → `variant="code-sm"`
- `d-helper--*` → approximated as `variant="body-md"` or `variant="body-xs"` plus `density` (flagged for review — see below)

Each variant renders the same composition as the `kind + size` pair earlier versions emitted. See the [Class-to-Prop Reference](#class-to-prop-reference).

**Override utility classes** on any element being migrated, or on existing `<dt-text>` elements carrying residual utilities:

- `d-fw-bold/semibold/medium/normal` → `strength="…"`
- `d-lh-100` – `d-lh-600` → `density="…"`
- `d-fc-*` (15 tone values) → `tone="…"`
- `d-truncate` → `truncate` (boolean prop)
- `d-ta-left/right/center/justify` → `align="start/end/center/justify"`
- `d-ff-mono` → `family="mono"` (size, weight, and line height still come from the composition or the parent)

Override utilities are `!important`, so they win over the defaults a composed class implies. The tool keeps that result: `d-headline--sm-soft d-fw-bold` becomes `variant="headline-xs" strength="bold"`, not `strength="medium"`.

**Non-rewriteable tags** (`<a>`, `<button>`, `<li>`, `<td>`, custom Vue components, etc.) are never converted — they carry semantic behavior beyond text and have no clean DtText receiver. If such a tag carries **only override utilities** (`d-fw-*`, `d-fc-*`, etc.) it is left untouched silently. If it carries a **composed class**, the tool flags it with a `review composed class on wrapper tag` marker instead of rewriting it (see the markers table below).

**Layout containers are skipped, not rewritten.** A rewriteable tag carrying a composed class is only converted when it's a genuine text leaf. If it has a layout display class or block/component children (i.e. it's a wrapper, not text), the tool leaves it in place and flags it with a `review composed class on wrapper` marker.

### What the Tool Flags for Review

Patterns the tool can't safely auto-migrate are surfaced with an inline `<!-- dt-text-migrate: … -->` comment. In most cases the element is left unchanged so the legacy class still appears in the diff for you to handle; the `d-helper--*` case is the exception (it is rewritten to an approximation *and* flagged). Run `--remove-markers` once you've resolved every flagged case to strip all `dt-text-migrate` comments.

| Marker comment | What triggered it | What to do |
| --- | --- | --- |
| `<!-- dt-text-migrate: review -->` | `d-headline--eyebrow` / `d-headline-eyebrow` (uses `text-transform: uppercase` — no DtText prop); `d-code--sm` / `d-code-small` (below DtText minimum code size) | Check whether uppercase or small code is genuinely required; implement a custom solution or leave as-is |
| `<!-- dt-text-migrate: review helper -->` | `d-helper--*` — approximated as `variant="body-md"` or `variant="body-xs"` plus `density`; element IS rewritten | Verify the approximation is visually correct; adjust `density` if needed |
| `<!-- dt-text-migrate: review composed class on wrapper -->` | A rewriteable tag (`<div>`, `<p>`, `<span>`, etc.) carrying a composed class that is actually a **layout container** — it has a layout display class or block/component children, so it isn't a text leaf. Left unchanged, including when it's nested inside another `<dt-text>`. | Move the composed class onto the actual text element inside, or wrap the text in a `<dt-text>`; keep the container as plain layout |
| `<!-- dt-text-migrate: review composed class on wrapper tag -->` | A composed class on a tag the tool never rewrites — `<a>`, `<button>`, `<dt-*>` components, custom Vue components, etc. Left unchanged. | Decide whether the text inside should become `<dt-text>`, or apply equivalent typography props to the component if it accepts them |
| `<!-- dt-text-migrate: review composed class with authored composition -->` | A composed class on a `<dt-text>` that already has `kind`, `size`, `variant`, or `family` (static, bound, or shorthand), or a `v-bind` spread or dynamic prop name that could supply one. Left unchanged, utilities included. | Choose the composition you want, set `variant`, and remove the class. Run `text-variant` first if the element has a `kind + size` pair |
| `<!-- dt-text-migrate: review attribute that may become a DtText prop -->` | A native element (`<p>`, `<span>`, etc.) with an attribute named like a DtText prop (`as`, `variant`, `size`, `max-lines`, …; static, bound, or shorthand), or a `v-bind` spread or dynamic attribute name that could supply one. The element ignores these today; converting it would make them props, so a spread `size` would become a raw font-size override and `as` would change the tag. Left unchanged, utilities included. | Remove or rename the attribute and run the tool again, or convert the element by hand |
| `<!-- dt-text-migrate: review multiple composed classes -->` | Two composed classes with different mappings on one element. Class order doesn't decide which renders, so there is no single safe variant. Left unchanged. Aliases with identical mappings (`d-body--md d-body-base`) collapse without a marker. | Remove the class you don't need and run the tool again |
| `<!-- dt-text-migrate: review nested span -->` | A child `<span>` with directives, events, extra attributes, or block/component children that can't be safely collapsed into a nested `<dt-text>` | Migrate the child manually, or keep it as a plain `<span>` inside the parent `<dt-text>` |
| `<!-- dt-text-migrate: review dynamic class -->` | `:class` / `v-bind:class` bindings containing typography utilities | Convert conditionally bound utilities to conditional props (e.g., `:strength="isBold ? 'bold' : 'normal'"`) |
| `<!-- dt-text-migrate: review conflicting class -->` | A utility can't become a prop safely: the element already sets that prop (`<dt-text strength="bold" class="d-fw-normal">`), two utilities set it to different values, or an inline style, bound style, or `v-bind` spread may set the same CSS property. The tool keeps the prop **and** the class, because the `!important` utility may be what renders today. | Pick the value you want, then remove either the class or the prop |
| `<!-- dt-text-migrate: review d-fs-N (raw font-size token; size="N" can replace it alongside variant) -->` | A `d-fs-N` class on an element that has a variant. | Replace the class with `size="N"`, or keep the class |
| `<!-- dt-text-migrate: review d-fs-N (raw font-size token; size="N" needs a variant, which font size alone does not determine) -->` | A `d-fs-N` class on an element without a variant. Font size alone can't establish the text composition. | Choose a `variant` for the text, then use `size="N"`. Keep the utility on non-text wrappers |
| `<!-- dt-text-migrate: review d-fs-N (no matching DtText size token; keep class) -->` | A `d-fs-N` class that isn't a Dialtone font-size token | Keep the utility |
| `<!-- dt-text-migrate: legacy heading — as=… \| variant=… (VERIFY) \| d-fs-N … \| strength=… \| tone=… -->` | The hand-rolled heading pattern: an element with both `d-fw-*` and `d-fs-N` (no composed class). The comment suggests `variant=headline-?` for `<h1>`–`<h6>` and asks you to choose headline, body, or label for other tags. | Choose the variant, then apply `size`, `strength`, and `tone` from the comment |

### How the Tool Works

#### Composed Class Rewriting

The script matches the full composed class name (e.g., `d-headline--md`) to the mapping table and emits its `variant` and optional `density`/`strength` props. Unrecognized classes are kept on the element's `class` attribute unchanged.

**Non-span tags get an `as` prop:**

```html
<!-- span: no as prop (DtText default) -->
<span class="d-body--sm">Help text</span>
→ <dt-text variant="body-xs">Help text</dt-text>

<!-- p: as="p" to preserve semantic element -->
<p class="d-body--md">Body copy</p>
→ <dt-text as="p" variant="body-md">Body copy</dt-text>
```

#### Override Extraction

Override utilities are extracted from the class list and written as props on the rewritten element. Any class not recognized as a typography utility is kept on the `class` attribute.

```html
<!-- Before: mixed composed + override + other class -->
<p class="d-body--md d-fc-tertiary d-truncate d-mb-300">...</p>

<!-- After: typography→props, other class retained -->
<dt-text as="p" variant="body-md" tone="tertiary" truncate class="d-mb-300">...</dt-text>
```

#### Nested Span Collapse

When a direct child `<span>` of a migrated element carries only recognized override classes (no extra attributes, directives, events, or block/component children), the script collapses it into a nested `<dt-text>` with only those props. It gets no variant, so it keeps inheriting the parent's typography:

```html
<!-- Before -->
<p class="d-headline--md">
  Run <span class="d-ff-mono">npm test</span> to <span class="d-fw-bold">check</span>
</p>

<!-- After: safe to collapse — spans have only recognized classes -->
<dt-text as="p" variant="headline-md">
  Run <dt-text family="mono">npm test</dt-text> to <dt-text strength="bold">check</dt-text>
</dt-text>
```

A child span with its own composed class is converted like any other element. If the tool leaves one unchanged with a marker, it isn't retried as a nested span.

#### Already-DtText Residual Lift

The script also scans `<dt-text>` elements that carry residual utility classes from a previous partial migration, and lifts those classes into props:

```html
<!-- Before: already DtText but with leftover utility classes -->
<dt-text kind="body" class="d-fw-bold d-fc-secondary">...</dt-text>

<!-- After -->
<dt-text kind="body" strength="bold" tone="secondary">...</dt-text>
```

A utility that conflicts with a prop the element already sets stays on the element next to that prop, with a `review conflicting class` marker.

### Convert Existing Kind and Size Pairs

The `typography` stage emits `variant` itself, so it creates no new `kind + size` pairs. The opt-in `text-variant` stage converts supported pairs already in your code, whether hand-written or emitted by earlier versions of the typography tool. Check `npx dialtone-migrate --help` in your installed version before using it; this source change does not establish npm release availability.

```sh
npx dialtone-migrate --only text-variant --dry-run --cwd ./src
# Preview both stages against current files (without simulated writes):
npx dialtone-migrate --only typography,text-variant --dry-run --cwd ./src
```

Remove `--dry-run` to apply changes; add `--yes` to skip confirmation. `--only` runs stages in the supplied order, and each stage scans again during an applied run. A combined dry-run previews each stage against the files currently on disk; it does not simulate earlier stages. The `text-variant` preview reports aggregate eligible and existing-variant counts plus manual-review locations; it does not show individual eligible transformations. To inspect exact changes, create an isolated checkout with a clean Git working tree. Run `typography` there if needed and commit its changes locally; then apply `text-variant` and review the diff. Health-check reports pending pairs and manual-review cases; it does not gate stage execution.

Health-check and `text-variant` stop at nested Git repositories, including checked-out submodules. Target each repository explicitly with `--cwd` so its own ignore rules apply. Built-in exclusions still match the full path, including segments above `--cwd`; a repository under `dist` or `compiled` is not scanned.

The `typography` stage has a different scan scope: it does not consult Git ignore rules and can traverse nested repositories. In a combined run, it may change files that `text-variant` then skips. Preview and inspect its output separately before applying the combined command.

```html
<!-- Before -->
<DtText as="p" :kind="'body'" :size="300">Copy</DtText>
<!-- After: both legacy props are removed -->
<DtText as="p" variant="body-md">Copy</DtText>
```

Numeric composition sizes `100`, `200`, `300`, `400`, `500`, `600`, `700` map to `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`. Headline supports all seven; body, label and code support `xs` through `lg`. Both tag casings, static attributes and statically bound string/numeric literals are supported in Vue HTML templates and HTML files. Other source regions are preserved.

Within `text-variant`, any explicit `variant`, including a bound variant, protects the entire element. Other selected stages have their own behavior; this guarantee does not extend to them. An existing `variant + size` may be an intentional raw font-size override. Spreads, dynamic arguments, nonliteral expressions, conflicting props and unsupported mappings stay unchanged with file/line/column diagnostics and a manual-review action. Kind-only and size-only usages are outside this pair conversion. The reported existing-variant count includes every Text element with an explicit variant, including elements converted on an earlier run and elements the `typography` stage created; it is not a count of size overrides. The stage inserts no review markers; a second run leaves converted output unchanged.

The `typography` stage converts `d-body--sm` to `variant="body-xs"` in one step; `text-variant` then leaves it unchanged and counts it as an existing variant.

### Usage

#### Preview Changes

```bash
npx dialtone-migrate --only typography --dry-run --cwd ./src
```

#### Target a Directory

```bash
npx dialtone-migrate --only typography --cwd ./src/components
```

#### Apply All Changes

```bash
npx dialtone-migrate --only typography --yes
```

#### Interactive Mode

```bash
npx dialtone-migrate --only typography
```

In interactive mode the tool processes one file at a time. For each file that has changes, it prints the file path and prompts once before writing:

```text
📄 src/components/Header.vue
   Apply? [y]es / [n]o / [a]ll / [q]uit:
```

Respond with:

- `y` / `yes`: apply all changes in this file
- `n` / `no`: skip this file
- `a` / `all`: apply this file and every remaining file without further prompts
- `q` / `quit`: stop immediately

The prompt applies or skips the whole file — it does not step through individual changes within a file. To preview exactly what would change before committing, run `--dry-run` first (it reports which files would be modified).

#### Target Specific Files

The following advanced modes are not forwarded by the umbrella runner and have no separately published binary. Run the module from your consumer project root using the path for your installed package:

- `@dialpad/dialtone`: `node node_modules/@dialpad/dialtone/dist/js/dialtone_migrate_typography/index.mjs`
- `@dialpad/dialtone-css`: `node node_modules/@dialpad/dialtone-css/lib/dist/js/dialtone_migrate_typography/index.mjs`

The examples below use the umbrella package path. Substitute the CSS package path when that is your installation.

```bash
# Single file
node node_modules/@dialpad/dialtone/dist/js/dialtone_migrate_typography/index.mjs --file src/components/Header.vue --dry-run

# Multiple files
node node_modules/@dialpad/dialtone/dist/js/dialtone_migrate_typography/index.mjs --file Header.vue --file Footer.vue --yes
```

When using `--file`, the `--cwd` option is ignored.

#### Validate Existing DtText Elements

```bash
node node_modules/@dialpad/dialtone/dist/js/dialtone_migrate_typography/index.mjs --validate --cwd ./src
```

`--validate` runs read-only and scans existing `<dt-text>` elements for prop bugs: object syntax (`:variant="{ … }"`), invalid prop values (including `variant` and `family`), and mixed CSS classes. It checks `size` in context, as DtText does: beside a `variant` it must be a raw font-size token such as `250`; with `kind` alone it must be a composition size for that kind; with neither, it is reported because DtText ignores it. Bound values and `v-bind` spreads are not evaluated. Useful as a post-migration audit.

#### Remove Review Markers

```bash
node node_modules/@dialpad/dialtone/dist/js/dialtone_migrate_typography/index.mjs --remove-markers --cwd ./src
```

Strips all `<!-- dt-text-migrate: review … -->` comments after you have reviewed and resolved each flagged pattern. Add `--dry-run` to preview which files would be cleaned.

**All options:**

| Option | Description |
| --- | --- |
| `--cwd <path>` | Working directory (default: current directory) |
| `--file <path>` | Specific file to process (repeatable; ignores `--cwd`) |
| `--dry-run` | Show changes without writing files |
| `--yes`, `-y` | Apply all changes without prompting |
| `--remove-markers` | Strip all `dt-text-migrate` review comments |
| `--validate` | Read-only: scan existing `<dt-text>` for prop bugs |
| `--package <name>` | Package name for injected `DtText` imports (e.g. `@dialpad/dialtone-next`). Overrides import-path detection |
| `--help`, `-h` | Show help |

Files processed: `.vue` and `.html`.

## Post-Migration

### Add DtText Imports

When a file gains its first `<dt-text>`, the script prints a per-file notice on stdout if `DtText` is not already imported or registered. It infers the import path from the file's existing imports: files that already import from `@dialpad/dialtone-vue` (or `@dialpad/dialtone-icons`) get an `@dialpad/dialtone-vue` suggestion; otherwise it suggests the local `@/components/text` path. Follow the printed instructions:

**Options API (registered globally in your app):**

```js
import { DtText } from '@dialpad/dialtone-vue';

export default {
  components: { DtText },
  // …
};
```

**Composition API:**

```vue
<script setup>
import { DtText } from '@dialpad/dialtone-vue';
</script>
```

Projects that import Dialtone components locally will instead see `import { DtText } from '@/components/text';` — use whichever path matches your project's existing imports.

If you run Dialtone under a custom package alias (for example `@dialpad/dialtone-next` while migrating incrementally), pass `--package` to force injected imports to use it:

```bash
npx dialtone-migrate --only typography --package @dialpad/dialtone-next --cwd ./src
```

### Remove Review Markers

After resolving all flagged patterns, strip the marker comments:

```bash
node node_modules/@dialpad/dialtone/dist/js/dialtone_migrate_typography/index.mjs --remove-markers --cwd ./src
```

### ESLint Auto-Fix

Run ESLint after migration to fix Vue attribute ordering:

```bash
npx eslint --fix "./src/**/*.vue"
```

## Manual Migration

### Native HTML Elements

1. Find elements with a `d-headline--*`, `d-body--*`, `d-label--*`, or `d-code--md` class
2. Change the tag to `<dt-text>`
3. Change the closing tag to `</dt-text>`
4. Convert composed classes to `variant` (plus any `strength` or `density`) using the [Class-to-Prop Reference](#class-to-prop-reference) below
5. Add `as="…"` if the original tag is not `<span>`
6. Keep non-typography classes on the component's `class` attribute

### Raw Font-Size Utilities

Use the `size` prop for raw font-size token replacement only when it is paired with `variant` for a complete text composition. With legacy `kind` and no `variant`, `size` selects a composition step instead, so `kind="body" size="250"` is not valid. Do not migrate a raw font-size utility to `<dt-text size="…">` by itself; DtText ignores `size` without a `variant` or `kind`. Font size alone doesn't tell you which variant the text needs, so choose it from the design.

```html
<!-- Before -->
<p class="d-fs-200">Body text</p>

<!-- After: composed style plus exact font-size token -->
<dt-text as="p" variant="body-md" size="200">Body text</dt-text>

<!-- After: composed style plus exact font-size override -->
<dt-text as="p" variant="body-md" size="250">Large body text</dt-text>
```

Supported raw `size` values are `50`, `75`, `100`, `125`, `150`, `200`, `250`, `300`, `350`, `400`, `450`, `500`, `550`, `600`, `650`, `700`, `750`, and `800`.

### Custom Components

> [!WARNING]
> Custom Vue components require manual migration.

#### Option 1: Wrap the component

```html
<!-- Before -->
<my-component class="d-body--md d-fc-secondary" />

<!-- After -->
<dt-text variant="body-md" tone="secondary">
  <my-component />
</dt-text>
```

#### Option 2: Update the component internally

If you own the component, apply the prop directly to the root text element.

### Dynamic Class Bindings

> [!WARNING]
> Dynamic bindings like `:class="{ 'd-body--md': active }"` cannot be auto-migrated. The migration tool emits a `<!-- dt-text-migrate: review dynamic class -->` comment.

**Before:**

```html
<p :class="{ 'd-fc-secondary': isDimmed }">Copy</p>
```

**After:**

```html
<dt-text as="p" :tone="isDimmed ? 'secondary' : undefined">Copy</dt-text>
```

## Class-to-Prop Reference

### Composed Typography Classes

The tool emits the `variant`, `density`, and `strength` values below. The last column shows the `kind + size` pair earlier versions emitted for the same class; each variant renders the same composition, and `text-variant` converts that pair to the same variant.

| Old class | `variant` | `density` | `strength` | Earlier `kind` `size` | Notes |
| --- | --- | --- | --- | --- | --- |
| `d-headline--sm` / `d-headline-small` | `headline-xs` | — | — | `headline` `100` | |
| `d-headline--md` / `d-headline-medium` | `headline-md` | — | — | `headline` `300` | |
| `d-headline--lg` / `d-headline-large` | `headline-xl` | — | — | `headline` `500` | |
| `d-headline--xl` / `d-headline-extra-large` | `headline-2xl` | — | — | `headline` `600` | |
| `d-headline--xxl` / `d-headline-extra-extra-large` | `headline-3xl` | — | — | `headline` `700` | |
| `d-headline--eyebrow` / `d-headline-eyebrow` | — | — | — | — | **Flagged** — no DtText prop for `text-transform: uppercase` |
| `d-headline--sm-soft` / `d-headline-soft-small` | `headline-xs` | — | `medium` | `headline` `100` | |
| `d-headline--lg-soft` | `headline-xl` | — | `medium` | `headline` `500` | |
| `d-headline--sm-compact` / `d-headline-compact-small` | `headline-xs` | `200` | — | `headline` `100` | |
| `d-headline--md-compact` / `d-headline-compact-medium` | `headline-md` | `300` | — | `headline` `300` | |
| `d-headline--lg-compact` / `d-headline-compact-large` | `headline-xl` | `200` | — | `headline` `500` | |
| `d-headline--xl-compact` | `headline-2xl` | `100` | — | `headline` `600` | |
| `d-headline--xxl-compact` | `headline-3xl` | — | — | `headline` `700` | Same line-height as base |
| `d-headline--sm-soft-compact` / `d-headline-compact-soft-small` | `headline-xs` | `200` | `medium` | `headline` `100` | |
| `d-headline--lg-soft-compact` | `headline-xl` | `200` | `medium` | `headline` `500` | |
| `d-body--md` / `d-body-base` | `body-md` | — | — | `body` `300` | |
| `d-body--sm` / `d-body-small` | `body-xs` | — | — | `body` `100` | |
| `d-body--md-compact` / `d-body-compact` | `body-md` | `300` | — | `body` `300` | |
| `d-body--sm-compact` / `d-body-compact-small` | `body-xs` | `200` | — | `body` `100` | |
| `d-label--md` / `d-label-base` | `label-md` | — | — | `label` `300` | |
| `d-label--sm` / `d-label-small` | `label-xs` | — | — | `label` `100` | |
| `d-label--md-compact` / `d-label-compact` | `label-md` | `300` | — | `label` `300` | |
| `d-label--sm-compact` / `d-label-compact-small` | `label-xs` | `200` | — | `label` `100` | |
| `d-label--md-plain` / `d-label-plain` | `label-md` | — | `normal` | `label` `300` | |
| `d-label--md-plain-compact` / `d-label-compact-plain` | `label-md` | `300` | `normal` | `label` `300` | |
| `d-label--sm-plain` / `d-label-plain-small` | `label-xs` | — | `normal` | `label` `100` | |
| `d-label--sm-plain-compact` / `d-label-compact-plain-small` | `label-xs` | `200` | `normal` | `label` `100` | |
| `d-code--md` / `d-code-base` | `code-sm` | — | — | `code` `200` | |
| `d-code--sm` / `d-code-small` | — | — | — | — | **Flagged** — below DtText minimum code size |
| `d-helper--md` / `d-helper-base` | `body-md` | `300` | — | `body` `300` | **Flagged for review** — approximated |
| `d-helper--sm` / `d-helper-small` | `body-xs` | `200` | — | `body` `100` | **Flagged for review** — approximated |

### Override Utility Classes

| Old class | DtText prop | Value |
| --- | --- | --- |
| `d-fw-bold` | `strength` | `"bold"` |
| `d-fw-semibold` | `strength` | `"semibold"` |
| `d-fw-medium` | `strength` | `"medium"` |
| `d-fw-normal` | `strength` | `"normal"` |
| `d-lh-100` | `density` | `"100"` |
| `d-lh-200` | `density` | `"200"` |
| `d-lh-300` | `density` | `"300"` |
| `d-lh-400` | `density` | `"400"` |
| `d-lh-500` | `density` | `"500"` |
| `d-lh-600` | `density` | `"600"` |
| `d-fc-primary` | `tone` | `"primary"` |
| `d-fc-secondary` | `tone` | `"secondary"` |
| `d-fc-tertiary` | `tone` | `"tertiary"` |
| `d-fc-muted` | `tone` | `"muted"` |
| `d-fc-disabled` | `tone` | `"disabled"` |
| `d-fc-placeholder` | `tone` | `"placeholder"` |
| `d-fc-critical` | `tone` | `"critical"` |
| `d-fc-critical-strong` | `tone` | `"critical-strong"` |
| `d-fc-positive` | `tone` | `"positive"` |
| `d-fc-positive-strong` | `tone` | `"positive-strong"` |
| `d-fc-warning` | `tone` | `"warning"` |
| `d-fc-info` | `tone` | `"info"` |
| `d-fc-info-strong` | `tone` | `"info-strong"` |
| `d-fc-neutral-black` | `tone` | `"neutral-black"` |
| `d-fc-neutral-white` | `tone` | `"neutral-white"` |
| `d-truncate` | `truncate` | *(boolean prop — no value)* |
| `d-ta-left` | `align` | `"start"` |
| `d-ta-right` | `align` | `"end"` |
| `d-ta-center` | `align` | `"center"` |
| `d-ta-justify` | `align` | `"justify"` |
| `d-ff-mono` | `family` | `"mono"` |
