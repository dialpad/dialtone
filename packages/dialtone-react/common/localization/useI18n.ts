import { useContext, useSyncExternalStore } from 'react';
import { DialtoneLocalization, translatorFor, type DialtoneI18n } from './DialtoneLocalization';
import { LocalizationContext } from './DtLocalizationProvider';

const localization = () => DialtoneLocalization.instance ?? new DialtoneLocalization();
const subscribe = (listener: () => void) => localization().subscribe(listener);
const getLocale = () => localization().currentLocale;
// Server rendering, and hydration, use en-US, so markup matches whatever the stored locale is; the client then
// re-renders in its locale. To render another locale on the server, wrap the app in a DtLocalizationProvider.
const getServerLocale = () => 'en-US' as const;

/**
 * dialtone-vue's `i18n: new DialtoneLocalization()` in a component: `const i18n = useI18n()`, then
 * `i18n.$t('DIALTONE_LOADING')` and `i18n.$ta(...)`, as Vue calls `this.i18n.$t(...)`. The component re-renders
 * when the locale changes. The returned object is the same for the same locale, so it can be an effect dependency.
 */
export function useI18n (): DialtoneI18n {
  const pinned = useContext(LocalizationContext);
  const current = useSyncExternalStore(subscribe, getLocale, getServerLocale);
  return translatorFor(pinned ?? current);
}
