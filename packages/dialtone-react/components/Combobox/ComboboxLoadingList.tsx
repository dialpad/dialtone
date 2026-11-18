import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../common/cx';
import { DtListItem } from '../ListItem';
import { DtSkeleton } from '../Skeleton';

const ITEMS = [1, 2, 3, 4, 5, 6, 7];

export type ComboboxLoadingListProps = ComponentPropsWithRef<'ol'>;

export function ComboboxLoadingList ({ className, ...rest }: ComboboxLoadingListProps) {
  return (
    <ol
      className={cx('d-combobox__loading-list', className)}
      aria-busy="true"
      {...rest}
    >
      {ITEMS.map(index => (
        <DtListItem key={index} role="option" navigationType="none">
          <DtSkeleton textOption={{ type: 'body' }} offset={0} />
        </DtListItem>
      ))}
    </ol>
  );
}
