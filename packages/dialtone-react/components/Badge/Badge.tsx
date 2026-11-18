import { Children, Fragment, isValidElement, useEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import type { IconSize } from '../../icons';
import {
  BADGE_DECORATION_MODIFIERS,
  BADGE_KIND_MODIFIERS,
  BADGE_TYPE_MODIFIERS,
  type BadgeDecoration,
  type BadgeKind,
  type BadgeType,
} from './BadgeConstants';

/** The scope of the startIcon and endIcon slots. */
export interface DtBadgeIconScope {
  iconSize: IconSize;
}

interface DtBadgeOwnProps {
  /**
   * The size of the start and end icons.
   * @values 100, 200, 300, 400, 500, 600, 700, 800
   */
  iconSize?: IconSize;

  /** Text for the badge content. Used when there are no `children`. */
  text?: string;

  /**
   * The kind of badge which determines the styling.
   * @values label, count
   */
  kind?: BadgeKind;

  /**
   * Color for the badge background.
   * @values default, info, positive, warning, critical, bulletin, ai
   */
  type?: BadgeType;

  /**
   * Decoration for the badge. This can be only used with kind: label and type: default
   * with no start and end icons.
   * @values black-400, black-500, black-900, red-200, red-300, red-400, purple-200,
   * purple-300, purple-400, purple-500, blue-200, blue-300, blue-400, green-300, green-400,
   * green-500, gold-300, gold-400, gold-500, magenta-200, magenta-300, magenta-400
   */
  decoration?: BadgeDecoration;

  /** Used to customize the label container. */
  labelClass?: ClassValue;

  /** Used to customize the start icon container. */
  startIconClass?: ClassValue;

  /** Used to customize the end icon container. */
  endIconClass?: ClassValue;

  /**
   * Shows a subtle appearance for the badge.
   * Currently only affects the badge when type is bulletin.
   */
  subtle?: boolean;

  /** Outlines the badge with a border. */
  outlined?: boolean;

  /** Slot for start icon. A function receives `{ iconSize }`, which defaults to 200. */
  startIcon?: SlotProp<DtBadgeIconScope>;

  /** Slot for end icon. A function receives `{ iconSize }`, which defaults to 200. */
  endIcon?: SlotProp<DtBadgeIconScope>;

  /** Slot for badge content, defaults to the `text` prop. */
  children?: ReactNode;
}

/** Attributes and handlers that Vue lets fall through to the root `<span>`, and the root's `ref`. */
export interface DtBadgeProps extends DtBadgeOwnProps, Omit<ComponentPropsWithRef<'span'>, keyof DtBadgeOwnProps> {}

// Children.toArray doesn't look inside a Fragment, as Vue's helper does with a vnode's children,
// so an empty Fragment is unwrapped here and counts as empty.
function hasSlotContent (node: ReactNode): boolean {
  return Children.toArray(node).some(child => isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
    ? hasSlotContent(child.props.children)
    : hasContent(child));
}

// The default slot's fallback test: like Children.toArray(x).length > 0 (an empty string counts, as in Vue),
// but an empty Fragment is unwrapped and counts as empty.
function hasChildren (node: ReactNode): boolean {
  return Children.toArray(node).some(child => isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
    ? hasChildren(child.props.children)
    : true);
}

/**
 * A badge is a compact UI element that provides brief, descriptive information about an element.
 * It is terse, ideally one word.
 * @see https://dialtone.dialpad.com/components/badge.html
 */
export function DtBadge ({
  iconSize = 200,
  text = '',
  kind = 'label',
  type = 'default',
  decoration,
  labelClass = '',
  startIconClass = '',
  endIconClass = '',
  subtle = false,
  outlined = false,
  startIcon,
  endIcon,
  children,
  className,
  ...rest
}: DtBadgeProps) {
  const scope: DtBadgeIconScope = { iconSize };
  const startNode = renderSlot(startIcon, scope);
  const endNode = renderSlot(endIcon, scope);
  const hasStartIcon = hasSlotContent(startNode);
  const hasEndIcon = hasSlotContent(endNode);

  // Vue validates in mounted() and updated(). Here the checks run on mount and when what they read changes,
  // and not again for an unrelated re-render or StrictMode's second mount.
  const checked = useRef<string | null>(null);
  useEffect(() => {
    const key = JSON.stringify([type, kind, subtle, decoration, hasStartIcon || hasEndIcon]);
    if (checked.current === key) return;
    checked.current = key;

    if (type === 'ai' && kind === 'count') {
      console.error('DtBadge error: type: \'ai\' with kind: \'count\' is an invalid combination.');
    }
    if (type !== 'bulletin' && subtle) {
      console.error('DtBadge error: subtle can only be used with type \'bulletin\'');
    }
    if (!decoration) return;
    if (kind !== 'label' || type !== 'default') {
      console.error('DtBadge error: decoration prop can only be used with kind: \'label\' and type: \'default\'.');
    }
    if (hasStartIcon || hasEndIcon) {
      console.error('DtBadge error: decoration prop cannot be used with startIcon or endIcon.');
    }
  }, [type, kind, subtle, decoration, hasStartIcon, hasEndIcon]);

  return (
    <span
      data-qa="dt-badge"
      {...rest}
      className={cx(
        'd-badge',
        BADGE_TYPE_MODIFIERS[type],
        BADGE_KIND_MODIFIERS[kind],
        decoration && BADGE_DECORATION_MODIFIERS[decoration],
        { 'd-badge--subtle': subtle },
        { 'd-badge--outlined': outlined },
        className,
      )}
    >
      {decoration && <span className="d-badge__decorative" />}
      {hasStartIcon && <span className={cx('d-badge__icon-left', startIconClass)}>{startNode}</span>}
      <span className={cx('d-badge__label', labelClass)}>
        {hasChildren(children) ? children : text}
      </span>
      {hasEndIcon && <span className={cx('d-badge__icon-right', endIconClass)}>{endNode}</span>}
    </span>
  );
}
