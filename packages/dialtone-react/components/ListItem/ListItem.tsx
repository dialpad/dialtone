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
  type ListItemType,
} from './ListItemConstants';

interface DtListItemOwnProps {
  /** Id for the item. Defaults to a generated unique id. */
  id?: string;

  /**
   * String to use for the item's role.
   * @values listitem, menuitem, option
   */
  role?: 'listitem' | 'menuitem' | 'option';

  /** HTML element type (tag name) of the content wrapper element. */
  elementType?: string;

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

  /** Applies selected styles to the list item. */
  selected?: boolean;

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
export type DtListItemProps = DtListItemOwnProps & Omit<ComponentPropsWithRef<'li'>, keyof DtListItemOwnProps>;

/**
 * A list item is an element that can be used to represent individual items in a list.
 * @see https://dialtone.dialpad.com/components/list_item.html
 */
export function DtListItem ({
  id: idProp,
  role = 'listitem',
  elementType = 'li',
  type = LIST_ITEM_TYPES.DEFAULT,
  navigationType = LIST_ITEM_NAVIGATION_TYPES.NONE,
  selected = false,
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
}: DtListItemProps) {
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

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (['enter', 'space'].includes(event.code.toLowerCase())) {
      onClick?.(event);
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

  // Any tag name: a string outside React's intrinsic element names isn't assignable to ElementType without the cast.
  const Component = elementType as ElementType;
  return (
    <Component
      id={id}
      className={cx('d-list-item', {
        'd-list-item--focusable': isFocusable,
        'd-list-item--highlighted': isHighlighted,
        'd-list-item--static': !isHoverable,
      }, className)}
      tabIndex={isFocusable ? 0 : -1}
      role={role}
      aria-selected={role === 'listitem' ? undefined : isHighlighted}
      {...rest}
      onClick={onClick}
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
