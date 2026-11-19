import { useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import type { DtLinkTo } from '../../common/link';
import { renderSlot, type SlotProp } from '../../common/slots';
import type { IconSize } from '../../icons';
import { DtButton } from '../Button/Button';
import {
  BUTTON_ICON_SIZES,
  type ButtonIconPosition,
  type ButtonImportance,
  type ButtonKind,
  type ButtonSize,
} from '../Button/ButtonConstants';
import { useTooltipDirective } from '../Tooltip/TooltipDirective';

/** The scope the split button's icon slots pass: the icon size that matches the button's size. */
export interface SplitButtonIconScope {
  size: IconSize | undefined;
}

export interface SplitButtonStartProps {
  active?: boolean;
  ariaLabel?: string | null;
  iconPosition?: ButtonIconPosition;
  labelClass?: ClassValue;
  leadingClass?: ClassValue;
  trailingClass?: ClassValue;
  loading?: boolean;
  tooltipText?: string;
  assertiveOnFocus?: boolean;
  disabled?: boolean;
  importance?: ButtonImportance;
  kind?: ButtonKind;
  size?: ButtonSize;
  to?: DtLinkTo | null;
  replace?: boolean;
  href?: string | null;
  target?: string | null;
  rel?: string | null;
  className?: ClassValue;
  style?: CSSProperties;
  startIcon?: SlotProp<SplitButtonIconScope>;
  endIcon?: SlotProp<SplitButtonIconScope>;
  icon?: SlotProp<SplitButtonIconScope>;
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

/** dialtone-vue's SplitButtonStart: the split button's main button, with its tooltip. */
export function SplitButtonStart ({
  active = false,
  ariaLabel = null,
  iconPosition = 'left',
  labelClass = '',
  leadingClass = '',
  trailingClass = '',
  loading = false,
  tooltipText = '',
  assertiveOnFocus = false,
  disabled = false,
  importance = 'primary',
  kind = 'default',
  size = 300,
  to = null,
  replace = false,
  href = null,
  target = null,
  rel = null,
  className,
  style,
  startIcon,
  endIcon,
  icon,
  leading,
  trailing,
  children,
  onClick,
}: SplitButtonStartProps) {
  const [button, setButton] = useState<HTMLElement | null>(null);
  useTooltipDirective(button, { message: tooltipText, inverted: kind === 'inverted' });

  const scope: SplitButtonIconScope = {
    size: (BUTTON_ICON_SIZES as Record<string, IconSize>)[String(size)],
  };
  // Vue passes the legacy icon slot only when neither of the new ones is set.
  const useLegacyIcon = startIcon === undefined && endIcon === undefined;

  return (
    <DtButton
      ref={setButton}
      data-qa="dt-split-button-start"
      active={active}
      aria-label={ariaLabel ?? undefined}
      assertiveOnFocus={assertiveOnFocus}
      className={cx(`d-split-btn__start d-split-btn__start--${size}`, className)}
      style={style}
      disabled={disabled}
      iconPosition={iconPosition}
      importance={importance}
      kind={kind}
      labelClass={labelClass}
      leadingClass={leadingClass}
      trailingClass={trailingClass}
      loading={loading}
      size={size}
      to={to}
      replace={replace}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      startIcon={startIcon === undefined ? undefined : renderSlot(startIcon, scope)}
      endIcon={endIcon === undefined ? undefined : renderSlot(endIcon, scope)}
      icon={useLegacyIcon && icon !== undefined ? renderSlot(icon, scope) : undefined}
      leading={leading}
      trailing={trailing}
    >
      {children}
    </DtButton>
  );
}
