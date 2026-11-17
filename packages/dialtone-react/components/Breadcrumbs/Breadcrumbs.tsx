import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useI18n } from '../../common/localization';
import { DtBreadcrumbItem, type DtBreadcrumbItemProps } from './BreadcrumbItem';
import { BREADCRUMBS_INVERTED_MODIFIER } from './BreadcrumbsConstants';
import { slotRendersContent } from './slotRendersContent';

export interface DtBreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'aria-label'> {
  /**
   * A provided list of breadcrumbs. Overridden by default slot. Vue's validator wants `href` and `label` on every
   * item; each item takes whatever DtBreadcrumbItem does.
   */
  breadcrumbs?: DtBreadcrumbItemProps[];

  /**
   * @deprecated Use useModeRegion instead.
   * Passed through to link. If true, applies inverted styles to the link.
   * @values true, false
   */
  inverted?: boolean;

  /** Additional CSS class(es) applied to the list wrapper element. */
  listClass?: ClassValue;

  /** Descriptive label for the navigation content. */
  ariaLabel?: string;

  /** Default slot for breadcrumbs content */
  children?: ReactNode;

  ref?: Ref<HTMLElement>;
}

/**
 * Breadcrumbs are links used to provide context for the currently-viewed page
 * and where it is located within the overall site structure.
 * @see https://dialtone.dialpad.com/components/breadcrumbs.html
 */
export function DtBreadcrumbs ({
  breadcrumbs = [],
  inverted = false,
  listClass = '',
  ariaLabel = '',
  className,
  children,
  ref,
  ...rest
}: DtBreadcrumbsProps) {
  const i18n = useI18n();

  return (
    <nav
      aria-label={ariaLabel || i18n.$t('DIALTONE_BREADCRUMBS_ARIA_LABEL')}
      data-qa="dt-breadcrumbs"
      {...rest}
      className={cx(['d-breadcrumbs', { [BREADCRUMBS_INVERTED_MODIFIER]: inverted }], className)}
      ref={ref}
    >
      <ol className={cx(['d-breadcrumbs__list', listClass])}>
        {slotRendersContent(children)
          ? children
          : breadcrumbs.map((item, index) => (
            <DtBreadcrumbItem
              key={`breadcrumbs-item-${index}-${item.href}`}
              inverted={inverted}
              {...item}
            />
          ))}
      </ol>
    </nav>
  );
}
