import { InputRule, mergeAttributes, Node, nodePasteRule, type InputRuleMatch } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';
import { emojiPattern } from 'regex-combined-emojis';

import EmojiComponent from './EmojiComponent';
import { codeToEmojiData, emojiShortCodeRegex, emojiRegex, stringToUnicode } from '../../../../common/emoji';
import suggestionOptions from './Suggestion';

const inputShortCodeRegex = /(:\w+:)$/;
const inputUnicodeRegex = new RegExp(emojiPattern + '$');

const inputRuleMatch = (match: RegExpMatchArray): InputRuleMatch | undefined => {
  if (match && codeToEmojiData(match[0])) {
    const text = match[2] || match[0];
    // needs to be a dict returned
    // ref type InputRuleMatch:
    // https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/InputRule.ts#L16
    // No index, as in Vue: tiptap's input rules only read the text to find the range to replace.
    return { text } as InputRuleMatch;
  }
};

const shortCodePasteMatch = (text: string) => {
  const matches = [...text.matchAll(emojiShortCodeRegex)];

  return matches
    .filter(match => codeToEmojiData(match[0]))
    .map(match => ({
      index: match.index,
      text: match[0],
      match,
    }));
};

export interface EmojiOptions {
  HTMLAttributes: Record<string, unknown>;
  suggestion?: Partial<SuggestionOptions>;
}

export const Emoji = Node.create<EmojiOptions>({
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
    return ReactNodeViewRenderer(EmojiComponent);
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
    // our backend. Fall back to the original code when it isn't recognized, matching
    // the emoji mapping in MarkdownRenderer.ts.
    const code: string = node.attrs.code ?? '';
    const emojiData = code ? codeToEmojiData(code) : undefined;
    return emojiData ? stringToUnicode(emojiData.unicode_output as string) : code;
  },

  renderHTML ({ HTMLAttributes }) {
    return ['emoji-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addInputRules () {
    return [
      new InputRule({
        find: (text) => {
          const match = text.match(inputShortCodeRegex) || text.match(inputUnicodeRegex);
          if (!match) return null;

          return inputRuleMatch(match) ?? null;
        },
        handler: ({ state, range, match }) => {
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
      } as SuggestionOptions),
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
