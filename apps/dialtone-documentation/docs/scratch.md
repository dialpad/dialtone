---
layout: Blank
---

<!-- Prose component scratch page — all base HTML elements typical in a prose block -->
<div class="d-p16">
  <div class="d-prose">
    <!-- Headings -->
    <h1>Heading Level 1 <small>small text</small></h1>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing. Good typography makes content easier to read and understand.</p>
    <p>This is another standard paragraph of body text. </p>
    <h2>Heading Level 2 <small>small text</small></h2>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing. Good typography makes content easier to read and understand.</p>
    <h3>Heading Level 3 <small>small text</small></h3>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing. Good typography makes content easier to read and understand.</p>
    <h4>Heading Level 4 <small>small text</small></h4>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing. Good typography makes content easier to read and understand.</p>
    <h5>Heading Level 5 <small>small text</small></h5>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing. Good typography makes content easier to read and understand.</p>
    <h6>Heading Level 6 <small>small text</small></h6>
    <!-- Paragraphs and inline text -->
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing. Good typography makes content easier to read and understand.</p>
    <p>This second paragraph tests spacing between consecutive paragraphs. It also contains <strong>bold text</strong>, <em>italic text</em>, <strong><em>bold italic text</em></strong>, and <u>underlined text</u>. Here is <s>strikethrough text</s> for deleted content.</p>
    <p>Inline elements: <code>inline code</code>, <kbd>Ctrl</kbd> + <kbd>S</kbd> keyboard input, <mark>highlighted text</mark>, <small>small text</small>, <sub>subscript</sub> and <sup>superscript</sup>, and <abbr title="Abbreviation">abbr</abbr>.</p>
    <p>More inline elements: <var>x</var> = <var>y</var> + <var>z</var> for variables, <samp>Error: file not found</samp> for sample output, <dfn>design token</dfn> for defining terms, and <q>an inline quotation</q> with automatic quote marks. The formula is E = mc<sup>2</sup> and water is H<sub>2</sub>O.</p>
    <p>Edit tracking: This text has <del>been removed</del> and <ins>been added</ins> to show revision marks.</p>
    <!-- Links -->
    <p>Here is <a href="#">a standard link</a> within a paragraph. And here is a <a href="#">link with <strong>bold</strong> and <em>em</em> inside it</a>.</p>
    <!-- Horizontal rule -->
    <hr>
    <!-- Unordered list -->
    <h2>Unordered List</h2>
    <ul>
      <li>First item in an unordered list</li>
      <li>Second item with a bit more text to test wrapping behavior on longer list items</li>
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
    <!-- Ordered list -->
    <h2>Ordered List</h2>
    <ol>
      <li>First step in a process</li>
      <li>Second step with more detail to test line wrapping within ordered list items</li>
      <li>Third step with a nested ordered list:
        <ol>
          <li>Sub-step one</li>
          <li>Sub-step two</li>
        </ol>
      </li>
      <li>Fourth step back at the top level</li>
    </ol>
    <!-- Mixed list -->
    <h2>Mixed List</h2>
    <ul>
      <li>Unordered item with an ordered sub-list:
        <ol>
          <li>Ordered sub-item one</li>
          <li>Ordered sub-item two</li>
        </ol>
      </li>
      <li>Another unordered item</li>
    </ul>
    <!-- Blockquote -->
    <h2>Blockquotes</h2>
    <blockquote>
      <p>This is a single-paragraph blockquote. It should be visually distinct from surrounding body text.</p>
    </blockquote>
    <blockquote>
      <p>This is a multi-paragraph blockquote. The first paragraph introduces the idea.</p>
      <p>The second paragraph continues the thought. Both paragraphs should sit inside the same blockquote styling.</p>
    </blockquote>
    <blockquote>
      <p>Nested blockquote:</p>
      <blockquote>
        <p>This is a blockquote inside a blockquote.</p>
      </blockquote>
    </blockquote>
    <blockquote>
      <p>Good design is as little design as possible.</p>
      <footer>— <cite>Dieter Rams</cite>, Ten Principles of Good Design</footer>
    </blockquote>
    <!-- Code blocks -->
    <h2>Code Blocks</h2>
    <pre><code>// A plain code block
