import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ElementType,
  type HTMLAttributes,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useScrollbar, type ScrollbarShowMode } from '../../common/scrollbar';
import type {
  DtBoxAs,
  DtBoxBorderColor,
  DtBoxBorderRadius,
  DtBoxBorderWidth,
  DtBoxInset,
  DtBoxInsetSide,
  DtBoxLayout,
  DtBoxOverflow,
  DtBoxPosition,
  DtBoxScrollbar,
  DtBoxShadow,
  DtBoxSpacing,
  DtBoxSurface,
  DtBoxZIndex,
} from './BoxConstants';
import {
  asValidator,
  spacingValidator,
  insetValidator,
  insetSideValidator,
  surfaceValidator,
  borderColorValidator,
  borderWidthValidator,
  borderRadiusValidator,
  shadowValidator,
  positionValidator,
  zIndexValidator,
  layoutValidator,
  overflowValidator,
  scrollbarValidator,
  type BoxValidator,
} from './Validators';

interface DtBoxOwnProps<T extends DtBoxAs> {
  /**
   * HTML element to render as.
   * @values div, span, section, article, aside, main, header, footer, nav, ul, ol, li, fieldset, form, figure
   */
  as?: T;

  /**
   * Custom scrollbar via OverlayScrollbars. When set, an inner viewport
   * wrapper (.d-box__scrollbar-content) is inserted automatically.
   * @values leave, scroll, move, always
   */
  scrollbar?: DtBoxScrollbar | true;

  /**
   * Background surface color. Maps to --dt-color-surface-* tokens.
   * @values primary, primary-opaque, secondary, secondary-opaque, moderate, moderate-opaque, bold, bold-opaque, strong, strong-opaque, contrast, contrast-opaque, backdrop, overlay, brand, brand-opaque, brand-subtle, brand-subtle-opaque, brand-strong, info, info-opaque, info-subtle, info-subtle-opaque, info-strong, positive, positive-opaque, positive-subtle, positive-subtle-opaque, positive-strong, warning, warning-opaque, warning-subtle, warning-subtle-opaque, warning-strong, critical, critical-opaque, critical-subtle, critical-subtle-opaque, critical-strong
   */
  surface?: DtBoxSurface;

  /**
   * Border color. Maps to --dt-color-border-* tokens.
   * Defaults to 'default'. Visible when any border-width prop is set.
   * @values transparent, subtle, default, moderate, bold, accent, positive, positive-subtle, positive-strong, warning, warning-subtle, warning-strong, critical, critical-subtle, critical-strong, info, info-subtle, info-strong, focus, brand, brand-subtle, brand-strong
   */
  borderColor?: DtBoxBorderColor;

  /**
   * Border radius. Maps to --dt-size-radius-* tokens.
   * @values 0, 100, 200, 300, 350, 400, 450, 500, 550, 600, pill, circle
   */
  borderRadius?: DtBoxBorderRadius;

  /**
   * Border width on all sides. Maps to --dt-size-border-* tokens.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidth?: DtBoxBorderWidth;

  /**
   * Border width on the block axis (aka top/bottom).
   * Overrides `borderWidth` for block sides.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthBlock?: DtBoxBorderWidth;

  /**
   * Border width on the block-end side (aka bottom).
   * Overrides `borderWidthBlock` and `borderWidth` for block-end.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthBlockEnd?: DtBoxBorderWidth;

  /**
   * Border width on the block-start side (aka top).
   * Overrides `borderWidthBlock` and `borderWidth` for block-start.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthBlockStart?: DtBoxBorderWidth;

  /**
   * Border width on the inline axis (aka left/right).
   * Overrides `borderWidth` for inline sides.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthInline?: DtBoxBorderWidth;

  /**
   * Border width on the inline-end side (aka right).
   * Overrides `borderWidthInline` and `borderWidth` for inline-end.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthInlineEnd?: DtBoxBorderWidth;

  /**
   * Border width on the inline-start side (aka left).
   * Overrides `borderWidthInline` and `borderWidth` for inline-start.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthInlineStart?: DtBoxBorderWidth;

  /**
   * Padding on all sides. Accepts spacing token scale values.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  padding?: DtBoxSpacing;

  /**
   * Padding on the block axis (aka top/bottom).
   * Overrides `padding` for the block axis.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingBlock?: DtBoxSpacing;

  /**
   * Padding on the block-end side (aka bottom).
   * Overrides `paddingBlock` and `padding` for block-end.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingBlockEnd?: DtBoxSpacing;

  /**
   * Padding on the block-start side (aka top).
   * Overrides `paddingBlock` and `padding` for block-start.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingBlockStart?: DtBoxSpacing;

  /**
   * Padding on the inline axis (aka left/right).
   * Overrides `padding` for the inline axis.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingInline?: DtBoxSpacing;

  /**
   * Padding on the inline-end side (aka right).
   * Overrides `paddingInline` and `padding` for inline-end.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingInlineEnd?: DtBoxSpacing;

  /**
   * Padding on the inline-start side (aka left).
   * Overrides `paddingInline` and `padding` for inline-start.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingInlineStart?: DtBoxSpacing;

  /**
   * Block size (aka height). Maps to --dt-layout-* tokens.
   * @values 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  blockSize?: DtBoxLayout;

  /**
   * Inline size (aka width). Maps to --dt-layout-* tokens.
   * @values 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  inlineSize?: DtBoxLayout;

  /**
   * Maximum block size. Maps to --dt-layout-* tokens.
   * @values 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  maxBlockSize?: DtBoxLayout;

  /**
   * Minimum block size. Maps to --dt-layout-* tokens.
   * @values 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  minBlockSize?: DtBoxLayout;

  /**
   * Maximum inline size. Maps to --dt-layout-* tokens.
   * @values 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  maxInlineSize?: DtBoxLayout;

  /**
   * Minimum inline size. Maps to --dt-layout-* tokens.
   * @values 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  minInlineSize?: DtBoxLayout;

  /**
   * Box shadow. Maps to --dt-shadow-* tokens.
   * @values small, medium, large, extra-large, card
   */
  shadow?: DtBoxShadow;

