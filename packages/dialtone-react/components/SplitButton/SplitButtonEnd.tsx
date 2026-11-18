import { Children, useId, useState, type CSSProperties, type MouseEvent } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { renderSlot, type SlotProp } from '../../common/slots';
import { DtIconChevronDown, type IconSize } from '../../icons';
import { DtButton } from '../Button/Button';
import type { ButtonImportance, ButtonKind, ButtonSize } from '../Button/ButtonConstants';
import type { DtPopoverAnchorAttrs } from '../Popover';
import { useTooltipDirective } from '../Tooltip/TooltipDirective';
import { SPLIT_BUTTON_ICON_SIZES } from './SplitButtonConstants';
import type { SplitButtonIconScope } from './SplitButtonStart';

export interface SplitButtonEndProps extends Partial<DtPopoverAnchorAttrs> {
  active?: boolean;
  ariaLabel?: string | null;
  disabled?: boolean;
  /** Element ID, useful in case you need to reference the button as an external anchor for popover. */
  id?: string;
  importance?: ButtonImportance;
  kind?: ButtonKind;
  size?: ButtonSize;
  tooltipText?: string;
  className?: ClassValue;
  style?: CSSProperties;
  icon?: SlotProp<SplitButtonIconScope>;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

/** dialtone-vue's SplitButtonEnd: the split button's icon-only end button, with its tooltip. */
export function SplitButtonEnd ({
  active = false,
  ariaLabel = null,
  disabled = false,
  id,
  importance = 'primary',
  kind = 'default',
  size = 300,
  tooltipText = '',
  className,
  style,
  icon,
  onClick,
  ...anchorAttrs
}: SplitButtonEndProps) {
  const generatedId = useId();
  const [button, setButton] = useState<HTMLElement | null>(null);
  useTooltipDirective(button, { message: tooltipText, inverted: kind === 'inverted' });

  const scope: SplitButtonIconScope = {
    size: (SPLIT_BUTTON_ICON_SIZES as Record<string, IconSize>)[String(size)],
  };
  const iconContent = renderSlot(icon, scope);

  return (
    <DtButton
      {...anchorAttrs}
      ref={setButton}
      id={id ?? generatedId}
      data-qa="dt-split-button-end"
      active={active}
      aria-label={ariaLabel ?? undefined}
      className={cx(`d-split-btn__end d-split-btn__end--${size}`, className)}
      style={style}
      disabled={disabled}
      importance={importance}
      kind={kind}
      size={size}
      onClick={onClick}
      icon={Children.toArray(iconContent).length > 0 ? iconContent : <DtIconChevronDown size={scope.size} />}
    />
  );
}
