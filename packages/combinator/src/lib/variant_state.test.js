import { expect } from 'vitest';
import { computed, reactive, readonly, shallowRef } from 'vue';
import {
  areOptionValuesEqual,
  captureComponentValues,
  computeDisabledMembers,
  getInitialValues,
  listVariantNames,
  writeUpdateEvent,
  createVariantBindings,
  buildVariantInfo,
  buildVariantState,
} from './variant_state';
import { DtButton, DtFilterPill } from '@dialpad/dialtone-vue';
import allDocs from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import filterPillVariants from '@/src/variants/variants_filter_pill';
import { serializeExampleTemplate } from './code_copy';
import { presetExampleId } from '@workspaceRoot/scripts/lib/preset-example-id.mjs';

// `link` is a boolean prop, so `linkKind` is inferred as its dependent child
// (boolean-prefix matching). The first exclusion rule hides target/rel/type
// when `to` is set; the second hides the `decoration` slot when kind is 'count'.
// Mirrors the shapes in the real variant banks.
const INFO = {
  exclusions: [
    { when: { to: v => !!v }, hide: { props: ['target', 'rel', 'type'] } },
    { when: { kind: 'count' }, hide: { slots: ['decoration'] } },
  ],
  props: [
    { name: 'to' },
    { name: 'target' },
    { name: 'rel' },
    { name: 'type', required: true },
    { name: 'kind' },
    { name: 'link', types: ['boolean'] },
    { name: 'linkKind' },
  ],
  slots: [
    { name: 'default' },
    { name: 'decoration' },
  ],
};

const TEXT_LIST_ITEM_INFO = {
  exclusions: [],
  props: [
    { name: 'contentClass' },
    { name: 'markerClass' },
  ],
  slots: [
    { name: 'default' },
    { name: 'marker' },
  ],
};

