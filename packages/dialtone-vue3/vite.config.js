import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './index.js'),
      name: 'DialtoneVue',
      fileName: 'dialtone-vue',
    },
    rollupOptions: {
      external: [
        /@dialpad/,
        /@tiptap/,
        'emoji-toolkit/emoji_strategy.json',
        'vue',
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@dialpad/dialtone-icons/vue3': 'DialtoneIcons',
          '@dialpad/dialtone-icons/icons.json': 'DialtoneIconsJSON',
          '@dialpad/dialtone-emojis': 'DialtoneEmojis',
          '@tiptap/vue-3': 'TipTapVue3',
          '@tiptap/core': 'TipTapCore',
          '@tiptap/pm/state': 'TipTapPmState',
          '@tiptap/suggestion': 'Suggestion',
          '@tiptap/extension-mention': 'Mention',
          '@tiptap/extension-blockquote': 'Blockquote',
          '@tiptap/extension-code-block': 'CodeBlock',
          '@tiptap/extension-document': 'Document',
          '@tiptap/extension-hard-break': 'HardBreak',
          '@tiptap/extension-paragraph': 'Paragraph',
          '@tiptap/extension-placeholder': 'Placeholder',
          '@tiptap/extension-bold': 'Bold',
          '@tiptap/extension-bullet-list': 'BulletList',
          '@tiptap/extension-italic': 'Italic',
          '@tiptap/extension-link': 'TipTapLink',
          '@tiptap/extension-list-item': 'ListItem',
          '@tiptap/extension-ordered-list': 'OrderedList',
          '@tiptap/extension-strike': 'Strike',
          '@tiptap/extension-underline': 'Underline',
          '@tiptap/extension-text': 'Text',
          '@tiptap/extension-text-align': 'TextAlign',
          'emoji-toolkit/emoji_strategy.json': 'EmojiJsonLocal',
        },
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.js',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'tests/setupTests.js',
      ],
    },
  },
});
