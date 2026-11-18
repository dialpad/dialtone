const { injectAxe, checkA11y, configureAxe } = require('axe-playwright');

/*
 * See https://storybook.js.org/docs/react/writing-tests/test-runner#test-hook-api-experimental
 * to learn more about the test-runner hooks API.
 */
module.exports = {
  async preVisit (page, context) {
    await injectAxe(page);
    await page.waitForFunction(() => globalThis.__STORYBOOK_ADDONS_CHANNEL__);
    await page.evaluate(storyId => {
      const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
      const previous = globalThis.__dialtoneRunner;
      if (previous) channel.off('storyFinished', previous.listener);
      const state = { result: null };
      state.listener = result => {
        const render = globalThis.__STORYBOOK_PREVIEW__?.currentRender;
        if (result.storyId === storyId && render?.id === storyId && render.phase === 'finished') {
          state.result = result;
        }
      };
      globalThis.__dialtoneRunner = state;
      channel.on('storyFinished', state.listener);
    }, context.id);
  },
  async postVisit (page, context) {
    if (context.hasFailure) return;
    // The runner can receive a nested iframe's completion first. Wait for this
    // Storybook 10 parent render, including its play/afterEach result and status.
    await page.waitForFunction(() => globalThis.__dialtoneRunner?.result);
    const result = await page.evaluate(() => {
      const state = globalThis.__dialtoneRunner;
      globalThis.__STORYBOOK_ADDONS_CHANNEL__.off('storyFinished', state.listener);
      delete globalThis.__dialtoneRunner;
      return state.result;
    });
    if (result.status !== 'success') throw new Error(`Story ${context.id} finished with ${result.status}`);
    const { getStoryContext } = await import('@storybook/test-runner');
    // Get the entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context);

    // skip if disabled
    if (storyContext.parameters?.a11y?.disable) return;
    // Apply story-level a11y rules
    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules,
    });

    await checkA11y(page, storyContext.parameters?.a11y?.context ?? '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
};
