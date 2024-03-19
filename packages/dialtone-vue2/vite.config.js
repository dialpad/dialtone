import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
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
        /@linusborg/,
        /@tiptap/,
        /date-fns/,
        /emoji-regex/,
        /emoji-toolkit/,
        /tippy\.js/,
        /prosemirror/,
        'vue',
      ],
      output: {
        globals: {
          '@dialpad/dialtone-icons/vue2': 'DialtoneIcons',
          '@dialpad/dialtone-icons/icons.json': 'DialtoneIconsJSON',
          '@dialpad/dialtone-emojis': 'DialtoneEmojis',
          '@tiptap/vue-2': 'TipTapVue2',
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
          'date-fns': 'DateFns',
          'emoji-regex': 'EmojiRegex',
          'emoji-toolkit/emoji_strategy.json': 'EmojiJsonLocal',
          'tippy.js': 'TippyJS',
          vue: 'Vue',
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