  /**
   * CSS position value.
   * @values static, relative, absolute, fixed, sticky
   */
  position?: DtBoxPosition;

  /**
   * Inset on all sides. Accepts spacing coordinate values and negative spacing coordinate values.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800, n1, n25, n50, n75, n100, n125, n150, n175, n200, n250, n300, n350, n400, n450, n500, n525, n550, n600, n650, n700, n750, n800
   */
  inset?: DtBoxInset;

  /**
   * Inset on the block axis (aka top/bottom).
   * Overrides `inset` for the block axis.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800, n1, n25, n50, n75, n100, n125, n150, n175, n200, n250, n300, n350, n400, n450, n500, n525, n550, n600, n650, n700, n750, n800
   */
  insetBlock?: DtBoxInset;

  /**
   * Inset on the block-start side (aka top).
   * Overrides `insetBlock` and `inset` for block-start. Also supports documented percentage coordinates.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800, n1, n25, n50, n75, n100, n125, n150, n175, n200, n250, n300, n350, n400, n450, n500, n525, n550, n600, n650, n700, n750, n800, 50p, 100p, n50p, n100p
   */
  insetBlockStart?: DtBoxInsetSide;

  /**
   * Inset on the block-end side (aka bottom).
   * Overrides `insetBlock` and `inset` for block-end. Also supports documented percentage coordinates.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800, n1, n25, n50, n75, n100, n125, n150, n175, n200, n250, n300, n350, n400, n450, n500, n525, n550, n600, n650, n700, n750, n800, 50p, 100p, n50p, n100p
   */
  insetBlockEnd?: DtBoxInsetSide;

  /**
   * Inset on the inline axis (aka left/right).
   * Overrides `inset` for the inline axis.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800, n1, n25, n50, n75, n100, n125, n150, n175, n200, n250, n300, n350, n400, n450, n500, n525, n550, n600, n650, n700, n750, n800
   */
  insetInline?: DtBoxInset;

  /**
   * Inset on the inline-start side (aka left).
   * Overrides `insetInline` and `inset` for inline-start. Also supports documented percentage coordinates.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800, n1, n25, n50, n75, n100, n125, n150, n175, n200, n250, n300, n350, n400, n450, n500, n525, n550, n600, n650, n700, n750, n800, 50p, 100p, n50p, n100p
   */
  insetInlineStart?: DtBoxInsetSide;

  /**
   * Inset on the inline-end side (aka right).
   * Overrides `insetInline` and `inset` for inline-end. Also supports documented percentage coordinates.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800, n1, n25, n50, n75, n100, n125, n150, n175, n200, n250, n300, n350, n400, n450, n500, n525, n550, n600, n650, n700, n750, n800, 50p, 100p, n50p, n100p
   */
  insetInlineEnd?: DtBoxInsetSide;

  /**
   * Z-index layer. Maps to --zi-* tokens.
   * @values hide, base, base1, selected, active, navigation, navigation-fixed, dropdown, popover, tooltip, drawer, modal, modal-element, notification
   */
  zIndex?: DtBoxZIndex;

  /**
   * Overflow behavior.
   * @values hidden, scroll, auto, clip, visible
   */
  overflow?: DtBoxOverflow;

  /**
   * Additional CSS classes applied to the scrollbar content wrapper element.
   * Only applies when scrollbar prop is set.
   */
  scrollbarContentClass?: ClassValue;
}

