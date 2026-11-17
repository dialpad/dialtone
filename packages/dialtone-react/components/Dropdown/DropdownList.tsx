import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { DtStack } from '../Stack';
import { DtText } from '../Text';

export interface DtDropdownListProps extends Omit<ComponentPropsWithRef<'li'>, 'children'> {
  /** List's heading. */
  heading?: string;

  /** Additional class for the wrapper list element. */
  listClass?: ClassValue;

  /** Slot for the list component. */
  children?: ReactNode;
}

/**
 * A group of dropdown items with an optional heading. Like Vue's DropdownList.vue, it isn't exported from the
 * component's index.
 */
export function DtDropdownList ({ heading = '', listClass = '', children, ...rest }: DtDropdownListProps) {
  return (
    <li {...rest}>
      {heading && (
        <DtStack
          direction="row"
          align="center"
          className="dt-dropdown-list--header d-py-50 d-px-150"
        >
          <DtText
            kind="label"
            size={100}
            strength="bold"
            tone="muted"
          >
            {heading}
          </DtText>
        </DtStack>
      )}
      <ul
        className={cx(['d-ps-relative', 'd-stack2', 'd-px-0', listClass])}
        data-qa="dt-dropdown-list-wrapper"
      >
        {children}
      </ul>
    </li>
  );
}
