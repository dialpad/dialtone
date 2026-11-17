import type { HTMLAttributes, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DtBox, type DtBoxProps } from './Box';
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
  type DtBoxAs,
} from './BoxConstants';

type BoxProps = DtBoxProps<DtBoxAs>;

describe('DtBox', () => {
  const slotContent = 'Box content';
  const EXPANDED_LAYOUT_VALUES = DT_BOX_LAYOUT_VALUES.filter((value) => {
    const token = Number(value);
    // Intermediate stops between 100-multiple base stops, such as 125, 350, and 1550.
    return Number.isInteger(token) && token > 100 && token % 100 !== 0;
  });

  const mountComponent = (
    props: BoxProps = {},
    attrs: HTMLAttributes<HTMLElement> = {},
    slots: { default?: ReactNode } = {},
  ) => {
    const { default: children = slotContent } = slots;
    render(<DtBox {...attrs} {...props}>{children}</DtBox>);
    return box();
  };

  const box = () => screen.getByTestId('dt-box');
  const classes = () => Array.from(box().classList);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Presentation ──────────────────────────────────────────

  it('renders with d-box base class', () => {
    mountComponent();

    expect(classes()).toContain('d-box');
  });

  it('renders slot content', () => {
    mountComponent();

    expect(box().textContent).toBe(slotContent);
  });

  it('renders as div by default', () => {
    mountComponent();

    expect(box().tagName).toBe('DIV');
  });

  it.each(
    DT_BOX_AS_VALUES.filter(tag => tag !== 'div'),
  )('renders as %s when as="%s"', (tag) => {
    mountComponent({ as: tag });

    expect(box().tagName).toBe(tag.toUpperCase());
  });

  it('applies data-qa attribute', () => {
    mountComponent();

    expect(box().getAttribute('data-qa')).toBe('dt-box');
  });

  // ── Padding ───────────────────────────────────────────────

  it('applies padding modifier class', () => {
    mountComponent({ padding: '200' });

    expect(classes()).toContain('d-box--p-200');
  });

  it('applies paddingInline modifier class', () => {
    mountComponent({ paddingInline: '100' });

    expect(classes()).toContain('d-box--pi-100');
  });

  it('applies paddingInlineStart modifier class', () => {
    mountComponent({ paddingInlineStart: '50' });

    expect(classes()).toContain('d-box--pis-50');
  });

  it('applies paddingInlineEnd modifier class', () => {
    mountComponent({ paddingInlineEnd: '75' });

    expect(classes()).toContain('d-box--pie-75');
  });

  it('applies paddingBlock modifier class', () => {
    mountComponent({ paddingBlock: '300' });

    expect(classes()).toContain('d-box--pbl-300');
  });

  it('applies paddingBlockStart modifier class', () => {
    mountComponent({ paddingBlockStart: '150' });

    expect(classes()).toContain('d-box--pbs-150');
  });

  it('applies paddingBlockEnd modifier class', () => {
    mountComponent({ paddingBlockEnd: '400' });

    expect(classes()).toContain('d-box--pbe-400');
  });

  it('applies multiple padding classes simultaneously', () => {
    mountComponent({
      padding: '200',
      paddingInline: '100',
      paddingBlockStart: '0',
    });

    expect(classes()).toContain('d-box--p-200');
    expect(classes()).toContain('d-box--pi-100');
    expect(classes()).toContain('d-box--pbs-0');
  });

  it('does not add padding class when prop is undefined', () => {
    mountComponent();

    const paddingClasses = classes().filter(c => c.startsWith('d-box--p'));
    expect(paddingClasses).toHaveLength(0);
  });

  // ── Surface ───────────────────────────────────────────────

  it('applies surface modifier class', () => {
    mountComponent({ surface: 'primary' });

    expect(classes()).toContain('d-box--surface-primary');
  });

  it.each(
    DT_BOX_SURFACE_VALUES.filter(v => v !== 'primary'),
  )('applies surface modifier class for %s', (surface) => {
    mountComponent({ surface });

    expect(classes()).toContain(`d-box--surface-${surface}`);
  });

  it('does not add surface class when prop is undefined', () => {
    mountComponent();

    const surfaceClasses = classes().filter(c => c.startsWith('d-box--surface'));
    expect(surfaceClasses).toHaveLength(0);
  });

  // ── Border color ───────────────────────────────────────────

  it('applies borderColor modifier class', () => {
    mountComponent({ borderColor: 'default' });

    expect(classes()).toContain('d-box--bc-default');
  });

  it.each(
    DT_BOX_BORDER_COLOR_VALUES.filter(v => v !== 'default'),
  )('applies borderColor modifier class for %s', (borderColor) => {
    mountComponent({ borderColor });

    expect(classes()).toContain(`d-box--bc-${borderColor}`);
  });

  it('applies default borderColor class when prop is not specified', () => {
    mountComponent();

    expect(classes()).toContain('d-box--bc-default');
  });

  // ── Border width ──────────────────────────────────────────

  it('applies borderWidth modifier class', () => {
    mountComponent({ borderWidth: '100' });

    expect(classes()).toContain('d-box--bw-100');
  });

  it.each(
    DT_BOX_BORDER_WIDTH_VALUES.filter(v => v !== '100'),
  )('applies borderWidth modifier class for %s', (borderWidth) => {
    mountComponent({ borderWidth });

    expect(classes()).toContain(`d-box--bw-${borderWidth}`);
  });

  it('does not add borderWidth class when prop is undefined', () => {
    mountComponent();

    const bwClasses = classes().filter(c => c.startsWith('d-box--bw'));
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
    mountComponent({ [prop]: value });

    expect(classes()).toContain(expectedClass);
  });

  // ── Border radius ─────────────────────────────────────────

  it('applies borderRadius modifier class', () => {
    mountComponent({ borderRadius: '200' });

    expect(classes()).toContain('d-box--br-200');
  });

  it.each(
    DT_BOX_BORDER_RADIUS_VALUES.filter(v => v !== '200'),
  )('applies borderRadius modifier class for %s', (borderRadius) => {
    mountComponent({ borderRadius });

    expect(classes()).toContain(`d-box--br-${borderRadius}`);
  });

  it('does not add borderRadius class when prop is undefined', () => {
    mountComponent();

    const brClasses = classes().filter(c => c.startsWith('d-box--br'));
    expect(brClasses).toHaveLength(0);
  });

  // ── Shadow ────────────────────────────────────────────────

  it('applies shadow modifier class', () => {
    mountComponent({ shadow: 'small' });

    expect(classes()).toContain('d-box--shadow-small');
  });

  it.each(
    DT_BOX_SHADOW_VALUES.filter(v => v !== 'small'),
  )('applies shadow modifier class for %s', (shadow) => {
    mountComponent({ shadow });

    expect(classes()).toContain(`d-box--shadow-${shadow}`);
  });

  it('does not add shadow class when prop is undefined', () => {
    mountComponent();

    const shadowClasses = classes().filter(c => c.startsWith('d-box--shadow'));
    expect(shadowClasses).toHaveLength(0);
  });

  // ── Combined V2 props ──────────────────────────────────────

  it('applies multiple border and shadow classes simultaneously', () => {
    mountComponent({
      borderColor: 'subtle',
      borderWidth: '100',
      borderRadius: '300',
      shadow: 'card',
    });

    expect(classes()).toContain('d-box--bc-subtle');
    expect(classes()).toContain('d-box--bw-100');
    expect(classes()).toContain('d-box--br-300');
    expect(classes()).toContain('d-box--shadow-card');
  });

  it('applies V1 and V2 props together', () => {
    mountComponent({
      padding: '200',
      surface: 'primary',
      borderColor: 'default',
      borderWidth: '100',
      borderRadius: '400',
      shadow: 'medium',
    });

    expect(classes()).toContain('d-box--p-200');
    expect(classes()).toContain('d-box--surface-primary');
    expect(classes()).toContain('d-box--bc-default');
    expect(classes()).toContain('d-box--bw-100');
    expect(classes()).toContain('d-box--br-400');
    expect(classes()).toContain('d-box--shadow-medium');
  });

  // ── Sizing (layout tokens) ─────────────────────────────────

  it('applies inlineSize modifier class for layout token', () => {
    mountComponent({ inlineSize: '300' });

    expect(classes()).toContain('d-box--is-300');
  });

  it('applies blockSize modifier class for layout token', () => {
    mountComponent({ blockSize: '500' });

    expect(classes()).toContain('d-box--bls-500');
  });

  it('applies inlineSize modifier class for percent layout token', () => {
    mountComponent({ inlineSize: '100p' });

    expect(classes()).toContain('d-box--is-100p');
  });

  it('applies blockSize modifier class for percent layout token', () => {
    mountComponent({ blockSize: '50p' });

    expect(classes()).toContain('d-box--bls-50p');
  });

  it('applies maxInlineSize modifier class for layout token', () => {
    mountComponent({ maxInlineSize: '800' });

    expect(classes()).toContain('d-box--max-is-800');
  });

  it('applies minBlockSize modifier class for layout token', () => {
    mountComponent({ minBlockSize: '100' });

    expect(classes()).toContain('d-box--min-bls-100');
  });

  it('applies minInlineSize modifier class for layout token', () => {
    mountComponent({ minInlineSize: '200' });

    expect(classes()).toContain('d-box--min-is-200');
  });

  it('applies maxBlockSize modifier class for layout token', () => {
    mountComponent({ maxBlockSize: '600' });

    expect(classes()).toContain('d-box--max-bls-600');
  });

  it.each(EXPANDED_LAYOUT_VALUES)('applies inlineSize class for expanded layout token %s', (value) => {
    mountComponent({ inlineSize: value });

    expect(classes()).toContain(`d-box--is-${value}`);
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
    mountComponent({ [prop]: value });

    expect(classes()).toContain(expectedClass);
  });

  it('warns when layout token is invalid', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // @ts-expect-error '225' isn't a layout token: the type rejects it as Vue's validator does
    mountComponent({ inlineSize: '225' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[DtBox] Invalid prop value: "225"'));
  });

  // ── Positioning ──────────────────────────────────────────

  it.each(DT_BOX_POSITION_VALUES)('applies position modifier class for %s', (position) => {
    mountComponent({ position });

    expect(classes()).toContain(`d-box--ps-${position}`);
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
    mountComponent({ [prop]: value });

    expect(classes()).toContain(expectedClass);
  });

  describe('positioning prop validation', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    it.each(DT_BOX_INSET_VALUES)('does not warn for shorthand inset coordinate %s', (value) => {
      mountComponent({ inset: value });

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it.each(DT_BOX_INSET_SIDE_VALUES)('does not warn for side-specific inset coordinate %s', (value) => {
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
      mountComponent({ [prop]: value });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining(`[DtBox] Invalid prop value: "${value}"`));
    });
  });

  it.each(DT_BOX_Z_INDEX_VALUES)('applies zIndex modifier class for %s', (zIndex) => {
    mountComponent({ zIndex });

    expect(classes()).toContain(`d-box--zi-${zIndex}`);
  });

  it.each([
    ['position', 'sticky', 'd-box--ps-sticky'],
    ['insetBlockStart', '0', 'd-box--ibs-0'],
    ['zIndex', 'navigation', 'd-box--zi-navigation'],
  ])('applies %s class alongside other positioning props', (prop, value, expectedClass) => {
    mountComponent({
      position: 'sticky',
      insetBlockStart: '0',
      zIndex: 'navigation',
      [prop]: value,
    });

    expect(classes()).toContain(expectedClass);
  });

  it('does not add positioning classes when props are undefined', () => {
    mountComponent();

    const prefixes = ['d-box--ps', 'd-box--inset', 'd-box--ib', 'd-box--ii', 'd-box--zi'];
    const positioningClasses = classes().filter(c => prefixes.some(p => c.startsWith(p)));
    expect(positioningClasses).toHaveLength(0);
  });

  // ── Overflow ──────────────────────────────────────────────

  it('applies overflow modifier class', () => {
    mountComponent({ overflow: 'hidden' });

    expect(classes()).toContain('d-box--of-hidden');
  });

  it.each(
    DT_BOX_OVERFLOW_VALUES.filter(v => v !== 'hidden'),
  )('applies overflow modifier class for %s', (overflow) => {
    mountComponent({ overflow });

    expect(classes()).toContain(`d-box--of-${overflow}`);
  });

  it('does not add overflow class when prop is undefined', () => {
    mountComponent();

    const ofClasses = classes().filter(c => c.startsWith('d-box--of'));
    expect(ofClasses).toHaveLength(0);
  });

  // ── Scrollbar ──────────────────────────────────────────────

  it('renders scrollbar viewport wrapper when scrollbar prop is set', () => {
    mountComponent({ scrollbar: 'always' });

    expect(screen.queryByTestId('dt-box-scrollbar-content')).toBeInTheDocument();
  });

  it('does not render scrollbar wrapper when scrollbar prop is undefined', () => {
    mountComponent();

    expect(screen.queryByTestId('dt-box-scrollbar-content')).not.toBeInTheDocument();
  });

  it('renders scrollbar wrapper when scrollbar is true', () => {
    mountComponent({ scrollbar: true });

    expect(screen.queryByTestId('dt-box-scrollbar-content')).toBeInTheDocument();
  });

  it('renders slot content inside scrollbar wrapper', () => {
    mountComponent({ scrollbar: 'leave' });

    expect(screen.getByTestId('dt-box-scrollbar-content').textContent).toBe(slotContent);
  });

  // ── Attrs passthrough ─────────────────────────────────────

  it('passes class attr through to root element', () => {
    mountComponent({}, { className: 'd-ps-sticky d-t-0' });

    expect(classes()).toContain('d-ps-sticky');
    expect(classes()).toContain('d-t-0');
  });

  it('passes id attr through to root element', () => {
    mountComponent({}, { id: 'my-box' });

    expect(box().getAttribute('id')).toBe('my-box');
  });

  it('passes aria attrs through to root element', () => {
    mountComponent({}, { 'aria-label': 'Navigation' });

    expect(box().getAttribute('aria-label')).toBe('Navigation');
  });

  // ── React-only ────────────────────────────────────────────

  describe('React-only', () => {
    it('warns once when scrollbar is set on an element whose children it would break', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountComponent({ as: 'ul', scrollbar: 'always' });

      const structureWarnings = warnSpy.mock.calls.filter(([message]) => String(message).includes('<ul>'));
      expect(structureWarnings).toHaveLength(1);
    });

    it('sets up the scrollbar on the root, with the content wrapper as its viewport', () => {
      mountComponent({ scrollbar: 'always' });

      expect(classes()).toContain('d-scrollbar');
      expect(box().getAttribute('data-overlayscrollbars-initialize')).toBe('true');
    });

    it('keeps the scrollbar class when a class-producing prop changes', () => {
      const { rerender } = render(<DtBox scrollbar="always" padding="100">{slotContent}</DtBox>);
      const before = box();

      rerender(<DtBox scrollbar="always" padding="200" className="extra">{slotContent}</DtBox>);

      expect(box()).toBe(before);
      expect(classes()).toContain('d-box--p-200');
      expect(classes()).toContain('d-scrollbar');
    });

    it('renders dangerouslySetInnerHTML inside the scrollbar content wrapper', () => {
      render(<DtBox scrollbar="always" dangerouslySetInnerHTML={{ __html: '<p>Raw</p>' }} />);

      const wrapper = screen.getByTestId('dt-box-scrollbar-content');
      expect(wrapper.innerHTML).toBe('<p>Raw</p>');
      expect(box().firstElementChild).toBe(wrapper);
    });

    it('renders dangerouslySetInnerHTML on the root without a scrollbar', () => {
      render(<DtBox dangerouslySetInnerHTML={{ __html: '<p>Raw</p>' }} />);

      expect(box().innerHTML).toBe('<p>Raw</p>');
    });

    it('replaces the root when the scrollbar is turned off, as Vue switches branches', () => {
      const { rerender } = render(<DtBox scrollbar="always">{slotContent}</DtBox>);
      const before = box();

      rerender(<DtBox>{slotContent}</DtBox>);

      expect(box()).not.toBe(before);
      expect(classes()).not.toContain('d-scrollbar');
    });

    it('forwards its ref to the root element', () => {
      let node: HTMLElement | null = null;
      render(<DtBox ref={(el: HTMLElement | null) => { node = el; }}>{slotContent}</DtBox>);

      expect(node).toBe(box());
    });
  });
});
