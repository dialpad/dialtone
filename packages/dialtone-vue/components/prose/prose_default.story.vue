<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable max-len -->
<template>
  <dt-prose>
    <!-- Headings -->
    <h1>Heading Level 1 <small>small text</small></h1>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing. Good typography makes content easier to read and understand.</p>
    <p>This is another standard paragraph of body text.</p>
    <h2>Heading Level 2 <small>small text</small></h2>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing.</p>
    <h3>Heading Level 3 <small>small text</small></h3>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing.</p>
    <h4>Heading Level 4 <small>small text</small></h4>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing.</p>
    <h5>Heading Level 5 <small>small text</small></h5>
    <p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines so you can evaluate line height, measure, and paragraph spacing.</p>
    <h6>Heading Level 6 <small>small text</small></h6>

    <!-- Paragraphs and inline text -->
    <p>This paragraph tests inline formatting: <strong>bold text</strong>, <em>italic text</em>, <strong><em>bold italic text</em></strong>, and <u>underlined text</u>. Here is <s>strikethrough text</s> for deleted content.</p>
    <p>Inline elements: <code>inline code</code>, <kbd>Ctrl</kbd> + <kbd>S</kbd> keyboard input, <mark>highlighted text</mark>, <small>small text</small>, <sub>subscript</sub> and <sup>superscript</sup>, and <abbr title="Abbreviation">abbr</abbr>.</p>
    <p>More inline elements: <var>x</var> = <var>y</var> + <var>z</var> for variables, <samp>Error: file not found</samp> for sample output, <dfn>design token</dfn> for defining terms, and <q>an inline quotation</q> with automatic quote marks.</p>
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
      <li>
        Third item with nested list:
        <ul>
          <li>Nested item one</li>
          <li>Nested item two</li>
          <li>
            Deeply nested:
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
      <li>
        Third step with a nested ordered list:
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
      <li>
        Unordered item with an ordered sub-list:
        <ol>
          <li>Ordered sub-item one</li>
          <li>Ordered sub-item two</li>
        </ol>
      </li>
      <li>Another unordered item</li>
    </ul>

    <!-- Blockquotes -->
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
      <footer>&#8212; <cite>Dieter Rams</cite>, Ten Principles of Good Design</footer>
    </blockquote>

    <!-- Code blocks -->
    <h2>Code Blocks</h2>
    <pre><code>// A plain code block
function greet(name) {
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

    <!-- Tables -->
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
          <th scope="row">
            <code>--dt-size-300</code>
          </th>
          <td>0.4rem</td>
          <td>4px</td>
        </tr>
        <tr>
          <th scope="row">
            <code>--dt-size-400</code>
          </th>
          <td>0.8rem</td>
          <td>8px</td>
        </tr>
        <tr>
          <th scope="row">
            <code>--dt-size-500</code>
          </th>
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

    <!-- Figure and image -->
    <h2>Figure</h2>
    <figure>
      <img
        src="https://placehold.co/600x300"
        alt="Placeholder image"
        width="600"
        height="300"
      >
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

    <!-- Task list -->
    <h2>Task List</h2>
    <ul>
      <li>
        <input
          type="checkbox"
          checked
        > Completed task
      </li>
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
      <li><code>d-p16</code> &#8212; applies 16px padding</li>
      <li><code>d-fc-primary</code> &#8212; sets the primary font color</li>
      <li><code>d-bgc-moderate</code> &#8212; applies a moderate background color</li>
    </ul>
    <blockquote>
      <p><strong>Note:</strong> Make sure your build pipeline is configured to process CSS imports before using utility classes in production.</p>
    </blockquote>
    <p>For more details, see the <a href="#">installation guide</a> or reach out to the team on <a href="#">Slack</a>.</p>
  </dt-prose>
</template>

<script setup>
import { DtProse } from './';
</script>
