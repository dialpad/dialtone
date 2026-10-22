import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { transformContent } from './index.mjs';

function run (input) {
  return transformContent(input, { filePath: 'test.vue' }).transformed;
}

function warnings (input) {
  return transformContent(input, { filePath: 'test.vue' }).warnings;
}

describe('dialtone-migrate-badge-api', () => {
  describe('released (v10) props to kind + variant', () => {
    it('adds the status group to a badge with no type', () => {
      assert.equal(run('<dt-badge text="Draft" />'), '<dt-badge kind="status" variant="neutral" label="Draft" />');
    });

    it('maps the default type to the neutral variant', () => {
      const input = '<dt-badge text="Draft" type="default" />';

      assert.equal(run(input), '<dt-badge kind="status" variant="neutral" label="Draft" />');
    });

    for (const variant of ['info', 'positive', 'warning', 'critical']) {
      it(`maps type="${variant}" to the status group`, () => {
        const input = `<dt-badge text="Label" type="${variant}" />`;

        assert.equal(run(input), `<dt-badge kind="status" variant="${variant}" label="Label" />`);
      });
    }

    it('maps type="bulletin" to the pre-release variant of the release group', () => {
      const input = '<dt-badge text="Beta" type="bulletin" />';

      assert.equal(run(input), '<dt-badge kind="release" variant="pre-release" label="Beta" />');
    });

    it('keeps the look of a subtle bulletin badge as the base emphasis', () => {
      const input = '<dt-badge text="Beta" type="bulletin" subtle />';

      assert.equal(run(input), '<dt-badge emphasis="base" kind="release" variant="pre-release" label="Beta" />');
    });

    it('keeps the look of an outlined bulletin badge as the subtle emphasis', () => {
      const input = '<dt-badge text="Alpha" type="bulletin" outlined />';

      assert.equal(run(input), '<dt-badge emphasis="subtle" kind="release" variant="pre-release" label="Alpha" />');
    });

    it('drops outlined on non-bulletin types and warns, since status badges have no outline', () => {
      const input = '<dt-badge text="Info" type="info" outlined />';

      assert.equal(run(input), '<dt-badge kind="status" variant="info" label="Info" />');
      assert.ok(warnings(input).some(warning => warning.startsWith('BADGE_API_OUTLINE_UNSUPPORTED')));
    });

    it('replaces the old count kind with the counter group', () => {
      const input = '<dt-badge kind="count" text="9" />';

      assert.equal(run(input), '<dt-badge kind="counter" variant="count" label="9" />');
    });

    it('replaces the old label kind with the status group', () => {
      const input = '<dt-badge kind="label" type="info" text="Info" />';

      assert.equal(run(input), '<dt-badge kind="status" variant="info" label="Info" />');
    });

    it('keeps a purple (bulletin) count as the strong count', () => {
      const input = '<dt-badge kind="count" type="bulletin" text="6" />';

      assert.equal(run(input), '<dt-badge kind="counter" variant="count" emphasis="strong" label="6" />');
      assert.equal(warnings(input).filter(warning => warning.startsWith('BADGE_API_AMBIGUOUS_COUNT_TYPE')).length, 0);
    });

    it('keeps one attribute per line in a multi-line tag', () => {
      const input = ['<dt-badge', '  type="info"', '  text="Info"', '/>'].join('\n');
      const expected = ['<dt-badge', '  kind="status"', '  variant="info"', '  label="Info"', '/>'].join('\n');

      assert.equal(run(input), expected);
    });

    it('warns when count kind has a non-default type', () => {
      const input = '<dt-badge kind="count" type="positive" text="9" />';

      assert.ok(warnings(input).some(warning => warning.startsWith('BADGE_API_AMBIGUOUS_COUNT_TYPE')));
    });

    it('adds the status group to type="ai" and warns', () => {
      const input = '<dt-badge type="ai" text="AI" />';

      assert.equal(run(input), '<dt-badge kind="status" type="ai" label="AI" />');
      assert.ok(warnings(input).some(warning => warning.startsWith('BADGE_API_AI_TYPE')));
    });
  });

  describe('interim variant values to kind + variant', () => {
    it('maps the base variant to the neutral status variant', () => {
      assert.equal(run('<dt-badge variant="base" label="Draft" />'), '<dt-badge kind="status" variant="neutral" label="Draft" />');
    });

    it('maps status variants unchanged', () => {
      assert.equal(run('<dt-badge variant="critical" label="Late" />'), '<dt-badge kind="status" variant="critical" label="Late" />');
    });

    it('maps count to the counter group', () => {
      assert.equal(run('<dt-badge variant="count" label="9" />'), '<dt-badge kind="counter" variant="count" label="9" />');
    });

    it('maps new to the release group and keeps its emphasis', () => {
      const input = '<dt-badge variant="new" emphasis="base" label="New" />';

      assert.equal(run(input), '<dt-badge kind="release" variant="pre-release" emphasis="base" label="New" />');
    });

    for (const emphasis of ['subtle', 'base', 'strong']) {
      it(`maps lifecycle with ${emphasis} emphasis to pre-release and keeps the emphasis`, () => {
        const input = `<dt-badge variant="lifecycle" emphasis="${emphasis}" label="Beta" />`;

        assert.equal(run(input), `<dt-badge kind="release" variant="pre-release" emphasis="${emphasis}" label="Beta" />`);
      });
    }

    it('maps lifecycle with no emphasis to pre-release with base emphasis', () => {
      const input = '<dt-badge variant="lifecycle" label="Beta" />';

      assert.equal(run(input), '<dt-badge kind="release" variant="pre-release" emphasis="base" label="Beta" />');
    });

    it('removes the clear emphasis and warns, since no group supports it', () => {
      const input = '<dt-badge variant="new" emphasis="clear" label="New" />';

      assert.ok(!run(input).includes('clear'));
      assert.ok(warnings(input).some(warning => warning.startsWith('BADGE_API_CLEAR_UNSUPPORTED')));
    });
  });

  describe('grouped variant names without kind', () => {
    for (const [variant, kind] of [['neutral', 'status'], ['mention', 'counter']]) {
      it(`adds kind="${kind}" to variant="${variant}"`, () => {
        const input = `<dt-badge variant="${variant}" label="Label" />`;

        assert.equal(run(input), `<dt-badge kind="${kind}" variant="${variant}" label="Label" />`);
      });
    }
  });

  describe('interim lifecycle variants to the release group', () => {
    // Both release variants default to strong now. internal, early-access and familiar used to default
    // to base, so they get an explicit base emphasis. new and recent already defaulted to strong.
    for (const [from, to, emphasis] of [
      ['new', 'pre-release', ''],
      ['internal', 'pre-release', ' emphasis="base"'],
      ['early-access', 'pre-release', ' emphasis="base"'],
      ['recent', 'release', ''],
      ['familiar', 'release', ' emphasis="base"'],
    ]) {
      for (const kind of ['', 'kind="lifecycle" ']) {
        it(`maps ${kind || 'no kind'} variant="${from}" to ${to}`, () => {
          const input = `<dt-badge ${kind}variant="${from}" label="Label" />`;

          assert.equal(run(input), `<dt-badge kind="release" variant="${to}"${emphasis} label="Label" />`);
        });
      }
    }

    it('preserves an explicit emphasis', () => {
      const input = '<dt-badge kind="lifecycle" variant="internal" emphasis="subtle" label="Alpha" />';

      assert.equal(run(input), '<dt-badge kind="release" variant="pre-release" emphasis="subtle" label="Alpha" />');
    });

    it('keeps one attribute per line when adding the base emphasis', () => {
      const input = ['<dt-badge', '  variant="familiar"', '  label="Label"', '/>'].join('\n');
      const expected = ['<dt-badge', '  kind="release"', '  variant="release"', '  emphasis="base"', '  label="Label"', '/>']
        .join('\n');

      assert.equal(run(input), expected);
    });

    it('leaves the lifecycle content states unchanged', () => {
      for (const variant of ['draft', 'edited', 'unsaved', 'saved', 'published', 'archived', 'scheduled']) {
        const input = `<dt-badge kind="lifecycle" variant="${variant}" label="Label" />`;

        assert.equal(run(input), input);
        assert.equal(warnings(input).length, 0);
      }
    });
  });

  describe('safety', () => {
    it('leaves a badge with a dynamic kind unchanged and does not warn', () => {
      const input = '<dt-badge :kind="group" :variant="variant" label="Badge" />';

      assert.equal(run(input), input);
      assert.equal(warnings(input).filter(warning => warning.startsWith('BADGE_API_DYNAMIC_KIND')).length, 0);
    });

    it('leaves a badge that already has a group unchanged', () => {
      const input = '<dt-badge kind="counter" variant="mention" label="2" />';

      assert.equal(run(input), input);
    });

    it('warns instead of guessing when a v-bind object spread supplies the props', () => {
      const input = '<dt-badge v-bind="statusBadge" class="x" />';

      assert.equal(run(input), input);
      assert.ok(warnings(input).some(warning => warning.startsWith('BADGE_API_DYNAMIC_KIND')));
    });

    it('inserts kind and variant after leading structural directives', () => {
      const input = '<dt-badge v-if="show" :key="id" type="info" text="Info" />';

      assert.equal(run(input), '<dt-badge v-if="show" :key="id" kind="status" variant="info" label="Info" />');
    });

    it('keeps one attribute per line after leading directives in a multi-line tag', () => {
      const input = ['<dt-badge', '  v-else', '  type="info"', '/>'].join('\n');
      const expected = ['<dt-badge', '  v-else', '  kind="status"', '  variant="info"', '/>'].join('\n');

      assert.equal(run(input), expected);
    });

    it('migrates every badge when self-closing badges precede a paired one', () => {
      const input = [
        '<dt-badge label="A" />',
        '<dt-badge label="B" />',
        '<dt-badge label="C"><template #start>x</template></dt-badge>',
        '<dt-badge variant="info" label="D" />',
      ].join('\n');
      const output = run(input);

      assert.equal(output.match(/kind="status"/g).length, 4);
    });

    it('migrates a badge nested inside another badge', () => {
      const input = '<dt-badge variant="count" label="99"><dt-badge variant="mention" label="2" /></dt-badge>';
      const output = run(input);

      assert.ok(output.includes('<dt-badge kind="counter" variant="count" label="99">'));
      assert.ok(output.includes('<dt-badge kind="counter" variant="mention" label="2" />'));
    });

    it('does not touch sibling elements that start with the badge name', () => {
      const input = '<dt-badge-group label="x" />';

      assert.equal(run(input), input);
    });

    it('is idempotent', () => {
      const once = run('<dt-badge text="Beta" type="bulletin" />');

      assert.equal(run(once), once);
    });

    it('warns instead of guessing when the variant or type is dynamic', () => {
      const input = '<dt-badge :variant="badgeVariant" label="Badge" />';

      assert.equal(run(input), input);
      assert.ok(warnings(input).some(warning => warning.startsWith('BADGE_API_DYNAMIC_KIND')));
    });

    it('warns for dynamic type bindings', () => {
      const input = '<dt-badge :type="badgeType" text="Badge" />';

      assert.ok(warnings(input).some(warning => warning === 'BADGE_API_DYNAMIC_PROP file=test.vue prop=type'));
    });
  });

  describe('slots and classes', () => {
    it('renames the deprecated leftIcon and rightIcon slots', () => {
      const input = [
        '<dt-badge text="Locked">',
        '  <template #leftIcon="{ iconSize }">',
        '    <dt-icon-lock :size="iconSize" />',
        '  </template>',
        '  <template #rightIcon>',
        '    <dt-icon-lock />',
        '  </template>',
        '</dt-badge>',
      ].join('\n');
      const expected = [
        '<dt-badge kind="status" variant="neutral" label="Locked">',
        '  <template #startIcon="{ iconSize }">',
        '    <dt-icon-lock :size="iconSize" />',
        '  </template>',
        '  <template #endIcon>',
        '    <dt-icon-lock />',
        '  </template>',
        '</dt-badge>',
      ].join('\n');

      assert.equal(run(input), expected);
      assert.ok(warnings(input).some(warning => warning.startsWith('BADGE_API_SLOT_RENAMED')));
    });

    it('keeps the startIcon and endIcon slots and their class props', () => {
      const input = '<DtBadge startIconClass="foo" end-icon-class="bar" text="Badge"><template #startIcon>x</template></DtBadge>';
      const output = run(input);

      assert.ok(output.includes('startIconClass="foo"'));
      assert.ok(output.includes('end-icon-class="bar"'));
      assert.ok(output.includes('<template #startIcon>'));
    });

    it('removes legacy emphasis aliases when emphasis is already set', () => {
      const input = '<dt-badge emphasis="base" subtle outlined text="Badge" />';

      assert.ok(run(input).includes('emphasis="base"'));
      assert.ok(!/\ssubtle|\soutlined/.test(run(input)));
    });

    it('does not transform non-badge leftIcon slots', () => {
      const input = '<dt-button><template #leftIcon><dt-icon /></template></dt-button>';

      assert.equal(run(input), input);
    });
  });
});
