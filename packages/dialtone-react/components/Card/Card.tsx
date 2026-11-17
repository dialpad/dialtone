import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent } from '../../common/slots';

export interface DtCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  /**
   * The maximum height of the card content.
   * If given, makes content area scrollable.
   */
  maxHeight?: string | null;

  /** class for card content. */
  contentClass?: ClassValue;

  /** class for card header. */
  headerClass?: ClassValue;

  /** class for card footer. */
  footerClass?: ClassValue;

  /** slot for header content */
  header?: ReactNode;

  /** slot for main content */
  content?: ReactNode;

  /** slot for footer content */
  footer?: ReactNode;

  /** The card's root element. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * A card contains summary content and actions about a single subject.
 * It can be used by itself or within a list, and is generally interactive.
 * @see https://dialtone.dialpad.com/components/card.html
 */
export function DtCard ({
  maxHeight = null,
  contentClass = '',
  headerClass = '',
  footerClass = '',
  header,
  content,
  footer,
  className,
  ref,
  ...attrs
}: DtCardProps) {
  return (
    <div
      data-qa="dt-card"
      {...attrs}
      ref={ref}
      className={cx('d-card', className)}
    >
      {hasContent(header) && (
        <div className={cx('d-card__header', headerClass)}>
          {header}
        </div>
      )}

      <div
        className={cx('d-card__content', contentClass)}
        style={{ maxHeight: maxHeight ?? undefined }}
      >
        {content}
      </div>

      {hasContent(footer) && (
        <div className={cx('d-card__footer', footerClass)}>
          {footer}
        </div>
      )}
    </div>
  );
}
