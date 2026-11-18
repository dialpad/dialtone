import { Children, type ComponentPropsWithRef } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { DtListItem } from '../ListItem';

interface ComboboxEmptyListOwnProps {
  /** Message to display when list is empty */
  message: string;

  /**
   * Additional class name for the empty list element.
   * Same API as Vue's class binding: a string, an object or an array.
   */
  itemClass?: ClassValue;
}

export type ComboboxEmptyListProps = ComboboxEmptyListOwnProps &
  Omit<ComponentPropsWithRef<'ol'>, keyof ComboboxEmptyListOwnProps>;

export function ComboboxEmptyList ({ message, itemClass = '', className, children, ...rest }: ComboboxEmptyListProps) {
  return (
    <ol
      className={cx('d-combobox__empty-list', className)}
      data-qa="dt-combobox-empty-list"
      {...rest}
    >
      {Children.toArray(children).length > 0
        ? children
        : (
          <DtListItem
            role="option"
            navigationType="none"
            type="custom"
            className={cx('d-combobox__empty-list-item', itemClass)}
          >
            <span>{message}</span>
          </DtListItem>
        )}
    </ol>
  );
}
