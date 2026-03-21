import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lintContent } from './lint-doc-examples.mjs';

describe('lint-doc-examples', () => {
  describe('Check 1: static-htmlCode', () => {
    it('flags static inline htmlCode string', () => {
      const content = `
<code-well-header>
  <dt-notice kind="base" title="Base" />
</code-well-header>

<code-example-tabs
htmlCode='
<aside class="d-notice">...</aside>
'
vueCode='
<dt-notice kind="base" title="Base" />
'
showHtmlWarning />
`;
      const violations = lintContent('notice.md', content);
      assert.equal(violations.length, 1);
      assert.equal(violations[0].check, 'static-htmlCode');
    });

    it('allows ref-based :htmlCode', () => {
      const content = `
<code-well-header>
  <dt-notice ref="baseExample" kind="base" title="Base" />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.baseExample'
vueCode='
<dt-notice kind="base" title="Base" />
'
showHtmlWarning />
`;
      const violations = lintContent('notice.md', content);
      assert.equal(violations.length, 0);
    });

    it('does not flag :htmlCode (bound) as static', () => {
      const content = `
<code-well-header>
  <dt-badge ref="ex">Label</dt-badge>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.ex'
vueCode='<dt-badge>Label</dt-badge>'
showHtmlWarning />
`;
      const violations = lintContent('badge.md', content);
      const staticViolations = violations.filter(v => v.check === 'static-htmlCode');
      assert.equal(staticViolations.length, 0);
    });
  });

  describe('Check 2: missing-htmlCode', () => {
    it('flags code-example-tabs without htmlCode after code-well-header', () => {
      const content = `
<code-well-header>
  <dt-button>Click</dt-button>
</code-well-header>

<code-example-tabs
vueCode='
<dt-button>Click</dt-button>
' />
`;
      const violations = lintContent('button.md', content);
      assert.equal(violations.length, 1);
      assert.equal(violations[0].check, 'missing-htmlCode');
    });

    it('does not flag when code-well-header is far away', () => {
      const content = `
<code-well-header>
  <dt-button>Click</dt-button>
</code-well-header>

Some text paragraph.

Another paragraph.

More text.

Yet more text.

Even more lines.

Still going.

<code-example-tabs
vueCode='
<dt-button>Click</dt-button>
' />
`;
      const violations = lintContent('button.md', content);
      const missingViolations = violations.filter(v => v.check === 'missing-htmlCode');
      assert.equal(missingViolations.length, 0);
    });

    it('does not flag standalone code-example-tabs without any code-well-header', () => {
      const content = `
## Migration

<code-example-tabs
vueCode='
<dt-button>Click</dt-button>
' />
`;
      const violations = lintContent('button.md', content);
      assert.equal(violations.length, 0);
    });
  });

  describe('Check 3: raw-html-in-header', () => {
    it('flags raw HTML with component CSS classes in code-well-header', () => {
      const content = `
<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__content">Content</div>
  </div>
</code-well-header>
`;
      const violations = lintContent('card.md', content);
      const rawViolations = violations.filter(v => v.check === 'raw-html-in-header');
      assert.ok(rawViolations.length > 0, 'Should flag raw HTML component classes');
    });

    it('allows layout utility classes in code-well-header', () => {
      const content = `
<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols2 d-w100p">
    <dt-input label="Label" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.example'
vueCode='<dt-input label="Label" />'
showHtmlWarning />
`;
      const violations = lintContent('input.md', content);
      const rawViolations = violations.filter(v => v.check === 'raw-html-in-header');
      assert.equal(rawViolations.length, 0);
    });

    it('does not flag Vue components (dt-*) in code-well-header', () => {
      const content = `
<code-well-header>
  <dt-card class="d-w264">
    <template #content>Content</template>
  </dt-card>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.example'
vueCode='<dt-card />'
showHtmlWarning />
`;
      const violations = lintContent('card.md', content);
      const rawViolations = violations.filter(v => v.check === 'raw-html-in-header');
      assert.equal(rawViolations.length, 0);
    });
  });

  describe('Allowlist', () => {
    it('skips allowlisted files', () => {
      const content = `
<code-well-header>
  <dt-text>Hello</dt-text>
</code-well-header>

<code-example-tabs
vueCode='<dt-text>Hello</dt-text>' />
`;
      assert.equal(lintContent('text.md', content).length, 0);
      assert.equal(lintContent('table.md', content).length, 0);
      assert.equal(lintContent('index.md', content).length, 0);
    });
  });

  describe('Disable comment', () => {
    it('disables checks for the next code-example-tabs block', () => {
      const content = `
<code-well-header>
  <dt-notice kind="base" title="Base" />
</code-well-header>

<!-- lint-doc-examples-disable -->
<code-example-tabs
htmlCode='
<aside class="d-notice">...</aside>
'
vueCode='<dt-notice />'
showHtmlWarning />
`;
      const violations = lintContent('notice.md', content);
      assert.equal(violations.length, 0);
    });
  });

  describe('Multi-line code-example-tabs', () => {
    it('handles multi-line static htmlCode spanning many lines', () => {
      const content = `
<code-well-header>
  <dt-banner>Message</dt-banner>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-banner">
  <div class="d-banner__dialog">
    <div class="d-banner__content">
      Message
    </div>
  </div>
</div>
'
vueCode='
<dt-banner>Message</dt-banner>
'
showHtmlWarning />
`;
      const violations = lintContent('banner.md', content);
      const staticViolations = violations.filter(v => v.check === 'static-htmlCode');
      assert.equal(staticViolations.length, 1);
    });
  });

  describe('Quote-tracking for multi-line vueCode', () => {
    it('does not false-positive on > inside quoted vueCode attribute', () => {
      const content = `
<code-well-header>
  <dt-button ref="example">Click</dt-button>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.example'
vueCode='
<dt-button>
  <template #startIcon>
    <dt-icon name="phone" />
  </template>
  Click
</dt-button>
'
showHtmlWarning />
`;
      const violations = lintContent('button.md', content);
      assert.equal(violations.length, 0);
    });

    it('correctly detects tag close after multi-line quoted attrs end', () => {
      const content = `
<code-well-header>
  <dt-notice kind="base" title="Base" />
</code-well-header>

<code-example-tabs
htmlCode='
<aside>...</aside>
'
vueCode='
<dt-notice kind="base" />
'
showHtmlWarning />
`;
      const violations = lintContent('notice.md', content);
      assert.equal(violations.length, 1);
      assert.equal(violations[0].check, 'static-htmlCode');
    });
  });

  describe('Base component class detection (no BEM modifier)', () => {
    it('flags base component class without __ or -- modifier', () => {
      const content = `
<code-well-header>
  <div class="d-badge">Label</div>
</code-well-header>
`;
      const violations = lintContent('badge.md', content);
      const rawViolations = violations.filter(v => v.check === 'raw-html-in-header');
      assert.ok(rawViolations.length > 0, 'Should flag base component class d-badge');
    });

    it('does not flag utility classes that start like a component name', () => {
      const content = `
<code-well-header>
  <div class="d-w100p d-p16 d-bgc-secondary">
    <dt-button>Click</dt-button>
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.example'
vueCode='<dt-button>Click</dt-button>'
showHtmlWarning />
`;
      const violations = lintContent('button.md', content);
      const rawViolations = violations.filter(v => v.check === 'raw-html-in-header');
      assert.equal(rawViolations.length, 0);
    });
  });

  describe('Disable comment window', () => {
    it('does not disable a block more than 2 lines away', () => {
      const content = `
<code-well-header>
  <dt-notice kind="base" title="Base" />
</code-well-header>

<!-- lint-doc-examples-disable -->


<code-example-tabs
htmlCode='
<aside class="d-notice">...</aside>
'
vueCode='<dt-notice />'
showHtmlWarning />
`;
      const violations = lintContent('notice.md', content);
      // The disable comment is 3+ lines before the tag — should NOT be suppressed
      assert.ok(violations.length > 0, 'Disable comment too far away should not suppress');
    });

    it('disables when comment is immediately before the block', () => {
      const content = `
<code-well-header>
  <dt-notice kind="base" title="Base" />
</code-well-header>

<!-- lint-doc-examples-disable -->
<code-example-tabs
htmlCode='
<aside class="d-notice">...</aside>
'
vueCode='<dt-notice />'
showHtmlWarning />
`;
      const violations = lintContent('notice.md', content);
      assert.equal(violations.length, 0, 'Disable comment on previous line should suppress');
    });
  });

  describe('Multiple blocks in one file', () => {
    it('detects violations in multiple blocks independently', () => {
      const content = `
<code-well-header>
  <dt-badge ref="good">OK</dt-badge>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.good'
vueCode='<dt-badge>OK</dt-badge>'
showHtmlWarning />

## Another section

<code-well-header>
  <dt-badge>Bad</dt-badge>
</code-well-header>

<code-example-tabs
htmlCode='<span class="d-badge">Bad</span>'
vueCode='<dt-badge>Bad</dt-badge>'
showHtmlWarning />

## Third section

<code-well-header>
  <dt-badge>Missing</dt-badge>
</code-well-header>

<code-example-tabs
vueCode='<dt-badge>Missing</dt-badge>' />
`;
      const violations = lintContent('badge.md', content);
      assert.equal(violations.length, 2);
      assert.equal(violations[0].check, 'static-htmlCode');
      assert.equal(violations[1].check, 'missing-htmlCode');
    });
  });
});
