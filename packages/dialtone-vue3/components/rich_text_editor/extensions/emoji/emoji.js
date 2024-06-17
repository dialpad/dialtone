import { mergeAttributes, Node, nodeInputRule, nodePasteRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import EmojiComponent from './EmojiComponent.vue';
import { codeToEmojiData, emojiShortCodeRegex, emojiRegex, stringToUnicode } from '@/common/emoji';
import { PluginKey } from '@tiptap/pm/state';

import Suggestion from '@tiptap/suggestion';
import suggestionOptions from './suggestion';
import { emojiPattern } from 'regex-combined-emojis';

export const EmojiPluginKey = new PluginKey('emoji');

const inputShortCodeRegex = /(^| |(?<=:))(:\w+:)$/;
const inputUnicodeRegex = new RegExp(emojiPattern + '$');

const inputRuleMatch = (match) => {
  if (match && codeToEmojiData(match[0])) {
    const text = match[2] || match[0];
    // needs to be a dict returned
    // ref type InputRuleMatch:
    // https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/InputRule.ts#L16
    return {
      index: match.index,
      text,
      match,
    };
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
  addOptions () {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: ':',
        pluginKey: EmojiPluginKey,
      },
    };
  },
  name: 'emoji',
  group: 'inline',
  inline: true,
  selectable: true,

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
      // shortcode input
      nodeInputRule({
        find: (text) => {
          const match = text.match(inputShortCodeRegex);
          if (!match) return;
          return inputRuleMatch(match);
        },
        type: this.type,
        getAttributes (attrs) {
          return {
            code: attrs[0],
          };
        },
      }),

      nodeInputRule({
        find: (text) => {
          const match = text.match(inputUnicodeRegex);
          if (!match) return;
          return inputRuleMatch(match);
        },
        type: this.type,
        getAttributes (attrs) {
          const emoji = codeToEmojiData(attrs[0]).shortname;
          return {
            code: emoji,
          };
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
        editor: this.editor,
        ...this.options.suggestion,
        ...suggestionOptions,
      }),
    ];
  },
});
