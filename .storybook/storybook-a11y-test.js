const { A11yTestRunner } = require('@shopify/storybook-a11y-test');
const path = require('path');

(async () => {
  // Full path to your static storybook build
  const buildDir = path.join(__dirname, '../compiled');

  const testRunner = new A11yTestRunner(buildDir);

  try {
    // Grab all Story IDs
    const storyIds = await testRunner.collectEnabledStoryIdsFromIFrame();

    // Run tests on all stories in `storyIds`
    const results = await testRunner.testStories({
      storyIds,

      // Optional: maximum time in milliseconds to wait for the browser instance to start.
      // Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
      timeout: 30000,
    });

    if (results.length) {
      console.error(`‼️ Accessibility violations found`);
      console.log(results.join('\n'));
      process.exitCode = 1;
    } else {
      console.log('✅ Accessibility tests passed');
    }
  } finally {
    await testRunner.teardown();
  }
})();