name) {
  return `Hello, ${name}!`;
}
const message = greet('world');
console.log(message);</code></pre>
    <p>And here is a paragraph between two code blocks to test spacing.</p>
    <pre><code>&lt;template&gt;
  &lt;div class="container"&gt;
    &lt;h1&gt;{{ title }}&lt;/h1&gt;
    &lt;p&gt;{{ description }}&lt;/p&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
    <!-- Table with thead -->
    <h2>Tables</h2>
    <table>
      <caption>Component API reference</caption>
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>size</code></td>
          <td>String</td>
          <td><code>'md'</code></td>
          <td>Sets the size of the component</td>
        </tr>
        <tr>
          <td><code>variant</code></td>
          <td>String</td>
          <td><code>'default'</code></td>
          <td>Sets the visual style variant</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td>Boolean</td>
          <td><code>false</code></td>
          <td>When true, prevents user interaction</td>
        </tr>
      </tbody>
    </table>
    <!-- Table with row headers -->
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
    <!-- Definition list -->
    <h2>Definition List</h2>
    <dl>
      <dt>Design token</dt>
      <dd>A named value that represents a design decision, such as a color, spacing unit, or font size.</dd>
      <dt>Component</dt>
      <dd>A reusable UI element that encapsulates structure, style, and behavior.</dd>
      <dt>Utility class</dt>
      <dd>A single-purpose CSS class that applies one specific style rule.</dd>
    </dl>
    <!-- Standalone image -->
    <h2>Images</h2>
    <img src="https://placehold.co/600x200" alt="Standalone image outside of a figure" width="600" height="200">
    <!-- Figure and image -->
    <figure>
      <img src="https://placehold.co/600x300" alt="Placeholder image" width="600" height="300">
      <figcaption>Figure 1: A placeholder image with a caption below it.</figcaption>
    </figure>
    <!-- Details / summary -->
    <h2>Details / Summary</h2>
    <details>
      <summary>Click to expand for more information</summary>
      <p>This content is hidden by default and revealed when the user interacts with the summary element. It can contain any block-level content including paragraphs, lists, and code.</p>
      <ul>
        <li>Detail item one</li>
        <li>Detail item two</li>
      </ul>
    </details>
    <!-- Task list (checkbox list) -->
    <h2>Task List</h2>
    <ul>
      <li><input type="checkbox"  checked> Completed task</li>
      <li><input type="checkbox"> Incomplete task</li>
      <li><input type="checkbox"> Another task to do</li>
    </ul>
    <!-- Long-form content flow -->
    <h2>Long-Form Content Flow</h2>
    <p>This section tests how all the elements above flow together naturally, as they would in real documentation or article content.</p>
    <p>When building with our design system, start by installing the package:</p>
    <pre><code>npm install @dialpad/dialtone</code></pre>
    <p>Then import the styles in your entry file:</p>
    <pre><code>import '@dialpad/dialtone/css';</code></pre>
    <p>You can now use any of the available utility classes. For example:</p>
    <ul>
      <li><code>d-p16</code> — applies 16px padding</li>
      <li><code>d-fc-primary</code> — sets the primary font color</li>
      <li><code>d-bgc-moderate</code> — applies a moderate background color</li>
    </ul>
    <blockquote>
      <p><strong>Note:</strong> Make sure your build pipeline is configured to process CSS imports before using utility classes in production.</p>
    </blockquote>
    <p>For more details, see the <a href="#">installation guide</a> or reach out to the team on <a href="#">Slack</a>.</p>
  </div>
</div>

