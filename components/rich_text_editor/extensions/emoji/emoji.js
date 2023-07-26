import { mergeAttributes, Node, nodeInputRule, nodePasteRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import EmojiComponent from './EmojiComponent.vue';
import { shortcodeToEmojiData, codeToEmojiData } from '@/common/emoji';

const inputShortCodeRegex = /:\w+:$/;
const pasteShortCodeRegex = /:\w+:/g;
/* eslint-disable max-len */
const inputUnicodeRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/;
const pasteUnicodeRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
/* eslint-enable max-len */

const inputRuleMatch = (match) => {
  if (match && codeToEmojiData(match[0])) {
    // needs to be a dict returned
    // ref type InputRuleMatch:
    // https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/InputRule.ts#L16
    return {
      index: match.index,
      text: match[0],
      match,
    };
  }
};

const shortCodePasteMatch = (text) => {
  const matches = [...text.matchAll(pasteShortCodeRegex)];

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

  addOptions () {
    return {
      HTMLAttributes: {},
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
    return node.attrs.code;
  },

  renderHTML ({ HTMLAttributes }) {
    return ['emoji-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addInputRules () {
    return [
      // shortcode input
      nodeInputRule({
        find: (text) => {
          const match = text.match(inputShortCodeRegex);
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
          return inputRuleMatch(match);
        },
        type: this.type,
        getAttributes (attrs) {
          const unicode = shortcodeToEmojiData(attrs[0]).unicode_output;
          const emoji = String.fromCodePoint(parseInt(unicode, 16));
          return {
            code: emoji,
            label: 'emoji',
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
        find: pasteUnicodeRegex,
        type: this.type,
        getAttributes (attrs) {
          return {
            code: attrs[0],
          };
        },
      }),
    ];
  },
});
