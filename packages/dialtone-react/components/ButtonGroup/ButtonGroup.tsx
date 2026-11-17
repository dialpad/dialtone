import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../common/cx';
import { BUTTON_GROUP_ALIGNMENT, type ButtonGroupAlignment } from './ButtonGroupConstants';

interface DtButtonGroupOwnProps {
  /**
   * Alignment of the buttons inside the container
   * @values start, end, space-between
   */
  alignment?: ButtonGroupAlignment;
}

export type DtButtonGroupProps = DtButtonGroupOwnProps &
  Omit<ComponentPropsWithRef<'div'>, keyof DtButtonGroupOwnProps>;

/**
 * Button group lays out related buttons in a single row.
 * @see https://dialtone.dialpad.com/components/button-group.html
 */
export function DtButtonGroup ({
  alignment = 'start',
  className,
  children,
  ...rest
}: DtButtonGroupProps) {
  return (
    <div
      role="group"
      data-qa="dt-button-group"
      {...rest}
      className={cx('d-btn-group', BUTTON_GROUP_ALIGNMENT[alignment], className)}
    >
      {children}
    </div>
  );
}
