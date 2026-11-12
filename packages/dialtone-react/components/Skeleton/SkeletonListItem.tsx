import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '../../common/cx';
import type { SkeletonAnimationProps } from './SkeletonAnimation';
import type { SkeletonShape } from './SkeletonConstants';
import { DtSkeletonParagraph, type DtSkeletonParagraphProps } from './SkeletonParagraph';
import { DtSkeletonShape } from './SkeletonShape';

interface DtSkeletonListItemOwnProps extends SkeletonAnimationProps {
  /**
   * Defines the shape of the skeleton, accepts circle or square.
   * @values circle, square
   */
  shape?: SkeletonShape;

  /**
   * Size of the shape
   * @values 100, 200, 300, 400, 500
   */
  shapeSize?: string | number;

  /**
   * Object containing quantity of paragraphs to display
   * and a randomWidth boolean.
   */
  paragraphs?: DtSkeletonParagraphProps;

  /**
   * Additional class name for the shape.
   */
  shapeClass?: string;

  /**
   * Additional class name for the content.
   */
  contentClass?: string;
}

export type DtSkeletonListItemProps = DtSkeletonListItemOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof DtSkeletonListItemOwnProps>;

const DEFAULT_PARAGRAPHS: DtSkeletonParagraphProps = { rows: 3, randomWidth: true };

export function DtSkeletonListItem ({
  shape = 'circle',
  shapeSize = 300,
  paragraphs = DEFAULT_PARAGRAPHS,
  animationDuration = -1,
  animate = true,
  offset = 1,
  shapeClass = '',
  contentClass = '',
  className,
  ...rest
}: DtSkeletonListItemProps) {
  return (
    <div
      data-qa="skeleton-list-item"
      {...rest}
      className={cx(
        'd-skeleton-list-item',
        { 'd-skeleton-list-item--single': paragraphs.rows === 1 },
        contentClass,
        className,
      )}
    >
      <DtSkeletonShape
        className="d-skeleton-list-item__shape"
        size={shapeSize}
        shape={shape}
        animationDuration={animationDuration}
        animate={animate}
        offset={offset}
        contentClass={shapeClass}
      />
      <div className="d-skeleton-list-item__paragraph-container">
        <DtSkeletonParagraph
          {...paragraphs}
          animationDuration={animationDuration}
          animate={animate}
          offset={offset}
        />
      </div>
    </div>
  );
}
