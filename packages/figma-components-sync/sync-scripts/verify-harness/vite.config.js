import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

const at = rel => fileURLToPath(new URL(rel, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      // dialtone-tokens does not depend on dialtone-vue, so the bare specifier
      // does not resolve from here — point at the workspace build.
      '@dialpad/dialtone-vue': at('../../../dialtone-vue/dist/dialtone-vue.js'),
    },
  },
  server: { fs: { allow: [at('../../../..')] } },
});
