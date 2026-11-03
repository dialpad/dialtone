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
