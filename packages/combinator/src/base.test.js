import { expect } from 'vitest';
import { enableAutoUnmount } from '@vue/test-utils';

enableAutoUnmount(afterAll);

describe('base.test.js', function () {
  describe('When running test', function () {
    it('Should correctly resolve asserts', function () {
      expect(true).toBe(true);
    });
  });
});
