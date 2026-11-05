import { useEffect, useMemo, type CSSProperties, type ElementType, type HTMLAttributes, type Ref } from 'react';
import { cx } from '../../common/cx';
import {
  TEXT_KIND_MODIFIERS,
  TEXT_VARIANT_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_SIZE_MAP,
  TEXT_HEADLINE_ONLY_SIZES,
  TEXT_FONT_SIZE_MODIFIERS,
  TEXT_FAMILY_MODIFIERS,
  TEXT_ITALIC_CLASS,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_MODIFIERS,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_LINE_CLAMP_CLASS,
  TEXT_WRAP_MODIFIERS,
  TEXT_BOX_TRIM_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
  type TextAlign,
  type TextBoxTrim,
  type TextDensity,
  type TextFamily,
  type TextKind,
  type TextStrength,
  type TextTone,
  type TextVariant,
  type TextWrap,
} from './TextConstants';

const DEFAULT_SIZE = '300';
const SEMANTIC_HEADING_ELEMENTS: readonly unknown[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

// Module-level flag to emit info only once per session
let hasEmittedHeadlineSemanticInfo = false;

// Exported for testing purposes only
export const resetHeadlineSemanticInfoFlag = () => {
  hasEmittedHeadlineSemanticInfo = false;
};

interface DtTextOwnProps {
  /**
   * HTML tag or component used for rendering.
   * @values span, p, h1, h2, h3, h4, h5, h6, label, div, component
   */
  as?: ElementType;

  /**
   * Typography kind mapping to headline/body/label/code token sets.
   * @values headline, body, label, code
   * @deprecated Use variant instead
   */
  kind?: TextKind | null;

  /**
   * Typography variant mapping to a complete token-backed composition.
   * @values headline-3xl, headline-2xl, headline-xl, headline-lg, headline-md, headline-sm, headline-xs, body-lg, body-md, body-sm, body-xs, label-lg, label-md, label-sm, label-xs, code-lg, code-md, code-sm, code-xs
   */
  variant?: TextVariant | null;

  /**
   * Raw font-size token. Must be paired with `variant` for overrides or legacy `kind` for composition size.
   * @values 50, 75, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800
   */
  size?: string | number | null;

  /**
   * Overrides font-family. By default, no font-family class is emitted and text inherits naturally.
   * @values inherit, custom, sans, mono, expressive
   */
  family?: TextFamily | null;

  /** Applies italic font style when true. */
  italic?: boolean;

  /**
   * Semantic foreground color.
   * @values primary, secondary, tertiary, muted, disabled, placeholder, critical, critical-strong, positive, positive-strong, warning, info, info-strong, neutral-black, neutral-white
   */
  tone?: TextTone | null;

  /**
   * Logical text alignment. Requires block/inline-block context.
   * @values start, center, end, justify
   */
  align?: TextAlign | null;

  /** Enables single-line truncation (i.e. ellipsis) when true; requires block/inline-block context. */
  truncate?: boolean;

  /** Applies multi-line truncation (i.e. clamp) when greater than zero; requires block/inline-block context. */
  maxLines?: number | null;

  /** Renders numeric content with tabular figures. */
  numeric?: boolean;

  /**
   * Controls text wrapping behavior.
   * @values wrap, nowrap, balance, pretty
   */
  wrap?: TextWrap | null;

  /**
   * Controls text-box-trim (leading space above/below text). Useful for tight component layouts.
   * @values start, end, both
   */
  textBoxTrim?: TextBoxTrim | null;

  /**
   * Overrides font-weight. Applies to any kind/size combination.
   * @values bold, semibold, medium, normal
   */
  strength?: TextStrength | null;

  /**
   * Overrides line-height. Applies to any kind/size combination.
   * @values 100, 200, 300, 400, 500, 600
   */
  density?: TextDensity | null;
}

export interface DtTextProps extends DtTextOwnProps, Omit<HTMLAttributes<HTMLElement>, keyof DtTextOwnProps> {
  /** The rendered element. */
  ref?: Ref<HTMLElement>;
}

type ModifierMap = Readonly<Record<string, string>>;

/** A modifier map's class for a value. Object keys are strings, so 300 and '300' find the same entry. */
function modifierOf (modifiers: ModifierMap, value: string | number): string | undefined {
  const key = String(value);
  return Object.hasOwn(modifiers, key) ? modifiers[key] : undefined;
}

function getModifierClass (value: string | number | null | undefined, modifiers: ModifierMap, propName: string): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const className = modifierOf(modifiers, value);
  if (!className) {
    console.warn(`[DtText] Unsupported ${propName} "${value}".`);
    return null;
  }

  return className;
}

type ClassInputs = Required<Omit<DtTextOwnProps, 'as'>>;

