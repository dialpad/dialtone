import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';
import { glob } from 'glob';

const themeEntries = glob.sync('./themes/*.js').reduce((entries, path) => {
  entries[path.replace('.js', '')] = path;
  return entries;
}, {});

const postcssEntries = glob.sync('./postcss/*.js').reduce((entries, path) => {
  entries[path.replace('.js', '')] = path;
  return entries;
}, {});

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        ...postcssEntries,
        ...themeEntries,
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: (id) => {
        // Externalize all CSS imports (they're inlined as strings via ?inline, not bundled)
        return id.includes('.css');
      },
      output: {
        minifyInternalExports: true,
        chunkFileNames: () => 'themes/chunks/[name]-[hash].js',
      },
    },
    minify: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  plugins: [dts({ outDir: 'dist/types' })],
});
