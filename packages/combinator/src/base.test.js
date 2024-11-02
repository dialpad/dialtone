import { assert } from 'chai';
import { enableAutoUnmount } from '@vue/test-utils';

enableAutoUnmount(after);

describe('base.test.js', function () {
  describe('When running test', function () {
    it('Should correctly resolve asserts', function () {
      assert.isTrue(true);
    });
  });
});
