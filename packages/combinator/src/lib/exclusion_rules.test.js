import { assert } from 'chai';
import { shouldExclude, getDisabledValues } from './exclusion_rules';

const EQUALITY_RULE = { when: { kind: 'body' }, disableValues: { props: { size: ['500'] } } };
const PREDICATE_RULE = { when: { kind: v => v !== 'headline' }, disableValues: { props: { size: ['500'] } } };
const HIDE_RULE = { when: { kind: 'count' }, hide: { props: ['decoration'] } };

describe('exclusion_rules', function () {
  describe('getDisabledValues', function () {
    it('should return empty Set when no rules', function () {
      assert.equal(getDisabledValues('size', [], { kind: 'body' }).size, 0);
    });

    it('should return empty Set when rules is undefined', function () {
      assert.equal(getDisabledValues('size', undefined, { kind: 'body' }).size, 0);
    });

    it('should contain value when equality condition matches', function () {
      assert.isTrue(getDisabledValues('size', [EQUALITY_RULE], { kind: 'body' }).has('500'));
    });

    it('should return empty Set when equality condition does not match', function () {
      assert.equal(getDisabledValues('size', [EQUALITY_RULE], { kind: 'headline' }).size, 0);
    });

    it('should contain value when predicate condition matches', function () {
      assert.isTrue(getDisabledValues('size', [PREDICATE_RULE], { kind: 'body' }).has('500'));
    });

    it('should return empty Set when predicate condition does not match', function () {
      assert.equal(getDisabledValues('size', [PREDICATE_RULE], { kind: 'headline' }).size, 0);
    });

    it('should union disabled values across multiple matching rules', function () {
      const rules = [
        { when: { kind: 'body' }, disableValues: { props: { size: ['500'] } } },
        { when: { kind: 'body' }, disableValues: { props: { size: ['600'] } } },
      ];
      assert.equal(getDisabledValues('size', rules, { kind: 'body' }).size, 2);
    });

    it('should coerce numeric values to strings', function () {
      const rules = [
        { when: { kind: 'body' }, disableValues: { props: { size: [500] } } },
      ];
      assert.isTrue(getDisabledValues('size', rules, { kind: 'body' }).has('500'));
    });

    it('should return empty Set for a prop not in disableValues', function () {
      assert.equal(getDisabledValues('tone', [EQUALITY_RULE], { kind: 'body' }).size, 0);
    });

    it('should ignore rules that only have hide', function () {
      assert.equal(getDisabledValues('decoration', [HIDE_RULE], { kind: 'count' }).size, 0);
    });
  });

  describe('shouldExclude', function () {
    it('should return false when no rules', function () {
      assert.isFalse(shouldExclude('size', 'props', [], {}));
    });

    it('should return true when condition matches and member is in hide list', function () {
      assert.isTrue(shouldExclude('decoration', 'props', [HIDE_RULE], { kind: 'count' }));
    });

    it('should return false when condition does not match', function () {
      assert.isFalse(shouldExclude('decoration', 'props', [HIDE_RULE], { kind: 'label' }));
    });

    it('should return false when member is not in hide list', function () {
      assert.isFalse(shouldExclude('size', 'props', [HIDE_RULE], { kind: 'count' }));
    });
  });
});
