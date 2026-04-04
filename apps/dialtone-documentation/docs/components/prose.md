---
title: Prose
description: A container that applies typographic defaults to raw HTML content, restoring margins, list styles, heading sizes, and other block-level formatting that the Dialtone reset strips away.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-prose--default
figma_url: planned
keywords: ["typography", "markdown", "content", "article", "html", "rich content", "d-prose", "DtProse", "dt-prose"]
---

<component-combinator component-name="DtProse" />

## Usage

Prose is a container for pre-rendered HTML content that needs sensible typographic defaults — markdown output, CMS pages, AI-generated responses, help articles, or any block of "raw" HTML that was not authored with Dialtone components, styles, or utility classes.

Style is stripped down and scoped so that elements start from a clean slate. Prose restores those defaults within a scoped container, so content reads naturally without requiring classes on any inner element.

<dialtone-usage>
<template #do>

- Wrap rendered markdown, CMS output, or any pre-rendered HTML that you do not control.
- Use for long-form prose-like content blocks: help articles, changelogs, etc.
- Let Prose handle all inner styling — pass plain HTML with no classes or inline styles.

</template>

<template #dont>

- Wrap Dialtone components or interactive UI — Prose is purely for static and raw HTML structures.
- Add `class` or `style` attributes to elements inside Prose — they will be stripped.
- Place form elements (`<input>`, `<select>`, `<button>`) inside Prose — use proper Dialtone form components instead.
- Nest a Prose container inside another Prose container.
- Use Prose as a general-purpose "reset" — it is specifically designed for article-like content.

</template>

</dialtone-usage>

### Content validation

DtProse enforces that slot content stays "pure" HTML:

- **Disallowed elements** — Form controls (`<input>`, `<select>`, `<textarea>`, `<button>`, etc.) and custom elements (any hyphenated tag name like `<dt-button>`) produce a `console.error`. The one exception is `<input type="checkbox">` inside `<li>` for task-list patterns.
- **Dialtone components** — Any Vue component inside the slot will have their attributes stripped and trigger a console error. DtProse is designed for **plain HTML only** — use Dialtone components outside of Prose.
- **Attribute stripping** — On elements inside the slot, non-essential attributes (`class`, `style`, `data-*`, event handlers) are silently removed. Structural and accessibility attributes (`id`, `href`, `src`, `alt`, `scope`, `lang`, `dir`, etc.) are preserved. Attributes on `<dt-prose>` itself are unaffected.

This is a development-time guardrail, not a security boundary. XSS protection is the responsibility of whoever produces the HTML.

### Supported elements

Prose styles the full set of content HTML elements:

| Category | Elements |
| --- | --- |
| Headings | `h1` – `h6`, with `<small>` subtext |
| Text blocks | `p`, `blockquote`, `pre`, `hr` |
| Inline formatting | `strong`, `em`, `code`, `kbd`, `mark`, `small`, `sub`, `sup`, `abbr`, `var`, `samp`, `dfn`, `del`, `ins`, `s`, `u`, `q` |
| Links | `a` with hover, active, and focus-visible states |
| Lists | `ul`, `ol`, `dl`/`dt`/`dd`, task lists |
| Tables | `table`, `thead`, `tbody`, `th`, `td`, `caption` |
| Media | `img`, `figure`/`figcaption` |
| Interactive | `details`/`summary` |
| Code | `pre > code` blocks, inline `code` |

## Variants

### Size

Shift the entire typography scale via the `size` prop. Headings, body text, code, and spacing all adjust proportionally.

```vue code-only
<!-- @wrapper -->
<dt-stack gap="400" class="d-w100p">
  <dt-prose :size="100"> ... </dt-prose>
  <dt-prose :size="200"> ... </dt-prose>
  <dt-prose> ... </dt-prose>
</dt-stack>
```

### Density

Control line-height independently from size via the `density` prop. Useful for tuning readability in different contexts.

```vue code-only
<!-- @wrapper -->
<dt-stack gap="400" class="d-w100p">
  <dt-prose :density="100"> ... </dt-prose>
  <dt-prose> ... </dt-prose>
  <dt-prose :density="300"> ... </dt-prose>
</dt-stack>
```

## Examples

### Headings and paragraphs

All six heading levels maintain a clear visual hierarchy with balanced spacing between sections, making long documents easy to scan.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <h1>Heading Level 1</h1>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines.</p>
    <h2>Heading Level 2</h2>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines.</p>
    <h3>Heading Level 3</h3>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines.</p>
    <h4>Heading Level 4</h4>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines.</p>
    <h5>Heading Level 5</h5>
    <p>This is a standard paragraph of body text.</p>
  </dt-prose>
</div>
```

### Inline elements

Rich inline formatting including bold, italic, code, keyboard shortcuts, highlights, and links are all styled to be visually distinct without disrupting the reading flow.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <p><strong>Bold text</strong>, <em>italic text</em>, <strong><em>bold italic</em></strong>, and <u>underlined text</u>. Here is <s>strikethrough</s> for deleted content.</p>
    <p>Here is <a href="#">a standard link</a> and a <a href="#">link with <strong>bold</strong> inside</a>.</p>
    <p><code>inline code</code>, <kbd>Ctrl</kbd> + <kbd>S</kbd>, <mark>highlighted</mark>, <small>small</small>, <sub>subscript</sub> and <sup>superscript</sup>, and <abbr title="Abbreviation">abbr</abbr>.</p>
    <p><var>x</var> = <var>y</var> + <var>z</var> for variables, <samp>Error: file not found</samp> for sample output, <dfn>definition</dfn> for terms, and <q>an inline quotation</q>.</p>
  </dt-prose>
</div>
```

