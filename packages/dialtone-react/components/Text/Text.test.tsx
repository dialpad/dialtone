import type { ElementType, ReactNode } from 'react';
import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DtText, resetHeadlineSemanticInfoFlag, type DtTextProps } from './Text';
import { listenForEscape } from './modules/slide';
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

  describe('slide', () => {
    // jsdom has no layout: the label is 300px wide in a 100px viewport, and the loop copy adds 324px
    const mountSlide = ({ fits, slot, ...initialProps }: AnyTextProps & { fits?: boolean; slot?: ReactNode } = {}) => {
      let props: AnyTextProps = initialProps;
      let label = 'A very long device name';
      const ui = () => (
        <form>
          <button type="button">
            <DtText as="div" {...props}>{slot ?? label}</DtText>
          </button>
        </form>
      );
      const { container, rerender, unmount } = render(ui());
      const viewport = container.querySelector<HTMLElement>('.d-text__slide')!;
      const content = container.querySelector<HTMLElement>('.d-text__slide-content')!;
      let width = fits ? 100 : 300;
      let room = 100;
      Object.defineProperty(content, 'scrollWidth', {
        get: () => (content.querySelector('.d-text__slide-copy') ? width + 324 : width),
      });
      Object.defineProperty(content, 'clientWidth', { get: () => room });
      Object.defineProperty(viewport, 'clientWidth', { get: () => room });
      return {
        form: container.querySelector('form')!,
        text: container.querySelector<HTMLElement>('[data-qa="dt-text"]')!,
        viewport,
        button: container.querySelector('button')!,
        offset: () => viewport.style.getPropertyValue('--_slide-offset'),
        setWidth: (value: number) => { width = value; },
        setRoom: (value: number) => { room = value; },
        setProps: (next: AnyTextProps) => {
          props = { ...props, ...next };
          rerender(ui());
        },
        setLabel: (next: string) => {
          label = next;
          rerender(ui());
        },
        unmount,
      };
    };

    const dispatch = (target: EventTarget, event: Event) => act(() => { target.dispatchEvent(event); });
    const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });
    const nextTick = () => act(async () => {});

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
      document.body.innerHTML = '';
    });

    it('slides cut text to its end while the button around it is hovered, and snaps back on leave', async () => {
      const { text, viewport, button, offset, unmount } = mountSlide({ slide: true });

      dispatch(button, new Event('pointerenter'));
      await advance(500);

      expect(viewport).toHaveClass('d-text__slide--moving');
      expect(offset()).toBe('200px');
      expect(text).not.toHaveAttribute('tabindex');
      expect(button.hasAttribute('tabindex')).toBe(false);

      await advance(10000);
      expect(viewport).toHaveClass('d-text__slide--end');
      expect(offset()).toBe('200px');

      dispatch(button, new Event('pointerleave'));
      await nextTick();

      expect(viewport).not.toHaveClass('d-text__slide--end');
      expect(offset()).toBe('');
      unmount();
    });

    it('starts on keyboard focus only, keeps going while focus stays inside the host, and stops on Escape without swallowing it', async () => {
      const { text, button, offset, unmount } = mountSlide({ slide: true });
      const outsideListener = vi.fn();
      document.addEventListener('keydown', outsideListener);

      // focus from a pointer or script (jsdom never matches :focus-visible here)
      act(() => button.focus());
      await advance(500);
      expect(offset()).toBe('');

      act(() => button.blur());
      vi.spyOn(button, 'matches').mockImplementation((selector: string) => selector === ':focus-visible');
      act(() => button.focus());
      await advance(500);
      dispatch(text, new FocusEvent('focusout', { bubbles: true, relatedTarget: text }));
      await nextTick();
      expect(offset()).toBe('200px');

      dispatch(button, new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await nextTick();
      expect(offset()).toBe('');
      expect(outsideListener).toHaveBeenCalled();

      document.removeEventListener('keydown', outsideListener);
      unmount();
    });

    it('stops on Escape while only hovered, even when the focused control stops the event', async () => {
      const { button, offset, unmount } = mountSlide({ slide: 'loop' });
      const input = document.createElement('input');
      input.addEventListener('keydown', (event) => event.stopPropagation());
      document.body.appendChild(input);
      input.focus();

      dispatch(button, new Event('pointerenter'));
      await advance(600);
      expect(offset()).not.toBe('');

      dispatch(input, new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await nextTick();
      expect(offset()).toBe('');
      unmount();
    });

    it('listenForEscape calls back on Escape until it is removed', () => {
      const onEscape = vi.fn();
      const remove = listenForEscape(document.body, onEscape);
      const escape = () => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      escape();
      remove();
      escape();

      expect(onEscape).toHaveBeenCalledTimes(1);
    });

    it('loop scrolls round with a copy, clears the start fade once the gap arrives, then snaps back and waits', async () => {
      const { viewport, button, offset, unmount } = mountSlide({ slide: 'loop' });

      dispatch(button, new Event('pointerenter'));
      await advance(500);
      const copy = viewport.querySelector('.d-text__slide-copy');
      expect(copy).toHaveAttribute('aria-hidden', 'true');
      expect(copy).toHaveAttribute('inert');
      expect(copy?.textContent).toBe('A very long device name');
      expect(viewport).toHaveClass('d-text__slide--loop');
      expect(offset()).toBe('324px');
      expect(viewport).not.toHaveClass('d-text__slide--loop-wrap');

      // 5 s for 324px; the 300px label has fully left the start edge after about 4.6 s
      await advance(4700);
      expect(viewport).toHaveClass('d-text__slide--loop-wrap');

      await advance(500);
      expect(viewport.querySelector('.d-text__slide-copy')).toBeNull();
      expect(offset()).toBe('0px');
      expect(viewport).not.toHaveClass('d-text__slide--moving');

      await advance(5000);
      expect(viewport).toHaveClass('d-text__slide--moving');
      unmount();
    });

    it('starts again from rest when the mode changes mid-sequence', async () => {
      const { viewport, button, offset, setProps, unmount } = mountSlide({ slide: 'loop' });

      dispatch(button, new Event('pointerenter'));
      await advance(500);
      expect(offset()).toBe('324px');

      // Checked before the next microtask, where the restart measures again (Vue's nextTick)
      setProps({ slide: 'once' });
      expect(viewport.querySelector('.d-text__slide-copy')).toBeNull();
      expect(viewport).not.toHaveClass('d-text__slide--moving');
      expect(offset()).toBe('');

      await advance(10500);
      expect(viewport).toHaveClass('d-text__slide--end');
      expect(offset()).toBe('200px');
      unmount();
    });

    it('stays at rest when the mode changes while inactive', async () => {
      const { offset, setProps, unmount } = mountSlide({ slide: 'once' });

      setProps({ slide: 'loop' });
      await advance(1000);

      expect(offset()).toBe('');
      unmount();
    });

    it('loop stops after three cycles and rests at the start', async () => {
      const { viewport, button, offset, unmount } = mountSlide({ slide: 'loop' });

      dispatch(button, new Event('pointerenter'));
      // delay, then three cycles of a 5 s scroll (plus the fallback margin) and a 5 s hold
      await advance(500 + 3 * 10100 + 6000);

      expect(viewport).not.toHaveClass('d-text__slide--moving');
      expect(offset()).toBe('0px');
      expect(vi.getTimerCount()).toBe(0);
      unmount();
    });

    it('loop copy adds no second form value for a named input in the label', async () => {
      const { form, viewport, button, unmount } = mountSlide({
        slide: 'loop',
        slot: <>Pick <input name="choice" defaultValue="a" /></>,
      });

      dispatch(button, new Event('pointerenter'));
      await advance(600);

      expect(viewport.querySelector<HTMLInputElement>('.d-text__slide-copy input')?.disabled).toBe(true);
      expect(new FormData(form).getAll('choice')).toEqual(['a']);
      unmount();
    });

    it('loop copy leaves a checked radio in the label checked', async () => {
      const { viewport, button, unmount } = mountSlide({
        slide: 'loop',
        slot: <>Pick <input type="radio" name="choice" value="a" defaultChecked /></>,
      });
      const radio = viewport.querySelector<HTMLInputElement>('.d-text__slide-content > input')!;

      dispatch(button, new Event('pointerenter'));
      await advance(600);

      expect(viewport.querySelector('.d-text__slide-copy input')).not.toBeNull();
      expect(radio.checked).toBe(true);
      unmount();
    });

    it('loop stops when the label changes to fit during a hold', async () => {
      const { viewport, button, offset, setWidth, unmount } = mountSlide({ slide: 'loop' });

      dispatch(button, new Event('pointerenter'));
      await advance(500 + 5200);
      setWidth(100);
      await advance(6000);

      expect(viewport).not.toHaveClass('d-text__slide--moving');
      expect(offset()).toBe('0px');
      unmount();
    });

    it('starts again from rest when the label changes while active', async () => {
      const { viewport, button, offset, setWidth, setLabel, unmount } = mountSlide({ slide: true });

      dispatch(button, new Event('pointerenter'));
      await advance(4000);
      expect(viewport).toHaveClass('d-text__slide--end');

      setWidth(40);
      setLabel('Short');
      await advance(1000);

      expect(viewport).not.toHaveClass('d-text__slide--end');
      expect(offset()).toBe('');
      unmount();
    });

    it('keeps going when the label changes at the same width, and slides again when a fitting label grows', async () => {
      const { viewport, button, offset, setWidth, setLabel, unmount } = mountSlide({ slide: true });

      dispatch(button, new Event('pointerenter'));
      await advance(4000);
      setLabel('A very long device name.');
      await advance(100);
      expect(viewport).toHaveClass('d-text__slide--end');

      setWidth(40);
      setLabel('Short');
      await advance(1000);
      expect(offset()).toBe('');

      setWidth(300);
      setLabel('A very long device name again');
      await advance(600);
      expect(viewport).toHaveClass('d-text__slide--moving');
      unmount();
    });

    it('ignores a resize caused by the loop copy while it scrolls', async () => {
      let onResize = () => {};
      vi.stubGlobal('ResizeObserver', class {
        constructor (callback: () => void) { onResize = callback; }
        observe () {}
        disconnect () {}
      });
      const { viewport, button, offset, setRoom, unmount } = mountSlide({ slide: 'loop' });

      dispatch(button, new Event('pointerenter'));
      await advance(600);
      setRoom(120);
      act(() => onResize());
      await advance(100);

      expect(viewport).toHaveClass('d-text__slide--moving');
      expect(offset()).toBe('324px');
      unmount();
    });

    it('starts again from rest when the viewport widens until the label fits', async () => {
      let onResize = () => {};
      vi.stubGlobal('ResizeObserver', class {
        constructor (callback: () => void) { onResize = callback; }
        observe () {}
        disconnect () {}
      });
      const { viewport, button, offset, setRoom, unmount } = mountSlide({ slide: true });

      dispatch(button, new Event('pointerenter'));
      await advance(4000);
      expect(viewport).toHaveClass('d-text__slide--end');

      setRoom(400);
      act(() => onResize());
      await advance(1000);

      expect(viewport).not.toHaveClass('d-text__slide--end');
      expect(offset()).toBe('');
      unmount();
    });

    it('rests at the end as soon as the transition ends', async () => {
      const { viewport, button, unmount } = mountSlide({ slide: true });

      dispatch(button, new Event('pointerenter'));
      await advance(600);
      const transitionEnd = new Event('transitionend');
      Object.defineProperty(transitionEnd, 'propertyName', { value: 'transform' });
      dispatch(viewport.querySelector('.d-text__slide-content')!, transitionEnd);
      await nextTick();

      expect(viewport).toHaveClass('d-text__slide--end');
      unmount();
    });

    it.each(['-1', '0'])('does not treat a focusable region (tabindex="%s") as the host', async (tabindex) => {
      const { container, unmount } = render(
        <div tabIndex={Number(tabindex)}><DtText slide>A very long device name</DtText></div>,
      );
      const region = container.firstElementChild!;
      const text = container.querySelector('[data-qa="dt-text"]')!;
      const viewport = container.querySelector('.d-text__slide')!;
      const content = container.querySelector('.d-text__slide-content')!;
      Object.defineProperty(content, 'scrollWidth', { value: 300 });
      Object.defineProperty(content, 'clientWidth', { value: 100 });

      dispatch(region, new Event('pointerenter'));
      await advance(600);
      expect(viewport).not.toHaveClass('d-text__slide--moving');

      dispatch(text, new Event('pointerenter'));
      await advance(600);
      expect(viewport).toHaveClass('d-text__slide--moving');
      unmount();
    });

    it('leaves text that fits alone', async () => {
      const { viewport, button, unmount } = mountSlide({ slide: true, fits: true });

      dispatch(button, new Event('pointerenter'));
      await advance(5000);

      expect([...viewport.classList]).toEqual(['d-text__slide']);
      unmount();
    });

    it.each(['once', 'loop'] as const)('with reduced motion, %s jumps to the end once and stays', async (mode) => {
      vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
      const { viewport, button, offset, unmount } = mountSlide({ slide: mode });

      dispatch(button, new Event('pointerenter'));
      await advance(600);
      expect(viewport).toHaveClass('d-text__slide--end');

      await advance(20000);
      expect(viewport).toHaveClass('d-text__slide--end');
      expect(offset()).toBe('200px');
      expect(viewport.querySelector('.d-text__slide-copy')).toBeNull();
      unmount();
    });

    it('leaves no timers behind when unmounted mid-movement, and turning slide off removes it', async () => {
      const { text, button, setProps, unmount } = mountSlide({ slide: true });

      dispatch(button, new Event('pointerenter'));
      await advance(600);
      setProps({ slide: false });

      expect(text.querySelector('.d-text__slide')).toBeNull();
      expect(text).not.toHaveClass('d-text--slide');
      expect(vi.getTimerCount()).toBe(0);

      setProps({ slide: true });
      expect(text.querySelector('.d-text__slide')).not.toBeNull();
      dispatch(button, new Event('pointerenter'));
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    });

    it('warns once that it ignores maxLines, and still slides', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const first = mountSlide({ slide: true, maxLines: 2 });
      const second = mountSlide({ slide: true, maxLines: 2 });

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(first.text).toHaveClass('d-text--slide');
      expect(first.text).not.toHaveClass(TEXT_LINE_CLAMP_CLASS);
      first.unmount();
      second.unmount();
    });
  });
});
