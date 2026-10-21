import * as components from '@dialpad/dialtone-vue';
import documentation from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import variants from '@/src/variants/variants';
import { getSliderControlConfig, isSliderControlValue } from './slider_control';
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
    { min: 0, max: 0, step: 1 }, { min: 2, max: 1, step: 1 },
    { min: 0, max: Infinity, step: 1 }, { min: -Number.MAX_VALUE, max: Number.MAX_VALUE, step: 1 },
    { min: 0, max: 100, step: 0 }, { min: 0, max: 100, step: -1 },
    { min: 0, max: 100, step: 101 }, { min: 0, max: 100, step: NaN },
    { min: 0, max: 1, step: 0.3 }, { min: 0, max: 1, step: 1, suffix: 2 },
    { min: '0', max: 100, step: 1 }, null,
  ])('rejects malformed configuration %j', config => {
    expect(getSliderControlConfig({ ...member, slider: config })).toBeNull();
  });

  it.each([
    { types: ['string'] }, { types: ['number', 'string'] }, { types: ['number[]'] },
    { values: [0, 1] }, { tokenCategory: 'size' },
  ])('rejects ineligible member %j', override => {
    expect(getSliderControlConfig({ ...member, ...override })).toBeNull();
  });

  const unsafeValues = [undefined, null, NaN, Infinity, '66', [66], -1, 101, 66.5, 66.0000000001];
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

describe('real variant bank slider declarations', () => {
  const bank = variants();

  it('opts in only ProgressCircle progress', () => {
    const declarations = Object.entries(bank).flatMap(([name, componentVariants]) =>
      Object.values(componentVariants).flatMap(variant =>
        Object.entries(variant.props ?? {})
          .filter(([, metadata]) => metadata.slider)
          .map(([prop]) => `${name}.${prop}`)));
    expect([...new Set(declarations)]).toEqual(['DtProgressCircle.progress']);
  });

  it.each(listVariantNames(bank.DtProgressCircle))('accepts the %s preset initial value', preset => {
    const doc = documentation.find(d => d.displayName === 'DtProgressCircle');
    const info = buildVariantInfo(components.DtProgressCircle, doc, bank.DtProgressCircle, preset);
    const member = info.props.find(p => p.name === 'progress');
    const config = getSliderControlConfig(member);
    expect(config).not.toBeNull();
    expect(isSliderControlValue(member.initialValue, config, member.validator)).toBe(true);
  });
});
