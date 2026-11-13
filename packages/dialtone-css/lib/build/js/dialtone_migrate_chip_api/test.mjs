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
    const input = '<dt-chip show-close>Chip</dt-chip>';
    const expected = '<dt-chip size="300" show-close>Chip</dt-chip>';

    assert.equal(run(input), expected);
  });

  it('does not override explicit size', () => {
    const input = '<dt-chip :size="200" show-close>Chip</dt-chip>';

    assert.equal(run(input), input);
  });

  it('renames the icon slot to startIcon', () => {
    const input = [
      '<dt-chip show-close>',
      '  <template #icon>',
      '    <dt-icon />',
      '  </template>',
      '  Chip',
      '</dt-chip>',
    ].join('\n');
    const expected = [
      '<dt-chip size="300" show-close>',
      '  <template #startIcon>',
      '    <dt-icon />',
      '  </template>',
      '  Chip',
      '</dt-chip>',
    ].join('\n');

    assert.equal(run(input), expected);
  });

  it('renames iconClass to startIconClass', () => {
    const input = '<DtChip iconClass="foo" show-close>Chip</DtChip>';
    const expected = '<DtChip size="300" startIconClass="foo" show-close>Chip</DtChip>';

    assert.equal(run(input), expected);
  });

  it('renames avatar-class to start-avatar-class', () => {
    const input = '<dt-chip avatar-class="foo" show-close>Chip</dt-chip>';
    const expected = '<dt-chip size="300" start-avatar-class="foo" show-close>Chip</dt-chip>';

    assert.equal(run(input), expected);
  });

  it('renames the avatar slot to startAvatar', () => {
    const input = '<dt-chip><template #avatar><dt-avatar /></template>Chip</dt-chip>';

    assert.ok(run(input).includes('<template #startAvatar>'));
  });

  it('does not warn for show-close without interactive, since the remove button no longer needs it', () => {
    for (const input of ['<dt-chip show-close>Chip</dt-chip>', '<dt-chip show-close :interactive="false">Chip</dt-chip>']) {
      assert.ok(!warnings(input).some(warning => warning.startsWith('CHIP_API_SHOW_CLOSE')), input);
    }
  });

  it('warns for dynamic show-close', () => {
    const input = '<dt-chip :show-close="canRemove">Chip</dt-chip>';

    assert.ok(warnings(input).some(warning => warning.startsWith('CHIP_API_DYNAMIC_SHOW_CLOSE')));
  });

  it('warns when label-class uses the removed d-chip__label--active class', () => {
    const input = '<dt-chip label-class="d-chip__label--active">Chip</dt-chip>';

    assert.ok(warnings(input).some(warning => warning.startsWith('CHIP_API_ACTIVE_LABEL_CLASS')));
  });

  it('warns for a bound label-class when the file mentions the removed active class', () => {
    const input = [
      '<template><dt-chip :label-class="selectedClass">Chip</dt-chip></template>',
      '<script>const selectedClass = "d-chip__label--active";</script>',
    ].join('\n');

    assert.ok(warnings(input).some(warning => warning.startsWith('CHIP_API_ACTIVE_LABEL_CLASS')));
  });

  it('does not warn for a bound label-class when the file never mentions the active class', () => {
    const input = '<dt-chip :label-class="extraClass">Chip</dt-chip>';

    assert.ok(!warnings(input).some(warning => warning.startsWith('CHIP_API_ACTIVE_LABEL_CLASS')));
  });

  it('does not warn about the active label class on other label classes or on non-chip tags', () => {
    assert.ok(!warnings('<dt-chip label-class="d-chip__label--strong">Chip</dt-chip>')
      .some(warning => warning.startsWith('CHIP_API_ACTIVE_LABEL_CLASS')));
    assert.ok(!warnings('<dt-badge label-class="d-chip__label--active">Badge</dt-badge>')
      .some(warning => warning.startsWith('CHIP_API_ACTIVE_LABEL_CLASS')));
  });

  it('adds show-close after a plain interactive="false"', () => {
    assert.equal(
      run('<dt-chip size="300" interactive="false">Chip</dt-chip>'),
      '<dt-chip size="300" interactive="false" show-close>Chip</dt-chip>',
    );
  });

  it('leaves a legacy hide-close to the props migration instead of adding show-close', () => {
    for (const hide of ['hide-close', 'hideClose', ':hide-close="hidden"']) {
      const input = `<dt-chip size="300" interactive ${hide}>Chip</dt-chip>`;

      assert.equal(run(input), input, hide);
      assert.ok(!warnings(input).some(warning => warning.startsWith('CHIP_API_OMITTED_SHOW_CLOSE')), hide);
    }
  });

  it('warns about the removed active class and points at emphasis strong', () => {
    const found = warnings('<dt-chip label-class="d-chip__label--active">Chip</dt-chip>')
      .filter(warning => warning.startsWith('CHIP_API_ACTIVE_LABEL_CLASS'));

    assert.equal(found.length, 1);
    assert.ok(found[0].includes('emphasis="strong"'));
  });

  it('does not transform non-chip icon slots', () => {
    const input = '<dt-button><template #icon><dt-icon /></template></dt-button>';

    assert.equal(run(input), input);
  });
  it('does not rename slots of a PascalCase component named like a void HTML element', () => {
    const input = [
      '<dt-chip size="300">',
      '  <Input>',
      '    <template #icon>Input icon</template>',
      '  </Input>',
      '  <Link>',
      '    <template #avatar>Link avatar</template>',
      '  </Link>',
      '  <template #icon>Chip icon</template>',
      '  Chip',
      '</dt-chip>',
    ].join('\n');
    const output = run(input);

    assert.ok(output.includes('<template #icon>Input icon</template>'));
    assert.ok(output.includes('<template #avatar>Link avatar</template>'));
    assert.ok(output.includes('<template #startIcon>Chip icon</template>'));
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
      '<dt-chip size="300" show-close>',
      '  <dt-button><template #icon><dt-icon /></template></dt-button>',
      '</dt-chip>',
    ].join('\n');

    assert.equal(run(input), input);
  });

  describe('omitted show-close', () => {
    const omittedWarning = (input, name = '') => warnings(input)
      .filter(w => w.startsWith(`CHIP_API_OMITTED_SHOW_CLOSE${name}`));

    it('adds show-close after interactive for statically interactive chips', () => {
      for (const interactive of ['interactive', 'interactive="true"', ':interactive="true"',
        'v-bind:interactive="true"']) {
        const input = `<dt-chip size="300" ${interactive}>Chip</dt-chip>`;

        assert.equal(run(input), `<dt-chip size="300" ${interactive} show-close>Chip</dt-chip>`, interactive);
        assert.deepEqual(omittedWarning(input), [], interactive);
      }
    });

    it('adds size and show-close together on an interactive chip with neither', () => {
      assert.equal(
        run('<dt-chip interactive>Chip</dt-chip>'),
        '<dt-chip size="300" interactive show-close>Chip</dt-chip>',
      );
    });

    it('keeps a multi-line tag one attribute per line', () => {
      const input = '<dt-chip\n  interactive\n  size="200"\n>Chip</dt-chip>';

      assert.equal(run(input), '<dt-chip\n  interactive\n  show-close\n  size="200"\n>Chip</dt-chip>');
    });

    it('skips a chip with a v-bind object spread and warns', () => {
      const input = '<dt-chip size="300" interactive v-bind="chipProps">Chip</dt-chip>';

      assert.equal(run(input), input);
      assert.equal(omittedWarning(input, '_SPREAD').length, 1);
    });

    it('adds show-close after size when the chip is not interactive, so its remove button stays', () => {
      for (const attrs of ['', ' :interactive="false"', ' v-bind:interactive="false"']) {
        const input = `<dt-chip size="300"${attrs}>Chip</dt-chip>`;

        assert.equal(run(input), `<dt-chip size="300"${attrs} show-close>Chip</dt-chip>`, attrs);
        assert.deepEqual(omittedWarning(input), [], attrs);
      }
    });

    it('adds show-close for a dynamic interactive binding, since the remove button no longer depends on it', () => {
      const input = '<dt-chip size="300" :interactive="isOn">Chip</dt-chip>';

      assert.equal(run(input), '<dt-chip size="300" :interactive="isOn" show-close>Chip</dt-chip>');
      assert.deepEqual(omittedWarning(input), []);
    });

    it('leaves chips that already have show-close or showClose untouched and silent', () => {
      for (const attrs of ['interactive show-close', 'interactive showClose', 'interactive :show-close="canRemove"',
        'show-close']) {
        const input = `<dt-chip size="300" ${attrs}>Chip</dt-chip>`;

        assert.equal(run(input), input, attrs);
        assert.deepEqual(omittedWarning(input), [], attrs);
      }
    });

    it('is idempotent', () => {
      const input = '<dt-chip interactive>A</dt-chip><dt-chip>B</dt-chip><dt-chip :interactive="x" />';
      const once = run(input);

      assert.equal(run(once), once);
    });
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
    const input = '<dt-chip size="300" show-close><template #default><i class="#icon" title="slot=\'icon\'" /></template>'
      + '</dt-chip>';

    assert.equal(run(input), input);
  });

  it('does not treat dt-chip-group as a chip', () => {
    const input = '<dt-chip-group><template #icon>x</template></dt-chip-group>';

    assert.equal(run(input), input);
  });

  it('only renames class props on the chip opening tag', () => {
    const input = '<dt-chip size="300" show-close><dt-avatar avatar-class="foo" /></dt-chip>';

    assert.equal(run(input), input);
  });

  it('transforms a self-closing chip and a following paired chip independently', () => {
    const input = '<dt-chip show-close /><dt-chip icon-class="foo" show-close>Chip</dt-chip>';
    const expected = '<dt-chip size="300" show-close /><dt-chip size="300" start-icon-class="foo" show-close>Chip</dt-chip>';

    assert.equal(run(input), expected);
  });

  it('transforms every chip in a list, including nested ones', () => {
    const input = '<dt-chip show-close><dt-chip show-close>Inner</dt-chip></dt-chip><DtChip show-close>Next</DtChip>';
    const expected = '<dt-chip size="300" show-close><dt-chip size="300" show-close>Inner</dt-chip></dt-chip>'
      + '<DtChip size="300" show-close>Next</DtChip>';

    assert.equal(run(input), expected);
  });

  it('does not warn for show-close on interactive or dynamically interactive chips', () => {
    for (const interactive of ['interactive', ':interactive="true"', ':interactive="isOn"']) {
      const input = `<dt-chip show-close ${interactive}>Chip</dt-chip>`;

      assert.ok(!warnings(input).some(warning => warning.startsWith('CHIP_API_SHOW_CLOSE')), interactive);
    }
  });
});
