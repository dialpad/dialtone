import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { transformFencedDemo } from './markdown-it-fenced-demo.js';

describe('transformFencedDemo', () => {
  it('converts a plain block to <code-example>', () => {
    const input = '<dt-button>Click me</dt-button>\n';
    const result = transformFencedDemo(input);
    assert.equal(result, '<code-example>\n<dt-button>Click me</dt-button>\n</code-example>');
  });

  it('handles @demo-only directive', () => {
    const input = '<!-- @demo-only -->\n<dt-button>Click me</dt-button>\n';
    const result = transformFencedDemo(input);
    assert.ok(result.startsWith('<code-example only-show="demo">'));
    assert.ok(result.includes('<dt-button>Click me</dt-button>'));
    assert.ok(!result.includes('@demo-only'));
  });

  it('handles @code-only directive', () => {
    const input = '<!-- @code-only -->\n<dt-button>Click me</dt-button>\n';
    const result = transformFencedDemo(input);
    assert.ok(result.startsWith('<code-example only-show="code">'));
    assert.ok(!result.includes('@code-only'));
  });

  it('handles @code separator', () => {
    const input = [
      '<dt-toggle v-model="isDisabled" />',
      '<dt-button :disabled="isDisabled">Click</dt-button>',
      '<!-- @code -->',
      '<dt-button disabled>Click</dt-button>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);

    // Slot should contain the demo content (above @code)
    assert.ok(result.includes('<dt-toggle v-model="isDisabled" />'));
    assert.ok(result.includes('<dt-button :disabled="isDisabled">Click</dt-button>'));

    // source-code should contain the code tab content (below @code), entity-encoded
    assert.ok(result.includes('source-code=\''));
    assert.ok(result.includes('&lt;dt-button disabled&gt;Click&lt;/dt-button&gt;'));

    // @code comment should not appear in output
    assert.ok(!result.includes('<!-- @code -->'));
  });

  it('handles @wrapper directive', () => {
    const input = [
      '<!-- @wrapper -->',
      '<dt-stack direction="row" gap="100">',
      '  <dt-button>A</dt-button>',
      '  <dt-button>B</dt-button>',
      '</dt-stack>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    assert.ok(result.includes('data-demo-wrapper'));
    assert.ok(result.includes('<dt-stack data-demo-wrapper direction="row"'));
    assert.ok(!result.includes('<!-- @wrapper -->'));
  });

  it('handles @bg directive', () => {
    const input = '<!-- @bg d-bgc-primary -->\n<dt-button>Click me</dt-button>\n';
    const result = transformFencedDemo(input);
    assert.ok(result.includes('bgclass="d-bgc-primary"'));
    assert.ok(!result.includes('<!-- @bg'));
  });

  it('handles @class directive', () => {
    const input = '<!-- @class d-d-block -->\n<dt-button>Click me</dt-button>\n';
    const result = transformFencedDemo(input);
    assert.ok(result.includes('class="d-d-block"'));
    assert.ok(!result.includes('<!-- @class'));
  });

  it('combines @bg and @class directives', () => {
    const input = [
      '<!-- @bg d-bgc-primary -->',
      '<!-- @class d-d-block -->',
      '<dt-button>Click me</dt-button>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    assert.ok(result.includes('bgclass="d-bgc-primary"'));
    assert.ok(result.includes('class="d-d-block"'));
  });

  it('preserves multi-line content', () => {
    const input = [
      '<dt-stack direction="row" gap="100">',
      '  <dt-button> Place Call </dt-button>',
      '  <dt-button importance="outlined"> Place Call </dt-button>',
      '</dt-stack>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    assert.ok(result.includes('<dt-stack direction="row" gap="100">'));
    assert.ok(result.includes('  <dt-button> Place Call </dt-button>'));
    assert.ok(result.includes('</dt-stack>'));
  });

  it('strips trailing blank lines from content', () => {
    const input = '\n\n<dt-button>Click</dt-button>\n\n\n';
    const result = transformFencedDemo(input);
    assert.ok(result.includes('<code-example>\n<dt-button>Click</dt-button>\n</code-example>'));
  });

  it('entity-encodes source-code attribute values', () => {
    const input = [
      '<dt-button :disabled="true">Click</dt-button>',
      '<!-- @code -->',
      '<dt-button disabled>Click</dt-button>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    // Quotes in the source-code should be encoded
    assert.ok(result.includes('&lt;dt-button disabled&gt;'));
  });

  it('handles demo-only via info string', () => {
    const input = '<dt-button>Click me</dt-button>\n';
    const result = transformFencedDemo(input, 'demo-only');
    assert.ok(result.startsWith('<code-example only-show="demo">'));
    assert.ok(result.includes('<dt-button>Click me</dt-button>'));
  });

  it('handles code-only via info string', () => {
    const input = '<dt-button>Click me</dt-button>\n';
    const result = transformFencedDemo(input, 'code-only');
    assert.ok(result.startsWith('<code-example only-show="code">'));
  });

  it('directive overrides info string mode', () => {
    // info string says demo, but directive says code-only
    const input = '<!-- @code-only -->\n<dt-button>Click me</dt-button>\n';
    const result = transformFencedDemo(input, 'demo');
    assert.ok(result.startsWith('<code-example only-show="code">'));
  });

  it('info string demo-only combines with other directives', () => {
    const input = [
      '<!-- @wrapper -->',
      '<dt-stack direction="row">',
      '  <dt-button>A</dt-button>',
      '</dt-stack>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input, 'demo-only');
    assert.ok(result.includes('only-show="demo"'));
    assert.ok(result.includes('data-demo-wrapper'));
  });

  it('handles @wrapper combined with @code separator', () => {
    const input = [
      '<!-- @wrapper -->',
      '<dt-stack direction="row">',
      '  <dt-button :loading="loading">Call</dt-button>',
      '</dt-stack>',
      '<!-- @code -->',
      '<dt-button loading>Call</dt-button>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    // Wrapper applied to slot content
    assert.ok(result.includes('<dt-stack data-demo-wrapper direction="row">'));
    // Source-code has the clean code (below @code), no wrapper
    assert.ok(result.includes('source-code=\''));
    assert.ok(result.includes('&lt;dt-button loading&gt;'));
    assert.ok(!result.includes('<!-- @wrapper -->'));
    assert.ok(!result.includes('<!-- @code -->'));
  });

  it('handles empty fenced block', () => {
    const result = transformFencedDemo('\n');
    assert.equal(result, '<code-example>\n\n</code-example>');
  });

  it('handles @demo-only combined with @code (demo-only wins, code ignored)', () => {
    const input = [
      '<!-- @demo-only -->',
      '<dt-button>Live demo</dt-button>',
      '<!-- @code -->',
      '<dt-button>Code tab</dt-button>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    // Both only-show and source-code are emitted; component handles precedence
    assert.ok(result.includes('only-show="demo"'));
    assert.ok(result.includes('<dt-button>Live demo</dt-button>'));
  });

  it('only uses the first @code separator', () => {
    const input = [
      '<dt-button>Demo</dt-button>',
      '<!-- @code -->',
      '<dt-button>First code</dt-button>',
      '<!-- @code -->',
      '<dt-button>Second code</dt-button>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    // Second <!-- @code --> is NOT a directive — it's regular content in the code tab
    assert.ok(result.includes('<dt-button>Demo</dt-button>'));
    assert.ok(result.includes('&lt;dt-button&gt;First code&lt;/dt-button&gt;'));
    assert.ok(result.includes('&lt;!-- @code --&gt;'));
    assert.ok(result.includes('&lt;dt-button&gt;Second code&lt;/dt-button&gt;'));
  });

  it('handles @code with empty content above', () => {
    const input = [
      '<!-- @code -->',
      '<dt-button>Code only</dt-button>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    assert.ok(result.includes('source-code=\''));
    assert.ok(result.includes('&lt;dt-button&gt;Code only&lt;/dt-button&gt;'));
  });

  it('handles @custom directive', () => {
    const input = [
      '<!-- @custom -->',
      '<!-- @class d-fl-center d-p-300 d-bgc-secondary d-w100p -->',
      '<dt-button kind="unstyled" class="d-p-200 d-bar8 h:d-bs-md">Hover</dt-button>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    assert.match(result, /\bcustom\b/);
    assert.ok(result.includes('class="'));
    assert.ok(!result.includes('<!-- @custom -->'));
  });

  it('handles @custom combined with @bg and @code', () => {
    const input = [
      '<!-- @custom -->',
      '<!-- @class d-fl-center d-p-300 -->',
      '<div v-for="c in colors" :class="`d-bgc-${c}`">{{ c }}</div>',
      '<!-- @code -->',
      '<div class="d-bgc-primary">...</div>',
      '',
    ].join('\n');
    const result = transformFencedDemo(input);
    assert.match(result, /\bcustom\b/);
    assert.ok(result.includes('class="'));
    assert.ok(result.includes('source-code=\''));
    assert.ok(result.includes('v-for'));
  });
});
