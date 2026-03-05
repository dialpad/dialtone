---
title: Prose
description: A container that applies typographic defaults to raw HTML content, restoring margins, list styles, heading sizes, and other block-level formatting that the Dialtone reset strips away.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-prose--default
figma_url: planned
keywords: ["prose", "typography", "markdown", "content", "article", "html", "rich content", "d-prose", "DtProse", "dt-prose"]
---

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
- **Attribute stripping** — Non-essential attributes (`class`, `style`, `data-*`, event handlers) are silently removed. Structural and accessibility attributes (`id`, `href`, `src`, `alt`, `scope`, `lang`, `dir`, etc.) are preserved.

This is a development-time guardrail, not a security boundary. XSS protection is the responsibility of whoever produces the HTML.

### Supported elements

Prose styles the full set of content HTML elements:

| Category | Elements |
| --- | --- |
| Headings | `h1` – `h6`, with `<small>` subtext |
| Text blocks | `p`, `blockquote`, `pre`, `hr` |
| Inline formatting | `strong`, `em`, `code`, `kbd`, `mark`, `small`, `sub`, `sup`, `abbr`, `var`, `samp`, `dfn`, `del`, `ins`, `s`, `u`, `q` |
| Links | `a` with hover, active, and focus-visible states |
| Lists | `ul`, `ol` (nested to 3 levels with distinct markers), `dl`/`dt`/`dd`, task lists |
| Tables | `table`, `thead`, `tbody`, `th`, `td`, `caption` |
| Media | `img`, `figure`/`figcaption` |
| Interactive | `details`/`summary` |
| Code | `pre > code` blocks, inline `code` |

## Accessibility

- Prose renders as a plain `<div>` with no implicit ARIA role. Add `role="article"` or wrap in an `<article>` element upstream if the content represents a self-contained composition.
- All heading levels (`h1`–`h6`) maintain their native semantics and document outline contribution.
- Links receive visible focus indicators via `box-shadow: var(--dt-shadow-focus)`.
- Abbreviations (`<abbr title="...">`) display a dotted underline and `cursor: help`.
- Tables use semantic `<thead>`, `<th scope>`, and visible borders for screen-reader navigability.

## Examples

### Markdown output

The most common use case: wrapping HTML that was rendered from markdown by a library like `markdown-it`, `marked`, or a server-side renderer.

<code-well-header>
  <div class="d-w100p">
    <dt-prose ref="proseExample1">
      <h1>Getting started</h1>
      <p>Install the package:</p>
      <pre><code>npm install @dialpad/dialtone</code></pre>
      <p>Then import the styles:</p>
      <pre><code>import '@dialpad/dialtone/css';</code></pre>
      <p>You can now use any of the available <a href="#">utility classes</a>. For example:</p>
      <ul>
        <li><code>d-p16</code> — applies 16px padding</li>
        <li><code>d-fc-primary</code> — sets the primary font color</li>
      </ul>
      <blockquote>
        <p><strong>Note:</strong> Make sure your build pipeline processes CSS imports before deploying.</p>
      </blockquote>
    </dt-prose>
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.proseExample1"
vueCode='
<dt-prose>
  <h1>Getting started</h1>
  <p>Install the package:</p>
  <pre><code>npm install @dialpad/dialtone</code></pre>
  <p>Then import the styles:</p>
  <pre><code>import &apos;@dialpad/dialtone/css&apos;;</code></pre>
  <p>You can now use any of the available
    <a href="#">utility classes</a>. For example:</p>
  <ul>
    <li><code>d-p16</code> — applies 16px padding</li>
    <li><code>d-fc-primary</code> — sets the primary font color</li>
  </ul>
  <blockquote>
    <p><strong>Note:</strong> Make sure your build pipeline
      processes CSS imports before deploying.</p>
  </blockquote>
</dt-prose>
'
/>

### Tables

Prose tables are fully styled with borders, header separation, and row-scoped headers.

<code-well-header>
  <div class="d-w100p">
    <dt-prose ref="proseExample2">
      <table>
        <caption>Token spacing scale</caption>
        <thead>
          <tr>
            <th>Token</th>
            <th>Value</th>
            <th>Pixels</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><code>--dt-size-300</code></th>
            <td>0.4rem</td>
            <td>4px</td>
          </tr>
          <tr>
            <th scope="row"><code>--dt-size-400</code></th>
            <td>0.8rem</td>
            <td>8px</td>
          </tr>
          <tr>
            <th scope="row"><code>--dt-size-500</code></th>
            <td>1.6rem</td>
            <td>16px</td>
          </tr>
        </tbody>
      </table>
    </dt-prose>
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.proseExample2"
vueCode='
<dt-prose>
  <table>
    <caption>Token spacing scale</caption>
    <thead>
      <tr>
        <th>Token</th>
        <th>Value</th>
        <th>Pixels</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row"><code>--dt-size-300</code></th>
        <td>0.4rem</td>
        <td>4px</td>
      </tr>
    </tbody>
  </table>
</dt-prose>
'
/>

### Task list

Checkboxes inside list items are the one exception to the "no form elements" rule, supporting the common markdown task-list pattern.

<code-well-header>
  <div class="d-w100p">
    <dt-prose ref="proseExample3">
      <ul>
        <li><input type="checkbox" checked disabled> Design review complete</li>
        <li><input type="checkbox" checked disabled> Implementation merged</li>
        <li><input type="checkbox" disabled> Documentation published</li>
      </ul>
    </dt-prose>
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.proseExample3"
vueCode='
<dt-prose>
  <ul>
    <li><input type="checkbox" checked disabled> Design review complete</li>
    <li><input type="checkbox" checked disabled> Implementation merged</li>
    <li><input type="checkbox" disabled> Documentation published</li>
  </ul>
</dt-prose>
'
/>

### Details and summary

Collapsible sections useful for FAQs, supplementary information, or long reference content.

<code-well-header>
  <div class="d-w100p">
    <dt-prose ref="proseExample4">
      <details>
        <summary>What elements are supported?</summary>
        <p>Prose styles headings, paragraphs, lists, tables, blockquotes, code blocks, definition lists, figures, and details/summary. See the <strong>Supported elements</strong> table above for the full list.</p>
      </details>
    </dt-prose>
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.proseExample4"
vueCode='
<dt-prose>
  <details>
    <summary>What elements are supported?</summary>
    <p>Prose styles headings, paragraphs, lists, tables,
      blockquotes, code blocks, definition lists, figures,
      and details/summary.</p>
  </details>
</dt-prose>
'
/>

## Vue API

<component-vue-api component-name="prose" />

<script setup>
import { DtProse } from '@dialpad/dialtone-vue';
</script>
