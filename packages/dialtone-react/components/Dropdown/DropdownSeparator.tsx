import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../common/cx';

/** Like Vue's fallthrough attributes, every attribute goes on the `<li>`, `ref` included. */
export type DtDropdownSeparatorProps = Omit<ComponentPropsWithRef<'li'>, 'children'>;

/** A separator between the items, or groups of items, of a dropdown list. */
export function DtDropdownSeparator ({ className, ...rest }: DtDropdownSeparatorProps) {
  return (
    <li
      aria-hidden="true"
      className={cx('d-list-item-separator', className)}
      {...rest}
    />
  );
}
