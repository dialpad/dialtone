import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DtBox from './Box.vue';
import {
  DT_BOX_AS_VALUES,
  DT_BOX_INSET_VALUES,
  DT_BOX_INSET_SIDE_VALUES,
  DT_BOX_SURFACE_VALUES,
  DT_BOX_BORDER_COLOR_VALUES,
  DT_BOX_BORDER_WIDTH_VALUES,
  DT_BOX_BORDER_RADIUS_VALUES,
  DT_BOX_SHADOW_VALUES,
  DT_BOX_LAYOUT_VALUES,
  DT_BOX_OVERFLOW_VALUES,
  DT_BOX_POSITION_VALUES,
  DT_BOX_Z_INDEX_VALUES,
} from './BoxConstants.js';

describe('DtBox', () => {
  const slotContent = 'Box content';
  const EXPANDED_LAYOUT_VALUES = DT_BOX_LAYOUT_VALUES.filter((value) => {
    const token = Number(value);
    // Intermediate stops between 100-multiple base stops, such as 125, 350, and 1550.
    return Number.isInteger(token) && token > 100 && token % 100 !== 0;
  });
  let wrapper;

  const mountComponent = (props = {}, attrs = {}, slots = {}) => {
    wrapper = mount(DtBox, {
      props,
      attrs,
      slots: {
        default: slotContent,
        ...slots,
      },
      global: {
        directives: {
          // Vue resolves the directive during render even when the scrollbar branch is not mounted.
          'dt-scrollbar': {},
        },
      },
    });
    return wrapper;
  };

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  // ── Presentation ──────────────────────────────────────────

  it('renders with d-box base class', () => {
    const wrapper = mountComponent();

    expect(wrapper.classes()).toContain('d-box');
  });

  it('renders slot content', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toBe(slotContent);
  });

  it('renders as div by default', () => {
    const wrapper = mountComponent();

    expect(wrapper.element.tagName).toBe('DIV');
  });

  it.each(
    DT_BOX_AS_VALUES.filter(tag => tag !== 'div'),
  )('renders as %s when as="%s"', (tag) => {
    const wrapper = mountComponent({ as: tag });

    expect(wrapper.element.tagName).toBe(tag.toUpperCase());
  });

  it('applies data-qa attribute', () => {
    const wrapper = mountComponent();

    expect(wrapper.attributes('data-qa')).toBe('dt-box');
  });

  // ── Padding ───────────────────────────────────────────────

  it('applies padding modifier class', () => {
    const wrapper = mountComponent({ padding: '200' });

    expect(wrapper.classes()).toContain('d-box--p-200');
  });

  it('applies paddingInline modifier class', () => {
    const wrapper = mountComponent({ paddingInline: '100' });

    expect(wrapper.classes()).toContain('d-box--pi-100');
  });

  it('applies paddingInlineStart modifier class', () => {
    const wrapper = mountComponent({ paddingInlineStart: '50' });

    expect(wrapper.classes()).toContain('d-box--pis-50');
  });

  it('applies paddingInlineEnd modifier class', () => {
    const wrapper = mountComponent({ paddingInlineEnd: '75' });

    expect(wrapper.classes()).toContain('d-box--pie-75');
  });

  it('applies paddingBlock modifier class', () => {
    const wrapper = mountComponent({ paddingBlock: '300' });

    expect(wrapper.classes()).toContain('d-box--pbl-300');
  });

  it('applies paddingBlockStart modifier class', () => {
    const wrapper = mountComponent({ paddingBlockStart: '150' });

    expect(wrapper.classes()).toContain('d-box--pbs-150');
  });

  it('applies paddingBlockEnd modifier class', () => {
    const wrapper = mountComponent({ paddingBlockEnd: '400' });

    expect(wrapper.classes()).toContain('d-box--pbe-400');
  });

  it('applies multiple padding classes simultaneously', () => {
    const wrapper = mountComponent({
      padding: '200',
      paddingInline: '100',
      paddingBlockStart: '0',
    });

    expect(wrapper.classes()).toContain('d-box--p-200');
    expect(wrapper.classes()).toContain('d-box--pi-100');
    expect(wrapper.classes()).toContain('d-box--pbs-0');
  });

  it('does not add padding class when prop is undefined', () => {
    const wrapper = mountComponent();

    const paddingClasses = wrapper.classes().filter(c => c.startsWith('d-box--p'));
    expect(paddingClasses).toHaveLength(0);
  });

  // ── Surface ───────────────────────────────────────────────

  it('applies surface modifier class', () => {
    const wrapper = mountComponent({ surface: 'primary' });

    expect(wrapper.classes()).toContain('d-box--surface-primary');
  });

  it.each(
    DT_BOX_SURFACE_VALUES.filter(v => v !== 'primary'),
  )('applies surface modifier class for %s', (surface) => {
    const wrapper = mountComponent({ surface });

    expect(wrapper.classes()).toContain(`d-box--surface-${surface}`);
  });

  it('does not add surface class when prop is undefined', () => {
    const wrapper = mountComponent();

    const surfaceClasses = wrapper.classes().filter(c => c.startsWith('d-box--surface'));
    expect(surfaceClasses).toHaveLength(0);
  });

  // ── Border color ───────────────────────────────────────────

  it('applies borderColor modifier class', () => {
    const wrapper = mountComponent({ borderColor: 'default' });

    expect(wrapper.classes()).toContain('d-box--bc-default');
  });

  it.each(
    DT_BOX_BORDER_COLOR_VALUES.filter(v => v !== 'default'),
  )('applies borderColor modifier class for %s', (borderColor) => {
    const wrapper = mountComponent({ borderColor });

    expect(wrapper.classes()).toContain(`d-box--bc-${borderColor}`);
  });

  it('applies default borderColor class when prop is not specified', () => {
    const wrapper = mountComponent();

    expect(wrapper.classes()).toContain('d-box--bc-default');
  });

  // ── Border width ──────────────────────────────────────────

  it('applies borderWidth modifier class', () => {
    const wrapper = mountComponent({ borderWidth: '100' });

    expect(wrapper.classes()).toContain('d-box--bw-100');
  });

  it.each(
    DT_BOX_BORDER_WIDTH_VALUES.filter(v => v !== '100'),
  )('applies borderWidth modifier class for %s', (borderWidth) => {
    const wrapper = mountComponent({ borderWidth });

    expect(wrapper.classes()).toContain(`d-box--bw-${borderWidth}`);
  });

  it('does not add borderWidth class when prop is undefined', () => {
    const wrapper = mountComponent();

    const bwClasses = wrapper.classes().filter(c => c.startsWith('d-box--bw'));
    expect(bwClasses).toHaveLength(0);
  });

  // ── Directional border width ──────────────────────────────

  it.each([
    ['borderWidthInline', '100', 'd-box--bwi-100'],
    ['borderWidthInlineStart', '150', 'd-box--bwis-150'],
    ['borderWidthInlineEnd', '200', 'd-box--bwie-200'],
    ['borderWidthBlock', '100', 'd-box--bwbl-100'],
    ['borderWidthBlockStart', '150', 'd-box--bwbs-150'],
    ['borderWidthBlockEnd', '200', 'd-box--bwbe-200'],
  ])('applies %s modifier class', (prop, value, expectedClass) => {
    const wrapper = mountComponent({ [prop]: value });

    expect(wrapper.classes()).toContain(expectedClass);
  });

  // ── Border radius ─────────────────────────────────────────

  it('applies borderRadius modifier class', () => {
    const wrapper = mountComponent({ borderRadius: '200' });

    expect(wrapper.classes()).toContain('d-box--br-200');
  });

  it.each(
    DT_BOX_BORDER_RADIUS_VALUES.filter(v => v !== '200'),
  )('applies borderRadius modifier class for %s', (borderRadius) => {
    const wrapper = mountComponent({ borderRadius });

    expect(wrapper.classes()).toContain(`d-box--br-${borderRadius}`);
  });

  it('does not add borderRadius class when prop is undefined', () => {
    const wrapper = mountComponent();

    const brClasses = wrapper.classes().filter(c => c.startsWith('d-box--br'));
    expect(brClasses).toHaveLength(0);
  });

  // ── Shadow ────────────────────────────────────────────────

  it('applies shadow modifier class', () => {
    const wrapper = mountComponent({ shadow: 'small' });

    expect(wrapper.classes()).toContain('d-box--shadow-small');
  });

  it.each(
    DT_BOX_SHADOW_VALUES.filter(v => v !== 'small'),
  )('applies shadow modifier class for %s', (shadow) => {
    const wrapper = mountComponent({ shadow });

    expect(wrapper.classes()).toContain(`d-box--shadow-${shadow}`);
  });

  it('does not add shadow class when prop is undefined', () => {
    const wrapper = mountComponent();

    const shadowClasses = wrapper.classes().filter(c => c.startsWith('d-box--shadow'));
    expect(shadowClasses).toHaveLength(0);
  });

  // ── Combined V2 props ──────────────────────────────────────

  it('applies multiple border and shadow classes simultaneously', () => {
    const wrapper = mountComponent({
      borderColor: 'subtle',
      borderWidth: '100',
      borderRadius: '300',
      shadow: 'card',
    });

    expect(wrapper.classes()).toContain('d-box--bc-subtle');
    expect(wrapper.classes()).toContain('d-box--bw-100');
    expect(wrapper.classes()).toContain('d-box--br-300');
    expect(wrapper.classes()).toContain('d-box--shadow-card');
  });

  it('applies V1 and V2 props together', () => {
    const wrapper = mountComponent({
      padding: '200',
      surface: 'primary',
      borderColor: 'default',
      borderWidth: '100',
      borderRadius: '400',
      shadow: 'medium',
    });

    expect(wrapper.classes()).toContain('d-box--p-200');
    expect(wrapper.classes()).toContain('d-box--surface-primary');
    expect(wrapper.classes()).toContain('d-box--bc-default');
    expect(wrapper.classes()).toContain('d-box--bw-100');
    expect(wrapper.classes()).toContain('d-box--br-400');
    expect(wrapper.classes()).toContain('d-box--shadow-medium');
  });

  // ── Sizing (layout tokens) ─────────────────────────────────

  it('applies inlineSize modifier class for layout token', () => {
    const wrapper = mountComponent({ inlineSize: '300' });

    expect(wrapper.classes()).toContain('d-box--is-300');
  });

  it('applies blockSize modifier class for layout token', () => {
    const wrapper = mountComponent({ blockSize: '500' });

    expect(wrapper.classes()).toContain('d-box--bls-500');
  });

  it('applies inlineSize modifier class for percent layout token', () => {
    const wrapper = mountComponent({ inlineSize: '100p' });

    expect(wrapper.classes()).toContain('d-box--is-100p');
  });

  it('applies blockSize modifier class for percent layout token', () => {
    const wrapper = mountComponent({ blockSize: '50p' });

    expect(wrapper.classes()).toContain('d-box--bls-50p');
  });

  it('applies maxInlineSize modifier class for layout token', () => {
    const wrapper = mountComponent({ maxInlineSize: '800' });

    expect(wrapper.classes()).toContain('d-box--max-is-800');
  });

  it('applies minBlockSize modifier class for layout token', () => {
    const wrapper = mountComponent({ minBlockSize: '100' });

    expect(wrapper.classes()).toContain('d-box--min-bls-100');
  });

  it('applies minInlineSize modifier class for layout token', () => {
    const wrapper = mountComponent({ minInlineSize: '200' });

    expect(wrapper.classes()).toContain('d-box--min-is-200');
  });

  it('applies maxBlockSize modifier class for layout token', () => {
    const wrapper = mountComponent({ maxBlockSize: '600' });

    expect(wrapper.classes()).toContain('d-box--max-bls-600');
  });

  it.each(EXPANDED_LAYOUT_VALUES)('applies inlineSize class for expanded layout token %s', (value) => {
    const wrapper = mountComponent({ inlineSize: value });

    expect(wrapper.classes()).toContain(`d-box--is-${value}`);
  });

  it.each(EXPANDED_LAYOUT_VALUES)('does not warn for expanded layout token %s', (value) => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mountComponent({ inlineSize: value });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it.each([
    ['inlineSize', '350', 'd-box--is-350'],
    ['blockSize', '650', 'd-box--bls-650'],
    ['minInlineSize', '750', 'd-box--min-is-750'],
    ['maxInlineSize', '350', 'd-box--max-is-350'],
    ['minBlockSize', '650', 'd-box--min-bls-650'],
    ['maxBlockSize', '750', 'd-box--max-bls-750'],
  ])('applies %s modifier class for expanded layout token %s', (prop, value, expectedClass) => {
    const wrapper = mountComponent({ [prop]: value });

    expect(wrapper.classes()).toContain(expectedClass);
  });

  it('warns when layout token is invalid', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mountComponent({ inlineSize: '225' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[DtBox] Invalid prop value: "225"'));
  });

  // ── Positioning ──────────────────────────────────────────

  it.each(DT_BOX_POSITION_VALUES)('applies position modifier class for %s', (position) => {
    const wrapper = mountComponent({ position });

    expect(wrapper.classes()).toContain(`d-box--ps-${position}`);
  });

  it.each([
    ['inset', '0', 'd-box--inset-0'],
    ['inset', 'n50', 'd-box--inset-n50'],
    ['insetBlock', '100', 'd-box--inset-block-100'],
    ['insetInline', 'n150', 'd-box--inset-inline-n150'],
    ['insetBlockStart', '50p', 'd-box--ibs-50p'],
    ['insetBlockEnd', 'n250', 'd-box--ibe-n250'],
    ['insetInlineStart', '300', 'd-box--iis-300'],
    ['insetInlineEnd', 'n100p', 'd-box--iie-n100p'],
  ])('applies %s modifier class for coordinate %s', (prop, value, expectedClass) => {
    const wrapper = mountComponent({ [prop]: value });

    expect(wrapper.classes()).toContain(expectedClass);
  });

  it.each(DT_BOX_INSET_VALUES)('does not warn for shorthand inset coordinate %s', (value) => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mountComponent({ inset: value });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it.each(DT_BOX_INSET_SIDE_VALUES)('does not warn for side-specific inset coordinate %s', (value) => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mountComponent({ insetInlineEnd: value });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it.each([
    ['position', 'unset'],
    ['zIndex', 'unset'],
    ['inset', '50p'],
    ['insetBlock', '100p'],
    ['insetInline', 'n50p'],
    ['insetBlockStart', '100p-calc'],
  ])('warns when %s receives invalid value %s', (prop, value) => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mountComponent({ [prop]: value });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining(`[DtBox] Invalid prop value: "${value}"`));
  });

  it.each(DT_BOX_Z_INDEX_VALUES)('applies zIndex modifier class for %s', (zIndex) => {
    const wrapper = mountComponent({ zIndex });

    expect(wrapper.classes()).toContain(`d-box--zi-${zIndex}`);
  });

  it('applies multiple positioning classes simultaneously', () => {
    const wrapper = mountComponent({
      position: 'sticky',
      insetBlockStart: '0',
      zIndex: 'navigation',
    });

    expect(wrapper.classes()).toContain('d-box--ps-sticky');
    expect(wrapper.classes()).toContain('d-box--ibs-0');
    expect(wrapper.classes()).toContain('d-box--zi-navigation');
  });

  it('does not add positioning classes when props are undefined', () => {
    const wrapper = mountComponent();

    const prefixes = ['d-box--ps', 'd-box--inset', 'd-box--ib', 'd-box--ii', 'd-box--zi'];
    const positioningClasses = wrapper.classes().filter(c => prefixes.some(p => c.startsWith(p)));
    expect(positioningClasses).toHaveLength(0);
  });

  // ── Overflow ──────────────────────────────────────────────

  it('applies overflow modifier class', () => {
    const wrapper = mountComponent({ overflow: 'hidden' });

    expect(wrapper.classes()).toContain('d-box--of-hidden');
  });

  it.each(
    DT_BOX_OVERFLOW_VALUES.filter(v => v !== 'hidden'),
  )('applies overflow modifier class for %s', (overflow) => {
    const wrapper = mountComponent({ overflow });

    expect(wrapper.classes()).toContain(`d-box--of-${overflow}`);
  });

  it('does not add overflow class when prop is undefined', () => {
    const wrapper = mountComponent();

    const ofClasses = wrapper.classes().filter(c => c.startsWith('d-box--of'));
    expect(ofClasses).toHaveLength(0);
  });

  // ── Scrollbar ──────────────────────────────────────────────

  it('renders scrollbar viewport wrapper when scrollbar prop is set', () => {
    const wrapper = mountComponent({ scrollbar: 'always' });

    expect(wrapper.find('[data-qa="dt-box-scrollbar-content"]').exists()).toBe(true);
  });

  it('does not render scrollbar wrapper when scrollbar prop is undefined', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-qa="dt-box-scrollbar-content"]').exists()).toBe(false);
  });

  it('renders scrollbar wrapper when scrollbar is true', () => {
    const wrapper = mountComponent({ scrollbar: true });

    expect(wrapper.find('[data-qa="dt-box-scrollbar-content"]').exists()).toBe(true);
  });

  it('renders slot content inside scrollbar wrapper', () => {
    const wrapper = mountComponent({ scrollbar: 'leave' });

    expect(wrapper.find('[data-qa="dt-box-scrollbar-content"]').text()).toBe(slotContent);
  });

  // ── Attrs passthrough ─────────────────────────────────────

  it('passes class attr through to root element', () => {
    const wrapper = mountComponent({}, { class: 'd-ps-sticky d-t-0' });

    expect(wrapper.classes()).toContain('d-ps-sticky');
    expect(wrapper.classes()).toContain('d-t-0');
  });

  it('passes id attr through to root element', () => {
    const wrapper = mountComponent({}, { id: 'my-box' });

    expect(wrapper.attributes('id')).toBe('my-box');
  });

  it('passes aria attrs through to root element', () => {
    const wrapper = mountComponent({}, { 'aria-label': 'Navigation' });

    expect(wrapper.attributes('aria-label')).toBe('Navigation');
  });
});