<style lang="less">
@layer components {
.d-prose {
    color: var(--dt-color-foreground-primary);

    &,
    :where(*) {
      all: revert;
      font: var(--dt-text-body-md);
      line-height: var(--dt-font-line-height-300);
    }

    > :first-child {
      margin-block-start: 0;
    }

    :is(h1, h2, h3, h4, h5, h6) {
      color: var(--dt-color-foreground-secondary);
    }
    :is(h1, h2, h3, h4, h5, h6) + *:not(hr) {
      margin-block-start: var(--dt-size-300) !important;
    }

    // ---------------------------------------------------------------------------
    //  HEADINGS
    // ---------------------------------------------------------------------------

    h1 {
      font: var(--dt-text-headline-3xl);
      line-height: var(--dt-font-line-height-100);
      margin-block-start: var(--dt-size-550);
      margin-block-end: var(--dt-size-400);
      text-wrap: balance;
    }

    h2 {
      font: var(--dt-text-headline-2xl);
      line-height: var(--dt-font-line-height-200);
      margin-block-start: var(--dt-size-550);
      margin-block-end: var(--dt-size-400);
      text-wrap: balance;
    }

    h3 {
      font: var(--dt-text-headline-xl);
      line-height: var(--dt-font-line-height-200);
      margin-block-start: var(--dt-size-550);
      margin-block-end: var(--dt-size-400);
      text-wrap: balance;
    }

    h4 {
      font: var(--dt-text-headline-lg);
      line-height: var(--dt-font-line-height-200);
      margin-block-start: var(--dt-size-550);
      margin-block-end: var(--dt-size-400);
      text-wrap: balance;
    }

    h5 {
      font: var(--dt-text-headline-md);
      line-height: var(--dt-font-line-height-200);
      margin-block-start: var(--dt-size-550);
      margin-block-end: var(--dt-size-400);
      text-wrap: balance;
    }

    h6 {
      font: var(--dt-text-headline-sm);
      line-height: var(--dt-font-line-height-200);
      margin-block-start: var(--dt-size-550);
      margin-block-end: var(--dt-size-400);
      text-wrap: balance;
    }

    // ---------------------------------------------------------------------------
    //  PARAGRAPHS
    // ---------------------------------------------------------------------------

    p {
      margin-block-start: var(--dt-size-400);
      text-wrap: pretty;
    }

    // ---------------------------------------------------------------------------
    //  LINKS
    //  Reuses DtLink (.d-link) visual language.
    // ---------------------------------------------------------------------------

    a {
      color: var(--dt-color-link-primary);
      text-decoration: underline;
      text-underline-offset: var(--dt-size-200);
      text-decoration-thickness: var(--dt-size-border-100);
      border-radius: var(--dt-size-radius-200);

      &:hover {
        color: var(--dt-color-link-primary-hover);
        text-decoration: none;
      }

      &:active {
        color: var(--dt-color-link-primary);
      }

      &:focus-visible {
        text-decoration: none;
        outline: none;
        box-shadow: var(--dt-shadow-focus);
      }
    }

    // ---------------------------------------------------------------------------
    //  INLINE ELEMENTS
    // ---------------------------------------------------------------------------

    strong, b {
      font-weight: var(--dt-font-weight-bold);
    }

    em, i {
      font-style: italic;
    }

    code {
      font: var(--dt-text-code-sm);
      padding-block: var(--dt-size-100);
      padding-inline: var(--dt-size-300);
      background-color: var(--dt-color-surface-secondary-opaque);
      border: var(--dt-size-border-50) solid var(--dt-color-border-subtle);
      border-radius: var(--dt-size-radius-200);
      color: var(--dt-color-foreground-tertiary);
    }

    kbd {
      font: var(--dt-text-code-sm);
      padding-block: var(--dt-size-100);
      padding-inline: var(--dt-size-350);
      border: var(--dt-size-border-100) solid var(--dt-color-border-default);
      border-radius: var(--dt-size-radius-300);
      border-block-end-width: var(--dt-size-border-200);
      color: var(--dt-color-foreground-tertiary);
    }

    mark {
      padding-block: var(--dt-size-100);
      padding-inline: var(--dt-size-200);
      background-color: var(--dt-color-surface-warning-subtle);
      border-radius: var(--dt-size-radius-200);
      color: inherit;
    }

    small {
      font-size: smaller;
      font-weight: var(--dt-font-weight-normal);
    }

    sub {
      font-size: smaller;
      vertical-align: sub;
    }

    sup {
      font-size: smaller;
      vertical-align: super;
    }

    abbr[title] {
      text-decoration: underline dotted;
      text-underline-offset: var(--dt-size-200);
      text-decoration-thickness: var(--dt-size-border-100);
      cursor: help;
    }

    var {
      font: var(--dt-text-code-sm);
      font-style: italic;
    }

    samp {
      font: var(--dt-text-code-sm);
    }

    dfn {
      font-style: italic;
      font-weight: var(--dt-font-weight-semi-bold);
    }

    del {
      text-decoration: line-through;
      text-decoration-thickness: var(--dt-size-border-100);
      color: var(--dt-color-foreground-secondary);
    }

    ins {
      text-decoration: underline;
      text-decoration-thickness: var(--dt-size-border-100);
      text-underline-offset: var(--dt-size-200);
    }

    s {
      color: var(--dt-color-foreground-tertiary);
      text-decoration-color: var(--dt-color-foreground-tertiary);
    }

    u {
      text-decoration: underline;
      text-underline-offset: var(--dt-size-200);
      text-decoration-thickness: var(--dt-size-border-100);
    }

    // ---------------------------------------------------------------------------
    //  HORIZONTAL RULE
    // ---------------------------------------------------------------------------

    hr {
      border: none;
      border-block-start: var(--dt-size-border-100) solid var(--dt-color-border-default);
      margin-block: var(--dt-size-550);
    }

    // ---------------------------------------------------------------------------
    //  LISTS
    // ---------------------------------------------------------------------------

    ul {
      list-style: disc;
      padding-inline-start: var(--dt-size-525);
      margin-block-start: var(--dt-size-400);
    }

    ol {
      list-style: decimal;
      padding-inline-start: var(--dt-size-525);
      margin-block-start: var(--dt-size-400);
    }

    li {
      list-style: inherit;
      margin-block-start: var(--dt-size-300);
    }

    ul ul, ul ol, ol ul, ol ol {
      margin-block-start: var(--dt-size-300);
    }

    ul ul {
      list-style-type: circle;
    }

    ul ul ul {
      list-style-type: square;
    }

    ol ol {
      list-style-type: lower-alpha;
    }

    ol ol ol {
      list-style-type: lower-roman;
    }

    li:first-child {
      margin-block-start: 0;
    }

    li > p:first-child {
      margin-block-start: 0;
    }

    // Task lists (checkbox items)
    li:has(> input[type="checkbox"]) {
      list-style-type: none;
      margin-inline-start: calc(-1 * var(--dt-size-525));
    }

    li > input[type="checkbox"] {
      margin-inline-end: var(--dt-size-300);
      vertical-align: text-bottom;
    }

    // ---------------------------------------------------------------------------
    //  BLOCKQUOTE
    // ---------------------------------------------------------------------------

    blockquote {
      border-inline-start: var(--dt-size-border-300) solid var(--dt-color-border-default);
      padding-inline-start: var(--dt-size-400);
      margin-inline: 0;
      margin-block-start: var(--dt-size-500);
      color: var(--dt-color-foreground-tertiary);
    }

    blockquote footer {
      color: var(--dt-color-foreground-muted);
      margin-block-start: var(--dt-size-200);
    }

    cite {
      font-style: italic;
    }

    // ---------------------------------------------------------------------------
    //  CODE BLOCKS
    // ---------------------------------------------------------------------------

    pre {
      margin-block-start: var(--dt-size-400);
      padding: var(--dt-size-500);
      overflow-x: auto;
      font: var(--dt-text-code-sm);
      background-color: var(--dt-color-surface-secondary-opaque);
      border-radius: var(--dt-size-radius-300);
      color: var(--dt-color-foreground-tertiary);
    }

    pre code {
      padding: 0;
      font: inherit;
      background-color: transparent;
      border: none;
      border-radius: 0;
      color: var(--dt-color-foreground-tertiary);
    }

    // ---------------------------------------------------------------------------
    //  TABLES
    // ---------------------------------------------------------------------------

    table {
      inline-size: 100%;
      margin-block: var(--dt-size-500);
      border-collapse: collapse;
      border-spacing: 0;
      font: var(--dt-text-body-sm);
      border: var(--dt-size-border-100) solid var(--dt-color-border-default);
    }

    caption {
      color: var(--dt-color-foreground-muted);
      font-weight: var(--dt-font-weight-medium);
      text-align: start;
      caption-side: bottom;
      padding-block-start: var(--dt-size-350);
    }

    thead {
      border-block-end: var(--dt-size-border-200) solid var(--dt-color-border-default);
    }

    th {
      padding: var(--dt-size-450) var(--dt-size-500);
      font-weight: var(--dt-font-weight-semi-bold);
      color: var(--dt-color-foreground-secondary);
      text-align: start;
    }

    tbody th {
      border-block-end: var(--dt-size-border-100) solid var(--dt-color-border-subtle);
    }

    tbody td {
      padding: var(--dt-size-450) var(--dt-size-500);
      border-block-end: var(--dt-size-border-100) solid var(--dt-color-border-subtle);
    }

    th[scope="row"] {
      font-weight: var(--dt-font-weight-semi-bold);
      color: var(--dt-color-foreground-primary);
    }

    tbody tr:last-child td,
    tbody tr:last-child th {
      border-block-end-width: 0;
    }

    // ---------------------------------------------------------------------------
    //  DEFINITION LIST
    // ---------------------------------------------------------------------------

    dl {
      margin-block-start: var(--dt-size-500);
    }

    dt {
      font-weight: var(--dt-font-weight-bold);
      margin-block-start: var(--dt-size-500);
    }

    dt:first-child {
      margin-block-start: 0;
    }

    dd {
      margin-inline-start: 0;
    }

    // ---------------------------------------------------------------------------
    //  FIGURE & FIGCAPTION
    // ---------------------------------------------------------------------------

    figure {
      margin-inline: 0;
      margin-block-start: var(--dt-size-500);
    }

    figure img {
      max-inline-size: 100%;
      block-size: auto;
      border-radius: var(--dt-size-radius-200);
    }

    figcaption {
      color: var(--dt-color-foreground-muted);
      font-weight: var(--dt-font-weight-medium);
      text-align: start;
      padding-block-start: var(--dt-size-300);
    }

    // ---------------------------------------------------------------------------
    //  DETAILS & SUMMARY
    // ---------------------------------------------------------------------------

    details {
      margin-block-start: var(--dt-size-500);
      border: var(--dt-size-border-100) solid var(--dt-color-border-subtle);
      border-radius: var(--dt-size-radius-400);
      padding: var(--dt-size-500);
    }

    details:has(summary:hover) {
      background-color: var(--dt-color-surface-secondary-opaque);
    }

    summary {
      cursor: pointer;
      font-weight: var(--dt-font-weight-semi-bold);

      &::marker {
        content: '▶\00a0\00a0';
        font-size: var(--dt-font-size-200);
        color: var(--dt-color-foreground-muted);
      }
    }

    details[open] > summary::marker {
      content: '▼\00a0\00a0';
    }

    details[open] > summary {
      margin-block-end: var(--dt-size-500);
    }

    details[open] {
      & > :last-child {
        margin-block-end: 0;
      }
    }

    // ---------------------------------------------------------------------------
    //  IMAGES (standalone, outside figure)
    // ---------------------------------------------------------------------------

    img {
      max-inline-size: 100%;
      block-size: auto;
      border-radius: var(--dt-size-radius-200);
    }
}
}
</style>
