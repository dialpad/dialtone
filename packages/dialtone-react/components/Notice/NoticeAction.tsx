import { useEffectEvent, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useI18n } from '../../common/localization';
import { DtIconClose } from '../../icons';
import { DtButton } from '../Button';
import { SrOnlyCloseButton } from '../Button/sr_only_close_button';

export interface DtNoticeActionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Shows the close button in the notice
   * @values true, false
   */
  showClose?: boolean;

  /**
   * Shows the action in the notice
   * @values true, false
   */
  showAction?: boolean;

  /** Additional class name for the action wrapper element. */
  actionClass?: ClassValue;

  /** Close button click event */
  onClose?: () => void;

  /** The action content. */
  children?: ReactNode;
}

export function DtNoticeAction ({
  showClose = true,
  showAction = true,
  actionClass = '',
  onClose,
  children,
  className,
  ...rest
}: DtNoticeActionProps) {
  const i18n = useI18n();
  const closeButtonTitle = i18n.$t('DIALTONE_CLOSE_BUTTON');

  useRestoreFocusOnUnmount(showClose);

  const close = () => onClose?.();

  return (
    <div
      className={cx('d-notice__actions', actionClass, className)}
      data-qa="notice-content-actions"
      {...rest}
    >
      {showAction && children}
      {showClose
        ? (
          <DtButton
            data-qa="dt-notice-action-close-button"
            importance="clear"
            kind="muted"
            size={200}
            aria-label={closeButtonTitle}
            title={closeButtonTitle}
            onClick={close}
            startIcon={<DtIconClose size="200" />}
          />
          )
        : <SrOnlyCloseButton onClose={close} />}
    </div>
  );
}

/**
 * Vue's mounted / beforeUnmount pair: when the close button shows on mount, remember what had focus then, and give
 * it focus back on unmount, so closing the notice doesn't drop focus to the body. A layout effect, as Vue's mounted
 * runs before the browser paints; the ref keeps StrictMode's second run from capturing again.
 */
function useRestoreFocusOnUnmount (showClose: boolean) {
  const captured = useRef(false);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const capture = useEffectEvent(() => {
    if (showClose) lastFocusedElement.current = document.activeElement as HTMLElement | null;
  });

  useLayoutEffect(() => {
    if (!captured.current) {
      captured.current = true;
      capture();
    }
    return () => lastFocusedElement.current?.focus();
  }, []);
}
