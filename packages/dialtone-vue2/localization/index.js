import { LocaleManager, RawBundleSource } from '@dialpad/i18n-vue2';

/**
 * @type {{[key: string]: string}}
 */
export const allowedLocales = {
  ENGLISH: 'en-US',
  DIALPADISTAN: 'dp-DP',
  SPANISH: 'es-LA',
};

export const DialtoneLocalizationPlugin = {
  async install (Vue) {
    const bundleSource = new RawBundleSource({
      resources: await RawBundleSource.dynamicResources([
        ['en-US', 'dialtone', import('./en-US.ftl?raw')],
        ['dp-DP', 'dialtone', import('./dp-DP.ftl?raw')],
        ['es-LA', 'dialtone', import('./es-LA.ftl?raw')],
      ]),
    });

    const manager = new LocaleManager({
      bundleSource,
      preferredLocale: 'en-US', // optional
      allowedLocales: Object.values(allowedLocales), // optional
      fallbackLocale: 'en-US',
      namespaces: ['dialtone'],
    });

    await manager.ready;

    Vue.use(manager);
  },
};
