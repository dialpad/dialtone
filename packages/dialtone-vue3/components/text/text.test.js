import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DtText from './text.vue';
import {
  TEXT_LINE_CLAMP_CLASS,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
} from './text_constants';

describe('DtText', () => {
  const slotContent = 'Sample text';

  const mountComponent = (props = {}, slots = {}) => {
    return mount(DtText, {
      props,
      slots: {
        default: slotContent,
        ...slots,
      },
    });
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the component root', () => {
    const wrapper = mountComponent();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('d-text');
    expect(wrapper.text()).toBe(slotContent);
  });

  it('applies typography modifier class for kind and size', () => {
    const wrapper = mountComponent({ kind: 'headline', size: 'lg' });

    expect(wrapper.classes()).toContain('d-headline--lg');
  });

  it('falls back to default size when invalid size provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ kind: 'headline', size: 'unknown' });

    expect(wrapper.classes()).toContain('d-headline--md');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('size="unknown"'));
  });

  it('applies truncate class when truncate prop is true', () => {
    const wrapper = mountComponent({ truncate: true });

    expect(wrapper.classes()).toContain(TEXT_TRUNCATE_CLASS);
  });

  it('applies numeric class when numeric prop is true', () => {
    const wrapper = mountComponent({ numeric: true });

    expect(wrapper.classes()).toContain(TEXT_NUMERIC_CLASS);
  });

  it('applies line clamp class and style when maxLines is provided', () => {
    const wrapper = mountComponent({ maxLines: 3 });

    expect(wrapper.classes()).toContain(TEXT_LINE_CLAMP_CLASS);
    expect(wrapper.attributes('style')).toContain('--dt-text-line-clamp: 3');
  });

  it('renders text prop when slot is not provided', () => {
    const wrapper = mount(DtText, {
      props: {
        text: 'Prop driven text',
      },
    });

    expect(wrapper.text()).toBe('Prop driven text');
  });

  it('applies color modifier class', () => {
    const wrapper = mountComponent({ color: 'primary' });

    expect(wrapper.classes()).toContain('d-fc-primary');
  });
});
