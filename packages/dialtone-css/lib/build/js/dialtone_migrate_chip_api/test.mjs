import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { transformContent } from './index.mjs';

function run (input) {
  return transformContent(input, { filePath: 'test.vue' }).transformed;
}

function warnings (input) {
  return transformContent(input, { filePath: 'test.vue' }).warnings;
}

describe('dialtone-migrate-chip-api', () => {
  it('preserves omitted size as explicit 300', () => {
    const input = '<dt-chip>Chip</dt-chip>';
    const expected = '<dt-chip size="300">Chip</dt-chip>';

    assert.equal(run(input), expected);
  });

  it('does not override explicit size', () => {
    const input = '<dt-chip :size="200">Chip</dt-chip>';

    assert.equal(run(input), input);
  });

  it('renames the icon slot to startIcon', () => {
    const input = [
      '<dt-chip>',
      '  <template #icon>',
      '    <dt-icon />',
      '  </template>',
      '  Chip',
      '</dt-chip>',
    ].join('\n');
    const expected = [
      '<dt-chip size="300">',
      '  <template #startIcon>',
      '    <dt-icon />',
      '  </template>',
      '  Chip',
      '</dt-chip>',
    ].join('\n');

    assert.equal(run(input), expected);
  });

  it('renames iconClass to startIconClass', () => {
    const input = '<DtChip iconClass="foo">Chip</DtChip>';
    const expected = '<DtChip size="300" startIconClass="foo">Chip</DtChip>';

    assert.equal(run(input), expected);
  });

  it('renames avatar-class to start-avatar-class', () => {
    const input = '<dt-chip avatar-class="foo">Chip</dt-chip>';
    const expected = '<dt-chip size="300" start-avatar-class="foo">Chip</dt-chip>';

    assert.equal(run(input), expected);
  });

  it('renames the avatar slot to startAvatar', () => {
    const input = '<dt-chip><template #avatar><dt-avatar /></template>Chip</dt-chip>';

    assert.ok(run(input).includes('<template #startAvatar>'));
  });

  it('warns for explicit show-close without interactive', () => {
    const input = '<dt-chip show-close>Chip</dt-chip>';

    assert.ok(warnings(input).some(warning => warning.startsWith('CHIP_API_SHOW_CLOSE_WITHOUT_INTERACTIVE')));
  });

  it('warns for dynamic show-close', () => {
    const input = '<dt-chip :show-close="canRemove">Chip</dt-chip>';

    assert.ok(warnings(input).some(warning => warning.startsWith('CHIP_API_DYNAMIC_SHOW_CLOSE')));
  });

  it('does not transform non-chip icon slots', () => {
    const input = '<dt-button><template #icon><dt-icon /></template></dt-button>';

    assert.equal(run(input), input);
  });
});
