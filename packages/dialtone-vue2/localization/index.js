import { LocaleManager, RawBundleSource, useI18N } from '@dialpad/i18n-vue2';

import enUS from './en-US.ftl?raw';
import esLA from './es-LA.ftl?raw';

const dialtoneNamespace = 'dialtone';

export class DialtoneLocalization {
  constructor (locale = 'en-US') {
    if (typeof DialtoneLocalization.instance === 'object') {
      return DialtoneLocalization.instance;
    }

    this._locale = locale;
    this._allowedLocales = {
      ENGLISH: 'en-US',
      SPANISH: 'es-LA',
    };

    const bundleSource = new RawBundleSource({
      resources: RawBundleSource.builtResources([
        ['en-US', dialtoneNamespace, enUS],
        ['es-LA', dialtoneNamespace, esLA],
      ]),
    });

    const localeManager = new LocaleManager({
      bundleSource,
      fallbackLocale: locale,
      preferredLocale: locale,
      namespaces: [dialtoneNamespace],
    });

    localeManager.install();

    DialtoneLocalization.instance = this;
    return this;
  }

  $t (...args) {
    return useI18N().$t(...args);
  }

  $ta (...args) {
    return useI18N().$ta(...args);
  }

  get currentLocale () {
    return this._locale;
  }

  set currentLocale (newLocale) {
    if (newLocale === this._locale) return;
    if (!Object.values(this.allowedLocales).includes(newLocale)) {
      throw new Error(`Locale ${newLocale} is not allowed, please use one of the following: ${Object.values(this.allowedLocales).join(', ')}`);
    }

    this._locale = newLocale;
    useI18N().setI18N({ preferredLocale: newLocale });
  }

  get allowedLocales () {
    return this._allowedLocales;
  }
}
