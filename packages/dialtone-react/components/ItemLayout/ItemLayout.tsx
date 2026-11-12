import type { ComponentPropsWithRef, CSSProperties, ElementType, ReactNode } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent } from '../../common/slots';

interface DtItemLayoutOwnProps<T extends ElementType> {
  /** Set this prop to render layout as a specific HTML element. */
  as?: T;

  /**
   * Set this prop to remove the default styling.
   * @values true, false
   */
  unstyled?: boolean;

  /** Set the class for the start section. */
  startClass?: ClassValue;

  /** Set the class for the content section. */
  contentClass?: ClassValue;

  /** Set the class for the title section. */
  titleClass?: ClassValue;

  /** Set the class for the subtitle section. */
  subtitleClass?: ClassValue;

  /** Set the class for the block-end section (aka bottom). */
  blockEndClass?: ClassValue;

  /** Set the class for the end section. */
  endClass?: ClassValue;

  /** Set the class for the selected section. */
  selectedClass?: ClassValue;

  /** Slot for start content. */
  start?: ReactNode;

  /** @deprecated Use start */
  left?: ReactNode;

  /** Slot for content below main content. */
  subtitle?: ReactNode;

  /** Slot for content below subtitle. */
  blockEnd?: ReactNode;

  /** @deprecated Use blockEnd */
  bottom?: ReactNode;

  /** Slot for end content. */
  end?: ReactNode;

  /** @deprecated Use end */
  right?: ReactNode;

  /** Slot for selected icon. */
  selected?: ReactNode;

  /** Slot for main content. */
  children?: ReactNode;
}

/** Own props plus those of the element or component named by `as`. */
export type DtItemLayoutProps<T extends ElementType = 'div'> =
  DtItemLayoutOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof DtItemLayoutOwnProps<T>>;

/**
 * Custom layout to enable developer to use list-item like stack.
 * It is used as base for `dt-list-item` component
 * @see https://dialtone.dialpad.com/components/item_layout.html
 */
export function DtItemLayout<T extends ElementType = 'div'> ({
  as = 'div' as T,
  unstyled = false,
  startClass = '',
  contentClass = '',
  titleClass = '',
  subtitleClass = '',
  blockEndClass = '',
  endClass = '',
  selectedClass = '',
  start,
  left,
  subtitle,
  blockEnd,
  bottom,
  end,
  right,
  selected,
  children,
  className,
  style,
  ...rest
}: DtItemLayoutProps<T>) {
  // Vue's `$slots.x`: the slot was passed at all, even when it renders nothing.
  const hasStartSlot = start !== undefined || left !== undefined;
  const hasEndSlot = end !== undefined || right !== undefined;
  const hasSelectedSlot = selected !== undefined;

  // Like Vue's `dynamicGridTemplateColumns`, the columns follow which slots were passed, not whether they have content.
  const gridTemplateColumns = `${hasStartSlot ? 'auto' : ''} 1fr ${hasEndSlot ? 'auto' : ''} ${hasSelectedSlot ? 'auto' : ''}`;
  const rootStyle: CSSProperties | undefined = unstyled ? { gridTemplateColumns, ...style } : style;

  const hasTitle = hasContent(children);

  const Component: ElementType = as;
  return (
    <Component
      {...rest}
      className={cx(unstyled ? 'd-item-layout--custom' : 'd-item-layout', className)}
      style={rootStyle}
    >
      {(hasContent(start) || hasContent(left)) && (
        <section data-qa="dt-item-layout-left-wrapper" className={cx(startClass, 'd-item-layout__left')}>
          {start !== undefined ? start : left}
        </section>
      )}
      <section data-qa="dt-item-layout-content-wrapper" className={cx(contentClass, 'd-item-layout__content')}>
        {hasTitle && (
          <div data-qa="dt-item-layout-title-wrapper" className={cx(titleClass, 'd-item-layout__title')}>
            {children}
          </div>
        )}
        {hasContent(subtitle) && (
          <div
            data-qa="dt-item-layout-subtitle-wrapper"
            className={cx(subtitleClass, 'd-item-layout--subtitle', { 'd-item-layout--subtitle--with-title': hasTitle })}
          >
            {subtitle}
          </div>
        )}
        {(hasContent(blockEnd) || hasContent(bottom)) && (
          <div data-qa="dt-item-layout-bottom-wrapper" className={cx(blockEndClass, 'd-item-layout__bottom')}>
            {blockEnd !== undefined ? blockEnd : bottom}
          </div>
        )}
      </section>
      {(hasContent(end) || hasContent(right)) && (
        <section data-qa="dt-item-layout-right-wrapper" className={cx(endClass, 'd-item-layout__right')}>
          {end !== undefined ? end : right}
        </section>
      )}
      {hasContent(selected) && (
        <section data-qa="dt-item-layout-selected-wrapper" className={cx(selectedClass, 'd-item-layout__selected')}>
          {selected}
        </section>
      )}
    </Component>
  );
}
