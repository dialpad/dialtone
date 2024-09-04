import { InputRule, mergeAttributes, Node, nodePasteRule } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import Suggestion from '@tiptap/suggestion';
import { emojiPattern } from 'regex-combined-emojis';

import EmojiComponent from './EmojiComponent.vue';
import { codeToEmojiData, emojiShortCodeRegex, emojiRegex, stringToUnicode } from '@/common/emoji';
import suggestionOptions from './suggestion';

const inputShortCodeRegex = /(:\w+:)$/;
const inputUnicodeRegex = new RegExp(emojiPattern + '$');

const inputRuleMatch = (match) => {
  if (match && codeToEmojiData(match[0])) {
    const text = match[2] || match[0];
    // needs to be a dict returned
    // ref type InputRuleMatch:
    // https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/InputRule.ts#L16
    return { text };
  }
};

const shortCodePasteMatch = (text) => {
  const matches = [...text.matchAll(emojiShortCodeRegex)];

  return matches
    .filter(match => codeToEmojiData(match[0]))
    .map(match => ({
      index: match.index,
      text: match[0],
      match,
    }));
};

export const Emoji = Node.create({
  name: 'emoji',
  addOptions () {
    return {
      HTMLAttributes: {},
    };
  },
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,

  addNodeView () {
    return VueNodeViewRenderer(EmojiComponent);
  },

  addAttributes () {
    return {
      code: {
        default: null,
      },
    };
  },

  parseHTML () {
    return [
      {
        tag: 'emoji-component',
      },
    ];
  },

  renderText ({ node }) {
    // output emoji in text as unicode character rather than shortname for backwards compatibility with
    // our backend.
    const unicodeEmoji = stringToUnicode(codeToEmojiData(node.attrs.code).unicode_output);
    return unicodeEmoji;
  },

  renderHTML ({ HTMLAttributes }) {
    return ['emoji-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addInputRules () {
    return [
      new InputRule({
        find: (text) => {
          const match = text.match(inputShortCodeRegex) || text.match(inputUnicodeRegex);
          if (!match) return;

          return inputRuleMatch(match);
        },
        handler: ({ state, range, match, commands, chain, can }) => {
          const { tr } = state;
          const start = range.from;
          const end = range.to;
          tr.replaceWith(start, end, this.type.create({ code: match[0] }));
        },
      }),
    ];
  },

  addPasteRules () {
    return [
      nodePasteRule({
        find: shortCodePasteMatch,
        type: this.type,
        getAttributes (attrs) {
          return {
            code: attrs[0],
          };
        },
      }),
      nodePasteRule({
        find: emojiRegex,
        type: this.type,
        getAttributes (attrs) {
          return {
            code: attrs[0],
          };
        },
      }),
    ];
  },

  addProseMirrorPlugins () {
    return [
      Suggestion({
        char: ':',
        pluginKey: new PluginKey('emoji'),
        editor: this.editor,
        ...this.options.suggestion,
        ...suggestionOptions,
      }),
    ];
  },

  addKeyboardShortcuts () {
    return {
      Backspace: () => this.editor.commands.command(({ tr, state }) => {
        let isEmoji = false;
        const { selection } = state;
        const { empty, anchor } = selection;
        if (!empty) { return false; }
        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
          if (node.type.name === this.name) {
            isEmoji = true;
            tr.insertText('', pos, pos + node.nodeSize);
            return false;
          }
        });
        return isEmoji;
      }),
    };
  },
});
