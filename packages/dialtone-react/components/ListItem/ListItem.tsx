import {
  useId,
  useState,
  type ComponentPropsWithRef,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useHighlightIdContext } from '../../common/keyboard-list-navigation';
import { DtIconCheck } from '../../icons';
import { DtItemLayout } from '../ItemLayout';
import {
  LIST_ITEM_NAVIGATION_TYPES,
  LIST_ITEM_TYPES,
  type ListItemNavigationType,
  type ListItemRole,
  type ListItemType,
} from './ListItemConstants';

interface DtListItemOwnProps<T extends ElementType = 'li'> {
  /** Additional classes for the root element. */
  className?: string;

  /** Id for the item. Defaults to a generated unique id. */
  id?: string;

  /**
   * Contextual role: listitem for ordinary lists, menuitem for menu actions,
   * menuitemradio for persistent mutually exclusive menu choices, option for listboxes.
   * selected never changes the role automatically.
   * @values listitem, menuitem, option, menuitemradio
   */
  role?: ListItemRole;

  /** HTML element type (tag name) of the content wrapper element. */
  elementType?: T;

  /**
   * The type of child list item to use.
   * @values default, custom
   */
  type?: ListItemType;

  /**
   * The type of navigation that this component should support.
   * - "arrow-keys" for items that are navigated with UP/DOWN keys.
   * - "tab" for items that are navigated using the TAB key.
   * - "none" for static items that are not interactive.
   * @values arrow-keys, tab, none
   */
  navigationType?: ListItemNavigationType;

  /** Shows a selected checkmark. For menuitemradio, also sets aria-checked independently of highlight. */
  selected?: boolean;

  /**
   * Marks the item unavailable. Sets aria-disabled="true" and the disabled style, and stops
   * the item from calling onClick for pointer, Enter or Space activation. The item stays
   * focusable and reachable by keyboard navigation, and still calls onKeyDown, onMouseMove and
   * onMouseLeave. Only the item's own activation is gated: a parent that selects by
   * highlighted index, such as Combobox on Enter, must check availability itself.
   * Don't also set an aria-disabled attribute: it overrides the announced state, while this prop
   * still controls the style and activation.
   */
  disabled?: boolean;

  /**
   * Additional classes to apply to the wrapper element, note: it only applies on "default" type.
   * Same API as Vue's class binding: a string, an object or an array.
   */
  wrapperClass?: ClassValue;

  /** Slot for the start content. */
  start?: ReactNode;

  /** @deprecated Use start */
  left?: ReactNode;

  /** Slot for the end content. */
  end?: ReactNode;

  /** @deprecated Use end */
  right?: ReactNode;

  /** Slot for the content below the main content. */
  subtitle?: ReactNode;

  /** Slot for the content below the subtitle. */
  blockEnd?: ReactNode;

  /** @deprecated Use blockEnd */
  bottom?: ReactNode;

  /** Slot for the main content. In the "custom" type, it is the whole content of the item. */
  children?: ReactNode;

  /** Native click event. Also called, with the keyboard event, when Enter or Space is pressed. */
  onClick?: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;

  /** Key down event. */
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;

  /** Native mouse move event. */
  onMouseMove?: (event: MouseEvent<HTMLElement>) => void;

  /** Native mouse leave event. */
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
}

/** Like Vue's `$attrs`, every other attribute goes on the root element, `ref` included. */
export type DtListItemProps<T extends ElementType = 'li'> =
  DtListItemOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof DtListItemOwnProps<T>>;

/**
 * A list item is an element that can be used to represent individual items in a list.
 * @see https://dialtone.dialpad.com/components/list_item.html
 */
export function DtListItem<T extends ElementType = 'li'> ({
  id: idProp,
  role = 'listitem',
  elementType = 'li' as T, // the default is the T default
  type = LIST_ITEM_TYPES.DEFAULT,
  navigationType = LIST_ITEM_NAVIGATION_TYPES.NONE,
  selected = false,
  disabled = false,
  wrapperClass = '',
  start,
  left,
  end,
  right,
  subtitle,
  blockEnd,
  bottom,
  children,
  className,
  onClick,
  onKeyDown,
  onMouseMove,
  onMouseLeave,
  ...rest
}: DtListItemProps<T>) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const highlightId = useHighlightIdContext();
  const [mouseHighlighted, setMouseHighlighted] = useState(false);

  const isDefaultType = type === LIST_ITEM_TYPES.DEFAULT;
  const isFocusable = navigationType === LIST_ITEM_NAVIGATION_TYPES.TAB;
  const isHoverable = navigationType !== LIST_ITEM_NAVIGATION_TYPES.NONE;

  // For keyboard navigation, whether this item is currently highlighted.
  // An injected highlightId overrides the default mouseover highlight.
  const injectedHighlightId = highlightId?.();
  const isHighlighted = isHoverable
    ? (injectedHighlightId ? id === injectedHighlightId : mouseHighlighted)
    : false;

  const isMenuItemRadio = role === 'menuitemradio';

  const handleClick = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    if (disabled) {
      // Also cancel the native default, such as navigation when elementType is "a".
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const root = event.currentTarget;
    // event.key, not event.code, so the keypad Enter activates too.
    const isEnter = event.key === 'Enter';
    const isSpace = event.key === ' ';
    // A native button already turns Enter and Space into a click, and a link Enter, so synthesizing one would
    // call onClick twice. A menu radio cancels the key's default, which also cancels that native click, so it
    // synthesizes its own. Keys typed in a descendant (an input) don't activate the item.
    const activatesNatively = !isMenuItemRadio && (root instanceof HTMLButtonElement ||
      (root instanceof HTMLAnchorElement && root.hasAttribute('href') && isEnter));
    if ((isEnter || isSpace) && event.target === root && !activatesNatively) {
      // Space would otherwise scroll the page.
      if (isSpace || isMenuItemRadio) event.preventDefault();
      handleClick(event);
    }
    onKeyDown?.(event);
  };

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    setMouseHighlighted(true);
    onMouseMove?.(event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
    setMouseHighlighted(false);
    onMouseLeave?.(event);
  };

  const Component: ElementType = elementType;
  return (
    <Component
      id={id}
      className={cx('d-list-item', {
        'd-list-item--focusable': isFocusable,
        'd-list-item--highlighted': isHighlighted,
        'd-list-item--static': !isHoverable,
        'd-list-item--disabled': disabled,
      }, className)}
      tabIndex={isFocusable ? 0 : -1}
      role={role}
      aria-selected={role === 'listitem' || isMenuItemRadio ? undefined : isHighlighted}
      aria-checked={isMenuItemRadio ? selected : undefined}
      aria-disabled={disabled ? 'true' : undefined}
      {...rest}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {isDefaultType
        ? (
          <DtItemLayout
            unstyled
            className={cx('d-list-item__wrapper', wrapperClass)}
            startClass="d-list-item__left"
            contentClass="d-list-item__content"
            titleClass="d-list-item__title"
            subtitleClass="d-list-item__subtitle"
            blockEndClass="d-list-item__bottom"
            endClass="d-list-item__right"
            selectedClass="d-list-item__selected"
            data-qa="dt-list-item-wrapper"
            start={start}
            left={left}
            subtitle={subtitle}
            blockEnd={blockEnd}
            bottom={bottom}
            end={end}
            right={right}
            selected={selected ? <DtIconCheck size="200" /> : undefined}
          >
            {children}
          </DtItemLayout>
        )
        : children}
    </Component>
  );
}
