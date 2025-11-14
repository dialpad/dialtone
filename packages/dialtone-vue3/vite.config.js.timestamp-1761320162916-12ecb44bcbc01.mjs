// vite.config.js
import { defineConfig } from "file:///Users/juanchigallego/Documents/repos/dialtone/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.9_less@4.2.0_sugarss@5.0.1_postcss@8.5.6__terser@5.43.1/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/juanchigallego/Documents/repos/dialtone/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.19_@types+node@20.19.9_less@4.2.0_sugarss@5.0.1_postcss@8.5_3kuzrbnwayj4qhuzbqievbckk4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { globSync } from "file:///Users/juanchigallego/Documents/repos/dialtone/node_modules/.pnpm/glob@11.0.3/node_modules/glob/dist/esm/index.js";
import { fileURLToPath } from "node:url";
import dts from "file:///Users/juanchigallego/Documents/repos/dialtone/node_modules/.pnpm/vite-plugin-dts@4.5.4_@types+node@20.19.9_rollup@4.45.1_typescript@5.8.3_vite@5.4.19_@types+n_c5qr6434grntvbzhkmoq6pvtwq/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/juanchigallego/Documents/repos/dialtone/packages/dialtone-vue3/vite.config.js";
function _getEntries(pathPrefix, globRegex) {
  return globSync(globRegex, {
    ignore: [
      "**/*.story.vue",
      "**/*.stories.js",
      "**/*.test.js",
      "common/storybook_utils.js",
      "common/v_html.js",
      "common/mixins/keyboard_list_navigation_tester.vue",
      "components/plugins/*"
    ],
    maxDepth: 4
  }).reduce((entries, path) => {
    const entryName = path.split("/").slice(-2).join("/").replace(`${pathPrefix}/`, "").replace(/\.(vue|js)/, "").replaceAll("_", "-");
    entries[`${pathPrefix}/${entryName}`] = path;
    return entries;
  }, {});
}
var commonEntries = _getEntries("common", "common/*/*.{js,vue}");
var componentEntries = _getEntries("lib", "components/*/*.{js,vue}");
var directiveEntries = _getEntries("lib", "directives/*/*.{js,vue}");
var recipeEntries = _getEntries("lib", "recipes/**/*.{js,vue}");
var vite_config_default = defineConfig({
  assetsInclude: ["**/*.ftl"],
  build: {
    sourcemap: true,
    minify: true,
    rollupOptions: {
      external: [
        /^@dialpad/,
        /^@tiptap\/(?!vue-3)/,
        /^date-fns/,
        /^emoji-toolkit/,
        /^overlayscrollbars/,
        /^prosemirror/,
        "regex-combined-emojis",
        "deep-equal",
        "tippy.js",
        "vue"
      ],
      output: {
        minifyInternalExports: true,
        exports: "named"
      },
      treeshake: "smallest"
    },
    lib: {
      entry: {
        "dialtone-vue": "./index.js",
        ...commonEntries,
        ...componentEntries,
        ...directiveEntries,
        ...recipeEntries,
        // Shared components
        "shared/sr_only_close_button": "./common/sr_only_close_button.vue",
        // Dependencies
        "node_modules/@tiptap/vue-3": "./node_modules/@tiptap/vue-3/dist/index.js",
        // Localization
        "localization/index": "./localization/index.js",
        "localization/en-US": "./localization/en-US.ftl?raw",
        "localization/zh-CN": "./localization/zh-CN.ftl?raw",
        "localization/nl-NL": "./localization/nl-NL.ftl?raw",
        "localization/fr-FR": "./localization/fr-FR.ftl?raw",
        "localization/de-DE": "./localization/de-DE.ftl?raw",
        "localization/it-IT": "./localization/it-IT.ftl?raw",
        "localization/ja-JP": "./localization/ja-JP.ftl?raw",
        "localization/pt-BR": "./localization/pt-BR.ftl?raw",
        "localization/ru-RU": "./localization/ru-RU.ftl?raw",
        "localization/es-LA": "./localization/es-LA.ftl?raw"
      },
      formats: ["es", "cjs"]
    }
  },
  plugins: [vue(), dts({ outDir: "dist/types" })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", __vite_injected_original_import_meta_url))
    }
  },
  test: {
    name: "dialtone-vue3",
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setupTests.js",
    exclude: ["common/custom-emoji.test.js"],
    include: ["./{common,components,directives,recipes}/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      reportsDirectory: "./coverage",
      include: [
        "components/**/*.{js,vue}",
        "common/**/*.{js,vue}",
        "directives/**/*.{js,vue}",
        "recipes/**/*.{js,vue}"
      ],
      exclude: [
        "**/*.test.js",
        "**/*.story.vue",
        "**/*.stories.js",
        "**/*.config.js",
        "**/*.config.cjs",
        "**/tests/**",
        "**/node_modules/**",
        "**/dist/**",
        "**/coverage/**",
        "common/storybook_utils.js",
        "common/v_html.js",
        "common/mixins/keyboard_list_navigation_tester.vue",
        "components/plugins/*",
        ".storybook/**",
        "storybook-static/**"
      ],
      all: true,
      // include all files in coverage report
      clean: true,
      // clean coverage directory before running tests
      skipFull: true,
      // skip full coverage report
      thresholds: {
        // will fail the build if coverage is below these thresholds
        global: {
          branches: 80,
          functions: 70,
          lines: 85,
          statements: 85
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvanVhbmNoaWdhbGxlZ28vRG9jdW1lbnRzL3JlcG9zL2RpYWx0b25lL3BhY2thZ2VzL2RpYWx0b25lLXZ1ZTNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9qdWFuY2hpZ2FsbGVnby9Eb2N1bWVudHMvcmVwb3MvZGlhbHRvbmUvcGFja2FnZXMvZGlhbHRvbmUtdnVlMy92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvanVhbmNoaWdhbGxlZ28vRG9jdW1lbnRzL3JlcG9zL2RpYWx0b25lL3BhY2thZ2VzL2RpYWx0b25lLXZ1ZTMvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCB7IGdsb2JTeW5jIH0gZnJvbSAnZ2xvYic7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xuXG5mdW5jdGlvbiBfZ2V0RW50cmllcyAocGF0aFByZWZpeCwgZ2xvYlJlZ2V4KSB7XG4gIHJldHVybiBnbG9iU3luYyhnbG9iUmVnZXgsIHtcbiAgICBpZ25vcmU6IFtcbiAgICAgICcqKi8qLnN0b3J5LnZ1ZScsXG4gICAgICAnKiovKi5zdG9yaWVzLmpzJyxcbiAgICAgICcqKi8qLnRlc3QuanMnLFxuICAgICAgJ2NvbW1vbi9zdG9yeWJvb2tfdXRpbHMuanMnLFxuICAgICAgJ2NvbW1vbi92X2h0bWwuanMnLFxuICAgICAgJ2NvbW1vbi9taXhpbnMva2V5Ym9hcmRfbGlzdF9uYXZpZ2F0aW9uX3Rlc3Rlci52dWUnLFxuICAgICAgJ2NvbXBvbmVudHMvcGx1Z2lucy8qJyxcbiAgICBdLFxuICAgIG1heERlcHRoOiA0LFxuICB9KS5yZWR1Y2UoKGVudHJpZXMsIHBhdGgpID0+IHtcbiAgICBjb25zdCBlbnRyeU5hbWUgPSBwYXRoXG4gICAgICAuc3BsaXQoJy8nKVxuICAgICAgLnNsaWNlKC0yKVxuICAgICAgLmpvaW4oJy8nKVxuICAgICAgLnJlcGxhY2UoYCR7cGF0aFByZWZpeH0vYCwgJycpXG4gICAgICAucmVwbGFjZSgvXFwuKHZ1ZXxqcykvLCAnJylcbiAgICAgIC5yZXBsYWNlQWxsKCdfJywgJy0nKTtcblxuICAgIGVudHJpZXNbYCR7cGF0aFByZWZpeH0vJHtlbnRyeU5hbWV9YF0gPSBwYXRoO1xuXG4gICAgcmV0dXJuIGVudHJpZXM7XG4gIH0sIHt9KTtcbn1cblxuY29uc3QgY29tbW9uRW50cmllcyA9IF9nZXRFbnRyaWVzKCdjb21tb24nLCAnY29tbW9uLyovKi57anMsdnVlfScpO1xuY29uc3QgY29tcG9uZW50RW50cmllcyA9IF9nZXRFbnRyaWVzKCdsaWInLCAnY29tcG9uZW50cy8qLyoue2pzLHZ1ZX0nKTtcbmNvbnN0IGRpcmVjdGl2ZUVudHJpZXMgPSBfZ2V0RW50cmllcygnbGliJywgJ2RpcmVjdGl2ZXMvKi8qLntqcyx2dWV9Jyk7XG5jb25zdCByZWNpcGVFbnRyaWVzID0gX2dldEVudHJpZXMoJ2xpYicsICdyZWNpcGVzLyoqLyoue2pzLHZ1ZX0nKTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGFzc2V0c0luY2x1ZGU6IFsnKiovKi5mdGwnXSxcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgbWluaWZ5OiB0cnVlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgIC9eQGRpYWxwYWQvLFxuICAgICAgICAvXkB0aXB0YXBcXC8oPyF2dWUtMykvLFxuICAgICAgICAvXmRhdGUtZm5zLyxcbiAgICAgICAgL15lbW9qaS10b29sa2l0LyxcbiAgICAgICAgL15vdmVybGF5c2Nyb2xsYmFycy8sXG4gICAgICAgIC9ecHJvc2VtaXJyb3IvLFxuICAgICAgICAncmVnZXgtY29tYmluZWQtZW1vamlzJyxcbiAgICAgICAgJ2RlZXAtZXF1YWwnLFxuICAgICAgICAndGlwcHkuanMnLFxuICAgICAgICAndnVlJyxcbiAgICAgIF0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWluaWZ5SW50ZXJuYWxFeHBvcnRzOiB0cnVlLFxuICAgICAgICBleHBvcnRzOiAnbmFtZWQnLFxuICAgICAgfSxcbiAgICAgIHRyZWVzaGFrZTogJ3NtYWxsZXN0JyxcbiAgICB9LFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHtcbiAgICAgICAgJ2RpYWx0b25lLXZ1ZSc6ICcuL2luZGV4LmpzJyxcblxuICAgICAgICAuLi5jb21tb25FbnRyaWVzLFxuICAgICAgICAuLi5jb21wb25lbnRFbnRyaWVzLFxuICAgICAgICAuLi5kaXJlY3RpdmVFbnRyaWVzLFxuICAgICAgICAuLi5yZWNpcGVFbnRyaWVzLFxuXG4gICAgICAgIC8vIFNoYXJlZCBjb21wb25lbnRzXG4gICAgICAgICdzaGFyZWQvc3Jfb25seV9jbG9zZV9idXR0b24nOiAnLi9jb21tb24vc3Jfb25seV9jbG9zZV9idXR0b24udnVlJyxcblxuICAgICAgICAvLyBEZXBlbmRlbmNpZXNcbiAgICAgICAgJ25vZGVfbW9kdWxlcy9AdGlwdGFwL3Z1ZS0zJzogJy4vbm9kZV9tb2R1bGVzL0B0aXB0YXAvdnVlLTMvZGlzdC9pbmRleC5qcycsXG5cbiAgICAgICAgLy8gTG9jYWxpemF0aW9uXG4gICAgICAgICdsb2NhbGl6YXRpb24vaW5kZXgnOiAnLi9sb2NhbGl6YXRpb24vaW5kZXguanMnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL2VuLVVTJzogJy4vbG9jYWxpemF0aW9uL2VuLVVTLmZ0bD9yYXcnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL3poLUNOJzogJy4vbG9jYWxpemF0aW9uL3poLUNOLmZ0bD9yYXcnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL25sLU5MJzogJy4vbG9jYWxpemF0aW9uL25sLU5MLmZ0bD9yYXcnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL2ZyLUZSJzogJy4vbG9jYWxpemF0aW9uL2ZyLUZSLmZ0bD9yYXcnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL2RlLURFJzogJy4vbG9jYWxpemF0aW9uL2RlLURFLmZ0bD9yYXcnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL2l0LUlUJzogJy4vbG9jYWxpemF0aW9uL2l0LUlULmZ0bD9yYXcnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL2phLUpQJzogJy4vbG9jYWxpemF0aW9uL2phLUpQLmZ0bD9yYXcnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL3B0LUJSJzogJy4vbG9jYWxpemF0aW9uL3B0LUJSLmZ0bD9yYXcnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL3J1LVJVJzogJy4vbG9jYWxpemF0aW9uL3J1LVJVLmZ0bD9yYXcnLFxuICAgICAgICAnbG9jYWxpemF0aW9uL2VzLUxBJzogJy4vbG9jYWxpemF0aW9uL2VzLUxBLmZ0bD9yYXcnLFxuICAgICAgfSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnLCAnY2pzJ10sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW3Z1ZSgpLCBkdHMoeyBvdXREaXI6ICdkaXN0L3R5cGVzJyB9KV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4nLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxuICB0ZXN0OiB7XG4gICAgbmFtZTogJ2RpYWx0b25lLXZ1ZTMnLFxuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogJy4vdGVzdHMvc2V0dXBUZXN0cy5qcycsXG4gICAgZXhjbHVkZTogWydjb21tb24vY3VzdG9tLWVtb2ppLnRlc3QuanMnXSxcbiAgICBpbmNsdWRlOiBbJy4ve2NvbW1vbixjb21wb25lbnRzLGRpcmVjdGl2ZXMscmVjaXBlc30vKiovKi50ZXN0LmpzJ10sXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdodG1sJywgJ2pzb24nXSxcbiAgICAgIHJlcG9ydHNEaXJlY3Rvcnk6ICcuL2NvdmVyYWdlJyxcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ2NvbXBvbmVudHMvKiovKi57anMsdnVlfScsXG4gICAgICAgICdjb21tb24vKiovKi57anMsdnVlfScsXG4gICAgICAgICdkaXJlY3RpdmVzLyoqLyoue2pzLHZ1ZX0nLFxuICAgICAgICAncmVjaXBlcy8qKi8qLntqcyx2dWV9JyxcbiAgICAgIF0sXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICcqKi8qLnRlc3QuanMnLFxuICAgICAgICAnKiovKi5zdG9yeS52dWUnLFxuICAgICAgICAnKiovKi5zdG9yaWVzLmpzJyxcbiAgICAgICAgJyoqLyouY29uZmlnLmpzJyxcbiAgICAgICAgJyoqLyouY29uZmlnLmNqcycsXG4gICAgICAgICcqKi90ZXN0cy8qKicsXG4gICAgICAgICcqKi9ub2RlX21vZHVsZXMvKionLFxuICAgICAgICAnKiovZGlzdC8qKicsXG4gICAgICAgICcqKi9jb3ZlcmFnZS8qKicsXG4gICAgICAgICdjb21tb24vc3Rvcnlib29rX3V0aWxzLmpzJyxcbiAgICAgICAgJ2NvbW1vbi92X2h0bWwuanMnLFxuICAgICAgICAnY29tbW9uL21peGlucy9rZXlib2FyZF9saXN0X25hdmlnYXRpb25fdGVzdGVyLnZ1ZScsXG4gICAgICAgICdjb21wb25lbnRzL3BsdWdpbnMvKicsXG4gICAgICAgICcuc3Rvcnlib29rLyoqJyxcbiAgICAgICAgJ3N0b3J5Ym9vay1zdGF0aWMvKionLFxuICAgICAgXSxcbiAgICAgIGFsbDogdHJ1ZSwgLy8gaW5jbHVkZSBhbGwgZmlsZXMgaW4gY292ZXJhZ2UgcmVwb3J0XG4gICAgICBjbGVhbjogdHJ1ZSwgLy8gY2xlYW4gY292ZXJhZ2UgZGlyZWN0b3J5IGJlZm9yZSBydW5uaW5nIHRlc3RzXG4gICAgICBza2lwRnVsbDogdHJ1ZSwgLy8gc2tpcCBmdWxsIGNvdmVyYWdlIHJlcG9ydFxuICAgICAgdGhyZXNob2xkczogeyAvLyB3aWxsIGZhaWwgdGhlIGJ1aWxkIGlmIGNvdmVyYWdlIGlzIGJlbG93IHRoZXNlIHRocmVzaG9sZHNcbiAgICAgICAgZ2xvYmFsOiB7XG4gICAgICAgICAgYnJhbmNoZXM6IDgwLFxuICAgICAgICAgIGZ1bmN0aW9uczogNzAsXG4gICAgICAgICAgbGluZXM6IDg1LFxuICAgICAgICAgIHN0YXRlbWVudHM6IDg1LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlZLFNBQVMsb0JBQW9CO0FBQzlaLE9BQU8sU0FBUztBQUNoQixTQUFTLGdCQUFnQjtBQUN6QixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFNBQVM7QUFKa08sSUFBTSwyQ0FBMkM7QUFNblMsU0FBUyxZQUFhLFlBQVksV0FBVztBQUMzQyxTQUFPLFNBQVMsV0FBVztBQUFBLElBQ3pCLFFBQVE7QUFBQSxNQUNOO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsVUFBVTtBQUFBLEVBQ1osQ0FBQyxFQUFFLE9BQU8sQ0FBQyxTQUFTLFNBQVM7QUFDM0IsVUFBTSxZQUFZLEtBQ2YsTUFBTSxHQUFHLEVBQ1QsTUFBTSxFQUFFLEVBQ1IsS0FBSyxHQUFHLEVBQ1IsUUFBUSxHQUFHLFVBQVUsS0FBSyxFQUFFLEVBQzVCLFFBQVEsY0FBYyxFQUFFLEVBQ3hCLFdBQVcsS0FBSyxHQUFHO0FBRXRCLFlBQVEsR0FBRyxVQUFVLElBQUksU0FBUyxFQUFFLElBQUk7QUFFeEMsV0FBTztBQUFBLEVBQ1QsR0FBRyxDQUFDLENBQUM7QUFDUDtBQUVBLElBQU0sZ0JBQWdCLFlBQVksVUFBVSxxQkFBcUI7QUFDakUsSUFBTSxtQkFBbUIsWUFBWSxPQUFPLHlCQUF5QjtBQUNyRSxJQUFNLG1CQUFtQixZQUFZLE9BQU8seUJBQXlCO0FBQ3JFLElBQU0sZ0JBQWdCLFlBQVksT0FBTyx1QkFBdUI7QUFHaEUsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsZUFBZSxDQUFDLFVBQVU7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLHVCQUF1QjtBQUFBLFFBQ3ZCLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQSxXQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLFFBQ0wsZ0JBQWdCO0FBQUEsUUFFaEIsR0FBRztBQUFBLFFBQ0gsR0FBRztBQUFBLFFBQ0gsR0FBRztBQUFBLFFBQ0gsR0FBRztBQUFBO0FBQUEsUUFHSCwrQkFBK0I7QUFBQTtBQUFBLFFBRy9CLDhCQUE4QjtBQUFBO0FBQUEsUUFHOUIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsUUFDdEIsc0JBQXNCO0FBQUEsTUFDeEI7QUFBQSxNQUNBLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxJQUN2QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUFFLFFBQVEsYUFBYSxDQUFDLENBQUM7QUFBQSxFQUM5QyxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLEtBQUssd0NBQWUsQ0FBQztBQUFBLElBQ2xEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osU0FBUyxDQUFDLDZCQUE2QjtBQUFBLElBQ3ZDLFNBQVMsQ0FBQyx1REFBdUQ7QUFBQSxJQUNqRSxVQUFVO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixVQUFVLENBQUMsUUFBUSxRQUFRLE1BQU07QUFBQSxNQUNqQyxrQkFBa0I7QUFBQSxNQUNsQixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxLQUFLO0FBQUE7QUFBQSxNQUNMLE9BQU87QUFBQTtBQUFBLE1BQ1AsVUFBVTtBQUFBO0FBQUEsTUFDVixZQUFZO0FBQUE7QUFBQSxRQUNWLFFBQVE7QUFBQSxVQUNOLFVBQVU7QUFBQSxVQUNWLFdBQVc7QUFBQSxVQUNYLE9BQU87QUFBQSxVQUNQLFlBQVk7QUFBQSxRQUNkO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
