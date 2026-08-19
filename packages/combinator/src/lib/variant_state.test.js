import { expect } from 'vitest';
import { computeDisabledMembers, listVariantNames, writeUpdateEvent } from './variant_state';

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
});
