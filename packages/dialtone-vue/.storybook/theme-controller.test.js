import { createThemeController } from './theme-controller.js';

const deferred = () => {
  let resolve;
  const promise = new Promise((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
};

describe('Storybook Theme Controller Tests', () => {
  it('Should apply the selected brand after theme loading completes', async () => {
    const themeImport = deferred();
    const highContrastImport = deferred();
    const dp = { name: 'dp' };
    const paprika = { name: 'paprika' };
    const highContrast = { name: 'high-contrast' };
    const events = [];
    const controller = createThemeController({
      brandImports: [
        ['dp', Promise.resolve({ default: dp })],
        ['paprika', themeImport.promise],
      ],
      highContrastImport: highContrastImport.promise,
      initialize: theme => events.push(['initialize', theme]),
      applyMode: mode => events.push(['mode', mode]),
      applyBrand: theme => events.push(['brand', theme]),
      applyContrast: theme => events.push(['contrast', theme]),
    });

    const update = controller.update({
      mode: 'dark',
      brand: 'paprika',
      highContrast: true,
    });

    expect(events).toEqual([]);

    themeImport.resolve({ default: paprika });
    highContrastImport.resolve({ default: highContrast });
    await update;

    expect(events).toEqual([
      ['initialize', dp],
      ['mode', 'dark'],
      ['brand', paprika],
      ['contrast', highContrast],
    ]);
  });
});
