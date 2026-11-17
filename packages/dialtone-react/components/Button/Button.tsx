import {
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { DtRouterLink, type DtLinkTo } from '../../common/link';
import { useI18n } from '../../common/localization';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import type { IconSize } from '../../icons';
import { getLinkKindModifier, LINK_KIND_MODIFIERS } from '../Link/LinkConstants';
import { DtLoader } from '../Loader/Loader';
import {
  BUTTON_ICON_SIZES,
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_SIZE_MODIFIERS,
  ICON_POSITION_MODIFIERS,
  INVALID_COMBINATION,
  type ButtonIconPosition,
  type ButtonImportance,
  type ButtonKind,
  type ButtonSize,
  type ButtonType,
} from './ButtonConstants';

/** The scope Vue's icon slots pass: the icon size that matches the button's size. */
export interface DtButtonIconSlotScope {
  iconSize: IconSize | undefined;
}

type ButtonElement = HTMLButtonElement | HTMLAnchorElement;
type LinkKind = keyof typeof LINK_KIND_MODIFIERS;

interface DtButtonOwnProps {
  /**
   * Whether the button is a circle or not. Use only with icon-only buttons.
   * @values true, false
   */
  circle?: boolean;

  /**
   * The position of the icon slot within the button.
   * @deprecated Use startIcon / endIcon / blockStartIcon / blockEndIcon instead.
   * @values start, end, blockStart, blockEnd, left, right, top, bottom
   */
  iconPosition?: ButtonIconPosition;

  /**
   * The fill and outline of the button associated with its visual importance.
   * @values clear, outlined, primary
   */
  importance?: ButtonImportance;

  /**
   * Whether the button should be styled as a link or not.
   * @values true, false
   * @see DtLink
   */
  link?: boolean;

  /**
   * The color of the link and button if the button is styled as a link.
   * @values default, critical, warning, positive, muted, info, mention
   * @see DtLink
   */
  linkKind?: LinkKind;

  /**
   * Determines whether the link-styled button should display an underline.
   * Only applies when the link prop is true.
   * @values true, false
   */
  linkUnderline?: boolean;

  /**
   * HTML button disabled attribute. On a link (`href` or `to`), sets `aria-disabled` and `tabindex="-1"`, drops
   * `href`, and cancels clicks instead.
   * @values true, false
   */
  disabled?: boolean;

  /**
   * HTML button type attribute
   * @values button, submit, reset
   */
  type?: ButtonType;

  /** Button width, accepts CSS width attribute values */
  width?: string | null;

  /**
   * The size of the button.
   * @values 100, 200, 300, 400, 500
   */
  size?: ButtonSize;

  /** Used to customize the label container */
  labelClass?: ClassValue;

  /** Used to customize the leading container */
  leadingClass?: ClassValue;

  /** Used to customize the trailing container */
  trailingClass?: ClassValue;

  /** Used to customize the start icon container */
  startIconClass?: ClassValue;

  /** Used to customize the end icon container */
  endIconClass?: ClassValue;

  /** Used to customize the block-start (aka top) icon container */
  blockStartIconClass?: ClassValue;

  /** Used to customize the block-end (aka bottom) icon container */
  blockEndIconClass?: ClassValue;

  /**
   * Used to customize the legacy icon container
   * @deprecated Use startIconClass or endIconClass
   */
  iconClass?: ClassValue;

  /**
   * Whether the button should display a loading animation or not.
   * @values true, false
   */
  loading?: boolean;

  /**
   * The color of the button.
   * The inverted value is deprecated and will be removed in the next major version.
   * @values default, unstyled, muted, critical, positive, inverted
   */
  kind?: ButtonKind;

  /**
   * Determines whether a screenreader reads live updates of the button content to the user while the button is in
   * focus. default is to not.
   * @values true, false
   */
  assertiveOnFocus?: boolean;

  /**
   * Determines whether the button should have active styling
   * default is false.
   * @values true, false
   */
  active?: boolean;

  /**
   * Router destination. When provided, renders the DtLinkProvider's link component for client-side navigation.
   * Takes precedence over `href`.
   */
  to?: DtLinkTo | null;

  /** When provided, renders an `<a>` element for standard browser navigation. */
  href?: string | null;

  /**
   * HTML anchor target attribute. Only applied when using the `href` prop.
   * @values _self, _blank, _parent, _top
   */
  target?: string | null;

  /** HTML anchor rel attribute. Only applied when using the `href` prop. */
  rel?: string | null;

  /**
   * When true, navigation will not leave a history entry. Only applied when using the `to` prop.
   * @values true, false
   */
  replace?: boolean;

  /** Content within button */
  children?: ReactNode;

  /** Optional leading content at the start of the button, such as badges or indicators */
  leading?: ReactNode;

  /** Optional trailing content at the end of the button, such as badges or indicators */
  trailing?: ReactNode;

  /** Icon displayed above the button label (block-start) */
  blockStartIcon?: SlotProp<DtButtonIconSlotScope>;

  /** Icon displayed at the start (aka left) of the button */
  startIcon?: SlotProp<DtButtonIconSlotScope>;

  /**
   * Button icon
   * @deprecated Use startIcon / endIcon / blockStartIcon / blockEndIcon instead.
   */
  icon?: SlotProp<DtButtonIconSlotScope>;

  /** Icon displayed at the end (aka right) of the button */
  endIcon?: SlotProp<DtButtonIconSlotScope>;

  /** Icon displayed below the button label (block-end) */
  blockEndIcon?: SlotProp<DtButtonIconSlotScope>;

  /** Native focus event (Vue's `focusin`). */
  onFocus?: (event: FocusEvent<ButtonElement>) => void;

  /** Native blur event (Vue's `focusout`). */
  onBlur?: (event: FocusEvent<ButtonElement>) => void;

  onClick?: (event: MouseEvent<ButtonElement>) => void;

  onKeyDown?: (event: KeyboardEvent<ButtonElement>) => void;

  /** The rendered `<button>` or `<a>`. */
  ref?: Ref<ButtonElement>;
}

type NativeAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof DtButtonOwnProps
>;

export type DtButtonProps = DtButtonOwnProps & NativeAttributes;

const modifierOf = (modifiers: Readonly<Record<string, string>>, key: string) =>
  (Object.hasOwn(modifiers, key) ? modifiers[key] : undefined);

/**
 * A button is a UI element which allows users to take an action throughout the app.
 * It is important a button is identifiable, consistent, and communicates its actions clearly,
 * and is appropriately sized to its action.
 * @see https://dialtone.dialpad.com/components/button.html
 */
export function DtButton ({
  circle = false,
  iconPosition = 'start',
  importance = 'primary',
  link = false,
  linkKind = 'default',
  linkUnderline = true,
  disabled = false,
  type = 'button',
  width = null,
  size = 300,
  labelClass = '',
  leadingClass = '',
  trailingClass = '',
  startIconClass = '',
  endIconClass = '',
  blockStartIconClass = '',
  blockEndIconClass = '',
  iconClass = '',
  loading = false,
  kind = 'default',
  assertiveOnFocus = false,
  active = false,
  to = null,
  href = null,
  target = null,
  rel = null,
  replace = false,
  children,
  leading,
  trailing,
  blockStartIcon,
  startIcon,
  icon,
  endIcon,
  blockEndIcon,
  className,
  style,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
  ref,
  ...rest
}: DtButtonProps) {
  const i18n = useI18n();
  const [isInFocus, setIsInFocus] = useState(false);

  useValidatePropCombination(circle, kind, importance, link);

  const isNativeButton = !to && !href;
  const styled = kind !== 'unstyled';
  const iconSize = modifierOf(BUTTON_ICON_SIZES, String(size)) as IconSize | undefined;
  const scope: DtButtonIconSlotScope = { iconSize };

  const blockStartIconContent = renderSlot(blockStartIcon, scope);
  const startIconContent = renderSlot(startIcon, scope);
  const iconContent = renderSlot(icon, scope);
  const endIconContent = renderSlot(endIcon, scope);
  const blockEndIconContent = renderSlot(blockEndIcon, scope);

  const hasBlockStartIcon = hasContent(blockStartIconContent);
  const hasStartIcon = hasContent(startIconContent);
  const hasEndIcon = hasContent(endIconContent);
  const hasBlockEndIcon = hasContent(blockEndIconContent);
  const hasLabel = hasContent(children);
  const hasNewIconSlots = hasStartIcon || hasEndIcon || hasBlockStartIcon || hasBlockEndIcon;
  const shouldRenderLegacyIcon = hasContent(iconContent) && !hasNewIconSlots && !link;
  const isIconOnly = (hasNewIconSlots || shouldRenderLegacyIcon) && !hasLabel;
  const isVerticalIconLayout = !isIconOnly && (hasBlockStartIcon || hasBlockEndIcon ||
    (!hasNewIconSlots && ['top', 'bottom'].includes(iconPosition)));

  const buttonClasses = (): ClassValue => {
    if (link) {
      return [
        'd-link',
        getLinkKindModifier(linkKind, false),
        modifierOf(BUTTON_SIZE_MODIFIERS, String(size)),
        { 'd-link--no-underline': !linkUnderline },
      ];
    }
    if (!styled) return ['d-btn--unstyled'];
    return [
      'd-btn',
      modifierOf(BUTTON_IMPORTANCE_MODIFIERS, importance),
      modifierOf(BUTTON_KIND_MODIFIERS, kind),
      modifierOf(BUTTON_SIZE_MODIFIERS, String(size)),
      {
        'd-btn--circle': circle,
        'd-btn--loading': loading,
        'd-btn--icon-only': isIconOnly,
        'd-btn--vertical': isVerticalIconLayout,
        'd-btn--active': active,
      },
    ];
  };

  const iconClasses = (positionClass: string | undefined, consumerClass: ClassValue) => cx(
    'base-button__icon',
    { 'd-btn__icon': styled, ...(positionClass && { [positionClass]: styled }) },
    consumerClass,
  );

  const handleFocus = (event: FocusEvent<ButtonElement>) => {
    setIsInFocus(assertiveOnFocus);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<ButtonElement>) => {
    setIsInFocus(false);
    onBlur?.(event);
  };

  const handleClick = (event: MouseEvent<ButtonElement>) => {
    // A disabled link can't be disabled natively: cancel the click, and stop it reaching the consumer's handler and
    // the ancestors' ones, as Vue's stopImmediatePropagation() does.
    if (!isNativeButton && disabled) {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<ButtonElement>) => {
    // <a> only responds to Enter natively, but buttons respond to both Enter and Space.
    if (!isNativeButton && (event.key === ' ' || event.code === 'Space')) {
      event.preventDefault();
      if (!disabled) (event.target as HTMLElement).click();
    }
    onKeyDown?.(event);
  };

  // Vue's own attributes come first and the consumer's ($attrs) last, so a consumer's `aria-label`, `aria-live` or
  // `data-qa` wins, as it does in Vue.
  const rootProps = {
    className: cx('base-button__button', buttonClasses(), className),
    'data-qa': 'dt-button',
    style: (width != null || style) ? { width: width ?? undefined, ...style } as CSSProperties : undefined,
    'aria-live': assertiveOnFocus && isInFocus ? 'assertive' as const : undefined,
    'aria-label': loading ? i18n.$t('DIALTONE_LOADING') : undefined,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };
  const disabledLinkProps = disabled ? { 'aria-disabled': 'true' as const, tabIndex: -1 } : {};

  const content = (
    <>
      {loading && styled && (
        <DtLoader
          className="d-btn__loader"
          size={iconSize}
          aria-hidden="true"
        />
      )}
      {hasContent(leading) && (
        <span className={cx('d-btn__leading', leadingClass)}>
          {leading}
        </span>
      )}
      {hasBlockStartIcon && (
        <span
          data-qa="dt-button-block-start-icon"
          className={iconClasses('d-btn__icon--top', blockStartIconClass)}
        >
          {blockStartIconContent}
        </span>
      )}
      {hasStartIcon && (
        <span
          data-qa="dt-button-start-icon"
          className={iconClasses('d-btn__icon--left', startIconClass)}
        >
          {startIconContent}
        </span>
      )}
      {shouldRenderLegacyIcon && (
        <span
          data-qa="dt-button-icon"
          className={iconClasses(modifierOf(ICON_POSITION_MODIFIERS, iconPosition), iconClass)}
        >
          {iconContent}
        </span>
      )}
      {hasLabel && (
        <span
          data-qa="dt-button-label"
          className={cx('base-button__label', { 'd-btn__label': styled }, labelClass)}
        >
          {children}
        </span>
      )}
      {hasEndIcon && (
        <span
          data-qa="dt-button-end-icon"
          className={iconClasses('d-btn__icon--right', endIconClass)}
        >
          {endIconContent}
        </span>
      )}
      {hasBlockEndIcon && (
        <span
          data-qa="dt-button-block-end-icon"
          className={iconClasses('d-btn__icon--bottom', blockEndIconClass)}
        >
          {blockEndIconContent}
        </span>
      )}
      {hasContent(trailing) && (
        <span className={cx('d-btn__trailing', trailingClass)}>
          {trailing}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <DtRouterLink
        {...rootProps}
        to={to}
        replace={replace}
        {...disabledLinkProps}
        {...rest}
        ref={ref as Ref<HTMLAnchorElement>}
      >
        {content}
      </DtRouterLink>
    );
  }

  if (href) {
    return (
      <a
        {...rootProps}
        href={disabled ? undefined : href}
        target={target ?? undefined}
        rel={rel ?? undefined}
        {...disabledLinkProps}
        {...rest}
        ref={ref as Ref<HTMLAnchorElement>}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...rootProps}
      type={type}
      disabled={disabled}
      {...rest}
      ref={ref as Ref<HTMLButtonElement>}
    >
      {content}
    </button>
  );
}

/**
 * Vue's `propCombination` watcher (immediate): warns about combinations the design system doesn't have, on mount and
 * whenever one of them changes. The ref keeps StrictMode's second effect run from warning twice.
 */
function useValidatePropCombination (circle: boolean, kind: string, importance: string, link: boolean) {
  const lastChecked = useRef<string | null>(null);
  useEffect(() => {
    const combination = JSON.stringify([circle, kind, importance, link]);
    if (lastChecked.current === combination) return;
    lastChecked.current = combination;

    if (circle && link) {
      console.warn('You cannot enable circle and link at the same time');
    }
    // Unstyled buttons skip validation.
    if (kind === 'unstyled') return;
    const invalid = INVALID_COMBINATION.find(row =>
      row.circle === circle && row.kind === kind && row.importance === importance);
    if (invalid) console.warn(invalid.message);
  }, [circle, kind, importance, link]);
}
