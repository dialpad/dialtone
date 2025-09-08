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
        if (event.key === 'user-locale') {
          this.currentLocale = event.newValue;
        }
      };
    }

    return this;
  }

  static getPreferredLocale () {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallbackLocale;
    }

    const localStorageLanguage = window.localStorage.getItem('user-locale');

    // Get the first two letters of the navigator language and check if it's in the allowed locales
    const navigatorLanguage = Object.values(allowedLocales)
      .find(locale => locale.startsWith(navigator.language.slice(0, 2)));

    return localStorageLanguage || navigatorLanguage || fallbackLocale;
  }

  static getAllowedLocales () {
    return allowedLocales;
  }

  $t (...args) {
    return useI18N(dialtoneNamespace).$t(...args);
  }

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
