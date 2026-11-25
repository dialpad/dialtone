import assert from 'node:assert/strict';
import test from 'node:test';
import { parseSource } from 'vue-docgen-api';
import { preserveDeclaredSlotBindings, tagDeprecatedSlots } from '../lib/vue-slot-bindings.mjs';

const fixture = `<template>
  <div>
    <!--
      @slot Trigger with directly spread popup attributes.
      @binding {string} aria-expanded Whether the popup is open.
      @binding {string} aria-controls The popup ID.
    -->
    <!-- eslint-disable-next-line vue/no-unused-refs -->
    <slot name="anchor" ref="anchor" :aria-expanded="open" v-bind="attrs" />
    <!-- @slot Ordinary content. -->
    <slot name="content" :close="close" />
  </div>
</template>
<script>
export default { name: 'PopupFixture' };
</script>`;

test('slot declarations survive adjacent comments beside inferred attributes and raw spreads', async () => {
  const doc = await parseSource(fixture, 'PopupFixture.vue', { addTemplateHandlers: [preserveDeclaredSlotBindings] });
  const anchor = doc.slots.find(slot => slot.name === 'anchor');
  assert.deepEqual(anchor.bindings.map(binding => binding.name).sort(), ['aria-controls', 'aria-expanded', 'ref']);
  assert.equal(anchor.bindings.find(binding => binding.name === 'aria-expanded').description, 'Whether the popup is open.');
  assert.deepEqual(doc.slots.find(slot => slot.name === 'content').bindings, [{ name: 'close', title: 'binding' }]);
});

test('repeated FilterPill slots retain the declared legacy and controlled binding union', async () => {
  const declarations = {
    default: ['label', 'filters', 'activeFilters', 'activeFilterList', 'activeFilterOverflow', 'selected', 'selectedOptions', 'displayLabel', 'isActive'],
    content: ['close', 'apply', 'cancel', 'pendingFilters', 'selected', 'pendingSelected', 'setSelected'],
  };
  const slot = (name, bindings) => `<!--
    @slot ${name} content; bindings depend on the selection contract.
    ${declarations[name].map(binding => `@binding {any} ${binding} Conditional ${binding}.`).join('\n    ')}
  -->
  <slot ${name === 'default' ? '' : `name="${name}"`} ${bindings} />`;
  const source = `<template><div>
    <template v-if="controlled">
      ${slot('default', ':label="label" :selected="selected" :selected-options="selectedOptions" :display-label="displayLabel" :is-active="isActive"')}
      ${slot('content', ':close="close" :apply="apply" :cancel="cancel" :selected="selected" :pending-selected="pendingSelected" :set-selected="setSelected"')}
    </template>
    <template v-else>
      ${slot('default', ':label="label" :filters="filters" :active-filters="activeFilters" :active-filter-list="activeFilterList" :active-filter-overflow="activeFilterOverflow"')}
      ${slot('content', ':close="close" :apply="apply" :cancel="cancel" :pending-filters="pendingFilters"')}
    </template>
  </div></template><script>export default { name: 'FilterPillSlotFixture' };</script>`;
  const doc = await parseSource(source, 'FilterPillSlotFixture.vue', { addTemplateHandlers: [preserveDeclaredSlotBindings] });
  for (const [name, bindings] of Object.entries(declarations)) {
    const actual = doc.slots.find(slot => slot.name === name).bindings;
    assert.deepEqual(actual.map(binding => binding.name).sort(), [...bindings].sort());
    assert.equal(actual.find(binding => binding.name === bindings.at(-1)).description, `Conditional ${bindings.at(-1)}.`);
  }
});

test('slot descriptions that start with @deprecated gain a deprecated tag shaped like prop tags', async () => {
  const source = `<template><div>
    <!-- @slot Start icon. -->
    <slot name="startIcon" />
    <!-- @slot @deprecated Use startIcon -->
    <slot name="leftIcon" />
    <!-- @slot @deprecated -->
    <slot name="bareIcon" />
  </div></template><script>export default { name: 'DeprecatedSlotFixture' };</script>`;
  const doc = tagDeprecatedSlots(await parseSource(source, 'DeprecatedSlotFixture.vue'));
  const bySlot = Object.fromEntries(doc.slots.map(slot => [slot.name, slot]));
  assert.equal(bySlot.startIcon.tags, undefined);
  assert.deepEqual(bySlot.leftIcon.tags, { deprecated: [{ description: 'Use startIcon', title: 'deprecated' }] });
  assert.deepEqual(bySlot.bareIcon.tags, { deprecated: [{ description: '', title: 'deprecated' }] });
  assert.equal(bySlot.leftIcon.description, '@deprecated Use startIcon');
});

test('tagDeprecatedSlots keeps existing slot tags and leaves docs without slots untouched', () => {
  const slot = { name: 'old', description: '@deprecated Use new', tags: { since: [{ title: 'since', description: '1.0' }] } };
  const [tagged] = tagDeprecatedSlots({ slots: [slot] }).slots;
  assert.deepEqual(Object.keys(tagged.tags), ['since', 'deprecated']);
  assert.deepEqual(slot.tags, { since: [{ title: 'since', description: '1.0' }] });
  const bare = { displayName: 'NoSlots' };
  assert.equal(tagDeprecatedSlots(bare), bare);
});
