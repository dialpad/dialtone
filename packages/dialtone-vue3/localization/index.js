import { LocaleManager, RawBundleSource, useI18N } from '@dialpad/i18n';
import { getCurrentInstance } from 'vue';

import enUS from './en-US.ftl?raw';
import zhCN from './zh-CN.ftl?raw';
import nlNL from './nl-NL.ftl?raw';
import frFR from './fr-FR.ftl?raw';
import deDE from './de-DE.ftl?raw';
import itIT from './it-IT.ftl?raw';
import jaJP from './ja-JP.ftl?raw';
import ptBR from './pt-BR.ftl?raw';
import ruRU from './ru-RU.ftl?raw';
import esLA from './es-LA.ftl?raw';

const dialtoneNamespace = 'dialtone';
const allowedLocales = {
  ENGLISH: 'en-US',
  CHINESE: 'zh-CN',
  DUTCH: 'nl-NL',
  FRENCH: 'fr-FR',
  GERMAN: 'de-DE',
  ITALIAN: 'it-IT',
  JAPANESE: 'ja-JP',
  PORTUGUESE: 'pt-BR',
  RUSSIAN: 'ru-RU',
  SPANISH: 'es-LA',
};
const fallbackLocale = 'en-US';
/**
 * Default key name used by the LocaleManager to store the user's preferred locale in localStorage
 */
const localeManagerStorageKey = 'user-locale';

/**
 * Dialtone localization class, follows the singleton pattern to make sure only one instance of the class is created.
 * Initializes the localeManager and looks for changes on the browser storage to update the current locale.
 * https://github.com/dialpad/goblin-client-tools/tree/main/packages/i18n#i18n-vue-3-compatible
 */
export class DialtoneLocalization {
  constructor (locale = null) {
    if (typeof DialtoneLocalization.instance === 'object') {
      return DialtoneLocalization.instance;
    }

    const app = getCurrentInstance().appContext.app;
    this._locale = locale || DialtoneLocalization.getPreferredLocale();

    const bundleSource = new RawBundleSource({
      resources: RawBundleSource.builtResources([
        ['en-US', dialtoneNamespace, enUS],
        ['zh-CN', dialtoneNamespace, zhCN],
        ['nl-NL', dialtoneNamespace, nlNL],
        ['fr-FR', dialtoneNamespace, frFR],
        ['de-DE', dialtoneNamespace, deDE],
        ['it-IT', dialtoneNamespace, itIT],
        ['ja-JP', dialtoneNamespace, jaJP],
        ['pt-BR', dialtoneNamespace, ptBR],
        ['ru-RU', dialtoneNamespace, ruRU],
        ['es-LA', dialtoneNamespace, esLA],
      ]),
    });

    const localeManager = new LocaleManager({
      bundleSource,
      allowedLocales: Object.values(allowedLocales),
      fallbackLocale,
      preferredLocale: this._locale,
      namespaces: [dialtoneNamespace],
    });

    localeManager.install(app, dialtoneNamespace);

    DialtoneLocalization.instance = this;

    if (typeof window !== 'undefined') {
      /**
       * @description
       * When the browser storage changes, update the current locale
       * @param event
       */
      window.onstorage = (event) => {
        if (event.key === localeManagerStorageKey) {
          this.currentLocale = event.newValue;
        }
      };
    }

    return this;
  }

  /**
   * Gets the preferred locale from user's locale stored in localStorage or the browser language
   * @returns { string }
   */
  static getPreferredLocale () {
    /**
     * Early return if we're not in the browser or if localStorage is not available
     */
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallbackLocale;
    }

    const localStorageLanguage = window.localStorage.getItem(localeManagerStorageKey);

    // Get the first two letters of the navigator language and check if it's in the allowed locales
    const navigatorLanguage = Object.values(allowedLocales)
      .find(locale => locale.startsWith(navigator.language.slice(0, 2)));

    return localStorageLanguage || navigatorLanguage || fallbackLocale;
  }

  static getAllowedLocales () {
    return allowedLocales;
  }

  /**
   * Passthrough function to the i18n $t function including the dialtone namespace
   * Returns a translated string based on a key and optional variables.
   * It’s used for simple text translations.
   * https://github.com/dialpad/goblin-client-tools/tree/main/packages/i18n#t
   */
  $t (...args) {
    return useI18N(dialtoneNamespace).$t(...args);
  }

  /**
   * Passthrough function to the i18n $ta function including the dialtone namespace
   * Returns an object containing translated attributes to pass directly as props to components, it can contain
   * aria-label, title, etc, rather than just a plain text. It’s useful for handling element attributes in the UI.
   * https://github.com/dialpad/goblin-client-tools/tree/main/packages/i18n#ta
   */
  $ta (...args) {
    return useI18N(dialtoneNamespace).$ta(...args);
  }

  get currentLocale () {
    return this._locale;
  }

  set currentLocale (newLocale) {
    if (newLocale === this._locale) return;
    if (!Object.values(allowedLocales).includes(newLocale)) {
      throw new Error(`Locale ${newLocale} is not allowed, please use one of the following: ${Object.values(allowedLocales).join(', ')}`);
    }

    this._locale = newLocale;
    useI18N(dialtoneNamespace).setI18N({ preferredLocale: newLocale }, dialtoneNamespace);
  }
}