describe('variant_state', function () {
  it('keeps live collections separate from preset defaults and other instances', () => {
    const initialValue = { selected: ['apple'] };
    const info = { props: [{ name: 'modelValue', initialValue }] };
    const first = getInitialValues(info);
    const second = getInitialValues(info);
    first.props.modelValue.selected.push('banana');
    expect(initialValue.selected).toEqual(['apple']);
    expect(second.props.modelValue.selected).toEqual(['apple']);
  });

  it('retains the legacy default lookup identity and configuration', () => {
    const preset = listVariantNames(filterPillVariants).find(name => name === 'default');
    expect(presetExampleId('DtFilterPill', preset)).toBe('examples/presets/DtFilterPill/default');
    const state = buildVariantState(DtFilterPill,
      allDocs.find(doc => doc.displayName === 'DtFilterPill'), filterPillVariants, preset);
    expect(state.info.metadata.lookupExclude).toBeUndefined();
    expect(filterPillVariants.default).toEqual({
      props: {
        label: { initialValue: 'Active example' },
        modelValue: { initialValue: [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3', active: true }] },
        endTooltipText: { initialValue: 'Remove' },
      },
    });
  });

  it.each([
    { options: undefined, controlled: false },
    { options: null, controlled: false },
    { options: {}, controlled: false },
    { options: [], controlled: true },
  ])('discriminates fresh options $options by array shape', ({ options, controlled }) => {
    const { info, options: state } = buildVariantState(DtFilterPill,
      allDocs.find(doc => doc.displayName === 'DtFilterPill'), {
        ...filterPillVariants,
        fixture: { props: { options: { initialValue: options } } },
      }, 'fixture');
    expect(info.metadata.previewIdentity(state.props)[0]).toBe(controlled ? 'controlled' : 'legacy');
    const disabled = computeDisabledMembers(info, state.props, state.slots);
    expect(disabled.has('modelValue')).toBe(controlled);
    expect(disabled.has('selected')).toBe(!controlled);
  });

  it.each([false, true])('copies exactly one Filter Pill contract (verbose=%s)', verbose => {
    const doc = allDocs.find(doc => doc.displayName === 'DtFilterPill');
    for (const [preset, omitted, present] of [
      ['controlled default', 'model-value', ':options='],
      ['default', 'options', ':model-value='],
    ]) {
      const state = buildVariantState(DtFilterPill, doc, filterPillVariants, preset);
      const disabledMembers = computeDisabledMembers(state.info, state.options.props, state.options.slots);
      const template = serializeExampleTemplate({ ...state, disabledMembers, verbose });
      expect(template).not.toMatch(new RegExp(`\\n +:?${omitted}=`));
      expect(template).toContain(present);
      if (preset === 'default') {
        expect(template).not.toMatch(/\n +:?(selected|neutral-value|open)=/);
      }
    }
  });

  it('keeps legacy popover controls available while excluding dropdown-only controls', () => {
    const { info, options } = buildVariantState(DtFilterPill,
      allDocs.find(doc => doc.displayName === 'DtFilterPill'), filterPillVariants, 'defer selection');
    const disabled = computeDisabledMembers(info, options.props, options.slots);
    expect(disabled.has('deferSelection')).toBe(false);
    expect(disabled.has('popoverFooterClass')).toBe(false);
    expect(disabled.has('dropdownListClass')).toBe(true);
  });

  it('keeps bank metadata separate from component members and applies named overrides', () => {
    const previewIdentity = bindings => [bindings.kind];
    const info = buildVariantInfo(DtButton, allDocs.find(doc => doc.displayName === 'DtButton'), {
      defaults: { metadata: { previewIdentity, copyNotice: 'Default notice' } },
      primary: { metadata: { copyNotice: 'Named notice' } },
    }, 'primary');

    expect(info.metadata).toEqual({ previewIdentity, copyNotice: 'Named notice' });
  });

  it('restores isolated initial arrays with or without a preview identity policy', () => {
    const initialValue = [{ value: 'phone', active: true }];
    const info = { metadata: { previewIdentity: () => [] }, props: [{ name: 'items', initialValue }] };
    const first = getInitialValues(info);
    first.props.items[0].active = false;
    expect(getInitialValues(info).props.items).toEqual([{ value: 'phone', active: true }]);
    const ordinary = getInitialValues({ props: info.props }).props.items;
    expect(ordinary).toEqual(initialValue);
    expect(ordinary).not.toBe(initialValue);
  });

  describe('computeDisabledMembers', function () {
    it('returns an empty set when no rule matches and dependents are active', function () {
      expect(computeDisabledMembers(INFO, { to: '', kind: 'body', link: true }).size).toBe(0);
    });

    it('hides props excluded by a matching exclusion rule', function () {
      const disabled = computeDisabledMembers(INFO, { to: '/', kind: 'body', link: true });
      expect(disabled.has('target')).toBe(true);
      expect(disabled.has('rel')).toBe(true);
    });

    it('never disables a required member even when a rule would hide it', function () {
      // `type` is in the hide list but required, so it must stay enabled.
      const disabled = computeDisabledMembers(INFO, { to: '/', kind: 'body', link: true });
      expect(disabled.has('type')).toBe(false);
    });

    it('hides a dependent prop when its boolean parent is falsy', function () {
      expect(computeDisabledMembers(INFO, { to: '', kind: 'body', link: false }).has('linkKind')).toBe(true);
    });

    it('shows a dependent prop when its boolean parent is truthy', function () {
      expect(computeDisabledMembers(INFO, { to: '', kind: 'body', link: true }).has('linkKind')).toBe(false);
    });

    it('hides slots via matching exclusion rules', function () {
      expect(computeDisabledMembers(INFO, { to: '', kind: 'count', link: true }).has('decoration')).toBe(true);
    });

    it('hides TextListItem marker class props when the marker slot is empty', function () {
      const disabled = computeDisabledMembers(TEXT_LIST_ITEM_INFO, {}, {
        default: 'List item',
        marker: '',
      });

      expect(disabled.has('contentClass')).toBe(false);
      expect(disabled.has('markerClass')).toBe(true);
    });

    it('shows TextListItem marker class props when the marker slot has content', function () {
      const disabled = computeDisabledMembers(TEXT_LIST_ITEM_INFO, {}, {
        default: 'List item',
        marker: '<dt-icon-close size="200" />',
      });

      expect(disabled.has('contentClass')).toBe(false);
      expect(disabled.has('markerClass')).toBe(false);
    });

    it('handles an info object with no props or slots', function () {
      expect(computeDisabledMembers({ exclusions: [] }, {}).size).toBe(0);
    });
  });

  describe('listVariantNames', function () {
    it('returns variant keys, excluding the reserved defaults/exclusions keys', function () {
      const names = listVariantNames({ default: {}, defaults: {}, exclusions: [], primary: {}, danger: {} });
      expect(names).toEqual(['default', 'primary', 'danger']);
    });

    it('returns an empty array for nullish input', function () {
      expect(listVariantNames(undefined)).toEqual([]);
      expect(listVariantNames(null)).toEqual([]);
    });
  });

  describe('writeUpdateEvent', function () {
    it('writes the value onto a matching prop', function () {
      const target = { props: { modelValue: '' }, attributes: {} };
      writeUpdateEvent(target, 'update:modelValue', 'hi');
      expect(target.props.modelValue).toBe('hi');
    });

    it('writes to attributes when the member is not a prop', function () {
      const target = { props: { kind: 'x' }, attributes: { 'data-foo': '' } };
      writeUpdateEvent(target, 'update:data-foo', 'bar');
      expect(target.attributes['data-foo']).toBe('bar');
    });

    it('ignores non-update events', function () {
      const target = { props: { modelValue: 'a' } };
      writeUpdateEvent(target, 'click', 'b');
      expect(target.props.modelValue).toBe('a');
    });

    it('ignores members the target does not own (no key is created)', function () {
      const target = { props: { modelValue: 'a' }, attributes: {} };
      writeUpdateEvent(target, 'update:unknown', 'b');
      expect('unknown' in target.props).toBe(false);
      expect('unknown' in target.attributes).toBe(false);
    });

    it('is a no-op when the target has neither props nor attributes', function () {
      expect(() => writeUpdateEvent({}, 'update:x', 1)).not.toThrow();
    });
  });

  describe('model echo equality', () => {
    it.each([['reactive', reactive], ['readonly', readonly]])(
      'preserves instance identity through a %s proxy', (proxyType, createProxy) => {
        class Choice {}
        const value = new Choice();
        const proxy = createProxy(value);
        expect(areOptionValuesEqual(value, proxy)).toBe(true);
        expect(areOptionValuesEqual(proxy, value)).toBe(true);
        expect(areOptionValuesEqual(proxy, createProxy(new Choice()))).toBe(false);
      },
    );

    it('preserves a nested instance echo while detecting a replacement instance', () => {
      class Choice {}
      const model = reactive({ props: { value: { choice: new Choice() } }, attributes: {} });
      const baseline = captureComponentValues(model).props.value;
      expect(areOptionValuesEqual(baseline, model.props.value)).toBe(true);
      model.props.value.choice = new Choice();
      expect(areOptionValuesEqual(baseline, model.props.value)).toBe(false);
    });

    it('keeps a detached baseline when a reactive prop is mutated before its event', () => {
      const model = reactive({ props: { modelValue: ['apple'] }, attributes: {} });
      let captures = 0;
      const recorded = computed(() => { captures++; return captureComponentValues(model); });
      const baseline = recorded.value;
      model.props.modelValue.push('banana');
      expect(recorded.value).toBe(baseline);
      expect(captures).toBe(1);
      expect(baseline.props.modelValue).toEqual(['apple']);
      expect(areOptionValuesEqual(baseline.props.modelValue, model.props.modelValue)).toBe(false);
      expect(captureComponentValues(model).props.modelValue).toEqual(['apple', 'banana']);
    });

    it('captures plain cycles and symbols while retaining callbacks and non-plain identities', () => {
      const key = Symbol('choice');
      const value = { callback: () => {}, date: new Date(0), [key]: [1] };
      value.self = value;
      const snapshot = captureComponentValues({ props: { value }, attributes: {} }).props.value;
      expect(snapshot).not.toBe(value);
      expect(snapshot.self).toBe(snapshot);
      expect(snapshot[key]).not.toBe(value[key]);
      expect(snapshot.callback).toBe(value.callback);
      expect(snapshot.date).toBe(value.date);
      expect(areOptionValuesEqual(snapshot, value)).toBe(true);
      value[key].push(2);
      expect(snapshot[key]).toEqual([1]);
    });

    it('recognizes cloned nested objects and arrays without depending on key order', () => {
      expect(areOptionValuesEqual({ showIcon: false, values: [undefined, { size: 2 }] },
        { values: [undefined, { size: 2 }], showIcon: false })).toBe(true);
      expect(areOptionValuesEqual([1, 2], [2, 1])).toBe(false);
      expect(areOptionValuesEqual({ value: undefined }, {})).toBe(false);
    });

    it('keeps callbacks, symbols and non-plain instances distinct', () => {
      const callback = () => {};
      const key = Symbol('option');
      expect(areOptionValuesEqual({ callback, [key]: true }, { callback, [key]: true })).toBe(true);
      expect(areOptionValuesEqual({ callback }, { callback: () => {} })).toBe(false);
      expect(areOptionValuesEqual({ [key]: true }, { [key]: false })).toBe(false);
      expect(areOptionValuesEqual(new Date(0), new Date(0))).toBe(false);
    });

    it('handles cyclic values and still detects a real change', () => {
      const previous = { size: 2 };
      previous.self = previous;
      const next = { size: 2 };
      next.self = next;
      expect(areOptionValuesEqual(previous, next)).toBe(true);
      next.size = 3;
      expect(areOptionValuesEqual(previous, next)).toBe(false);
    });
  });
  it('keeps copied bindings reactive across value changes and reset replacements', () => {
    const info = shallowRef(Object.freeze({ props: [{ name: 'size' }], attributes: [undefined, { name: 'class' }] }));
    const options = shallowRef(reactive({ props: { size: 300 }, attributes: { class: 'd-w100p' } }));
    const bindings = createVariantBindings(() => info.value, () => options.value);
    const values = computed(() => bindings.optionBindings.get());
    expect(values.value).toEqual({ size: 300, class: 'd-w100p' });
    options.value.props.size = 400;
    expect(values.value.size).toBe(400);
    options.value = reactive({ props: { size: 500 }, attributes: {} });
    expect(values.value).toEqual({ size: 500 });
    info.value = Object.freeze({ props: [{ name: 'label' }], attributes: [] });
    expect(bindings.infoBindings.get().map(member => member.name)).toEqual(['label']);
  });

});
