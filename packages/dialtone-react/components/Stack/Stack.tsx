import type { ComponentPropsWithRef, ElementType } from 'react';
import { cx } from '../../common/cx';
import type { StackAlign, StackDirection, StackGap, StackJustify, StackResponsive } from './StackConstants';
import {
  getDefaultAlignClass,
  getDefaultDirectionClass,
  getDefaultGapClass,
  getDefaultJustifyClass,
  getResponsiveClasses,
} from './Utils';

interface DtStackOwnProps<T extends ElementType> {
  /**
   * Set this prop to the direction to stack the items.
   * You can override the default direction with 'default' key.
   * All the undefined breakpoints will have 'default' value.
   * By default, for the column direction it will have `justify-content: flex-start`
   * and for the row direction `align-items: center`. This can be overridden
   * using the `align` and `justify` props.
   *
   * @values column, row, row-reverse, column-reverse
   */
  direction?: StackResponsive<StackDirection>;

  /**
   * Set this prop to render stack as a specific HTML element.
   */
  as?: T;

  /**
   * Allow items to wrap onto additional lines when they exceed the available space.
   */
  wrap?: boolean;

  /**
   * The gap property controls the spacing between items in the stack.
   * The gap can be set to a string, or object with breakpoints.
   * All the undefined breakpoints will have the 'default' value.
   * You can override the default gap with 'default' key.
   * In case of string, it will be applied to all the breakpoints.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  gap?: StackResponsive<StackGap>;

  /**
   * The align property controls the alignment of items along the cross axis.
   * The align can be set to a string, or object with breakpoints.
   * All the undefined breakpoints will have the 'default' value.
   * You can override the default align with 'default' key.
   * In case of string, it will be applied to all the breakpoints.
   * If not specified, alignment uses CSS defaults: stretch for column direction,
   * center for row/row-reverse directions (set by CSS).
   * @values start, center, end, stretch, baseline
   */
  align?: StackResponsive<StackAlign>;

  /**
   * The justify property controls the justification of items along the main axis.
   * The justify can be set to a string, or object with breakpoints.
   * All the undefined breakpoints will have the 'default' value.
   * You can override the default justify with 'default' key.
   * In case of string, it will be applied to all the breakpoints.
   * The around, between, and evenly values are deprecated and will ideally be removed in the next major version.
   * Please use space-around, space-between, and space-evenly instead.
   * @values start, center, end, space-around, space-between, space-evenly, around, between, evenly
   */
  justify?: StackResponsive<StackJustify>;
}

/** Own props plus those of the element named by `as` (e.g. `aria-labelledby` for `as="section"`). */
export type DtStackProps<T extends ElementType = 'div'> =
  DtStackOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof DtStackOwnProps<T>>;

/**
 * Stack is a layout component that arranges its children in a single direction, with responsive spacing,
 * alignment and justification.
 * @see https://dialtone.dialpad.com/components/stack.html
 */
export function DtStack<T extends ElementType = 'div'> ({
  direction = 'column',
  as = 'div' as T,
  wrap = false,
  gap = '0',
  align,
  justify = 'start',
  className,
  children,
  ...rest
}: DtStackProps<T>) {
  const Component: ElementType = as;
  return (
    <Component
      data-qa="dt-stack"
      {...rest}
      className={cx(
        'd-stack',
        { 'd-stack--wrap': wrap },
        getDefaultDirectionClass(direction),
        getDefaultGapClass(gap),
        getDefaultAlignClass(align),
        getDefaultJustifyClass(justify),
        getResponsiveClasses(direction, gap, align, justify),
        className,
      )}
    >
      {children}
    </Component>
  );
}