### Unordered list

Unordered lists support nesting, each with a distinct marker style (disc, circle, square) so readers can track depth at a glance.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <ul>
      <li>First item in an unordered list</li>
      <li>Second item with more text to test wrapping</li>
      <li>Third item with nested list:
        <ul>
          <li>Nested item one</li>
          <li>Nested item two</li>
          <li>Deeply nested:
            <ul>
              <li>Third level item</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>Fourth item back at the top level</li>
    </ul>
  </dt-prose>
</div>
```

### Ordered list

Ordered lists use decimal numbering with lower-alpha and lower-roman for nested levels, preserving sequence clarity in step-by-step instructions.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <ol>
      <li>First step in a process</li>
      <li>Second step with more detail to test line wrapping</li>
      <li>Third step with a nested ordered list:
        <ol>
          <li>Sub-step one</li>
          <li>Sub-step two</li>
        </ol>
      </li>
      <li>Fourth step back at the top level</li>
    </ol>
  </dt-prose>
</div>
```

### Mixed list

Unordered and ordered lists can be freely nested inside each other, with each level retaining its own marker style.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <ul>
      <li>Unordered item with an ordered sub-list:
        <ol>
          <li>Ordered sub-item one</li>
          <li>Ordered sub-item two</li>
        </ol>
      </li>
      <li>Another unordered item</li>
    </ul>
  </dt-prose>
</div>
```

### Blockquote

Blockquotes are visually offset with an inline-start border and muted color, supporting multi-paragraph content, nesting, and attributed citations.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <blockquote>
      <p>This is a single-paragraph blockquote.</p>
    </blockquote>
    <blockquote>
      <p>This is a multi-paragraph blockquote. The first paragraph introduces the idea.</p>
      <p>The second paragraph continues the thought.</p>
    </blockquote>
    <blockquote>
      <p>Good design is as little design as possible.</p>
      <footer>— <cite>Dieter Rams</cite>, Ten Principles of Good Design</footer>
    </blockquote>
  </dt-prose>
</div>
```

### Code blocks

Preformatted code blocks preserve whitespace and use a monospace font on a subtle background, clearly separating code from surrounding prose.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <pre><code>function greet(name) {
  return `Hello, ${name}!`;
}
const message = greet('world');
console.log(message);</code></pre>
  </dt-prose>
</div>
```

### Table

Prose tables are fully styled with borders, header separation, and row-scoped headers.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <table>
      <caption>Layout token scale</caption>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Pixels</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"><code>--dt-layout-100</code></th>
          <td>4rem</td>
          <td>64px</td>
        </tr>
        <tr>
          <th scope="row"><code>--dt-layout-200</code></th>
          <td>8rem</td>
          <td>128px</td>
        </tr>
        <tr>
          <th scope="row"><code>--dt-layout-400</code></th>
          <td>16rem</td>
          <td>256px</td>
        </tr>
      </tbody>
    </table>
  </dt-prose>
</div>
```

### Definition list

Definition lists pair terms with descriptions, useful for glossaries, metadata tables, and structured key-value content.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <dl>
      <dt>Design token</dt>
      <dd>A named value that represents a design decision, such as a color, spacing unit, or font size.</dd>
      <dt>Component</dt>
      <dd>A reusable UI element that encapsulates structure, style, and behavior.</dd>
      <dt>Utility class</dt>
      <dd>A single-purpose CSS class that applies one specific style rule.</dd>
    </dl>
  </dt-prose>
</div>
```

### Details and summary

Collapsible sections useful for FAQs, supplementary information, or long reference content.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <details>
      <summary>Click to expand for more information</summary>
      <p>This content is hidden by default and revealed when the user interacts with the summary element.</p>
      <ul>
        <li>Detail item one</li>
        <li>Detail item two</li>
      </ul>
    </details>
  </dt-prose>
</div>
```

### Task list

Checkboxes inside list items are the one exception to the "no form elements" rule, supporting the common markdown task-list pattern.

```vue demo
<!-- @wrapper -->
<div class="d-w100p">
  <dt-prose>
    <ul>
      <li><input type="checkbox" checked disabled> Design review complete</li>
      <li><input type="checkbox" checked disabled> Implementation merged</li>
      <li><input type="checkbox" disabled> Documentation published</li>
    </ul>
  </dt-prose>
</div>
```

## Accessibility

- Prose renders as a plain `<div>` with no implicit ARIA role. Add `role="article"` or wrap in an `<article>` element upstream if the content represents a self-contained composition.
- All heading levels (`h1`–`h6`) maintain their native semantics and document outline contribution.
- Links receive visible focus indicators via `box-shadow: var(--dt-shadow-focus)`.
- Abbreviations (`<abbr title="...">`) display a dotted underline and `cursor: help`.
- Tables use semantic `<thead>`, `<th scope>`, and visible borders for screen-reader navigability.

## Vue API

<component-vue-api component-name="prose" />

<script setup>
import { DtProse } from '@dialpad/dialtone-vue';
</script>
