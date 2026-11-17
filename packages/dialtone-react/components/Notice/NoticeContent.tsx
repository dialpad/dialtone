import type { HTMLAttributes, ReactNode } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { DtText } from '../Text';
import { hasSlotContent, withSlotFallback } from './slotFallback';

export interface DtNoticeContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Header text of the notice. This can be left blank to remove the header from the notice entirely.
   * Can also be overridden with the header slot.
   */
  headerText?: string;

  /**
   * The main textual content of the notice. Rendered as the fallback of `children` so that, like headerText, an
   * absent or empty value leaves the message empty and the message paragraph is not rendered at all.
   */
  message?: string;

  /**
   * ID for the header element of the component. Useful for aria-describedby
   * or aria-labelledby or any other reason you may need an id to refer to the header.
   */
  headerId?: string;

  /**
   * ID for the content element of the component. Useful for aria-describedby
   * or aria-labelledby or any other reason you may need an id to refer to the content.
   */
  contentId?: string;

  /** Additional class name for the header wrapper element. */
  headerClass?: ClassValue;

  /** Additional class name for the content wrapper element. */
  contentClass?: ClassValue;

  /** Header content, in place of headerText. */
  header?: ReactNode;

  /** The main content, in place of message. */
  children?: ReactNode;
}

export function DtNoticeContent ({
  headerText,
  message,
  headerId,
  contentId,
  headerClass = '',
  contentClass = '',
  header,
  children,
  className,
  ...rest
}: DtNoticeContentProps) {
  return (
    <div
      className={cx('d-notice__content', contentClass, className)}
      data-qa="notice-content"
      {...rest}
    >
      {(headerText || hasSlotContent(header)) && (
        <DtText
          id={headerId}
          kind="headline"
          size={300}
          density="200"
          wrap="pretty"
          as="p"
          className={cx('d-notice__title', headerClass)}
          data-qa="notice-content-title"
        >
          {withSlotFallback(header, headerText)}
        </DtText>
      )}
      {(message || hasSlotContent(children)) && (
        <DtText
          id={contentId}
          kind="body"
          size={200}
          wrap="pretty"
          as="p"
          className="d-notice__message"
          data-qa="notice-content-message"
        >
          {withSlotFallback(children, message)}
        </DtText>
      )}
    </div>
  );
}
