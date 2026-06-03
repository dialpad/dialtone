import { describe, expect, it } from 'vitest';
import { getControlByMemberType } from './control';
import { extendMember } from './info_extend';

describe('control.js test', function () {
  describe('getControlByMemberType', function () {
    it('uses the boolean control for a plain boolean', function () {
      expect(getControlByMemberType('boolean')).toBe('boolean');
    });

    it('uses the boolean control for a nullable boolean enum', function () {
      expect(getControlByMemberType('boolean', { values: ['null', true, false] })).toBe('boolean');
    });

    it('uses the segmented control for the mixed boolean enum', function () {
      expect(getControlByMemberType('boolean', { values: [true, false, 'mixed'] })).toBe('segmented');
    });

    it('uses the segmented control for short string values', function () {
      expect(getControlByMemberType('string', { values: ['sm', 'md', 'lg'] })).toBe('segmented');
    });

    it('uses the selection control for longer string values', function () {
      expect(getControlByMemberType('string', { values: ['label', 'count'] })).toBe('selection');
    });
  });

  describe('docgen value normalization', function () {
    it('normalizes a mixed boolean enum to runtime values', function () {
      const member = { type: { name: 'boolean|string' }, values: ['true', 'false', '\'mixed\''] };

      extendMember(member);

      expect(member.values).toEqual([true, false, 'mixed']);
    });

    it('leaves non-boolean string enums untouched', function () {
      const member = { type: { name: 'string' }, values: ['\'body\'', '\'parent\''] };

      extendMember(member);

      expect(member.values).toEqual(['\'body\'', '\'parent\'']);
    });
  });
});
