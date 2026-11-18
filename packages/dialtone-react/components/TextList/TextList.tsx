import { useCallback, useEffect, useMemo, useRef, type ComponentPropsWithRef, type ElementType, type Ref } from 'react';
import { cx } from '../../common/cx';
import { isDevelopment } from '../../common/dev';
import {
  DT_TEXT_LIST_DEFAULT_TYPE,
  DT_TEXT_LIST_ORDERED_MARKERS,
  DT_TEXT_LIST_UNORDERED_MARKERS,
  type TextListGap,
  type TextListMarker,
  type TextListMarkerTone,
  type TextListType,
} from './TextListConstants';
import { TextListContext } from './TextListContext';

interface DtTextListOwnProps {
  /**
   * Semantic list type. Sets the rendered element to `ul` or `ol`.
   * @values unordered, ordered
   */
  type?: TextListType;

  /**
   * Visual marker style. Leave unset for automatic depth-aware markers.
   * @values disc, circle, square, decimal, lower-alpha, upper-alpha, lower-roman, upper-roman, none
   */
  marker?: TextListMarker;

  /**
   * Marker foreground tone. Uses the same tone vocabulary as DtText.
   * @values primary, secondary, tertiary, muted, disabled, placeholder, critical, critical-strong, positive, positive-strong, warning, info, info-strong, neutral-black, neutral-white
   */
  markerTone?: TextListMarkerTone;

  /**
   * Space between list items and before nested lists.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400
   */
  gap?: TextListGap;

  /** Starting number for ordered lists. */
  start?: number;

  /** Reverse ordered list numbering. */
  reversed?: boolean;
}

type ListNativeProps<E extends 'ul' | 'ol'> = Omit<ComponentPropsWithRef<E>, keyof DtTextListOwnProps>;

/**
 * Own props plus those of the list element: `type` picks `ul` or `ol` props, so `ref` and event
 * targets are typed for the rendered element. A `type` that varies at runtime gets either.
 */
export type DtTextListProps = DtTextListOwnProps & (
  | (ListNativeProps<'ul'> & { type?: 'unordered' })
  | (ListNativeProps<'ol'> & { type: 'ordered' })
);

const warn = (message: string) => console.warn(`[DtTextList] ${message}`);

/**
 * A semantic list (`ul` or `ol`) with depth-aware markers. Use DtTextListItem or a native `li` as the direct children.
 * @see https://dialtone.dialpad.com/components/text-list.html
 */
export function DtTextList ({
  type = DT_TEXT_LIST_DEFAULT_TYPE,
  marker,
  markerTone,
  gap,
  start,
  reversed = false,
  className,
  children,
  ref,
  role: roleProp,
  ...rest
}: DtTextListProps) {
  const listRef = useRef<HTMLElement | null>(null);
  const forwardedRef = ref as Ref<HTMLElement> | undefined;
  // Both the forwarded ref and ours get the element; React 19 calls a returned cleanup on detach.
  const rootRef = useCallback((node: HTMLElement | null) => {
    listRef.current = node;
    if (typeof forwardedRef === 'function') return forwardedRef(node);
    if (forwardedRef) forwardedRef.current = node;
    return undefined;
  }, [forwardedRef]);

  const contextValue = useMemo(() => ({ type }), [type]);

  const isOrdered = type === 'ordered';
  const ListElement: ElementType = isOrdered ? 'ol' : 'ul';
  // Safari drops list semantics when list-style is none; restore them explicitly.
  // An explicit role wins; an undefined one keeps the fallback.
  const role = roleProp ?? (marker === 'none' ? 'list' : undefined);

  // Vue's mounted() checks: once per instance, so neither prop changes nor StrictMode repeat them.
  const validated = useRef(false);
  useEffect(() => {
    if (!isDevelopment()) return;
    if (validated.current) return;
    validated.current = true;

    if (!isOrdered) {
      if (start !== undefined) {
        warn('The start prop only applies when type="ordered".');
      }

      if (reversed) {
        warn('The reversed prop only applies when type="ordered".');
      }
    }

    if (marker && marker !== 'none') {
      if (type === 'ordered' && (DT_TEXT_LIST_UNORDERED_MARKERS as readonly string[]).includes(marker)) {
        warn(`The marker="${marker}" value is usually used with type="unordered".`);
      }

      if (type === 'unordered' && (DT_TEXT_LIST_ORDERED_MARKERS as readonly string[]).includes(marker)) {
        warn(`The marker="${marker}" value is usually used with type="ordered".`);
      }
    }

    const rootElement = listRef.current;
    if (!rootElement) return;

    for (const child of Array.from(rootElement.children)) {
      if (child.tagName === 'LI') continue;

      warn('Use DtTextListItem or a native li as the direct child of DtTextList.');
      break;
    }
  });

  return (
    <TextListContext value={contextValue}>
      <ListElement
        data-qa="dt-text-list"
        role={role}
        start={isOrdered ? start : undefined}
        reversed={isOrdered && reversed ? true : undefined}
        {...rest}
        ref={rootRef}
        className={cx(
          'd-text-list',
          gap ? `d-text-list--gap-${gap}` : null,
          { 'd-text-list--ordered': isOrdered },
          marker ? `d-text-list--marker-${marker}` : null,
          markerTone ? `d-text-list--marker-tone-${markerTone}` : null,
          className,
        )}
      >
        {children}
      </ListElement>
    </TextListContext>
  );
}
