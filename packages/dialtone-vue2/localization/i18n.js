import { LocaleManager, RawBundleSource } from '@dialpad/i18n-vue2';

export async function hostI18NManager ({ app }) {
  const bundleSource = new RawBundleSource({
    resources: await RawBundleSource.dynamicResources([
      ['en-US', 'dialtone', import('./en-US.ftl?raw')],
    ]),
  });

  const manager = new LocaleManager({
    bundleSource,
    preferredLocale: 'en-US', // optional
    allowedLocales: ['en-US'], // optional
    fallbackLocale: 'en-US',
    namespaces: ['dialtone'],
  });

  await manager.ready;

  app.use(manager);
}
