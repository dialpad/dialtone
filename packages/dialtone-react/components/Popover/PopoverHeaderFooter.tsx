import { useImperativeHandle, useRef, type ReactNode, type Ref } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useI18n } from '../../common/localization';
import { hasContent } from '../../common/slots';
import { DtIconClose } from '../../icons';
import { DtButton } from '../Button';

/** Vue's public method on the component, through its ref. */
export interface PopoverHeaderFooterHandle {
  focusCloseButton: () => void;
}

export interface PopoverHeaderFooterProps {
  ref?: Ref<PopoverHeaderFooterHandle>;
  type: 'header' | 'footer';
  /** Additional class name for the outer header/footer wrapper element. */
  wrapperClass?: ClassValue;
  /** Additional class name for the content wrapper element. */
  contentClass?: ClassValue;
  /** Optional semantic role for the native close button. */
  closeRole?: string;
  /** Determines visibility for close button */
  showCloseButton?: boolean;
  /** Vue's `class` on the component, which lands on its root. */
  className?: string;
  /** Slot for main content */
  content?: ReactNode;
  /** Called when the close button is clicked. */
  onClose?: () => void;
}

/** dialtone-vue's components/Popover/PopoverHeaderFooter.vue: DtPopover's header and footer. */
export function PopoverHeaderFooter ({
  ref,
  type,
  wrapperClass,
  contentClass,
  closeRole,
  showCloseButton = false,
  className,
  content,
  onClose,
}: PopoverHeaderFooterProps) {
  const i18n = useI18n();
  const closeButtonTitle = i18n.$t('DIALTONE_CLOSE_BUTTON');
  const closeButtonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useImperativeHandle(ref, () => ({
    focusCloseButton: () => closeButtonRef.current?.focus(),
  }), []);

  return (
    <div
      data-qa="dt-popover-header-footer"
      className={cx({
        'd-popover__header': type === 'header',
        'd-popover__footer': type === 'footer',
      }, wrapperClass, className)}
    >
      {hasContent(content) && (
        <div
          data-qa="dt-popover-header-footer-content"
          className={cx({
            'd-popover__header__content': type === 'header',
            'd-popover__footer__content': type === 'footer',
          }, contentClass)}
        >
          {content}
        </div>
      )}
      {showCloseButton && (
        <DtButton
          ref={closeButtonRef}
          data-qa="dt-popover-close"
          className={cx({
            'd-popover__header__close-button': type === 'header',
            'd-popover__footer__close-button': type === 'footer',
          })}
          importance="outlined"
          kind="muted"
          circle
          aria-label={closeButtonTitle}
          title={closeButtonTitle}
          role={closeRole}
          onClick={() => onClose?.()}
          icon={<DtIconClose size="300" />}
        />
      )}
    </div>
  );
}