/** Own props plus those of the element named by `as` (e.g. `aria-labelledby` for `as="section"`). */
export type DtBoxProps<T extends DtBoxAs = 'div'> =
  DtBoxOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof DtBoxOwnProps<T>>;

const SCROLLBAR_INCOMPATIBLE_ELEMENTS: readonly string[] = ['ul', 'ol', 'span', 'fieldset'];

// Each validated prop and its validator, as in Vue's `defineProps`.
const VALIDATORS: Record<string, BoxValidator> = {
  as: asValidator,
  scrollbar: scrollbarValidator,
  surface: surfaceValidator,
  borderColor: borderColorValidator,
  borderRadius: borderRadiusValidator,
  borderWidth: borderWidthValidator,
  borderWidthBlock: borderWidthValidator,
  borderWidthBlockEnd: borderWidthValidator,
  borderWidthBlockStart: borderWidthValidator,
  borderWidthInline: borderWidthValidator,
  borderWidthInlineEnd: borderWidthValidator,
  borderWidthInlineStart: borderWidthValidator,
  padding: spacingValidator,
  paddingBlock: spacingValidator,
  paddingBlockEnd: spacingValidator,
  paddingBlockStart: spacingValidator,
  paddingInline: spacingValidator,
  paddingInlineEnd: spacingValidator,
  paddingInlineStart: spacingValidator,
  blockSize: layoutValidator,
  inlineSize: layoutValidator,
  maxBlockSize: layoutValidator,
  minBlockSize: layoutValidator,
  maxInlineSize: layoutValidator,
  minInlineSize: layoutValidator,
  shadow: shadowValidator,
  position: positionValidator,
  inset: insetValidator,
  insetBlock: insetValidator,
  insetBlockStart: insetSideValidator,
  insetBlockEnd: insetSideValidator,
  insetInline: insetValidator,
  insetInlineStart: insetSideValidator,
  insetInlineEnd: insetSideValidator,
  zIndex: zIndexValidator,
  overflow: overflowValidator,
};

/**
 * Vue runs a prop's validator whenever the prop is set; `null` and `undefined` (an absent prop) are never validated.
 * This checks each validated prop once per value it takes, so neither re-renders nor StrictMode repeat a warning.
 */
function usePropValidation (values: Record<string, unknown>) {
  const checked = useRef(new Map<string, unknown>());
  useEffect(() => {
    for (const [name, value] of Object.entries(values)) {
      if (value == null) {
        checked.current.delete(name);
        continue;
      }
      if (checked.current.has(name) && Object.is(checked.current.get(name), value)) continue;
      checked.current.set(name, value);
      VALIDATORS[name](value);
    }
  });
}

// React 19 calls a ref callback's returned cleanup on detach instead of calling it with null, so the merged callback
// returns one: each ref gets its own cleanup if it returned one, and null otherwise, as React would do itself.
function mergeRefs<T> (...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
      return undefined;
    });
    return () => {
      refs.forEach((ref, i) => {
        const cleanup = cleanups[i];
        if (typeof cleanup === 'function') cleanup();
        else if (typeof ref === 'function') ref(null);
        else if (ref) ref.current = null;
      });
    };
  };
}

const modifierClass = (prefix: string, value: string | undefined) => (value ? `${prefix}-${value}` : false);

/**
 * Box is a layout primitive: a container with token-based padding, surface, border, sizing, positioning and overflow,
 * and an optional custom scrollbar.
 * @see https://dialtone.dialpad.com/components/box.html
 */
