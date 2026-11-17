import {
  Children, Fragment, isValidElement, useEffect, useEffectEvent, useRef,
  type HTMLAttributes, type ReactNode, type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import { DtStack } from '../Stack';
import { DtText } from '../Text';
import {
  EMPTY_STATE_BODY_DENSITIES,
  EMPTY_STATE_BODY_SIZES,
  EMPTY_STATE_CONTENT_SIZE_MODIFIERS,
  EMPTY_STATE_HEADLINE_DENSITIES,
  EMPTY_STATE_HEADLINE_SIZES,
  EMPTY_STATE_SIZE_MODIFIERS,
  type EmptyStateSize,
} from './EmptyStateConstants';

export interface DtEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The empty state size.
   * @values 200, 300, 400
   */
  size?: EmptyStateSize | `${200 | 300 | 400}`;

  /** Header text */
  headerText: string;

  /** Body text */
  bodyText?: string | null;

  /** Additional class name for the illustration wrapper element. */
  illustrationClass?: ClassValue;

  /** Additional class name for the icon wrapper element. */
  iconClass?: ClassValue;

  /** Additional class name for the body slot wrapper element. */
  bodyClass?: ClassValue;

  /** Slot for the illustration. Displays when size is 300 or 400 (md or lg). Overrides icon. */
  illustration?: ReactNode;

  /** Slot for the icon. Displayed if illustration is not provided. Receives the icon size to use. */
  icon?: SlotProp<{ iconSize: string }>;

  /** Slot for custom body content, rendered below the body text. */
  body?: ReactNode;

  /** The root `Stack` element. */
  ref?: Ref<HTMLDivElement>;
}

/** hasContent that looks inside fragments, as Vue's hasSlotContent does: an empty fragment is no content. */
function hasFragmentContent (node: ReactNode): boolean {
  return Children.toArray(node).some(child => isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
    ? hasFragmentContent(child.props.children)
    : hasContent(child));
}

/** The modifier's value for a size, or undefined for a size the maps don't know (Vue's object lookup). */
function bySize<T> (map: Readonly<Record<string, T>>, sizeKey: string): T | undefined {
  return Object.hasOwn(map, sizeKey) ? map[sizeKey] : undefined;
}

/**
 * Empty states are shown when there is no data to display, and guide the user on what to do next.
 * @see https://dialtone.dialpad.com/components/empty_state.html
 */
export function DtEmptyState ({
  size = 400,
  headerText,
  bodyText = null,
  illustrationClass = '',
  iconClass = '',
  bodyClass = '',
  illustration,
  icon,
  body,
  ref,
  className,
  ...rest
}: DtEmptyStateProps) {
  const sizeKey = String(size);
  const isSmallSize = sizeKey === 'sm' || sizeKey === '200';

  const iconContent = renderSlot(icon, { iconSize: '800' });
  const hasIcon = hasContent(iconContent);
  const hasIllustration = hasFragmentContent(illustration);
  const hasBody = hasContent(body);

  // Icon is shown in lg and md size only if there is no illustration, and always in sm size.
  const showIcon = hasIcon && (!hasIllustration || isSmallSize);
  // Illustration is shown in lg and md size, never in sm size.
  const showIllustration = hasIllustration && !isSmallSize;

  // Vue's mounted() check: once per instance, not on prop changes or StrictMode's second effect run.
  const hasWarned = useRef(false);
  const checkBody = useEffectEvent(() => {
    if (!bodyText && !hasBody) {
      console.error('DtEmptyState: You should provide either bodyText or content on body slot.');
    }
  });
  useEffect(() => {
    if (hasWarned.current) return;
    hasWarned.current = true;
    checkBody();
  }, []);

  return (
    <DtStack
      {...rest}
      ref={ref}
      className={cx('d-empty-state', bySize(EMPTY_STATE_SIZE_MODIFIERS, sizeKey), className)}
    >
      {showIllustration && (
        <span
          className={cx('d-empty-state__illustration', illustrationClass)}
          data-qa="dt-empty-state-illustration"
        >
          {illustration}
        </span>
      )}

      {showIcon && (
        <span
          className={cx('d-empty-state__icon', iconClass)}
          data-qa="dt-empty-state-icon"
        >
          {iconContent}
        </span>
      )}

      <DtStack
        gap="150"
        className={cx('d-empty-state__content', bySize(EMPTY_STATE_CONTENT_SIZE_MODIFIERS, sizeKey))}
      >
        <DtText
          kind="headline"
          size={bySize(EMPTY_STATE_HEADLINE_SIZES, sizeKey)}
          density={bySize(EMPTY_STATE_HEADLINE_DENSITIES, sizeKey)}
          wrap="balance"
          as="div"
          className="d-empty-state__header-text"
        >
          {headerText}
        </DtText>

        {bodyText && (
          <DtText
            kind="body"
            size={bySize(EMPTY_STATE_BODY_SIZES, sizeKey)}
            density={bySize(EMPTY_STATE_BODY_DENSITIES, sizeKey)}
            tone="secondary"
            wrap="balance"
            as="p"
            className="d-empty-state__body-text"
          >
            {bodyText}
          </DtText>
        )}
      </DtStack>

      {hasBody && (
        <div
          className={cx(bodyClass)}
          data-qa="dt-empty-state-body-slot"
        >
          {body}
        </div>
      )}
    </DtStack>
  );
}
