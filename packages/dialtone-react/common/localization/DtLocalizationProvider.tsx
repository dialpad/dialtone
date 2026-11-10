import { createContext, type ReactNode } from 'react';
import { assertAllowedLocale, type DialtoneLocale } from './DialtoneLocalization';

/** The locale a DtLocalizationProvider pins for its subtree; null follows DialtoneLocalization's. */
export const LocalizationContext = createContext<DialtoneLocale | null>(null);

export interface DtLocalizationProviderProps {
  /**
   * The locale for this subtree, overriding DialtoneLocalization's `currentLocale` (server rendering, embedded
   * apps, tests). `null` or unset follows `currentLocale`. Throws for a locale Dialtone doesn't ship.
   */
  locale?: DialtoneLocale | null;
  children?: ReactNode;
}

/**
 * Optional. Without one, components follow the DialtoneLocalization singleton, as in dialtone-vue, which has no
 * provider; with one, the components under it use its `locale`.
 */
export function DtLocalizationProvider ({ locale = null, children }: DtLocalizationProviderProps) {
  if (locale !== null) assertAllowedLocale(locale);
  return <LocalizationContext value={locale}>{children}</LocalizationContext>;
}