export function DtBox<T extends DtBoxAs = 'div'> (props: DtBoxProps<T>) {
  const {
    as = 'div' as T,
    scrollbar,
    surface,
    borderColor = 'default',
    borderRadius,
    borderWidth,
    borderWidthBlock,
    borderWidthBlockEnd,
    borderWidthBlockStart,
    borderWidthInline,
    borderWidthInlineEnd,
    borderWidthInlineStart,
    padding,
    paddingBlock,
    paddingBlockEnd,
    paddingBlockStart,
    paddingInline,
    paddingInlineEnd,
    paddingInlineStart,
    blockSize,
    inlineSize,
    maxBlockSize,
    minBlockSize,
    maxInlineSize,
    minInlineSize,
    shadow,
    position,
    inset,
    insetBlock,
    insetBlockStart,
    insetBlockEnd,
    insetInline,
    insetInlineStart,
    insetInlineEnd,
    zIndex,
    overflow,
    scrollbarContentClass = '',
    className,
    children,
    ref,
    ...rest
  } = props;

  usePropValidation({
    as,
    scrollbar,
    surface,
    borderColor,
    borderRadius,
    borderWidth,
    borderWidthBlock,
    borderWidthBlockEnd,
    borderWidthBlockStart,
    borderWidthInline,
    borderWidthInlineEnd,
    borderWidthInlineStart,
    padding,
    paddingBlock,
    paddingBlockEnd,
    paddingBlockStart,
    paddingInline,
    paddingInlineEnd,
    paddingInlineStart,
    blockSize,
    inlineSize,
    maxBlockSize,
    minBlockSize,
    maxInlineSize,
    minInlineSize,
    shadow,
    position,
    inset,
    insetBlock,
    insetBlockStart,
    insetBlockEnd,
    insetInline,
    insetInlineStart,
    insetInlineEnd,
    zIndex,
    overflow,
  });

  // Vue's `onMounted` check: once per instance.
  const mountChecked = useRef(false);
  const warnIfScrollbarBreaksStructure = useEffectEvent(() => {
    if (scrollbar && SCROLLBAR_INCOMPATIBLE_ELEMENTS.includes(as)) {
      console.warn(
        `[DtBox] scrollbar prop inserts a <div> wrapper which breaks semantic child structure ` +
        `for <${as}>. Consider applying scrollbar on a parent DtBox container instead.`,
      );
    }
  });
  useEffect(() => {
    if (mountChecked.current) return;
    mountChecked.current = true;
    warnIfScrollbarBreaksStructure();
  }, []);

  // `v-dt-scrollbar:[scrollbarMode]`. Vue's mode for `true` and `'leave'` is `'leave'`, which the directive doesn't
  // know: it logs that and falls back to `'enter'`. `'enter'` is passed for it, which gives the same scrollbar.
  const [el, setEl] = useState<HTMLElement | null>(null);
  const scrollbarMode: ScrollbarShowMode | undefined = scrollbar === true || scrollbar === 'leave'
    ? 'enter'
    : scrollbar;
  useScrollbar(scrollbar ? el : null, undefined, { arg: scrollbarMode });

  const forwardedRef = ref as Ref<HTMLElement> | undefined;
  const rootRef = useMemo(() => mergeRefs<HTMLElement>(setEl, forwardedRef), [forwardedRef]);

  const Component: ElementType = as;
  // The props of whichever element `as` names; TypeScript can't relate a generic `as` to one element's props.
  const attrs = rest as HTMLAttributes<HTMLElement>;
  const boxClassName = cx(
    'd-box',
    // Padding
    modifierClass('d-box--p', padding),
    modifierClass('d-box--pi', paddingInline),
    modifierClass('d-box--pis', paddingInlineStart),
    modifierClass('d-box--pie', paddingInlineEnd),
    modifierClass('d-box--pbl', paddingBlock),
    modifierClass('d-box--pbs', paddingBlockStart),
    modifierClass('d-box--pbe', paddingBlockEnd),
    // Visual
    modifierClass('d-box--surface', surface),
    modifierClass('d-box--bc', borderColor),
    modifierClass('d-box--bw', borderWidth),
    modifierClass('d-box--bwi', borderWidthInline),
    modifierClass('d-box--bwis', borderWidthInlineStart),
    modifierClass('d-box--bwie', borderWidthInlineEnd),
    modifierClass('d-box--bwbl', borderWidthBlock),
    modifierClass('d-box--bwbs', borderWidthBlockStart),
    modifierClass('d-box--bwbe', borderWidthBlockEnd),
    modifierClass('d-box--br', borderRadius),
    modifierClass('d-box--shadow', shadow),
    modifierClass('d-box--of', overflow),
    // Sizing
    modifierClass('d-box--is', inlineSize),
    modifierClass('d-box--bls', blockSize),
    modifierClass('d-box--min-is', minInlineSize),
    modifierClass('d-box--max-is', maxInlineSize),
    modifierClass('d-box--min-bls', minBlockSize),
    modifierClass('d-box--max-bls', maxBlockSize),
    // Positioning
    modifierClass('d-box--ps', position),
    modifierClass('d-box--inset', inset),
    modifierClass('d-box--inset-block', insetBlock),
    modifierClass('d-box--inset-inline', insetInline),
    modifierClass('d-box--ibs', insetBlockStart),
    modifierClass('d-box--ibe', insetBlockEnd),
    modifierClass('d-box--iis', insetInlineStart),
    modifierClass('d-box--iie', insetInlineEnd),
    modifierClass('d-box--zi', zIndex),
    className,
  );

  // Vue's v-if/v-else are two elements: switching the scrollbar on or off replaces the root, so the key does too.
  return (
    <Component
      key={scrollbar ? 'scrollbar' : 'plain'}
      data-qa="dt-box"
      {...attrs}
      ref={rootRef}
      className={boxClassName}
    >
      {scrollbar
        ? (
          <div
            data-qa="dt-box-scrollbar-content"
            className={cx('d-box__scrollbar-content', scrollbarContentClass)}
          >
            {children}
          </div>
        )
        : children}
    </Component>
  );
}
