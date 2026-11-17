import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent } from '../../common/slots';

interface DtListItemGroupOwnProps {
  /**
   * Id of the List Item Group
   */
  id?: string;

  /**
   * List's heading.
   * Can also be a node, which Vue passes as the slot of the same name.
   */
  heading?: ReactNode;

  /**
   * Additional class to style the heading
   */
  headingClass?: ClassValue;

  /**
   * Additional class for the wrapper list element.
   */
  listClass?: ClassValue;

  /**
   * Slot for the list component
   */
  children?: ReactNode;
}

export type DtListItemGroupProps = DtListItemGroupOwnProps &
  Omit<ComponentPropsWithRef<'ul'>, keyof DtListItemGroupOwnProps>;

/**
 * A list item group wraps a set of list items under an optional heading.
 * @see https://dialtone.dialpad.com/components/list-item-group.html
 */
export function DtListItemGroup ({
  id,
  heading = '',
  headingClass = '',
  listClass = '',
  className,
  children,
  ...attrs
}: DtListItemGroupProps) {
  const generatedId = useId();
  const resolvedId = id ?? generatedId;

  return (
    <ul
      role="group"
      data-qa="dt-dropdown-list-wrapper"
      aria-labelledby={`${resolvedId}-heading`}
      {...attrs}
      id={resolvedId}
      className={cx('d-list-item-group', listClass, className)}
    >
      {hasContent(heading) && (
        <li
          id={`${resolvedId}-heading`}
          role="presentation"
          data-qa="dt-dropdown-list-heading"
          className={cx('dt-dropdown-list--header', headingClass)}
        >
          {heading}
        </li>
      )}
      {children}
    </ul>
  );
}
