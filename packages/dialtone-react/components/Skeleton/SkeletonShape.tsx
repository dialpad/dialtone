import { useState, type ComponentPropsWithoutRef } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useSkeletonAnimation, type SkeletonAnimationProps } from './SkeletonAnimation';
import { SKELETON_SHAPES, SKELETON_SHAPE_SIZES, type SkeletonShape } from './SkeletonConstants';

interface DtSkeletonShapeOwnProps extends SkeletonAnimationProps {
  /**
   * Defines the shape of the skeleton, accepts circle or square.
   * @values circle, square
   */
  shape?: SkeletonShape;

  /**
   * Size of the shape
   * @values 100, 200, 300, 400, 500
   */
  size?: string | number;

  /**
   * Additional class name for the content.
   */
  contentClass?: ClassValue;
}

export type DtSkeletonShapeProps = DtSkeletonShapeOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof DtSkeletonShapeOwnProps>;

export function DtSkeletonShape ({
  shape = 'circle',
  size = 300,
  animationDuration = -1,
  animate = true,
  offset = 1,
  contentClass = '',
  className,
  style,
  ...rest
}: DtSkeletonShapeProps) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const skeletonStyle = useSkeletonAnimation({ animationDuration, animate, offset }, el);

  const key = String(size);
  // A size outside the scale is used as it is. Vue sets a number without a unit, which the browser ignores, where
  // React would add `px`: the string keeps Vue's result.
  const shapeSize = Object.hasOwn(SKELETON_SHAPE_SIZES, key)
    ? SKELETON_SHAPE_SIZES[key as keyof typeof SKELETON_SHAPE_SIZES]
    : key;

  return (
    <div
      data-qa="skeleton-shape"
      {...rest}
      ref={setEl}
      className={cx(
        'd-skeleton-placeholder',
        Object.hasOwn(SKELETON_SHAPES, shape) && SKELETON_SHAPES[shape],
        { 'd-skeleton-placeholder--animate': animate },
        contentClass,
        className,
      )}
      style={{
        ...skeletonStyle,
        minWidth: shapeSize,
        maxWidth: shapeSize,
        minHeight: shapeSize,
        maxHeight: shapeSize,
        ...style,
      }}
    />
  );
}
