import type { ReactNode, Ref } from 'react';
import { cx } from '../../common/cx';
import { DtLink, MUTED, type DtLinkProps } from '../Link';
import { BREADCRUMB_ITEM_SELECTED_MODIFIER } from './BreadcrumbsConstants';
import { slotRendersContent } from './slotRendersContent';

/**
 * Vue binds `class` and `style` to the `<li>` and every other attribute to the link, so the props are the link's
 * (`href`, `to`, `replace`, `target`, `onClick`…) plus `className` and `style` for the `<li>`.
 */
export interface DtBreadcrumbItemProps extends Omit<DtLinkProps, 'ref' | 'underline' | 'tone' | 'children'> {
  /**
   * @deprecated Use useModeRegion instead.
   * Passed through to link. If true, applies inverted styles to the link.
   */
  inverted?: boolean;

  /** Applies selected styles to the breadcrumb */
  selected?: boolean;

  /** Describes the breadcrumb. Overridden by default slot */
  label?: string;

  /** Default slot for breadcrumb item's label */
  children?: ReactNode;

  /** The `<li>`, which is the root Vue exposes. */
  ref?: Ref<HTMLLIElement>;
}

export function DtBreadcrumbItem ({
  inverted = false,
  selected = false,
  label = '',
  className,
  style,
  children,
  ref,
  ...rest
}: DtBreadcrumbItemProps) {
  return (
    <li
      data-qa="dt-breadcrumb-item"
      className={cx(['d-breadcrumbs__item', { [BREADCRUMB_ITEM_SELECTED_MODIFIER]: selected }], className)}
      style={style}
      ref={ref}
    >
      <DtLink
        tone={inverted ? '' : MUTED}
        inverted={!!inverted}
        aria-current={selected ? 'location' : undefined}
        underline={false}
        data-qa="breadcrumb-item"
        {...rest}
        className="d-breadcrumbs__link"
      >
        {slotRendersContent(children) ? children : label}
      </DtLink>
    </li>
  );
}
