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
  it('does not rename slots of a component nested in the avatar slot', () => {
    const input = [
      '<dt-chip size="300">',
      '  <template #avatar>',
      '    <dt-avatar>',
      '      <template #icon><dt-icon /></template>',
      '    </dt-avatar>',
      '  </template>',
      '  Chip',
      '</dt-chip>',
    ].join('\n');
    const output = run(input);

    assert.ok(output.includes('<template #startAvatar>'));
    assert.ok(output.includes('<template #icon><dt-icon /></template>'));
    assert.ok(!output.includes('#startIcon'));
    assert.ok(!warnings(input).some(warning => warning.startsWith('CHIP_API_ICON_AVATAR_CONFLICT')));
  });

  it('does not rename the icon slot of a dt-button nested in the chip', () => {
    const input = [
      '<dt-chip size="300">',
      '  <dt-button><template #icon><dt-icon /></template></dt-button>',
      '</dt-chip>',
    ].join('\n');

    assert.equal(run(input), input);
  });

  it('warns when show-close is omitted, including on an interactive chip', () => {
    const omitted = input => warnings(input).some(w => w.startsWith('CHIP_API_OMITTED_SHOW_CLOSE_INTERACTIVE'));

    assert.ok(omitted('<dt-chip size="300" interactive>Label</dt-chip>'));
    assert.ok(omitted('<dt-chip size="300">Label</dt-chip>'));
    assert.ok(!omitted('<dt-chip size="300" interactive show-close>Label</dt-chip>'));
  });

  it('renames an unquoted slot attribute value without adding quotes', () => {
    const output = run('<dt-chip size="300"><span slot=avatar>A</span></dt-chip>');

    assert.ok(output.includes('<span slot=startAvatar>'));
  });

  it('renames v-slot and slot attribute forms only on direct children', () => {
    const input = [
      '<dt-chip size="300">',
      '  <template v-slot:icon="props"><dt-icon /></template>',
      '  <span slot="avatar">A</span>',
      '  <dt-button><template v-slot:icon>x</template></dt-button>',
      '</dt-chip>',
    ].join('\n');
    const output = run(input);

    assert.ok(output.includes('<template v-slot:startIcon="props">'));
    assert.ok(output.includes('<span slot="startAvatar">'));
    assert.ok(output.includes('<template v-slot:icon>x</template>'));
  });

  it('does not rename slot-like text inside quoted attribute values', () => {
    const input = '<dt-chip size="300"><template #default><i class="#icon" title="slot=\'icon\'" /></template>'
      + '</dt-chip>';

    assert.equal(run(input), input);
  });

  it('does not treat dt-chip-group as a chip', () => {
    const input = '<dt-chip-group><template #icon>x</template></dt-chip-group>';

    assert.equal(run(input), input);
  });

  it('only renames class props on the chip opening tag', () => {
    const input = '<dt-chip size="300"><dt-avatar avatar-class="foo" /></dt-chip>';

    assert.equal(run(input), input);
  });

  it('transforms a self-closing chip and a following paired chip independently', () => {
    const input = '<dt-chip /><dt-chip icon-class="foo">Chip</dt-chip>';
    const expected = '<dt-chip size="300" /><dt-chip size="300" start-icon-class="foo">Chip</dt-chip>';

    assert.equal(run(input), expected);
  });

  it('transforms every chip in a list, including nested ones', () => {
    const input = '<dt-chip><dt-chip>Inner</dt-chip></dt-chip><DtChip>Next</DtChip>';
    const expected = '<dt-chip size="300"><dt-chip size="300">Inner</dt-chip></dt-chip>'
      + '<DtChip size="300">Next</DtChip>';

    assert.equal(run(input), expected);
  });

  it('warns for show-close with an explicitly false interactive binding', () => {
    for (const interactive of [':interactive="false"', 'interactive="false"', 'v-bind:interactive="false"']) {
      const input = `<dt-chip show-close ${interactive}>Chip</dt-chip>`;

      assert.ok(
        warnings(input).some(warning => warning.startsWith('CHIP_API_SHOW_CLOSE_WITHOUT_INTERACTIVE')),
        interactive,
      );
    }
  });

  it('does not warn for show-close on interactive or dynamically interactive chips', () => {
    for (const interactive of ['interactive', ':interactive="true"', ':interactive="isOn"']) {
      const input = `<dt-chip show-close ${interactive}>Chip</dt-chip>`;

      assert.ok(!warnings(input).some(warning => warning.startsWith('CHIP_API_SHOW_CLOSE')), interactive);
    }
  });
});