function getVariantClass ({ kind, variant, size }: ClassInputs): string | null {
  if (variant) {
    return getModifierClass(variant, TEXT_VARIANT_MODIFIERS, 'variant');
  }

  if (!kind) {
    return null;
  }

  if (!Object.hasOwn(TEXT_KIND_MODIFIERS, kind)) {
    console.warn(`[DtText] Unsupported kind "${kind}".`);
    return null;
  }

  const allowedSizes: readonly string[] = TEXT_SIZE_MODIFIERS[kind];
  const rawSize = size != null ? String(size) : null;
  const requestedSize = rawSize || DEFAULT_SIZE;
  let resolvedSize = requestedSize;

  if (!allowedSizes.includes(requestedSize)) {
    // Headline-only sizes (3xl, 2xl, xl, 500, 600, 700) throw an error when used with incompatible kinds
    if ((TEXT_HEADLINE_ONLY_SIZES as readonly string[]).includes(requestedSize)) {
      throw new Error(
        `[DtText] size="${requestedSize}" is only valid for kind="headline". ` +
          `Cannot use with kind="${kind}".`,
      );
    }

    // Universal sizes fall back gracefully with a warning
    const fallbackSize = allowedSizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : allowedSizes[0];
    if (fallbackSize) {
      resolvedSize = fallbackSize;
    }
    console.warn(
      `[DtText] size="${requestedSize}" is not valid for kind="${kind}". Using "${resolvedSize}" instead.`,
    );
  }

  // Map numeric sizes to t-shirt CSS class suffix
  const cssSuffix = modifierOf(TEXT_SIZE_MAP, resolvedSize) || resolvedSize;
  return `${TEXT_KIND_MODIFIERS[kind]}--${cssSuffix}`;
}

function getFontSizeClass ({ kind, variant, size }: ClassInputs): string | null {
  if (size === null || size === undefined) {
    return null;
  }

  if (!variant && !kind) {
    console.warn(
      '[DtText] size must be paired with variant or legacy kind. ' +
        'Prefer variant for typography composition; use size only as a variant override.',
    );
    return null;
  }

  // Legacy kind composition already carries the size.
  if (kind && !variant) {
    return null;
  }

  const className = modifierOf(TEXT_FONT_SIZE_MODIFIERS, size);
  if (className) {
    return className;
  }

  console.warn(`[DtText] Unsupported size "${String(size)}". Use a numeric font-size token.`);
  return null;
}

function getTextClasses (inputs: ClassInputs): string[] {
  const classes = ['d-text'];
  const candidates = [
    getVariantClass(inputs),
    getFontSizeClass(inputs),
    getModifierClass(inputs.family, TEXT_FAMILY_MODIFIERS, 'family'),
    inputs.italic ? TEXT_ITALIC_CLASS : null,
    getModifierClass(inputs.align, TEXT_ALIGN_MODIFIERS, 'align'),
    getModifierClass(inputs.tone, TEXT_TONE_MODIFIERS, 'tone'),
    inputs.truncate ? TEXT_TRUNCATE_CLASS : null,
    inputs.numeric ? TEXT_NUMERIC_CLASS : null,
    inputs.maxLines ? TEXT_LINE_CLAMP_CLASS : null,
    getModifierClass(inputs.wrap, TEXT_WRAP_MODIFIERS, 'wrap'),
    getModifierClass(inputs.textBoxTrim, TEXT_BOX_TRIM_MODIFIERS, 'textBoxTrim'),
    getModifierClass(inputs.strength, TEXT_STRENGTH_MODIFIERS, 'strength'),
    getModifierClass(inputs.density, TEXT_DENSITY_MODIFIERS, 'density'),
  ];
  for (const className of candidates) {
    if (className) {
      classes.push(className);
    }
  }
  return classes;
}

type TextStyle = CSSProperties & { '--dt-text-line-clamp'?: number };

/**
 * Dialtone text primitive that applies typography tokens based on semantic props.
 * @see https://dialtone.dialpad.com/components/text.html
 */
export function DtText ({
  as = 'span',
  kind = null,
  variant = null,
  size = null,
  family = null,
  italic = false,
  tone = null,
  align = null,
  truncate = false,
  maxLines = null,
  numeric = false,
  wrap = null,
  textBoxTrim = null,
  strength = null,
  density = null,
  className,
  style,
  children,
  ...rest
}: DtTextProps) {
  // Memoized like Vue's computed: an unsupported value warns once per change, not on every render.
  const textClasses = useMemo(
    () => getTextClasses({ kind, variant, size, family, italic, tone, align, truncate, maxLines, numeric, wrap, textBoxTrim, strength, density }),
    [kind, variant, size, family, italic, tone, align, truncate, maxLines, numeric, wrap, textBoxTrim, strength, density],
  );
  const textStyles: TextStyle | undefined = maxLines ? { '--dt-text-line-clamp': maxLines } : undefined;

  const usesHeadlineVisualStyle = variant ? variant.startsWith('headline-') : kind === 'headline';
  const isSemanticHeading = SEMANTIC_HEADING_ELEMENTS.includes(as);
  useEffect(() => {
    // Emit info once per session when headline is used without semantic heading element
    if (!hasEmittedHeadlineSemanticInfo && usesHeadlineVisualStyle && !isSemanticHeading) {
      console.info(
        '[DtText] A headline text style is used without a semantic heading element. ' +
          'Consider using as="h1|h2|h3|h4|h5|h6" for better accessibility.',
      );
      hasEmittedHeadlineSemanticInfo = true;
    }
  }, [usesHeadlineVisualStyle, isSemanticHeading]);

  const Component = as;
  return (
    <Component
      data-qa="dt-text"
      {...rest}
      className={cx(textClasses, className)}
      style={textStyles ? { ...textStyles, ...style } : style}
    >
      {children}
    </Component>
  );
}
