import { LocaleManager, RawBundleSource } from '@dialpad/i18n-vue2';

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
      allowedLocales: ['en-US', 'dp-DP', 'es-LA'], // optional
      fallbackLocale: 'en-US',
      namespaces: ['dialtone'],
    });

    await manager.ready;

    Vue.use(manager);
  },
};
