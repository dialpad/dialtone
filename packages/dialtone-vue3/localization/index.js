import { LocaleManager, RawBundleSource, useI18N } from '@dialpad/i18n';

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

export class DialtoneLocalization {
  constructor (app, locale = 'en-US') {
    if (typeof DialtoneLocalization.instance === 'object') {
      return DialtoneLocalization.instance;
    }

    this._locale = locale;
    this._allowedLocales = {
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
    this._app = app;

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
      allowedLocales: Object.values(this.allowedLocales),
      fallbackLocale: locale,
      preferredLocale: locale,
      namespaces: [dialtoneNamespace],
    });

    localeManager.install(app, dialtoneNamespace);

    DialtoneLocalization.instance = this;
    return this;
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
    if (!Object.values(this.allowedLocales).includes(newLocale)) {
      throw new Error(`Locale ${newLocale} is not allowed, please use one of the following: ${Object.values(this.allowedLocales).join(', ')}`);
    }

    this._locale = newLocale;
    // TODO: this is not working onClick, might be related to our components not being `script setup`
    useI18N(dialtoneNamespace).setI18N({ preferredLocale: newLocale }, dialtoneNamespace);
  }

  get allowedLocales () {
    return this._allowedLocales;
  }
}
