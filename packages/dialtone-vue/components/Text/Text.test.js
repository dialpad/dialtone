import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DtText, { resetHeadlineSemanticInfoFlag } from './Text.vue';
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


  describe('slide', () => {
    // jsdom has no layout: the label is 300px wide in a 100px viewport, and the loop copy adds 324px
    const mountSlide = ({ fits, slot = '{{ label }}', ...props } = {}) => {
      const wrapper = mount({
        components: { DtText },
        data: () => ({ props, label: 'A very long device name' }),
        template: `<form><button type="button"><dt-text as="div" v-bind="props">${slot}</dt-text></button></form>`,
      }, { attachTo: document.body });
      const viewport = wrapper.find('.d-text__slide');
      const content = wrapper.find('.d-text__slide-content').element;
      let width = fits ? 100 : 300;
      let room = 100;
      Object.defineProperty(content, 'scrollWidth', {
        get: () => (content.querySelector('.d-text__slide-copy') ? width + 324 : width),
      });
      Object.defineProperty(content, 'clientWidth', { get: () => room });
      Object.defineProperty(viewport.element, 'clientWidth', { get: () => room });
      return {
        wrapper,
        text: wrapper.find('[data-qa="dt-text"]'),
        viewport,
        button: wrapper.find('button').element,
        offset: () => viewport.element.style.getPropertyValue('--_slide-offset'),
        setWidth: (value) => { width = value; },
        setRoom: (value) => { room = value; },
      };
    };

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
      document.body.innerHTML = '';
    });

    it('slides cut text to its end while the button around it is hovered, and snaps back on leave', async () => {
      const { wrapper, text, viewport, button, offset } = mountSlide({ slide: true });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(500);

      expect(viewport.classes()).toContain('d-text__slide--moving');
      expect(offset()).toBe('200px');
      expect(text.attributes('tabindex')).toBeUndefined();
      expect(button.hasAttribute('tabindex')).toBe(false);

      await vi.advanceTimersByTimeAsync(10000);
      expect(viewport.classes()).toContain('d-text__slide--end');
      expect(offset()).toBe('200px');

      button.dispatchEvent(new Event('pointerleave'));
      await wrapper.vm.$nextTick();

      expect(viewport.classes()).not.toContain('d-text__slide--end');
      expect(offset()).toBe('');
      wrapper.unmount();
    });

    it('starts on keyboard focus only, keeps going while focus stays inside the host, and stops on Escape without swallowing it', async () => {
      const { wrapper, text, button, offset } = mountSlide({ slide: true });
      const outsideListener = vi.fn();
      document.addEventListener('keydown', outsideListener);

      // focus from a pointer or script (jsdom never matches :focus-visible here)
      button.focus();
      await vi.advanceTimersByTimeAsync(500);
      expect(offset()).toBe('');

      button.blur();
      vi.spyOn(button, 'matches').mockImplementation((selector) => selector === ':focus-visible');
      button.focus();
      await vi.advanceTimersByTimeAsync(500);
      text.element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: text.element }));
      await wrapper.vm.$nextTick();
      expect(offset()).toBe('200px');

      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await wrapper.vm.$nextTick();
      expect(offset()).toBe('');
      expect(outsideListener).toHaveBeenCalled();

      document.removeEventListener('keydown', outsideListener);
      wrapper.unmount();
    });

    it('stops on Escape while only hovered, even when the focused control stops the event', async () => {
      const { wrapper, button, offset } = mountSlide({ slide: 'loop' });
      const input = document.createElement('input');
      input.addEventListener('keydown', (event) => event.stopPropagation());
      document.body.appendChild(input);
      input.focus();

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(600);
      expect(offset()).not.toBe('');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await wrapper.vm.$nextTick();
      expect(offset()).toBe('');
      wrapper.unmount();
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
      const { wrapper, viewport, button, offset } = mountSlide({ slide: 'loop' });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(500);
      const copy = viewport.find('.d-text__slide-copy');
      expect(copy.attributes('aria-hidden')).toBe('true');
      expect(copy.attributes('inert')).toBeDefined();
      expect(copy.text()).toBe('A very long device name');
      expect(viewport.classes()).toContain('d-text__slide--loop');
      expect(offset()).toBe('324px');
      expect(viewport.classes()).not.toContain('d-text__slide--loop-wrap');

      // 5 s for 324px; the 300px label has fully left the start edge after about 4.6 s
      await vi.advanceTimersByTimeAsync(4700);
      expect(viewport.classes()).toContain('d-text__slide--loop-wrap');

      await vi.advanceTimersByTimeAsync(500);
      expect(viewport.find('.d-text__slide-copy').exists()).toBe(false);
      expect(offset()).toBe('0px');
      expect(viewport.classes()).not.toContain('d-text__slide--moving');

      await vi.advanceTimersByTimeAsync(5000);
      expect(viewport.classes()).toContain('d-text__slide--moving');
      wrapper.unmount();
    });

    it('starts again from rest when the mode changes mid-sequence, and stays at rest when inactive', async () => {
      const { wrapper, viewport, button, offset } = mountSlide({ slide: 'loop' });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(500);
      expect(offset()).toBe('324px');

      wrapper.vm.props.slide = 'once';
      await wrapper.vm.$nextTick();
      expect(viewport.find('.d-text__slide-copy').exists()).toBe(false);
      expect(viewport.classes()).not.toContain('d-text__slide--moving');
      expect(offset()).toBe('');

      await vi.advanceTimersByTimeAsync(10500);
      expect(viewport.classes()).toContain('d-text__slide--end');
      expect(offset()).toBe('200px');

      button.dispatchEvent(new Event('pointerleave'));
      wrapper.vm.props.slide = 'loop';
      await vi.advanceTimersByTimeAsync(1000);
      expect(offset()).toBe('');
      wrapper.unmount();
    });

    it('loop stops after three cycles and rests at the start', async () => {
      const { wrapper, viewport, button, offset } = mountSlide({ slide: 'loop' });

      button.dispatchEvent(new Event('pointerenter'));
      // delay, then three cycles of a 5 s scroll (plus the fallback margin) and a 5 s hold
      await vi.advanceTimersByTimeAsync(500 + 3 * 10100 + 6000);

      expect(viewport.classes()).not.toContain('d-text__slide--moving');
      expect(offset()).toBe('0px');
      expect(vi.getTimerCount()).toBe(0);
      wrapper.unmount();
    });

    it('loop copy adds no second form value for a named input in the label', async () => {
      const { wrapper, viewport, button } = mountSlide({ slide: 'loop', slot: 'Pick <input name="choice" value="a">' });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(600);

      expect(viewport.find('.d-text__slide-copy input').exists()).toBe(true);
      expect(new FormData(wrapper.element).getAll('choice')).toEqual(['a']);
      wrapper.unmount();
    });

    it('loop stops when the label changes to fit during a hold', async () => {
      const { wrapper, viewport, button, offset, setWidth } = mountSlide({ slide: 'loop' });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(500 + 5200);
      setWidth(100);
      await vi.advanceTimersByTimeAsync(6000);

      expect(viewport.classes()).not.toContain('d-text__slide--moving');
      expect(offset()).toBe('0px');
      wrapper.unmount();
    });

    it('starts again from rest when the label changes while active', async () => {
      const { wrapper, viewport, button, offset, setWidth } = mountSlide({ slide: true });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(4000);
      expect(viewport.classes()).toContain('d-text__slide--end');

      setWidth(40);
      wrapper.vm.label = 'Short';
      await vi.advanceTimersByTimeAsync(1000);

      expect(viewport.classes()).not.toContain('d-text__slide--end');
      expect(offset()).toBe('');
      wrapper.unmount();
    });

    it('keeps going when the label changes at the same width, and slides again when a fitting label grows', async () => {
      const { wrapper, viewport, button, offset, setWidth } = mountSlide({ slide: true });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(4000);
      wrapper.vm.label = 'A very long device name.';
      await vi.advanceTimersByTimeAsync(100);
      expect(viewport.classes()).toContain('d-text__slide--end');

      setWidth(40);
      wrapper.vm.label = 'Short';
      await vi.advanceTimersByTimeAsync(1000);
      expect(offset()).toBe('');

      setWidth(300);
      wrapper.vm.label = 'A very long device name again';
      await vi.advanceTimersByTimeAsync(600);
      expect(viewport.classes()).toContain('d-text__slide--moving');
      wrapper.unmount();
    });

    it('ignores a resize caused by the loop copy while it scrolls', async () => {
      let onResize;
      vi.stubGlobal('ResizeObserver', class {
        constructor (callback) { onResize = callback; }
        observe () {}
        disconnect () {}
      });
      const { wrapper, viewport, button, offset, setRoom } = mountSlide({ slide: 'loop' });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(600);
      setRoom(120);
      onResize();
      await vi.advanceTimersByTimeAsync(100);

      expect(viewport.classes()).toContain('d-text__slide--moving');
      expect(offset()).toBe('324px');
      wrapper.unmount();
    });

    it('starts again from rest when the viewport widens until the label fits', async () => {
      let onResize;
      vi.stubGlobal('ResizeObserver', class {
        constructor (callback) { onResize = callback; }
        observe () {}
        disconnect () {}
      });
      const { wrapper, viewport, button, offset, setRoom } = mountSlide({ slide: true });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(4000);
      expect(viewport.classes()).toContain('d-text__slide--end');

      setRoom(400);
      onResize();
      await vi.advanceTimersByTimeAsync(1000);

      expect(viewport.classes()).not.toContain('d-text__slide--end');
      expect(offset()).toBe('');
      wrapper.unmount();
    });

    it('rests at the end as soon as the transition ends', async () => {
      const { wrapper, viewport, button } = mountSlide({ slide: true });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(600);
      const transitionEnd = new Event('transitionend');
      Object.defineProperty(transitionEnd, 'propertyName', { value: 'transform' });
      wrapper.find('.d-text__slide-content').element.dispatchEvent(transitionEnd);
      await wrapper.vm.$nextTick();

      expect(viewport.classes()).toContain('d-text__slide--end');
      wrapper.unmount();
    });

    it.each(['-1', '0'])('does not treat a focusable region (tabindex="%s") as the host', async (tabindex) => {
      const wrapper = mount({
        components: { DtText },
        template: `<div tabindex="${tabindex}"><dt-text slide>A very long device name</dt-text></div>`,
      }, { attachTo: document.body });
      const text = wrapper.find('[data-qa="dt-text"]');
      const viewport = wrapper.find('.d-text__slide');
      const content = wrapper.find('.d-text__slide-content').element;
      Object.defineProperty(content, 'scrollWidth', { value: 300 });
      Object.defineProperty(content, 'clientWidth', { value: 100 });

      wrapper.element.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(600);
      expect(viewport.classes()).not.toContain('d-text__slide--moving');

      text.element.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(600);
      expect(viewport.classes()).toContain('d-text__slide--moving');
      wrapper.unmount();
    });

    it('leaves text that fits alone', async () => {
      const { wrapper, viewport, button } = mountSlide({ slide: true, fits: true });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(5000);

      expect(viewport.classes()).toEqual(['d-text__slide']);
      wrapper.unmount();
    });

    it.each(['once', 'loop'])('with reduced motion, %s jumps to the end once and stays', async (mode) => {
      vi.stubGlobal('matchMedia', (query) => ({ matches: query.includes('reduce') }));
      const { wrapper, viewport, button, offset } = mountSlide({ slide: mode });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(600);
      expect(viewport.classes()).toContain('d-text__slide--end');

      await vi.advanceTimersByTimeAsync(20000);
      expect(viewport.classes()).toContain('d-text__slide--end');
      expect(offset()).toBe('200px');
      expect(viewport.find('.d-text__slide-copy').exists()).toBe(false);
      wrapper.unmount();
    });

    it('leaves no timers behind when unmounted mid-movement, and turning slide off removes it', async () => {
      const { wrapper, text, button } = mountSlide({ slide: true });

      button.dispatchEvent(new Event('pointerenter'));
      await vi.advanceTimersByTimeAsync(600);
      wrapper.vm.props.slide = false;
      await wrapper.vm.$nextTick();

      expect(text.find('.d-text__slide').exists()).toBe(false);
      expect(text.classes()).not.toContain('d-text--slide');
      expect(vi.getTimerCount()).toBe(0);

      wrapper.vm.props.slide = true;
      await wrapper.vm.$nextTick();
      expect(text.find('.d-text__slide').exists()).toBe(true);
      button.dispatchEvent(new Event('pointerenter'));
      wrapper.unmount();
      expect(vi.getTimerCount()).toBe(0);
    });

    it('warns once that it ignores maxLines, and still slides', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const first = mountSlide({ slide: true, maxLines: 2 });
      const second = mountSlide({ slide: true, maxLines: 2 });

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(first.text.classes()).toContain('d-text--slide');
      expect(first.text.classes()).not.toContain(TEXT_LINE_CLAMP_CLASS);
      first.wrapper.unmount();
      second.wrapper.unmount();
    });
  });
});
