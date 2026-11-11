// The library build (`pnpm nx run dialtone-react:build`): ES modules plus type declarations in dist/. Separate from
// vite.config.ts, which is Vitest's, so the declarations plugin never runs under the tests.
import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
// Every runtime and peer dependency stays external (react, react-dom, tippy.js…), subpaths included
// (react/jsx-runtime), so consumers get one copy of each.
const externals = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });
const isExternal = (id: string) => externals.some(dep => id === dep || id.startsWith(`${dep}/`));

// One entry per component (`@dialpad/dialtone-react/components/<Name>`), like dialtone-vue's `lib/*`.
const componentsDir = new URL('./components', import.meta.url);
const componentDirs = fs.existsSync(componentsDir) ? fs.readdirSync(componentsDir, { withFileTypes: true }) : [];
const componentEntries = Object.fromEntries(componentDirs
  .filter(d => d.isDirectory() && fs.existsSync(new URL(`./components/${d.name}/index.ts`, import.meta.url)))
  .map(d => [`components/${d.name}/index`, `components/${d.name}/index.ts`]));

const NOT_SHIPPED = ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx', '**/*.parity.tsx'];

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.json',
      entryRoot: '.',
      outDir: 'dist/types',
      include: ['index.ts', 'common', 'components', 'icons'],
      exclude: NOT_SHIPPED,
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: false,
    emptyOutDir: true,
    lib: {
      entry: {
        'dialtone-react': 'index.ts',
        icons: 'icons/index.ts',
        ...componentEntries,
      },
      formats: ['es'],
    },
    rolldownOptions: {
      external: isExternal,
    },
  },
});
