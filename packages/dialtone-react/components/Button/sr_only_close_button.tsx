import type { KeyboardEvent, MouseEvent } from 'react';
import { cx } from '../../common/cx';
import { useI18n } from '../../common/localization';
import { DtIconClose } from '../../icons';
import { DtButton, type DtButtonProps } from './Button';

export interface SrOnlyCloseButtonProps extends Omit<DtButtonProps, 'children'> {
  /** Called when the button is clicked, or when Space is pressed on it. */
  onClose?: () => void;
}

/**
 * dialtone-vue's `common/sr_only_close_button.vue`: a close button only screen readers see, which overlays (Modal,
 * Popover, Toast…) render so screen reader users can dismiss them. Its other props and attributes go to DtButton.
 */
export function SrOnlyCloseButton ({ onClose, onClick, onKeyDown, className, ...rest }: SrOnlyCloseButtonProps) {
  const i18n = useI18n();
  const closeButtonTitle = i18n.$t('DIALTONE_CLOSE_BUTTON');

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    onClose?.();
    onClick?.(event);
  };

  // Vue's @keydown.space.prevent.stop
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      onClose?.();
    }
    onKeyDown?.(event);
  };

  return (
    <DtButton
      id="sr-only-close-button"
      data-qa="dt-sr-only-close-button"
      className={cx('d-vi-visible-sr', className)}
      aria-label={closeButtonTitle}
      title={closeButtonTitle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <DtIconClose />
    </DtButton>
  );
}
