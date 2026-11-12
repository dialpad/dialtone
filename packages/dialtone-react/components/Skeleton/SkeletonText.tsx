import { useState, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../common/cx';
import { useSkeletonAnimation, type SkeletonAnimationProps } from './SkeletonAnimation';
import { SKELETON_HEADING_HEIGHTS, type SkeletonHeadingHeight, type SkeletonTextType } from './SkeletonConstants';

interface DtSkeletonTextOwnProps extends SkeletonAnimationProps {
  /**
   * Skeleton type
   * @values body, heading
   */
  type?: SkeletonTextType;

  /**
   * Heading height
   * @values 200, 300, 400, sm, md, lg
   */
  headingHeight?: SkeletonHeadingHeight;

  /**
   * Width of the skeleton
   */
  width?: string;

  /**
   * Additional class name for the content.
   */
  contentClass?: string;
}

export type DtSkeletonTextProps = DtSkeletonTextOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof DtSkeletonTextOwnProps>;

export function DtSkeletonText ({
  type = 'body',
  headingHeight = 'md',
  width = '100%',
  animationDuration = -1,
  animate = false,
  offset = 1,
  contentClass = '',
  className,
  style,
  ...rest
}: DtSkeletonTextProps) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const skeletonStyle = useSkeletonAnimation({ animationDuration, animate, offset }, el);
  const textStyle = { width, ...skeletonStyle, ...style };

  if (type === 'body') {
    return (
      <div
        data-qa="skeleton-text-body"
        {...rest}
        ref={setEl}
        className={cx(
          'd-skeleton-text',
          'd-skeleton-placeholder',
          { 'd-skeleton-placeholder--animate': animate },
          contentClass,
          className,
        )}
        style={textStyle}
      />
    );
  }

  if (type === 'heading') {
    return (
      <div
        data-qa="skeleton-text-heading"
        {...rest}
        ref={setEl}
        className={cx(
          SKELETON_HEADING_HEIGHTS[headingHeight],
          'd-skeleton-text--heading',
          'd-skeleton-placeholder',
          { 'd-skeleton-placeholder--animate': animate },
          contentClass,
          className,
        )}
        style={textStyle}
      />
    );
  }

  return null;
}
