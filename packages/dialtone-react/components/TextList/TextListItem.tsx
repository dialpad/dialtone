import {
  Children, Fragment, isValidElement, useEffect, useRef, type ComponentPropsWithRef, type ReactNode,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { isDevelopment } from '../../common/dev';
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

const isPortal = (node: unknown): boolean => typeof node === 'object' && node !== null
  && (node as { $$typeof?: symbol }).$$typeof === Symbol.for('react.portal');

// An empty fragment has no content, though it is an element.
function hasMarkerContent (node: ReactNode): boolean {
  if (isValidElement<{ children?: ReactNode }>(node) && node.type === Fragment) {
    return hasMarkerContent(node.props.children);
  }
  return Children.toArray(node).some(child => {
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      return hasMarkerContent(child.props.children);
    }
    // A portal renders elsewhere, so it leaves the marker wrapper empty.
    if (isPortal(child)) return false;
    return hasContent(child);
  });
}

// Separates portals from local marker content, looking through fragments. Keys follow the tree path.
function splitMarker (node: ReactNode, prefix: string): { portals: ReactNode[]; local: ReactNode[] } {
  const portals: ReactNode[] = [];
  const local: ReactNode[] = [];
  Children.toArray(node).forEach((child, index) => {
    // Text nodes and keyless portals carry no key, so they fall back to their position among siblings.
    const ownKey = isValidElement(child) || isPortal(child) ? (child as { key: string | null }).key : null;
    const key = `${prefix}${ownKey ?? `#${index}`}`;
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      const inner = splitMarker(child.props.children, `${key}/`);
      portals.push(...inner.portals);
      local.push(...inner.local);
    } else if (isPortal(child)) {
      portals.push(<Fragment key={key}>{child as ReactNode}</Fragment>);
    } else {
      local.push(<Fragment key={key}>{child}</Fragment>);
    }
  });
  return { portals, local };
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
  ...restWithHtml
}: DtTextListItemProps) {
  // Not in the types, but a JS caller could still pass it, and React throws with children present.
  const { dangerouslySetInnerHTML: _html, ...rest } = restWithHtml as typeof restWithHtml & {
    dangerouslySetInnerHTML?: unknown;
  };
  const parentContext = useTextListContext();
  const parentType = parentContext ? parentContext.type : undefined;
  const { portals, local } = splitMarker(marker, '');
  const hasCustomMarker = hasMarkerContent(local);
  const orderedValue = parentType === 'ordered' ? value : undefined;

  // Vue's mounted() checks: once per instance, so neither prop changes nor StrictMode repeat them.
  const validated = useRef(false);
  useEffect(() => {
    if (!isDevelopment()) return;
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
      {/* Portals sit outside the wrapper so they keep their React position when local content comes or goes. */}
      {portals}
      {hasCustomMarker && (
        <span
          data-qa="dt-text-list-item-marker"
          className={cx('d-text-list__item-marker', markerClass)}
          aria-hidden="true"
        >
          {local}
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
