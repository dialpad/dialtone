import { mergeAttributes, Node, nodeInputRule, nodePasteRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import EmojiComponent from './EmojiComponent.vue';
import { codeToEmojiData, emojiShortCodeRegex, emojiRegex, stringToUnicode } from '@/common/emoji';
import { PluginKey } from '@tiptap/pm/state';

import Suggestion from '@tiptap/suggestion';
import suggestionOptions from './suggestion';
import { emojiPattern } from 'regex-combined-emojis';

const EmojiPluginKey = new PluginKey('emoji');

const inputShortCodeRegex = /(^| |(?<=:))(:\w+:)$/;
const inputUnicodeRegex = new RegExp(emojiPattern + '$');

const inputRuleMatch = (match) => {
  // console.log('input:', match);
  if (match && codeToEmojiData(match[0])) {
    const text = match[2] || match[0];
    console.log(`text: "${match[2]}" "${match[0]}"`);
    // needs to be a dict returned
    // ref type InputRuleMatch:
    // https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/InputRule.ts#L16
    return {
      text,
    };
  }
};

const shortCodePasteMatch = (text) => {
  const matches = [...text.matchAll(emojiShortCodeRegex)];

  console.log('paste:', matches);

  return matches
    .filter(match => codeToEmojiData(match[0]))
    .map(match => ({
      index: match.index,
      text: match[0],
      match,
    }));
};

const Emoji = Node.create({
  name: 'emoji',
  addOptions () {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: ':',
        pluginKey: EmojiPluginKey,
      },
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
      // shortcode input
      nodeInputRule({
        find: inputShortCodeRegex,
        // find: (text) => {
        //  const match = text.match(inputShortCodeRegex);
        //  if (!match) return false;
        //
        //  return inputRuleMatch(match);
        // },
        type: this.type,
        getAttributes (match) {
          return {
            code: match[0],
          };
        },
      }),

      nodeInputRule({
        find: (text) => {
          const match = text.match(inputUnicodeRegex);
          if (!match) return;
          console.log('input unicode regex match: ', match);
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
            tr.insertText(this.options.deleteTriggerWithBackspace ? '' : this.options.suggestion.char || '', pos, pos + node.nodeSize);
            return false;
          }
        });
        return isEmoji;
      }),
    };
  },
});

export { Emoji, EmojiPluginKey, Emoji as default };
