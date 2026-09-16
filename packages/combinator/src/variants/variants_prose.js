export default {
  default: {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<h1>Headings and paragraphs</h1>
<p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines.</p>
<p>This is another standard paragraph of body text. </p>
<h2>Heading Level 2</h2>
<p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines.</p>
<h3>Heading Level 3</h3>
<p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines.</p>
<h4>Heading Level 4</h4>
<p>This is a standard paragraph of body text. It contains enough words to wrap across multiple lines.</p>
<h5>Heading Level 5</h5>
<p>This is a standard paragraph of body text.</p>
` },
    },
  },
  'inline elements': {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
default: { initialValue: `<p>
  How about <strong>bold text</strong>,
  <em>italic text</em>,
  <strong><em>bold italic text</em></strong>,
  and
  <u>underlined text</u>.
  Here is <s>strikethrough text</s> for deleted content.
</p>
<p>
  Here is <a href="#">a standard link</a> within a paragraph.
  And here is a <a href="#">link with <strong>bold</strong> and <em>em</em> inside it</a>.
</p>
<p>
  <code>inline code</code>,
  <kbd>Ctrl</kbd> + <kbd>S</kbd> keyboard input,
  <mark>highlighted text</mark>,
  <small>small text</small>,
  <sub>subscript</sub>
  and
  <sup>superscript</sup>,
  and
  <abbr title="Abbreviation">abbr</abbr>.</p>
<p>
  <var>x</var> = <var>y</var> + <var>z</var> for variables,
  <samp>Error: file not found</samp> for sample output,
  <dfn>definition</dfn> for terms,
  and
  <q>an inline quotation</q> with automatic quote marks.
</p>
<p>
  The formula is <var>E</var> = <var>m</var><var>c</var><sup>2</sup> and water is <var>H</var><sub>2</sub><var>O</var>.
</p>
` },
    },
  },
  'unordered list': {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<ul>
  <li><p>First item in an unordered list</p></li>
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
` },
    },
  },
  'ordered list': {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<ol>
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
    ` },
    },
  },
  'mixed list': {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<ul>
  <li>
    Unordered item with an ordered sub-list:
    <ol>
      <li>Ordered sub-item one</li>
      <li>Ordered sub-item two</li>
    </ol>
  </li>
  <li>Another unordered item</li>
</ul>
    ` },
    },
  },
  blockquote: {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<blockquote>
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
    ` },
    },
  },
  'code blocks': {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<pre><code>// A plain code block
return \`Hello, \${name}!\`;
const message = greet('world');
console.log(message);</code></pre>
<pre><code> &lt;template&gt;
  &lt;div class="container"&gt;
    &lt;h1&gt;{{ title }}&lt;/h1&gt;
    &lt;p&gt;{{ description }}&lt;/p&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
` },
    },
  },
  table: {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<!-- Table with thead -->
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
      <td>6.4rem</td>
      <td>64px</td>
    </tr>
    <tr>
      <th scope="row"><code>--dt-layout-200</code></th>
      <td>12.8rem</td>
      <td>128px</td>
    </tr>
    <tr>
      <th scope="row"><code>--dt-layout-400</code></th>
      <td>25.6rem</td>
      <td>256px</td>
    </tr>
  </tbody>
</table>
` },
    },
  },
  'definition list': {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<dl>
  <dt>Design token</dt>
  <dd>A named value that represents a design decision, such as a color, spacing unit, or font size.</dd>
  <dt>Component</dt>
  <dd>A reusable UI element that encapsulates structure, style, and behavior.</dd>
  <dt>Utility class</dt>
  <dd>A single-purpose CSS class that applies one specific style rule.</dd>
</dl>
` },
    },
  },
  'details/summary': {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<details>
  <summary>Click to expand for more information</summary>
  <p>This content is hidden by default and revealed when the user
interacts with the summary element.</p>
  <ul>
    <li>Detail item one</li>
    <li>Detail item two</li>
  </ul>
</details>
` },
    },
  },
  'task list': {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<ul>
  <li><input type="checkbox" checked disabled> Design review complete</li>
  <li><input type="checkbox" checked disabled> Implementation merged</li>
  <li><input type="checkbox" disabled> Documentation published</li>
</ul>
` },
    },
  },
  'example composition': {
    props: {
      size: { initialValue: 300 },
      density: { initialValue: 200 },
    },
    slots: {
      default: { initialValue: `<h1>Getting started</h1>
<p>Install the package:</p>
<pre><code>npm install @dialpad/dialtone</code></pre>
<p>Then import the styles:</p>
<pre><code>import '@dialpad/dialtone/css';</code></pre>
<p>You can now use any of the available <a href="#">utility classes</a>. For example:</p>
<ul>
  <li><code>d-p-200</code> — applies 16px padding</li>
  <li><code>d-fc-tertiary</code> — sets the tertiary foreground color</li>
</ul>
<blockquote>
  <p><strong>Note:</strong> Make sure your build pipeline processes CSS imports before deploying.</p>
</blockquote>
` },
    },
  },
};
