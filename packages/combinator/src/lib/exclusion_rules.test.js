import { expect } from 'vitest';
import { shouldExclude, shouldDisable, getDisabledValues } from './exclusion_rules';
import variantsBadge from '@/src/variants/variants_badge';

const EQUALITY_RULE = { when: { kind: 'body' }, disableValues: { props: { size: ['500'] } } };
const PREDICATE_RULE = { when: { kind: v => v !== 'headline' }, disableValues: { props: { size: ['500'] } } };
const HIDE_RULE = { when: { kind: 'count' }, hide: { props: ['decoration'] } };
const DISABLE_RULE = { when: { kind: 'count' }, disable: { props: ['decoration'] } };

describe('exclusion_rules', function () {
  describe('getDisabledValues', function () {
    it('should return empty Set when no rules', function () {
      expect(getDisabledValues('size', [], { kind: 'body' }).size).toBe(0);
    });

    it('should return empty Set when rules is undefined', function () {
      expect(getDisabledValues('size', undefined, { kind: 'body' }).size).toBe(0);
    });

    it('should contain value when equality condition matches', function () {
      expect(getDisabledValues('size', [EQUALITY_RULE], { kind: 'body' }).has('500')).toBe(true);
    });

    it('should return empty Set when equality condition does not match', function () {
      expect(getDisabledValues('size', [EQUALITY_RULE], { kind: 'headline' }).size).toBe(0);
    });

    it('should contain value when predicate condition matches', function () {
      expect(getDisabledValues('size', [PREDICATE_RULE], { kind: 'body' }).has('500')).toBe(true);
    });

    it('should return empty Set when predicate condition does not match', function () {
      expect(getDisabledValues('size', [PREDICATE_RULE], { kind: 'headline' }).size).toBe(0);
    });

    it('should union disabled values across multiple matching rules', function () {
      const rules = [
        { when: { kind: 'body' }, disableValues: { props: { size: ['500'] } } },
        { when: { kind: 'body' }, disableValues: { props: { size: ['600'] } } },
      ];
      expect(getDisabledValues('size', rules, { kind: 'body' }).size).toBe(2);
    });

    it('should coerce numeric values to strings', function () {
      const rules = [
        { when: { kind: 'body' }, disableValues: { props: { size: [500] } } },
      ];
      expect(getDisabledValues('size', rules, { kind: 'body' }).has('500')).toBe(true);
    });

    it('should return empty Set for a prop not in disableValues', function () {
      expect(getDisabledValues('tone', [EQUALITY_RULE], { kind: 'body' }).size).toBe(0);
    });

    it('should ignore rules that only have hide', function () {
      expect(getDisabledValues('decoration', [HIDE_RULE], { kind: 'count' }).size).toBe(0);
    });
  });

  describe('shouldExclude', function () {
    it('should return false when no rules', function () {
      expect(shouldExclude('size', 'props', [], {})).toBe(false);
    });

    it('should return true when condition matches and member is in hide list', function () {
      expect(shouldExclude('decoration', 'props', [HIDE_RULE], { kind: 'count' })).toBe(true);
    });

    it('should return false when condition does not match', function () {
      expect(shouldExclude('decoration', 'props', [HIDE_RULE], { kind: 'label' })).toBe(false);
    });

    it('should return false when member is not in hide list', function () {
      expect(shouldExclude('size', 'props', [HIDE_RULE], { kind: 'count' })).toBe(false);
    });
  });

  describe('shouldDisable', function () {
    it('should return false when no rules', function () {
      expect(shouldDisable('size', 'props', [], {})).toBe(false);
    });

    it('should return true when condition matches and member is in disable list', function () {
      expect(shouldDisable('decoration', 'props', [DISABLE_RULE], { kind: 'count' })).toBe(true);
    });

    it('should treat hide rules as disable rules for backwards compatibility', function () {
      expect(shouldDisable('decoration', 'props', [HIDE_RULE], { kind: 'count' })).toBe(true);
    });

    it('should disable DtBadge icon size when no icon slot is provided', function () {
      expect(shouldDisable('iconSize', 'props', variantsBadge.exclusions, {
        startIcon: '',
        endIcon: '',
      })).toBe(false);
      expect(shouldDisable('iconSize', 'props', variantsBadge.exclusions, {}, {
        startIcon: '',
        endIcon: '',
      })).toBe(true);
      expect(shouldDisable('iconSize', 'props', variantsBadge.exclusions, {}, {
        startIcon: '<dt-icon-lock :size="iconSize" />',
        endIcon: '',
      })).toBe(false);
    });

    it('should disable DtBadge icon class props when their icon slots are empty', function () {
      expect(shouldDisable('startIconClass', 'props', variantsBadge.exclusions, {}, {
        startIcon: '',
        endIcon: '',
      })).toBe(true);
      expect(shouldDisable('endIconClass', 'props', variantsBadge.exclusions, {}, {
        startIcon: '',
        endIcon: '',
      })).toBe(true);
      expect(shouldDisable('startIconClass', 'props', variantsBadge.exclusions, {}, {
        startIcon: '<dt-icon-lock :size="iconSize" />',
        endIcon: '',
      })).toBe(false);
      expect(shouldDisable('endIconClass', 'props', variantsBadge.exclusions, {}, {
        startIcon: '<dt-icon-lock :size="iconSize" />',
        endIcon: '',
      })).toBe(true);
    });
  });
});
