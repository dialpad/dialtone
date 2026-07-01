import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DtText, { resetHeadlineSemanticInfoFlag } from './Text.vue';
import {
  TEXT_LINE_CLAMP_CLASS,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_TONE_MODIFIERS,
  TEXT_WRAP_MODIFIERS,
  TEXT_BOX_TRIM_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
  TEXT_FONT_SIZE_MODIFIERS,
  TEXT_FAMILY_MODIFIERS,
  TEXT_ITALIC_CLASS,
} from './TextConstants';

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

  it('renders with d-text base class', () => {
    const wrapper = mountComponent();

    expect(wrapper.classes()).toContain('d-text');
  });

  it('does not apply a typography variant by default', () => {
    const wrapper = mountComponent();

    expect(wrapper.classes()).not.toContain('d-text-body--md');
  });

  it('renders slot content', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toBe(slotContent);
  });

  it('applies typography modifier class for kind and size', () => {
    const wrapper = mountComponent({ kind: 'headline', size: 'lg' });

    expect(wrapper.classes()).toContain('d-text-headline--lg');
  });

  it('preserves legacy kind composition when variant is omitted', () => {
    const wrapper = mountComponent({ kind: 'headline', size: 'lg' });

    expect(wrapper.classes()).toContain('d-text-headline--lg');
    expect(wrapper.classes()).not.toContain('d-text-body--md');
  });

  it('falls back to default size when invalid universal size provided', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ kind: 'headline', size: 'unknown' });

    expect(wrapper.classes()).toContain('d-text-headline--md');
  });

  it('warns when invalid universal size provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mountComponent({ kind: 'headline', size: 'unknown' });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('size="unknown"'),
    );
  });

  it.each([
    ['body', '3xl'],
    ['label', '2xl'],
    ['code', 'xl'],
  ])(
    'throws error for kind="%s" with headline-only size="%s"',
    (kind, size) => {
      expect(() => mountComponent({ kind, size })).toThrow(
        `[DtText] size="${size}" is only valid for kind="headline"`,
      );
    },
  );

  it('allows headline-only sizes with headline kind', () => {
    const wrapper = mountComponent({ kind: 'headline', size: '3xl' });

    expect(wrapper.classes()).toContain('d-text-headline--3xl');
  });

  describe('When size is numeric', () => {
    it('keeps legacy composition mapping when kind is set', () => {
      const wrapper = mountComponent({ kind: 'body', size: 200 });

      expect(wrapper.classes()).toContain('d-text-body--sm');
    });

    it('does not add raw font-size class for legacy kind and size', () => {
      const wrapper = mountComponent({ kind: 'body', size: 200 });

      expect(wrapper.classes()).not.toContain(TEXT_FONT_SIZE_MODIFIERS[200]);
    });

    it('warns when size is set without kind or variant', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountComponent({ size: 300 });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'size must be paired with variant or legacy kind',
        ),
      );
    });

    it('does not apply raw font-size class when size is set without kind or variant', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent({ size: 300 });

      expect(wrapper.classes()).not.toContain(TEXT_FONT_SIZE_MODIFIERS[300]);
    });

    it('applies the raw font-size class for 125', () => {
      const wrapper = mountComponent({ variant: 'body-md', size: 125 });

      expect(wrapper.classes()).toContain(TEXT_FONT_SIZE_MODIFIERS[125]);
    });

    it('applies the raw font-size class for extended sizes', () => {
      const wrapper = mountComponent({ variant: 'body-md', size: 800 });

      expect(wrapper.classes()).toContain(TEXT_FONT_SIZE_MODIFIERS[800]);
    });
  });

  describe('variant prop', () => {
    it('applies typography composition class for variant', () => {
      const wrapper = mountComponent({ variant: 'body-lg' });

      expect(wrapper.classes()).toContain('d-text-body--lg');
    });

    it('applies raw size override class with variant', () => {
      const wrapper = mountComponent({ variant: 'body-lg', size: 300 });

      expect(wrapper.classes()).toEqual(
        expect.arrayContaining([
          'd-text-body--lg',
          TEXT_FONT_SIZE_MODIFIERS[300],
        ]),
      );
    });

    it('ignores kind when variant is set', () => {
      const wrapper = mountComponent({ kind: 'headline', variant: 'body-md' });

      expect(wrapper.classes()).toContain('d-text-body--md');
      expect(wrapper.classes()).not.toContain('d-text-headline--md');
    });

    it('warns for t-shirt size with variant', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountComponent({ variant: 'body-md', size: 'lg' });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported size "lg"'),
      );
    });

    it('does not apply raw font-size class for t-shirt size with variant', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent({ variant: 'body-md', size: 'lg' });

      expect(wrapper.classes()).not.toContain('d-text--fs-lg');
    });
  });

  it('applies truncate class when truncate prop is true', () => {
    const wrapper = mountComponent({ truncate: true });

    expect(wrapper.classes()).toContain(TEXT_TRUNCATE_CLASS);
  });

  it('applies numeric class when numeric prop is true', () => {
    const wrapper = mountComponent({ numeric: true });

    expect(wrapper.classes()).toContain(TEXT_NUMERIC_CLASS);
  });

  it('applies line clamp class when maxLines is provided', () => {
    const wrapper = mountComponent({ maxLines: 3 });

    expect(wrapper.classes()).toContain(TEXT_LINE_CLAMP_CLASS);
  });

  it('applies line clamp style when maxLines is provided', () => {
    const wrapper = mountComponent({ maxLines: 3 });

    expect(wrapper.attributes('style')).toContain('--dt-text-line-clamp: 3');
  });

  it('applies tone modifier class', () => {
    const wrapper = mountComponent({ tone: 'primary' });

    expect(wrapper.classes()).toContain(TEXT_TONE_MODIFIERS.primary);
  });

  it('applies positive tone modifier class', () => {
    const wrapper = mountComponent({ tone: 'positive' });

    expect(wrapper.classes()).toContain(TEXT_TONE_MODIFIERS.positive);
  });

  it('warns and does not apply class for unrecognized tone', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ tone: 'not-real' });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported tone'),
    );
    expect(wrapper.classes()).not.toContain('d-text--tone-not-real');
  });

  it('applies align modifier class when align prop is valid', () => {
    const wrapper = mountComponent({ align: 'center' });

    expect(wrapper.classes()).toContain('d-text--align-center');
  });

  it('warns and does not apply class for unrecognized align', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ align: 'diagonal' });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported align "diagonal"'),
    );
    expect(wrapper.classes()).not.toContain('d-text--align-diagonal');
  });

  it('composes all modifier classes additively', () => {
    const wrapper = mountComponent({
      kind: 'headline',
      size: 'lg',
      strength: 'semibold',
      density: 300,
      tone: 'primary',
      align: 'center',
      wrap: 'balance',
      textBoxTrim: 'both',
      truncate: true,
      numeric: true,
      maxLines: 3,
      family: 'mono',
      italic: true,
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'd-text',
        'd-text-headline--lg',
        TEXT_STRENGTH_MODIFIERS.semibold,
        TEXT_DENSITY_MODIFIERS[300],
        TEXT_TONE_MODIFIERS.primary,
        'd-text--align-center',
        TEXT_WRAP_MODIFIERS.balance,
        TEXT_BOX_TRIM_MODIFIERS.both,
        TEXT_FAMILY_MODIFIERS.mono,
        TEXT_ITALIC_CLASS,
        TEXT_TRUNCATE_CLASS,
        TEXT_NUMERIC_CLASS,
        TEXT_LINE_CLAMP_CLASS,
      ]),
    );
  });

  it('removes line clamp class when maxLines is cleared', async () => {
    const wrapper = mountComponent({ maxLines: 2 });

    await wrapper.setProps({ maxLines: null });

    expect(wrapper.classes()).not.toContain(TEXT_LINE_CLAMP_CLASS);
  });

  it('removes line clamp style when maxLines is cleared', async () => {
    const wrapper = mountComponent({ maxLines: 2 });

    await wrapper.setProps({ maxLines: null });

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

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['d-text', 'd-text-headline--md']),
    );

    wrapper.unmount();
    mountTarget.remove();
  });

  it('applies wrap modifier class', () => {
    const wrapper = mountComponent({ wrap: 'balance' });

    expect(wrapper.classes()).toContain(TEXT_WRAP_MODIFIERS.balance);
  });

  it('warns and does not apply class for unrecognized wrap', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ wrap: 'invalid-wrap' });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported wrap "invalid-wrap"'),
    );
    expect(wrapper.classes()).not.toContain('d-text--wrap-invalid-wrap');
  });

  it('applies textBoxTrim modifier class', () => {
    const wrapper = mountComponent({ textBoxTrim: 'both' });

    expect(wrapper.classes()).toContain(TEXT_BOX_TRIM_MODIFIERS.both);
  });

  it('warns and does not apply class for unrecognized textBoxTrim', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ textBoxTrim: 'invalid' });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported textBoxTrim "invalid"'),
    );
    expect(wrapper.classes()).not.toContain('d-text--trim-invalid');
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

    it('emits info when headline variant used without semantic heading element', () => {
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      mountComponent({ variant: 'headline-md', as: 'span' });

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
    it('applies strength modifier class', () => {
      const wrapper = mountComponent({ strength: 'bold' });

      expect(wrapper.classes()).toContain(TEXT_STRENGTH_MODIFIERS.bold);
    });

    it('warns for unrecognized strength', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountComponent({ strength: 'invalid-strength' });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported strength "invalid-strength"'),
      );
    });

    it('does not apply class for unrecognized strength', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent({ strength: 'invalid-strength' });

      expect(wrapper.classes()).not.toContain('d-text--fw-invalid-strength');
    });

    it('does not add strength class when prop is omitted', () => {
      const wrapper = mountComponent({});

      const hasStrengthClass = wrapper
        .classes()
        .some((c) => c.includes('--fw-'));
      expect(hasStrengthClass).toBe(false);
    });
  });

  describe('density prop', () => {
    it('applies density modifier class', () => {
      const wrapper = mountComponent({ density: 300 });

      expect(wrapper.classes()).toContain(TEXT_DENSITY_MODIFIERS[300]);
    });

    it.each([400, '400'])('accepts density %s', (density) => {
      const wrapper = mountComponent({ density });

      expect(wrapper.classes()).toContain(TEXT_DENSITY_MODIFIERS[400]);
    });

    it('warns for unrecognized density', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountComponent({ density: 999 });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported density "999"'),
      );
    });

    it('does not apply class for unrecognized density', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent({ density: 999 });

      expect(wrapper.classes()).not.toContain('d-text--lh-999');
    });

    it('does not add density class when prop is omitted', () => {
      const wrapper = mountComponent({});

      const hasDensityClass = wrapper
        .classes()
        .some((c) => c.includes('--lh-'));
      expect(hasDensityClass).toBe(false);
    });
  });

  describe('family prop', () => {
    it('applies family modifier class', () => {
      const wrapper = mountComponent({ family: 'mono' });

      expect(wrapper.classes()).toContain(TEXT_FAMILY_MODIFIERS.mono);
    });

    it('applies inherited family modifier class', () => {
      const wrapper = mountComponent({ family: 'inherit' });

      expect(wrapper.classes()).toContain(TEXT_FAMILY_MODIFIERS.inherit);
    });

    it('warns for unrecognized family', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountComponent({ family: 'invalid-family' });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported family "invalid-family"'),
      );
    });

    it('does not apply class for unrecognized family', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent({ family: 'invalid-family' });

      expect(wrapper.classes()).not.toContain('d-text--ff-invalid-family');
    });
  });

  describe('italic prop', () => {
    it('applies italic modifier class when true', () => {
      const wrapper = mountComponent({ italic: true });

      expect(wrapper.classes()).toContain(TEXT_ITALIC_CLASS);
    });

    it('does not apply italic modifier class by default', () => {
      const wrapper = mountComponent();

      expect(wrapper.classes()).not.toContain(TEXT_ITALIC_CLASS);
    });
  });
});
