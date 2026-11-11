import assert from 'node:assert/strict';
import test from 'node:test';
import { parseSource } from 'vue-docgen-api';
import { preserveDeclaredSlotBindings } from '../lib/vue-slot-bindings.mjs';

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
      ${slot('default', ':label="label" :selected="selected" :selectedOptions="selectedOptions" :displayLabel="displayLabel" :isActive="isActive"')}
      ${slot('content', ':close="close" :apply="apply" :cancel="cancel" :selected="selected" :pendingSelected="pendingSelected" :setSelected="setSelected"')}
    </template>
    <template v-else>
      ${slot('default', ':label="label" :filters="filters" :activeFilters="activeFilters" :activeFilterList="activeFilterList" :activeFilterOverflow="activeFilterOverflow"')}
      ${slot('content', ':close="close" :apply="apply" :cancel="cancel" :pendingFilters="pendingFilters"')}
    </template>
  </div></template><script>export default { name: 'FilterPillSlotFixture' };</script>`;
  const doc = await parseSource(source, 'FilterPillSlotFixture.vue', { addTemplateHandlers: [preserveDeclaredSlotBindings] });
  for (const [name, bindings] of Object.entries(declarations)) {
    const actual = doc.slots.find(slot => slot.name === name).bindings;
    assert.deepEqual(actual.map(binding => binding.name).sort(), [...bindings].sort());
    assert.equal(actual.find(binding => binding.name === bindings.at(-1)).description, `Conditional ${bindings.at(-1)}.`);
  }
});
