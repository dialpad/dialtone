import type { ElementType } from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DtText, resetHeadlineSemanticInfoFlag, type DtTextProps } from './Text';
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

// The tests vary `as` at runtime, so they use the widest props type.
type AnyTextProps = DtTextProps<ElementType>;

// The Vue tests pass unsupported values on purpose, which DtTextProps' literal unions would reject.
const unsupported = (props: Record<string, unknown>) => props as AnyTextProps;

describe('DtText', () => {
  const slotContent = 'Sample text';

  const mountComponent = (props: AnyTextProps = {}) => {
    const { rerender } = render(<DtText {...props}>{slotContent}</DtText>);
    return {
      element: () => screen.getByText(slotContent),
      setProps: (next: AnyTextProps) => rerender(<DtText {...props} {...next}>{slotContent}</DtText>),
    };
  };

  const classesOf = (element: HTMLElement) => [...element.classList];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with d-text base class', () => {
    const wrapper = mountComponent();

    expect(wrapper.element()).toHaveClass('d-text');
  });

  it('does not apply a typography variant by default', () => {
    const wrapper = mountComponent();

    expect(wrapper.element()).not.toHaveClass('d-text-body--md');
  });

  it('renders slot content', () => {
    const wrapper = mountComponent();

    expect(wrapper.element().textContent).toBe(slotContent);
  });

  it('applies typography modifier class for kind and size', () => {
    const wrapper = mountComponent({ kind: 'headline', size: 'lg' });

    expect(wrapper.element()).toHaveClass('d-text-headline--lg');
  });

  it('preserves legacy kind composition when variant is omitted', () => {
    const wrapper = mountComponent({ kind: 'headline', size: 'lg' });

    expect(wrapper.element()).toHaveClass('d-text-headline--lg');
    expect(wrapper.element()).not.toHaveClass('d-text-body--md');
  });

  it('falls back to default size when invalid universal size provided', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent({ kind: 'headline', size: 'unknown' });

    expect(wrapper.element()).toHaveClass('d-text-headline--md');
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
  ] as const)(
    'throws error for kind="%s" with headline-only size="%s"',
    (kind, size) => {
      expect(() => mountComponent({ kind, size })).toThrow(
        `[DtText] size="${size}" is only valid for kind="headline"`,
      );
    },
  );

  it('allows headline-only sizes with headline kind', () => {
    const wrapper = mountComponent({ kind: 'headline', size: '3xl' });

    expect(wrapper.element()).toHaveClass('d-text-headline--3xl');
  });

  describe('When size is numeric', () => {
    it('keeps legacy composition mapping when kind is set', () => {
      const wrapper = mountComponent({ kind: 'body', size: 200 });

      expect(wrapper.element()).toHaveClass('d-text-body--sm');
    });

    it('does not add raw font-size class for legacy kind and size', () => {
      const wrapper = mountComponent({ kind: 'body', size: 200 });

      expect(wrapper.element()).not.toHaveClass(TEXT_FONT_SIZE_MODIFIERS[200]);
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

      expect(wrapper.element()).not.toHaveClass(TEXT_FONT_SIZE_MODIFIERS[300]);
    });

    it('applies the raw font-size class for 125', () => {
      const wrapper = mountComponent({ variant: 'body-md', size: 125 });

      expect(wrapper.element()).toHaveClass(TEXT_FONT_SIZE_MODIFIERS[125]);
    });

    it('applies the raw font-size class for extended sizes', () => {
      const wrapper = mountComponent({ variant: 'body-md', size: 800 });

      expect(wrapper.element()).toHaveClass(TEXT_FONT_SIZE_MODIFIERS[800]);
    });
  });

  describe('variant prop', () => {
    it('applies typography composition class for variant', () => {
      const wrapper = mountComponent({ variant: 'body-lg' });

      expect(wrapper.element()).toHaveClass('d-text-body--lg');
    });

    it('applies raw size override class with variant', () => {
      const wrapper = mountComponent({ variant: 'body-lg', size: 300 });

      expect(wrapper.element()).toHaveClass('d-text-body--lg', TEXT_FONT_SIZE_MODIFIERS[300]);
    });

    it('ignores kind when variant is set', () => {
      const wrapper = mountComponent({ kind: 'headline', variant: 'body-md' });

      expect(wrapper.element()).toHaveClass('d-text-body--md');
      expect(wrapper.element()).not.toHaveClass('d-text-headline--md');
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

      expect(wrapper.element()).not.toHaveClass('d-text--fs-lg');
    });
  });

  it('applies truncate class when truncate prop is true', () => {
    const wrapper = mountComponent({ truncate: true });

    expect(wrapper.element()).toHaveClass(TEXT_TRUNCATE_CLASS);
  });

  it('applies numeric class when numeric prop is true', () => {
    const wrapper = mountComponent({ numeric: true });

    expect(wrapper.element()).toHaveClass(TEXT_NUMERIC_CLASS);
  });

  it('applies line clamp class when maxLines is provided', () => {
    const wrapper = mountComponent({ maxLines: 3 });

    expect(wrapper.element()).toHaveClass(TEXT_LINE_CLAMP_CLASS);
  });

  it('applies line clamp style when maxLines is provided', () => {
    const wrapper = mountComponent({ maxLines: 3 });

    expect(wrapper.element().getAttribute('style')).toContain('--dt-text-line-clamp: 3');
  });

  it('applies tone modifier class', () => {
    const wrapper = mountComponent({ tone: 'primary' });

    expect(wrapper.element()).toHaveClass(TEXT_TONE_MODIFIERS.primary);
  });

  it('applies positive tone modifier class', () => {
    const wrapper = mountComponent({ tone: 'positive' });

    expect(wrapper.element()).toHaveClass(TEXT_TONE_MODIFIERS.positive);
  });

  it('warns and does not apply class for unrecognized tone', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent(unsupported({ tone: 'not-real' }));

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported tone'),
    );
    expect(wrapper.element()).not.toHaveClass('d-text--tone-not-real');
  });

  it('applies align modifier class when align prop is valid', () => {
    const wrapper = mountComponent({ align: 'center' });

    expect(wrapper.element()).toHaveClass('d-text--align-center');
  });

  it('warns and does not apply class for unrecognized align', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent(unsupported({ align: 'diagonal' }));

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported align "diagonal"'),
    );
    expect(wrapper.element()).not.toHaveClass('d-text--align-diagonal');
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

    expect(wrapper.element()).toHaveClass(
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
    );
  });

  it('removes line clamp class when maxLines is cleared', () => {
    const wrapper = mountComponent({ maxLines: 2 });

    wrapper.setProps({ maxLines: null });

    expect(wrapper.element()).not.toHaveClass(TEXT_LINE_CLAMP_CLASS);
  });

  it('removes line clamp style when maxLines is cleared', () => {
    const wrapper = mountComponent({ maxLines: 2 });

    wrapper.setProps({ maxLines: null });

    // React empties a removed style prop's declarations but keeps the (now empty) attribute; Vue drops it.
    expect(wrapper.element().getAttribute('style') ?? '').toBe('');
  });

  it('maintains expected classes when mounted onto existing DOM (hydration-style)', () => {
    const mountTarget = document.createElement('div');
    mountTarget.innerHTML = '<span class="d-text"></span>';
    document.body.appendChild(mountTarget);

    const { unmount } = render(<DtText kind="headline" size="md">{slotContent}</DtText>, { container: mountTarget });

    expect(screen.getByText(slotContent)).toHaveClass('d-text', 'd-text-headline--md');

    unmount();
    mountTarget.remove();
  });

  it('applies wrap modifier class', () => {
    const wrapper = mountComponent({ wrap: 'balance' });

    expect(wrapper.element()).toHaveClass(TEXT_WRAP_MODIFIERS.balance);
  });

  it('warns and does not apply class for unrecognized wrap', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent(unsupported({ wrap: 'invalid-wrap' }));

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported wrap "invalid-wrap"'),
    );
    expect(wrapper.element()).not.toHaveClass('d-text--wrap-invalid-wrap');
  });

  it('applies textBoxTrim modifier class', () => {
    const wrapper = mountComponent({ textBoxTrim: 'both' });

    expect(wrapper.element()).toHaveClass(TEXT_BOX_TRIM_MODIFIERS.both);
  });

  it('warns and does not apply class for unrecognized textBoxTrim', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mountComponent(unsupported({ textBoxTrim: 'invalid' }));

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported textBoxTrim "invalid"'),
    );
    expect(wrapper.element()).not.toHaveClass('d-text--trim-invalid');
  });

  it('has data-qa attribute', () => {
    const wrapper = mountComponent();

    expect(wrapper.element()).toHaveAttribute('data-qa', 'dt-text');
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

      expect(wrapper.element()).toHaveClass(TEXT_STRENGTH_MODIFIERS.bold);
    });

    it('warns for unrecognized strength', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountComponent(unsupported({ strength: 'invalid-strength' }));

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported strength "invalid-strength"'),
      );
    });

    it('does not apply class for unrecognized strength', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent(unsupported({ strength: 'invalid-strength' }));

      expect(wrapper.element()).not.toHaveClass('d-text--fw-invalid-strength');
    });

    it('does not add strength class when prop is omitted', () => {
      const wrapper = mountComponent({});

      const hasStrengthClass = classesOf(wrapper.element())
        .some((c) => c.includes('--fw-'));
      expect(hasStrengthClass).toBe(false);
    });
  });

  describe('density prop', () => {
    it('applies density modifier class', () => {
      const wrapper = mountComponent({ density: 300 });

      expect(wrapper.element()).toHaveClass(TEXT_DENSITY_MODIFIERS[300]);
    });

    it.each([400, '400'] as const)('accepts density %s', (density) => {
      const wrapper = mountComponent({ density });

      expect(wrapper.element()).toHaveClass(TEXT_DENSITY_MODIFIERS[400]);
    });

    it('warns for unrecognized density', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountComponent(unsupported({ density: 999 }));

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported density "999"'),
      );
    });

    it('does not apply class for unrecognized density', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent(unsupported({ density: 999 }));

      expect(wrapper.element()).not.toHaveClass('d-text--lh-999');
    });

    it('does not add density class when prop is omitted', () => {
      const wrapper = mountComponent({});

      const hasDensityClass = classesOf(wrapper.element())
        .some((c) => c.includes('--lh-'));
      expect(hasDensityClass).toBe(false);
    });
  });

  describe('family prop', () => {
    it('applies family modifier class', () => {
      const wrapper = mountComponent({ family: 'mono' });

      expect(wrapper.element()).toHaveClass(TEXT_FAMILY_MODIFIERS.mono);
    });

    it('applies inherited family modifier class', () => {
      const wrapper = mountComponent({ family: 'inherit' });

      expect(wrapper.element()).toHaveClass(TEXT_FAMILY_MODIFIERS.inherit);
    });

    it('warns for unrecognized family', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountComponent(unsupported({ family: 'invalid-family' }));

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported family "invalid-family"'),
      );
    });

    it('does not apply class for unrecognized family', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mountComponent(unsupported({ family: 'invalid-family' }));

      expect(wrapper.element()).not.toHaveClass('d-text--ff-invalid-family');
    });
  });

  describe('polymorphic props', () => {
    it('accepts the props of the element named by as', () => {
      render(<DtText as="a" href="/home" variant="body-md">Home</DtText>);
      expect(screen.getByText('Home')).toHaveAttribute('href', '/home');
    });

    it('accepts the props of a component named by as', () => {
      const Badge = ({ label, className }: { label: string; className?: string }) => (
        <b className={className}>{label}</b>
      );
      render(<DtText as={Badge} label="New" variant="label-sm" />);
      expect(screen.getByText('New')).toHaveClass('d-text');
    });
  });

  describe('italic prop', () => {
    it('applies italic modifier class when true', () => {
      const wrapper = mountComponent({ italic: true });

      expect(wrapper.element()).toHaveClass(TEXT_ITALIC_CLASS);
    });

    it('does not apply italic modifier class by default', () => {
      const wrapper = mountComponent();

      expect(wrapper.element()).not.toHaveClass(TEXT_ITALIC_CLASS);
    });
  });
});
