import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DtText, { resetHeadlineSemanticInfoFlag } from './text.vue';
import {
  TEXT_LINE_CLAMP_CLASS,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_WRAP_MODIFIERS,
  TEXT_TRIM_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
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

    expect(wrapper.classes()).toContain('d-text-headline--lg');
  });

  it('falls back to default size when invalid universal size provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ kind: 'headline', size: 'unknown' });

    expect(wrapper.classes()).toContain('d-text-headline--md');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('size="unknown"'));
  });

  it('throws error when headline-only size used with incompatible kind', () => {
    expect(() => mountComponent({ kind: 'body', size: 'xxxl' }))
      .toThrow('[DtText] size="xxxl" is only valid for kind="headline"');

    expect(() => mountComponent({ kind: 'label', size: 'xxl' }))
      .toThrow('[DtText] size="xxl" is only valid for kind="headline"');

    expect(() => mountComponent({ kind: 'code', size: 'xl' }))
      .toThrow('[DtText] size="xl" is only valid for kind="headline"');
  });

  it('allows headline-only sizes with headline kind', () => {
    const wrapper1 = mountComponent({ kind: 'headline', size: 'xxxl' });
    const wrapper2 = mountComponent({ kind: 'headline', size: 'xxl' });
    const wrapper3 = mountComponent({ kind: 'headline', size: 'xl' });

    expect(wrapper1.classes()).toContain('d-text-headline--xxxl');
    expect(wrapper2.classes()).toContain('d-text-headline--xxl');
    expect(wrapper3.classes()).toContain('d-text-headline--xl');
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

  it('applies tone modifier class', () => {
    const wrapper = mountComponent({ tone: 'primary' });

    expect(wrapper.classes()).toContain('d-fc-primary');
  });

  it('warns when tone is not recognized', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ tone: 'not-real' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported tone'));
    expect(wrapper.classes()).not.toContain('d-fc-not-real');
  });

  it('applies align modifier class when align prop is valid', () => {
    const wrapper = mountComponent({ align: 'center' });

    expect(wrapper.classes()).toContain('d-text--align-center');
  });

  it('warns when align is not recognized', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ align: 'diagonal' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported align "diagonal"'));
    expect(wrapper.classes()).not.toContain('d-text--align-diagonal');
  });

  it('stacks tone, numeric, and maxLines modifiers together', () => {
    const wrapper = mountComponent({ tone: 'success', numeric: true, maxLines: 4 });

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['d-text', 'd-fc-success', TEXT_NUMERIC_CLASS, TEXT_LINE_CLAMP_CLASS]));
    expect(wrapper.attributes('style')).toContain('--dt-text-line-clamp: 4');
  });

  it('removes line clamp class and style when maxLines is cleared', async () => {
    const wrapper = mountComponent({ maxLines: 2 });

    await wrapper.setProps({ maxLines: null });

    expect(wrapper.classes()).not.toContain(TEXT_LINE_CLAMP_CLASS);
    expect(wrapper.attributes('style')).toBeUndefined();
  });

  it('maintains expected classes when mounted onto existing DOM (hydration-style)', () => {
    const mountTarget = document.createElement('div');
    mountTarget.innerHTML = '<span class="d-text"></span>';
    document.body.appendChild(mountTarget);

    const wrapper = mount(DtText, {
      props: { kind: 'headline', size: 'md' },
      slots: { default: slotContent },
      attachTo: mountTarget,
    });

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['d-text', 'd-text-headline--md']));

    wrapper.unmount();
    mountTarget.remove();
  });

  it('applies wrap modifier class when wrap prop is valid', () => {
    const wrapper = mountComponent({ wrap: 'balance' });

    expect(wrapper.classes()).toContain(TEXT_WRAP_MODIFIERS.balance);
  });

  it('applies all wrap modifier classes correctly', () => {
    Object.entries(TEXT_WRAP_MODIFIERS).forEach(([wrapValue, expectedClass]) => {
      const wrapper = mountComponent({ wrap: wrapValue });
      expect(wrapper.classes()).toContain(expectedClass);
    });
  });

  it('warns when wrap is not recognized', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ wrap: 'invalid-wrap' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported wrap "invalid-wrap"'));
    expect(wrapper.classes()).not.toContain('d-text--wrap-invalid-wrap');
  });

  it('applies trim modifier class when trim prop is valid', () => {
    const wrapper = mountComponent({ trim: 'both' });

    expect(wrapper.classes()).toContain(TEXT_TRIM_MODIFIERS.both);
  });

  it('applies all trim modifier classes correctly', () => {
    Object.entries(TEXT_TRIM_MODIFIERS).forEach(([trimValue, expectedClass]) => {
      const wrapper = mountComponent({ trim: trimValue });
      expect(wrapper.classes()).toContain(expectedClass);
    });
  });

  it('warns when trim is not recognized', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ trim: 'invalid-trim' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported trim "invalid-trim"'));
    expect(wrapper.classes()).not.toContain('d-text--trim-invalid-trim');
  });

  it('stacks wrap and trim modifiers with other modifiers', () => {
    const wrapper = mountComponent({
      kind: 'headline',
      size: 'lg',
      wrap: 'balance',
      trim: 'both',
    });

    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'd-text',
      'd-text-headline--lg',
      TEXT_WRAP_MODIFIERS.balance,
      TEXT_TRIM_MODIFIERS.both,
    ]));
  });

  it('has data-qa attribute', () => {
    const wrapper = mountComponent();

    expect(wrapper.attributes('data-qa')).toBe('dt-text');
  });

  describe('semantic heading info', () => {
    beforeEach(() => {
      resetHeadlineSemanticInfoFlag();
    });

    it('emits info when headline kind used without semantic heading element', () => {
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      mountComponent({ kind: 'headline', as: 'span' });

      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('Consider using as="h1|h2|h3|h4|h5|h6"'),
      );
    });

    it('does not emit info when headline kind used with semantic heading element', () => {
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      mountComponent({ kind: 'headline', as: 'h2' });

      expect(infoSpy).not.toHaveBeenCalled();
    });

    it('emits info only once per session', () => {
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      mountComponent({ kind: 'headline', as: 'div' });
      mountComponent({ kind: 'headline', as: 'span' });
      mountComponent({ kind: 'headline', as: 'p' });

      expect(infoSpy).toHaveBeenCalledTimes(1);
    });

    it('does not emit info for non-headline kinds', () => {
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      mountComponent({ kind: 'body' });
      mountComponent({ kind: 'label' });
      mountComponent({ kind: 'code' });

      expect(infoSpy).not.toHaveBeenCalled();
    });
  });

  describe('strength prop', () => {
    it('applies strength modifier class when strength prop is valid', () => {
      const wrapper = mountComponent({ strength: 'bold' });

      expect(wrapper.classes()).toContain(TEXT_STRENGTH_MODIFIERS.bold);
    });

    it('applies all strength modifier classes correctly', () => {
      Object.entries(TEXT_STRENGTH_MODIFIERS).forEach(([strength, expectedClass]) => {
        const wrapper = mountComponent({ strength });

        expect(wrapper.classes()).toContain(expectedClass);
      });
    });

    it('warns when strength is not recognized', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent({ strength: 'invalid-strength' });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported strength "invalid-strength"'));
      expect(wrapper.classes()).not.toContain('d-text--fw-invalid-strength');
    });

    it('does not add strength class when prop is omitted', () => {
      const wrapper = mountComponent({});

      const hasStrengthClass = wrapper.classes().some(c => c.includes('--fw-'));
      expect(hasStrengthClass).toBe(false);
    });

    it('stacks strength with kind/size modifiers', () => {
      const wrapper = mountComponent({
        kind: 'headline',
        size: 'lg',
        strength: 'medium',
      });

      expect(wrapper.classes()).toEqual(expect.arrayContaining([
        'd-text',
        'd-text-headline--lg',
        TEXT_STRENGTH_MODIFIERS.medium,
      ]));
    });
  });

  describe('density prop', () => {
    it('applies density modifier class when density prop is valid', () => {
      const wrapper = mountComponent({ density: 300 });

      expect(wrapper.classes()).toContain(TEXT_DENSITY_MODIFIERS[300]);
    });

    it('applies all density modifier classes correctly', () => {
      Object.entries(TEXT_DENSITY_MODIFIERS).forEach(([density, expectedClass]) => {
        const wrapper = mountComponent({ density });

        expect(wrapper.classes()).toContain(expectedClass);
      });
    });

    it('accepts density as string or number', () => {
      const wrapperNumber = mountComponent({ density: 400 });
      const wrapperString = mountComponent({ density: '400' });

      expect(wrapperNumber.classes()).toContain(TEXT_DENSITY_MODIFIERS[400]);
      expect(wrapperString.classes()).toContain(TEXT_DENSITY_MODIFIERS[400]);
    });

    it('warns when density is not recognized', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent({ density: 999 });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unsupported density "999"'));
      expect(wrapper.classes()).not.toContain('d-text--lh-999');
    });

    it('does not add density class when prop is omitted', () => {
      const wrapper = mountComponent({});

      const hasDensityClass = wrapper.classes().some(c => c.includes('--lh-'));
      expect(hasDensityClass).toBe(false);
    });

    it('stacks density with kind/size modifiers', () => {
      const wrapper = mountComponent({
        kind: 'body',
        size: 'md',
        density: 200,
      });

      expect(wrapper.classes()).toEqual(expect.arrayContaining([
        'd-text',
        'd-text-body--md',
        TEXT_DENSITY_MODIFIERS[200],
      ]));
    });
  });

  describe('strength and density combined', () => {
    it('stacks strength and density with other modifiers', () => {
      const wrapper = mountComponent({
        kind: 'label',
        size: 'sm',
        strength: 'semibold',
        density: 300,
      });

      expect(wrapper.classes()).toEqual(expect.arrayContaining([
        'd-text',
        'd-text-label--sm',
        TEXT_STRENGTH_MODIFIERS.semibold,
        TEXT_DENSITY_MODIFIERS[300],
      ]));
    });
  });
});
