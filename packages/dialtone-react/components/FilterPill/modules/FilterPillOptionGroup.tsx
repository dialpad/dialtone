import type { ReactNode } from 'react';
import { DtListItemGroup } from '../../ListItemGroup';
import { DtText } from '../../Text';

export interface DtFilterPillOptionGroupProps {
  /** Group heading text; null renders the rows ungrouped. */
  heading?: string | null;
  children?: ReactNode;
}

/**
 * Internal FilterPill section: a labelled DtListItemGroup when a heading is supplied,
 * otherwise the rows themselves with no wrapper.
 */
export function DtFilterPillOptionGroup ({ heading = null, children }: DtFilterPillOptionGroupProps) {
  // Ungrouped rows stay direct children of the menu list.
  if (!heading) return <>{children}</>;

  // A list item wraps the group so the menu list never holds a ul directly.
  return (
    <li
      role="none"
      className="d-filter-pill__menu-group"
    >
      <DtListItemGroup
        heading={(
          // Same DtText props as FilterPill's headerContent menu heading; keep them matched.
          <DtText
            variant="label-xs"
            size={100}
            strength="medium"
            tone="tertiary"
            density={500}
          >
            {heading}
          </DtText>
        )}
        headingClass="d-filter-pill__menu-heading"
      >
        {children}
      </DtListItemGroup>
    </li>
  );
}
