import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { stripMarkedWrapper } from './markdown-it-code-example-source.js';

describe('stripMarkedWrapper', () => {
  it('strips a wrapper with data-demo-wrapper, keeping children', () => {
    const input = `<dt-stack direction="row" gap="400" data-demo-wrapper>
  <dt-button> Place Call </dt-button>
  <dt-button importance="outlined"> Place Call </dt-button>
</dt-stack>`;

    const result = stripMarkedWrapper(input);
    assert.ok(result.includes('<dt-button> Place Call </dt-button>'));
    assert.ok(result.includes('<dt-button importance="outlined">'));
    assert.ok(!result.includes('<dt-stack'));
    assert.ok(!result.includes('</dt-stack>'));
    assert.ok(!result.includes('data-demo-wrapper'));
  });

  it('returns content unchanged when no data-demo-wrapper present', () => {
    const input = `<dt-stack direction="row" gap="400">
  <dt-button> Click </dt-button>
</dt-stack>`;

    const result = stripMarkedWrapper(input);
    assert.equal(result, input);
  });

  it('handles wrapper with multiple quoted attributes', () => {
    const input = `<dt-stack direction="row" gap="400" class="d-w100p" data-demo-wrapper>
  <dt-badge text="Label" />
  <dt-badge text="Label" type="info" />
</dt-stack>`;

    const result = stripMarkedWrapper(input);
    assert.ok(result.includes('<dt-badge text="Label" />'));
    assert.ok(!result.includes('d-w100p'));
  });

  it('handles div wrapper', () => {
    const input = `<div class="d-w332" data-demo-wrapper>
  <dt-description-list ref="descriptionList" />
</div>`;

    const result = stripMarkedWrapper(input);
    assert.ok(result.includes('<dt-description-list'));
    assert.ok(!result.includes('<div'));
  });

  it('dedents children after stripping', () => {
    const input = `<dt-stack gap="400" data-demo-wrapper>
    <dt-button>One</dt-button>
    <dt-button>Two</dt-button>
</dt-stack>`;

    const result = stripMarkedWrapper(input);
    // Children should be dedented (no leading 4-space indent)
    assert.ok(result.startsWith('<dt-button>'));
  });
});
