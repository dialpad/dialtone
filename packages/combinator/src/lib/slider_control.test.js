import { getSliderControlConfig, isSliderControlValue } from './slider_control';
import pagination from '@/src/variants/variants_pagination';

const slider = { min: 0, max: 100, step: 1, suffix: '%' };
const member = { types: ['number'], slider };

describe('slider control', () => {
  it('requires explicit scalar-number opt-in without token metadata', () => {
    expect(getSliderControlConfig(member)).toEqual(slider);
    expect(getSliderControlConfig({ types: ['number'] })).toBeNull();
    expect(getSliderControlConfig({ ...member, types: ['number', 'string'] })).toBeNull();
    expect(getSliderControlConfig({ ...member, tokenCategory: 'size' })).toBeNull();
  });

  it('rejects unusable bounds and steps', () => {
    for (const config of [
      { min: 0, max: 0, step: 1 },
      { min: 0, max: Infinity, step: 1 },
      { min: 0, max: 100, step: 0 },
      { min: 0, max: 1, step: 0.3 },
    ]) expect(getSliderControlConfig({ ...member, slider: config })).toBeNull();
  });

  it('accepts only finite, in-range values exactly on the grid', () => {
    expect(isSliderControlValue(66, slider)).toBe(true);
    for (const value of [undefined, '66', NaN, -1, 101, 66.5, 66.0000000001]) {
      expect(isSliderControlValue(value, slider)).toBe(false);
    }
  });

  it('preserves exact decimal values and honors the target validator', () => {
    const decimals = { min: 0, max: 1, step: 0.1 };
    expect(isSliderControlValue(0.3, decimals)).toBe(true);
    expect(isSliderControlValue(0.30000000000000004, decimals)).toBe(false);
    expect(isSliderControlValue(66, slider, () => false)).toBe(false);
  });

  it('admits numeric enums only when they cover the complete grid', () => {
    const enumMember = { types: ['number'], slider: { min: 0, max: 2, step: 1 } };
    expect(getSliderControlConfig({ ...enumMember, values: ['2', '0', '1'] })).not.toBeNull();
    expect(getSliderControlConfig({ ...enumMember, values: ['0', '2'] })).toBeNull();
    expect(getSliderControlConfig({ ...enumMember, values: ['0', '1', '1'] })).toBeNull();
  });

  it('resolves dependent bounds without losing opt-in eligibility for invalid totals', () => {
    const member = { types: ['number'], slider: pagination.defaults.props.activePage.slider };
    expect(getSliderControlConfig(member)).not.toBeNull();
    expect(getSliderControlConfig(member, { totalPages: 25 }).max).toBe(25);
    expect(getSliderControlConfig(member, { totalPages: 1 }).max).toBe(1);
    expect(getSliderControlConfig(member, { totalPages: 0 })).toBeNull();
  });

  it('shows opted-in ticks only for grids of at most ten stops', () => {
    const page = { types: ['number'], slider: pagination.defaults.props.activePage.slider };
    const visible = { types: ['number'], slider: pagination.defaults.props.maxVisible.slider };
    expect(getSliderControlConfig(page, { totalPages: 10 }).showTicks).toBe(true);
    expect(getSliderControlConfig(page, { totalPages: 11 }).showTicks).toBe(false);
    expect(getSliderControlConfig(visible, { totalPages: 200 }).showTicks).toBe(true);
    expect(getSliderControlConfig({
      types: ['number'], slider: { min: 0, max: 2.7, step: 0.3, showTicks: true },
    }).showTicks).toBe(true);
  });

  it('keeps the zero-page-number preset outside the max-visible slider', () => {
    const { initialValue, slider } = pagination['without page numbers'].props.maxVisible;
    expect(initialValue).toBe(0);
    expect(getSliderControlConfig({ types: ['number'], slider })).toBeNull();
  });
});
