import { supportsRootClass } from './utils';

import { expect } from 'vitest';

describe('utils.js test', function () {
  it('Should support root class for components by default', function () {
    expect(supportsRootClass('DtAvatar')).toBe(true);
    expect(supportsRootClass('DtCard')).toBe(true);
    expect(supportsRootClass('DtEmptyState')).toBe(true);
  });

  it('Should reject components that do not expose root class reliably', function () {
    expect(supportsRootClass('DtDropdown')).toBe(false);
  });

  it('Should reject missing component names', function () {
    expect(supportsRootClass()).toBe(false);
  });
});
