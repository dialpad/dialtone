import { mount } from '@vue/test-utils';
import DtBox from './box.vue';
import {
  DT_BOX_AS_VALUES,
  DT_BOX_SPACING_VALUES,
  DT_BOX_SURFACE_VALUES,
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
