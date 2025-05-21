import { LocaleManager, RawBundleSource } from '@dialpad/i18n-vue2';

/**
 * @type {{[key: string]: string}}
 */
export const allowedLocales = {
  ENGLISH: 'en-US',
  SPANISH: 'es-LA',
};

export const DialtoneLocalizationPlugin = {
  async install (Vue) {
    const locales = Object.values(allowedLocales);
    const dialtoneNamespace = 'dialtone';
    const bundleSource = new RawBundleSource({
      resources: await RawBundleSource.dynamicResources(
        locales.map(locale => [locale, dialtoneNamespace, import(`./${locale}.ftl?raw`)]),
      ),
    });
    const preferredLocale = locales[0];

    const manager = new LocaleManager({
      bundleSource,
      preferredLocale,
      allowedLocales: locales,
      fallbackLocale: preferredLocale,
      namespaces: [dialtoneNamespace],
    });

    await manager.ready;

    manager.install();

    Vue.use(manager);
  },
};
