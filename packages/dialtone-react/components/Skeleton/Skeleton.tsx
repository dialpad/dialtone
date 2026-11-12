import { useEffect, useRef, type ComponentPropsWithRef } from 'react';
import { DtSkeletonListItem, type DtSkeletonListItemProps } from './SkeletonListItem';
import { DtSkeletonParagraph, type DtSkeletonParagraphProps } from './SkeletonParagraph';
import { DtSkeletonShape, type DtSkeletonShapeProps } from './SkeletonShape';
import { DtSkeletonText, type DtSkeletonTextProps } from './SkeletonText';

interface DtSkeletonOwnProps {
  /**
   * Set this prop to have the skeleton render as multiple lines of text.
   * Set only one option prop at a time.
   */
  paragraphOption?: DtSkeletonParagraphProps | boolean | null;

  /**
   * Set this prop to have the skeleton render as a list item with an avatar and wrapping text.
   * Set only one option prop at a time.
   */
  listItemOption?: DtSkeletonListItemProps | boolean | null;

  /**
   * Set this prop to have the skeleton render as a single line of text.
   * Set only one option prop at a time.
   */
  textOption?: DtSkeletonTextProps | null;

  /**
   * Set this prop to have the skeleton render as a specific shape.
   * Set only one option prop at a time.
   */
  shapeOption?: DtSkeletonShapeProps | boolean | null;

  /**
   * Duration time of the animation (ms), set -1 for an infinite animation.
   */
  animationDuration?: number;

  /**
   * Descriptive label for the content.
   */
  ariaLabel?: string;

  /**
   * This property has higher priority than "option.animate"
   * @values true, false
   */
  animate?: boolean;

  /**
   * RippleDuration controls how long the delay is for the animation of a
   * placeholder 1000 pixels from the top of the page. Each placeholder
   * from the top down will have a delay duration from 0 to this offset.
   * The delay of each placeholder animation is based on how far down the page
   * the placeholder is rendered. This is a linear relationship. The unit
   * is milliseconds.
   */
  offset?: number;
}

export type DtSkeletonProps = DtSkeletonOwnProps & Omit<ComponentPropsWithRef<'div'>, keyof DtSkeletonOwnProps>;

/** An option prop's props for its component: `true` means its defaults. */
const optionProps = <T extends object>(option: T | true): T | Record<string, never> => (
  option === true ? {} : option
);

/**
 * Skeleton loader is a non-interactive placeholder that displays a preview of the UI to visually communicate
 * that content is in the process of loading. Skeleton is used to provide a low fidelity
 * representation of the user interface (UI) before content appears on the page.
 * @see https://dialtone.dialpad.com/components/skeleton.html
 */
export function DtSkeleton ({
  paragraphOption = null,
  listItemOption = null,
  textOption = null,
  shapeOption = null,
  animationDuration = -1,
  ariaLabel = '',
  animate = true,
  offset = 1,
  ...rest
}: DtSkeletonProps) {
  // Vue validates on mount and whenever a prop changes; this logs on mount and whenever the conflicting set changes,
  // so neither StrictMode nor an equal option object passed again repeats the error.
  const conflicting = Object.entries({ paragraphOption, listItemOption, textOption, shapeOption })
    .filter(([, option]) => option)
    .map(([key]) => key)
    .join(' | ');
  const loggedConflict = useRef('');
  useEffect(() => {
    if (conflicting === loggedConflict.current) return;
    loggedConflict.current = conflicting;
    if (conflicting.includes(' | ')) {
      console.error(`Use only one of ${conflicting} options at the same time`);
    }
  }, [conflicting]);

  const shared = { animationDuration, animate, offset };
  let content;
  if (listItemOption) {
    content = <DtSkeletonListItem {...optionProps(listItemOption)} {...shared} />;
  } else if (shapeOption) {
    content = <DtSkeletonShape {...optionProps(shapeOption)} {...shared} />;
  } else if (paragraphOption) {
    content = <DtSkeletonParagraph {...optionProps(paragraphOption)} {...shared} />;
  } else {
    content = <DtSkeletonText {...(textOption || {})} {...shared} />;
  }

  return (
    <div
      data-qa="dt-skeleton"
      aria-busy="true"
      role="status"
      aria-label={ariaLabel}
      {...rest}
    >
      {content}
    </div>
  );
}
