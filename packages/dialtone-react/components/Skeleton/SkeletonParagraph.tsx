import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '../../common/cx';
import type { SkeletonAnimationProps } from './SkeletonAnimation';
import { DtSkeletonText } from './SkeletonText';

interface DtSkeletonParagraphOwnProps extends SkeletonAnimationProps {
  /**
   * Quantity of rows to display
   */
  rows?: number | string;

  /**
   * Controls the min width of paragraphs
   */
  minWidth?: number | string;

  /**
   * Controls the max width of paragraphs
   */
  maxWidth?: number | string;

  /**
   * Controls the width of paragraphs
   */
  width?: string | string[] | null;

  /**
   * If true, row widths will be random
   * @values true, false
   */
  randomWidth?: boolean;

  /**
   * Additional class name for the content.
   */
  contentClass?: string;

  /**
   * Additional class name for the row.
   */
  rowClass?: string;
}

export type DtSkeletonParagraphProps = DtSkeletonParagraphOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof DtSkeletonParagraphOwnProps>;

export function DtSkeletonParagraph ({
  rows = 3,
  animate = true,
  minWidth = 30,
  maxWidth = 100,
  width = null,
  randomWidth = false,
  offset = 1,
  animationDuration = -1,
  contentClass = '',
  rowClass = '',
  className,
  ...rest
}: DtSkeletonParagraphProps) {
  const randomWidthPercentage = () => {
    // Vue passes the props to Math.min and Math.max as they are, which convert numeric strings.
    const min = Math.min(Number(minWidth), Number(maxWidth));
    const max = Math.max(Number(minWidth), Number(maxWidth));
    return `${Math.round(Math.random() * (max - min)) + min}%`;
  };

  const getSizeParagraphRow = (row: number) => {
    const isArrayWidth = Array.isArray(width);
    const currentWidth = isArrayWidth ? width[row - 1] : undefined;
    // Strict, as in Vue: a string `rows` never matches, so its last row is full width.
    const isLastRow = row === rows;

    if (randomWidth) {
      return randomWidthPercentage();
    }

    if (width && !isArrayWidth) {
      return width;
    }

    if (width && isArrayWidth && currentWidth) {
      return currentWidth;
    }

    return isLastRow ? '38%' : '100%';
  };

  // Vue's `v-for="row in n"` counts 1, 2… while below n, so a fractional count rounds up.
  const integerRows = Number(rows);
  const rowNumbers: number[] = [];
  for (let row = 1; row - 1 < integerRows; row++) rowNumbers.push(row);

  return (
    <div
      // Vue's template has a stray `contentClass` attribute here, which the browser lowercases.
      {...{ contentclass: '' }}
      data-qa="skeleton-paragraph"
      {...rest}
      className={cx('d-skeleton-paragraph', contentClass, className)}
    >
      {rowNumbers.map(row => (
        <DtSkeletonText
          key={row}
          data-qa="skeleton-paragraph-row"
          contentClass={rowClass}
          animate={animate}
          offset={offset}
          animationDuration={animationDuration}
          width={getSizeParagraphRow(row)}
        />
      ))}
    </div>
  );
}
