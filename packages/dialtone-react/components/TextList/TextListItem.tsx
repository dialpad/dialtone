import {
  Children, Fragment, isValidElement, useEffect, useRef, type ComponentPropsWithRef, type ReactNode,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent } from '../../common/slots';
import type { TextListMarkerTone } from './TextListConstants';
import { useTextListContext } from './TextListContext';

interface DtTextListItemOwnProps {
  /** Native `li` value for ordered lists. */
  value?: number;

  /**
   * Marker foreground tone for this item. Overrides the parent DtTextList markerTone.
   * @values primary, secondary, tertiary, muted, disabled, placeholder, critical, critical-strong, positive, positive-strong, warning, info, info-strong, neutral-black, neutral-white
   */
  markerTone?: TextListMarkerTone;

  /** Additional class name for the marker wrapper. */
  markerClass?: ClassValue;

  /** Additional class name for the content wrapper. */
  contentClass?: ClassValue;

  /** Custom marker content. Decorative by default. */
  marker?: ReactNode;
}

/** Own props plus those of the `li` element. */
export type DtTextListItemProps = DtTextListItemOwnProps
  & Omit<ComponentPropsWithRef<'li'>, keyof DtTextListItemOwnProps | 'dangerouslySetInnerHTML'>;

// An empty fragment has no content, though it is an element.
function hasMarkerContent (node: ReactNode): boolean {
  if (isValidElement<{ children?: ReactNode }>(node) && node.type === Fragment) {
    return hasMarkerContent(node.props.children);
  }
  return Children.toArray(node).some(child => isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
    ? hasMarkerContent(child.props.children)
    : hasContent(child));
}

const warn = (message: string) => console.warn(`[DtTextListItem] ${message}`);

/**
 * An item of DtTextList: an `li` with a content wrapper and an optional custom marker.
 * @see https://dialtone.dialpad.com/components/text-list.html
 */
export function DtTextListItem ({
  value,
  markerTone,
  markerClass = '',
  contentClass = '',
  marker,
  className,
  children,
  ...rest
}: DtTextListItemProps) {
  const parentContext = useTextListContext();
  const parentType = parentContext ? parentContext.type : undefined;
  const hasCustomMarker = hasMarkerContent(marker);
  const orderedValue = parentType === 'ordered' ? value : undefined;

  // Vue's mounted() checks: once per instance, so neither prop changes nor StrictMode repeat them.
  const validated = useRef(false);
  useEffect(() => {
    if (validated.current) return;
    validated.current = true;

    if (!parentContext) {
      warn('DtTextListItem must be used inside DtTextList.');
    }

    if (value !== undefined && parentType !== 'ordered') {
      warn('The value prop only applies inside a DtTextList with type="ordered".');
    }
  });

  return (
    <li
      data-qa="dt-text-list-item"
      value={orderedValue}
      {...rest}
      className={cx(
        'd-text-list__item',
        { 'd-text-list__item--custom-marker': hasCustomMarker },
        markerTone ? `d-text-list__item--marker-tone-${markerTone}` : null,
        className,
      )}
    >
      {hasCustomMarker && (
        <span
          data-qa="dt-text-list-item-marker"
          className={cx('d-text-list__item-marker', markerClass)}
          aria-hidden="true"
        >
          {marker}
        </span>
      )}
      <div
        data-qa="dt-text-list-item-content"
        className={cx('d-text-list__item-content', contentClass)}
      >
        {children}
      </div>
    </li>
  );
}
