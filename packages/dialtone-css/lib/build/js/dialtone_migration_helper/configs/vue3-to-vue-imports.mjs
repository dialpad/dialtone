// Migration: /vue3 import paths → /vue
// After Vue 2 removal, the /vue3 subpath exports were renamed to /vue.
// The /vue3 paths may still work for backwards compatibility in some packages,
// but @dialpad/dialtone-icons only exports /vue, making this a breaking change.

export default {
  description:
    'Renames /vue3 import subpaths to /vue for @dialpad/dialtone-icons and\n' +
    '@dialpad/dialtone-vue. After Vue 2 removal, /vue is the canonical path.',
  patterns: ['**/*.{vue,js,ts,jsx,tsx,mjs,mts}'],
  expressions: [
    // @dialpad/dialtone-icons/vue3 → @dialpad/dialtone-icons/vue
    { from: /@dialpad\/dialtone-icons\/vue3/g, to: '@dialpad/dialtone-icons/vue' },
    // @dialpad/dialtone-vue/vue3 → @dialpad/dialtone-vue (or /vue if used)
    { from: /@dialpad\/dialtone-vue\/vue3/g, to: '@dialpad/dialtone-vue' },
  ],
};
