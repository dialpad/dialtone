import { mount } from '@vue/test-utils';
import DtBox from './box.vue';
import {
  DT_BOX_AS_VALUES,
} from './box_constants.js';

describe('DtBox', () => {
  const slotContent = 'Box content';

  const mountComponent = (props = {}, attrs = {}, slots = {}) => {
    return mount(DtBox, {
      props,
      attrs,
      slots: {
        default: slotContent,
        ...slots,
      },
    });
  };

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

  it.each([
    'secondary', 'moderate', 'bold', 'strong', 'contrast',
    'brand', 'info', 'success', 'warning', 'critical',
    'brand-subtle', 'brand-strong',
    'primary-opaque', 'brand-subtle-opaque',
  ])('applies surface modifier class for %s', (surface) => {
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

  it.each([
    'subtle', 'moderate', 'bold', 'accent', 'focus',
    'brand', 'info', 'success', 'warning', 'critical',
    'brand-subtle', 'brand-strong',
  ])('applies borderColor modifier class for %s', (borderColor) => {
    const wrapper = mountComponent({ borderColor });

    expect(wrapper.classes()).toContain(`d-box--bc-${borderColor}`);
  });

  it('does not add borderColor class when prop is undefined', () => {
    const wrapper = mountComponent();

    const bcClasses = wrapper.classes().filter(c => c.startsWith('d-box--bc'));
    expect(bcClasses).toHaveLength(0);
  });

  // ── Border width ──────────────────────────────────────────

  it('applies borderWidth modifier class', () => {
    const wrapper = mountComponent({ borderWidth: '100' });

    expect(wrapper.classes()).toContain('d-box--bw-100');
  });

  it.each(['0', '50', '150', '200', '300', '400'])('applies borderWidth modifier class for %s', (borderWidth) => {
    const wrapper = mountComponent({ borderWidth });

    expect(wrapper.classes()).toContain(`d-box--bw-${borderWidth}`);
  });

  it('does not add borderWidth class when prop is undefined', () => {
    const wrapper = mountComponent();

    const bwClasses = wrapper.classes().filter(c => c.startsWith('d-box--bw'));
    expect(bwClasses).toHaveLength(0);
  });

  // ── Border radius ─────────────────────────────────────────

  it('applies borderRadius modifier class', () => {
    const wrapper = mountComponent({ borderRadius: '200' });

    expect(wrapper.classes()).toContain('d-box--br-200');
  });

  it.each(['0', '300', '500', 'pill', 'circle'])('applies borderRadius modifier class for %s', (borderRadius) => {
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

  it.each(['medium', 'large', 'extra-large', 'card'])('applies shadow modifier class for %s', (shadow) => {
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

  it('applies maxInlineSize modifier class for layout token', () => {
    const wrapper = mountComponent({ maxInlineSize: '800' });

    expect(wrapper.classes()).toContain('d-box--max-is-800');
  });

  it('applies minBlockSize modifier class for layout token', () => {
    const wrapper = mountComponent({ minBlockSize: '100' });

    expect(wrapper.classes()).toContain('d-box--min-bls-100');
  });

  // ── Sizing (raw CSS fallback) ─────────────────────────────

  it('applies raw CSS inline-size via inline style', () => {
    const wrapper = mountComponent({ inlineSize: '480px' });

    expect(wrapper.attributes('style')).toContain('inline-size: 480px');
    expect(wrapper.classes()).not.toContain('d-box--is-480px');
  });

  it('applies raw CSS max-inline-size via inline style', () => {
    const wrapper = mountComponent({ maxInlineSize: 'calc(100% - 2rem)' });

    expect(wrapper.attributes('style')).toContain('max-inline-size: calc(100% - 2rem)');
  });

  it('does not add inline style when sizing uses layout token', () => {
    const wrapper = mountComponent({ inlineSize: '300' });

    expect(wrapper.attributes('style')).toBeUndefined();
  });

  // ── Overflow ──────────────────────────────────────────────

  it('applies overflow modifier class', () => {
    const wrapper = mountComponent({ overflow: 'hidden' });

    expect(wrapper.classes()).toContain('d-box--of-hidden');
  });

  it.each(['scroll', 'auto', 'clip', 'visible'])('applies overflow modifier class for %s', (overflow) => {
    const wrapper = mountComponent({ overflow });

    expect(wrapper.classes()).toContain(`d-box--of-${overflow}`);
  });

  it('does not add overflow class when prop is undefined', () => {
    const wrapper = mountComponent();

    const ofClasses = wrapper.classes().filter(c => c.startsWith('d-box--of'));
    expect(ofClasses).toHaveLength(0);
  });

  // ── Attrs passthrough ─────────────────────────────────────

  it('passes class attr through to root element', () => {
    const wrapper = mountComponent({}, { class: 'd-ps-sticky d-t0' });

    expect(wrapper.classes()).toContain('d-ps-sticky');
    expect(wrapper.classes()).toContain('d-t0');
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
