import { isClassProp, shouldDisableSlotClassProp, supportsRootClass } from './utils';

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

  describe('isClassProp', function () {
    it('Should treat native class and *Class props as class props', function () {
      expect(isClassProp({ name: 'class' })).toBe(true);
      expect(isClassProp({ name: 'startIconClass' })).toBe(true);
      expect(isClassProp({ name: 'size' })).toBe(false);
    });
  });

  describe('shouldDisableSlotClassProp', function () {
    it('Should disable direct slot class props when their slot is empty', function () {
      expect(shouldDisableSlotClassProp('startIconClass', { startIcon: '' })).toBe(true);
    });

    it('Should disable TextListItem marker class props when the marker slot is empty', function () {
      expect(shouldDisableSlotClassProp('markerClass', { marker: ' ' })).toBe(true);
    });

    it('Should not disable direct slot class props when their slot has content', function () {
      expect(shouldDisableSlotClassProp('startIconClass', {
        startIcon: '<dt-icon-phone :size="iconSize" />',
      })).toBe(false);
    });

    it('Should not disable TextListItem marker class props when the marker slot has content', function () {
      expect(shouldDisableSlotClassProp('markerClass', {
        marker: '<dt-icon-close size="200" />',
      })).toBe(false);
    });

    it('Should ignore class props without a direct slot dependency', function () {
      expect(shouldDisableSlotClassProp('labelClass', { label: '' })).toBe(false);
      expect(shouldDisableSlotClassProp('contentClass', { marker: '' })).toBe(false);
    });

    it('Should ignore direct slot class props when the slot is not available', function () {
      expect(shouldDisableSlotClassProp('iconClass', {})).toBe(false);
    });
  });
});
