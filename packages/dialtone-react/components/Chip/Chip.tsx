import { Fragment, isValidElement, useId, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode, type Ref } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useI18n } from '../../common/localization';
import { hasContent } from '../../common/slots';
import { DtIconClose, type IconSize } from '../../icons';
import { DtButton } from '../Button';
import {
  CHIP_CLOSE_BUTTON_SIZE_MODIFIERS,
  CHIP_ICON_SIZES,
  CHIP_SIZE_MODIFIERS,
  type ChipSize,
} from './ChipConstants';

type ChipElement = HTMLButtonElement | HTMLSpanElement;

interface DtChipOwnProps {
  /**
   * Whether the chip is disabled
   * @values true, false
   */
  disabled?: boolean;

  /**
   * Shows the close button on the chip
   * @values true, false
   */
  showClose?: boolean;

  /**
   * The size of the chip.
   * @values 100, 200, 300
   */
  size?: ChipSize;

  /**
   * The interactivity of the chip.
   * Makes chip clickable, apply hover/focus/active style, emit keyboard events etc.
   * @values true, false
   */
  interactive?: boolean;

  /** Id to use for the dialog's aria-labelledby. Generated when unset. */
  id?: string;

  /**
   * Descriptive label for the chip content.
   * If this prop is unset the content in the default slot will be used as an aria-label.
   */
  ariaLabel?: string;

  /** Additional class name for the chip element. */
  contentClass?: ClassValue;

  /** Additional class name for the span element. */
  labelClass?: ClassValue;

  /** Additional class name for the icon wrapper element. */
  iconClass?: ClassValue;

  /** Additional class name for the avatar wrapper element. */
  avatarClass?: ClassValue;

  /**
   * Vue reads this attribute to render the chip as a member of a chip group: it swaps the label class `d-chip__label`
   * for `d-chip`. It also stays on the root element as an attribute, as in Vue.
   */
  'grouped-chip'?: boolean | string;

  /** Content within the chip */
  children?: ReactNode;

  /** Slot for Chip icon */
  icon?: ReactNode;

  /** Slot for Chip avatar */
  avatar?: ReactNode;

  /** Native chip click event. Only called when the chip is interactive. */
  onClick?: (event: MouseEvent<ChipElement>) => void;

  /** Close button click event, or Delete pressed on the chip (when the close button shows). */
  onClose?: () => void;

  /** Native chip key up event */
  onKeyUp?: (event: KeyboardEvent<ChipElement>) => void;

  /** Native chip key down event. Not called for Delete, which closes the chip. */
  onKeyDown?: (event: KeyboardEvent<ChipElement>) => void;

  /** The element that shows the chip's content: a `<button>` when interactive, otherwise a `<span>`. */
  ref?: Ref<ChipElement>;
}

/** Like Vue's `$attrs`, anything else goes to the root `<span class="d-chip">`. */
type RootAttributes = Omit<HTMLAttributes<HTMLSpanElement>, keyof DtChipOwnProps>;

export type DtChipProps = DtChipOwnProps & RootAttributes;

const modifierOf = (modifiers: Readonly<Record<string, string>>, key: string) =>
  (Object.hasOwn(modifiers, key) ? modifiers[key] : undefined);

const isEmptyFragment = (node: ReactNode) =>
  isValidElement<{ children?: ReactNode }>(node) && node.type === Fragment && !hasContent(node.props.children);

/**
 * A chip is a compact UI element that provides brief, descriptive information about an element.
 * It is terse, ideally one word. It is important a button is identifiable, consistent, and
 * communicates its actions clearly, and is appropriately sized to its action.
 * @see https://dialtone.dialpad.com/components/chip.html
 */
export function DtChip ({
  disabled = false,
  showClose = true,
  size = 300,
  interactive = false,
  id: idProp,
  ariaLabel = '',
  contentClass = '',
  labelClass = '',
  iconClass = '',
  avatarClass = '',
  'grouped-chip': groupedChip,
  children,
  icon,
  avatar,
  className,
  onClick,
  onClose,
  onKeyUp,
  onKeyDown,
  ref,
  ...rest
}: DtChipProps) {
  const i18n = useI18n();
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const closeButtonTitle = i18n.$t('DIALTONE_CLOSE_BUTTON');
  const closeButtonIconSize = modifierOf(CHIP_ICON_SIZES, String(size)) as IconSize | undefined;

  const handleClick = (event: MouseEvent<ChipElement>) => {
    if (interactive) onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<ChipElement>) => {
    if (event.code?.toLowerCase() === 'delete') {
      if (showClose) onClose?.();
    } else {
      onKeyDown?.(event);
    }
  };

  const chipProps = {
    id,
    // Vue binds `interactive && 'button'`, so a non-interactive chip's <span> gets type="false". Kept for DOM parity.
    type: interactive ? 'button' : 'false',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabel ? undefined : `${id}-content`,
    'aria-disabled': disabled,
    className: cx(
      groupedChip ? 'd-chip' : 'd-chip__label',
      modifierOf(CHIP_SIZE_MODIFIERS, String(size)),
      labelClass,
      disabled && 'd-chip--disabled',
    ),
    'data-qa': 'dt-chip',
    tabIndex: disabled ? -1 : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onKeyUp,
  };

  // Vue rejects a fragment with no children as slot content, so an empty `<></>` icon falls back to the avatar.
  const hasIcon = hasContent(icon) && !isEmptyFragment(icon);

  const chipContent = (
    <>
      {hasIcon
        ? (
          <span className={cx('d-chip__icon', iconClass)} data-qa="dt-chip-icon">
            {icon}
          </span>
        )
        : hasContent(avatar) && (
          <span className={cx('d-chip__avatar', avatarClass)} data-qa="dt-chip-avatar">
            {avatar}
          </span>
        )}
      {hasContent(children) && (
        <span id={`${id}-content`} className={cx('d-chip__text', contentClass)} data-qa="dt-chip-label">
          {children}
        </span>
      )}
    </>
  );

  return (
    <span
      {...(groupedChip !== undefined && { 'grouped-chip': String(groupedChip) })}
      className={cx('d-chip', className)}
      {...rest}
    >
      {interactive
        ? <button {...chipProps} type="button" ref={ref as Ref<HTMLButtonElement>}>{chipContent}</button>
        : <span {...chipProps} ref={ref as Ref<HTMLSpanElement>}>{chipContent}</span>}
      {showClose && (
        <DtButton
          className={cx(
            'd-chip__close',
            modifierOf(CHIP_CLOSE_BUTTON_SIZE_MODIFIERS, String(size)),
            disabled && 'd-chip__close--disabled',
          )}
          data-qa="dt-chip-close"
          aria-label={closeButtonTitle}
          aria-disabled={disabled}
          title={closeButtonTitle}
          tabIndex={disabled ? -1 : undefined}
          onClick={() => onClose?.()}
          startIcon={<DtIconClose size={closeButtonIconSize} />}
        />
      )}
    </span>
  );
}
