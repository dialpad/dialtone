import * as components from '@dialpad/dialtone-vue';
import documentation from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import variants from '@/src/variants/variants';
import { getSliderControlConfig, isSliderControlValue } from './slider_control';
import { shouldDisable } from './exclusion_rules';
import { buildVariantInfo, listVariantNames } from './variant_state';

const slider = { min: 0, max: 100, step: 1, suffix: '%' };
const member = { types: ['number'], slider };

describe('slider control eligibility', () => {
  it('accepts explicit scalar metadata', () => {
    expect(getSliderControlConfig(member)).toEqual(slider);
    expect(getSliderControlConfig({ types: ['number'] })).toBeNull();
    expect(getSliderControlConfig({ ...member, slider: { min: 0, max: 1, step: 0.1 } }))
      .toEqual({ min: 0, max: 1, step: 0.1, suffix: '' });
  });

  it.each([
    { min: 0, max: 0, step: 1 },
    { min: 0, max: Infinity, step: 1 },
    { min: 0, max: 100, step: 0 },
    { min: 0, max: 1, step: 0.3 }, { min: 0, max: 1, step: 1, suffix: 2 },
    { min: '0', max: 100, step: 1 }, null,
  ])('rejects malformed configuration %j', config => {
    expect(getSliderControlConfig({ ...member, slider: config })).toBeNull();
  });

  it.each([
    { types: ['string'] }, { types: ['number', 'string'] }, { types: ['number[]'] },
    { tokenCategory: 'size' },
  ])('rejects ineligible member %j', override => {
    expect(getSliderControlConfig({ ...member, ...override })).toBeNull();
  });

  const unsafeValues = [undefined, NaN, '66', [66], -1, 101, 66.0000000001];
  it.each(unsafeValues)('rejects unsafe value %j', value => {
    expect(isSliderControlValue(value, slider)).toBe(false);
  });

  it('uses exact decimal normalization and target validation', () => {
    expect(isSliderControlValue(66, slider)).toBe(true);
    const decimals = { min: 0, max: 1, step: 0.1 };
    expect(isSliderControlValue(0.3, decimals)).toBe(true);
    expect(isSliderControlValue(0.30000000000000004, decimals)).toBe(false);
    expect(isSliderControlValue(66, null)).toBe(false);
    expect(isSliderControlValue(66, slider, () => false)).toBe(false);
    expect(isSliderControlValue(66, slider, () => { throw new Error('invalid'); })).toBe(false);
    expect(isSliderControlValue(0.0000003, { min: 0, max: 0.000001, step: 0.0000001 })).toBe(true);
  });
});

const bank = variants();
const infoFor = (name, preset) =>
  buildVariantInfo(components[name], documentation.find(d => d.displayName === name), bank[name], preset);

describe('real variant bank slider declarations', () => {
  const adopted = ['DtAvatar', 'DtPagination', 'DtProgressCircle', 'DtText'];

  it('keeps Avatar variant unset by default', () => {
    const variant = infoFor('DtAvatar', 'default').props.find(p => p.name === 'variant');
    expect(variant.initialValue).toBeUndefined();
  });

  const cases = adopted.flatMap(name => listVariantNames(bank[name])
    .map(preset => {
      const { props } = infoFor(name, preset);
      const members = props.filter(p => p.slider &&
        (preset === 'default' || Object.hasOwn(bank[name][preset].props ?? {}, p.name)));
      return { name, preset, props, members };
    })
    .filter(({ members }) => members.length));
  it.each(cases)('$name $preset has safe effective slider settings', ({ props, members }) => {
    const values = Object.fromEntries(props.map(p => [p.name, p.initialValue ?? p.defaultValue]));
    for (const member of members) {
      const config = getSliderControlConfig(member, values);
      expect(config).not.toBeNull();
      if (member.initialValue == null) {
        expect([null, undefined]).toContain(member.defaultValue);
        expect(member.required).toBeFalsy();
      } else {
        expect(isSliderControlValue(member.initialValue, config, member.validator)).toBe(true);
      }
    }
  });

  it('preserves Pagination zero as a selectable preset outside the odd slider grid', () => {
    const member = infoFor('DtPagination', 'without page numbers').props.find(p => p.name === 'maxVisible');
    expect(member.initialValue).toBe(0);
    expect(getSliderControlConfig(member)).toBeNull();
  });
});

describe('Avatar variant exclusions', () => {
  it('disables Avatar variant when its color effect is absent', () => {
    const rules = bank.DtAvatar.exclusions;
    expect(shouldDisable('variant', 'props', rules, { imageSrc: 'photo.png' }, {})).toBe(true);
    expect(shouldDisable('variant', 'props', rules, {}, { icon: '<dt-icon-user />' })).toBe(true);
  });
});

describe('explicit numeric enum grids', () => {
  const enumMember = { types: ['number'], slider: { min: 0, max: 2, step: 1 }, values: ['2', '0', '1'] };
  it('accepts complete numeric docgen grids in any order', () => {
    expect(getSliderControlConfig(enumMember)).toEqual({ min: 0, max: 2, step: 1, suffix: '' });
  });
  it.each([[['0', '2']], [['0', '1', '1']], [['0', '1', 'other']], [['0', '1', '3']]])(
    'rejects incomplete, duplicate, nonnumeric or out-of-grid values %j', values => {
      expect(getSliderControlConfig({ ...enumMember, values })).toBeNull();
    },
  );
});

describe('prop-dependent slider maximum', () => {
  const member = { types: ['number'], slider: { min: 1, maxProp: 'totalPages', step: 1 } };
  it('keeps the opt-in eligible and resolves current bounds, including a single value', () => {
    expect(getSliderControlConfig(member)).not.toBeNull();
    expect(getSliderControlConfig(member, { totalPages: 25 })).toEqual({ min: 1, max: 25, step: 1, suffix: '' });
    expect(getSliderControlConfig(member, { totalPages: 1 })).toEqual({ min: 1, max: 1, step: 1, suffix: '' });
  });
  it.each([undefined, 0, 2.5, '25'])('rejects unusable runtime maximum %j', totalPages => {
    expect(getSliderControlConfig(member, { totalPages })).toBeNull();
  });
});

describe('Pagination slider ticks', () => {
  const propsFor = name => infoFor('DtPagination', 'default').props.find(p => p.name === name);

  it.each([[10, true], [11, false]])(
    'shows active-page ticks for %s pages: %s', (totalPages, showTicks) => {
      expect(getSliderControlConfig(propsFor('activePage'), { totalPages }).showTicks).toBe(showTicks);
    },
  );
  it('keeps max-visible ticks on its five stops regardless of total pages', () => {
    expect(getSliderControlConfig(propsFor('maxVisible'), { totalPages: 200 }).showTicks).toBe(true);
  });
});
