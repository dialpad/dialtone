import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { checkTemplateApi } from './example-consumer.mjs';

const require = createRequire(new URL('../../apps/dialtone-documentation/package.json', import.meta.url));
const { baseParse } = createRequire(require.resolve('vue/package.json'))('@vue/compiler-dom');
const metadata = [{ displayName: 'DtToggle', props: [{ name: 'modelValue', values: [] }, { name: 'showIcon', values: [] }], events: [{ name: 'update:modelValue' }], slots: [{ name: 'default' }] }];

test('consumer API checks normalize kebab props and require a supported v-model event', () => {
  assert.doesNotThrow(() => checkTemplateApi(baseParse('<dt-toggle v-model="checked" :show-icon="false">Label</dt-toggle>'), metadata, []));
  assert.throws(() => checkTemplateApi(baseParse('<dt-toggle invalid-prop />'), metadata, []), /invalid-prop/);
  assert.throws(() => checkTemplateApi(baseParse('<dt-toggle v-model="checked" />'), [{ ...metadata[0], events: [] }], []), /update:modelValue/);
});

test('consumer API validation rejects opaque object-form prop bindings', () => {
  assert.throws(() => checkTemplateApi(baseParse('<dt-toggle v-bind="{ invalidProp: true }" />'), metadata, []), /Object-form v-bind/);
});

test('consumer icon API checks use installed exports and declared props', () => {
  const icons = { DtIconPhone: { props: { size: { type: [String, Number] } } } };
  assert.doesNotThrow(() => checkTemplateApi(baseParse('<dt-icon-phone :size="iconSize" />'), metadata, [], icons));
  assert.throws(() => checkTemplateApi(baseParse('<dt-icon-phone invalid-prop />'), metadata, [], icons), /invalid-prop/);
  assert.throws(() => checkTemplateApi(baseParse('<dt-icon-missing />'), metadata, [], icons), /dt-icon-missing/);
});


test('consumer API checks distinguish named-slot templates from default content', () => {
  const avatar = [{ displayName: 'DtAvatar', props: [], slots: [{ name: 'icon' }] }];
  assert.doesNotThrow(() => checkTemplateApi(baseParse('<dt-avatar><template #icon><span>Icon</span></template></dt-avatar>'), avatar, []));
  assert.throws(() => checkTemplateApi(baseParse('<dt-avatar>Default content</dt-avatar>'), avatar, []), /default slot/);
  assert.throws(() => checkTemplateApi(baseParse('<dt-avatar><template #unknown>Icon</template></dt-avatar>'), avatar, []), /unknown/);
});

test('consumer API checks accept explicitly documented native attributes', () => {
  const input = [{ displayName: 'DtInput', props: [], slots: [], events: [],
    tags: { property: [{ name: 'placeholder', description: 'attribute' }] } }];
  for (const attribute of ['placeholder="Hint"', ':placeholder="hint"']) {
    assert.deepEqual(checkTemplateApi(baseParse(`<dt-input ${attribute} />`), input, []), ['DtInput.placeholder']);
  }
  for (const attribute of ['placehoder="Hint"', 'autocomplete="off"', 'v-model:placeholder="hint"', ':[placeholder]="hint"']) {
    assert.throws(() => checkTemplateApi(baseParse(`<dt-input ${attribute} />`), input, []), /DtInput/);
  }
  for (const tags of [{}, { property: [{ name: 'placeholder', description: 'component property' }] }]) {
    assert.throws(() => checkTemplateApi(baseParse('<dt-input placeholder="Hint" />'), [{ ...input[0], tags }], []), /DtInput.placeholder/);
  }
});

test('documented native attributes cannot bypass declared prop restrictions', () => {
  const input = { displayName: 'DtInput', slots: [], events: [],
    tags: { property: [{ name: 'placeholder', description: 'attribute' }] } };
  for (const [prop, error] of [
    [{ name: 'placeholder', tags: { deprecated: true } }, /deprecated/],
    [{ name: 'placeholder', values: ['Only allowed'] }, /Hint/],
  ]) {
    assert.throws(() => checkTemplateApi(baseParse('<dt-input placeholder="Hint" />'), [{ ...input, props: [prop] }], []), error);
  }
});
