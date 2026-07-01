import { cachedRef } from './utils_vue';

import { expect } from 'vitest';

describe('utils_vue.js test', function () {
  afterEach(function () {
    window.localStorage.clear();
  });

  describe('cachedRef', function () {
    it('Should clear malformed cached values and use the default value', function () {
      const defaultValue = { controls: { hideDeprecated: true } };

      window.localStorage.setItem('dialtoneCombinatorSettings', '{bad json');

      const value = cachedRef('dialtoneCombinatorSettings', defaultValue);

      expect(value.value).toEqual(defaultValue);
      expect(window.localStorage.getItem('dialtoneCombinatorSettings')).toBeNull();
    });
  });
});
