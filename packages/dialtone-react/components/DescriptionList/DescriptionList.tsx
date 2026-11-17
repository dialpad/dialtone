import { Fragment, type ComponentPropsWithRef } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import type { StackGap } from '../Stack/StackConstants';
import type { DescriptionListDirection } from './DescriptionListConstants';

/** A term and its description. */
export interface DtDescriptionListItem {
  term: string;
  description: string;
}

interface DtDescriptionListOwnProps {
  /**
   * The direction for the list
   * @values row, column
   */
  direction?: DescriptionListDirection;

  /**
   * A list of items that represent the term and the description
   */
  items: DtDescriptionListItem[];

  /**
   * Set the space between the elements
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  gap?: StackGap;

  /**
   * Used to customize the term element
   */
  termClass?: ClassValue;

  /**
   * Used to customize the description element
   */
  descriptionClass?: ClassValue;
}

export type DtDescriptionListProps = DtDescriptionListOwnProps &
  Omit<ComponentPropsWithRef<'dl'>, keyof DtDescriptionListOwnProps | 'children'>;

/**
 * A description list renders terms and their descriptions as a `<dl>` of `<dt>` and `<dd>` pairs.
 * @see https://dialtone.dialpad.com/components/description-list.html
 */
export function DtDescriptionList ({
  direction = 'row',
  items = [],
  gap = '100',
  termClass = '',
  descriptionClass = '',
  className,
  ...rest
}: DtDescriptionListProps) {
  return (
    <dl
      data-qa="dt-description-list"
      {...rest}
      className={cx(
        'd-description-list',
        `d-description-list--${direction}`,
        `d-description-list--gap-${gap}`,
        className,
      )}
    >
      {items.map((item, index) => (
        <Fragment key={`${index}-${item.term}`}>
          <dt
            className={cx('d-description-list__term', termClass)}
            data-qa="dt-description-list-term"
          >
            {item.term}
          </dt>
          <dd
            className={cx('d-description-list__description', descriptionClass)}
            data-qa="dt-description-list-description"
          >
            {item.description}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}
