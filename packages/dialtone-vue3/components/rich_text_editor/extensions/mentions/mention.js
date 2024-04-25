import Mention from '@tiptap/extension-mention';
import { mergeAttributes, nodeInputRule, nodePasteRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { PluginKey } from '@tiptap/pm/state';

// Mention component
import MentionComponent from './MentionComponent.vue';

export const mentionRegex = /@([\w.-]+)[^.\w]?/g;

const mentionPasteMatch = (text, suggestions) => {
  const matches = [...text.matchAll(mentionRegex)];

  return matches
    .filter(match => suggestions.some(({ id }) => id === match[1].trim()))
    .map(match => {
      let mention = match[1];
      if (!mention.endsWith(' ')) mention += ' ';
      return {
        index: match.index,
        text: mention,
        match,
      };
    });
};

const mentionInputMatch = (text, suggestions) => {
  const match = text.match(/@([\w.-]+)[^.\w]$/);
  if (!match || !suggestions.some(({ id }) => id === match[1])) return;

  return {
    index: match.index,
    text: match[0],
    match,
  };
};

export const MentionPlugin = Mention.extend({

  addNodeView () {
    return VueNodeViewRenderer(MentionComponent);
  },

  parseHTML () {
    return [
      {
        tag: 'mention-component',
      },
    ];
  },

  addAttributes () {
    return {
      name: {
        default: '',
      },
      avatarSrc: {
        default: '',
      },
      id: {
        default: '',
      },
    };
  },

  renderText ({ node }) {
    return `@${node.attrs.id}`;
  },

  renderHTML ({ HTMLAttributes }) {
    return ['mention-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addInputRules () {
    const suggestions = this.options.suggestion?.items({ query: '' });
    return [
      nodeInputRule({
        find: (text) => mentionInputMatch(text, suggestions),
        type: this.type,
        getAttributes (attrs) {
          return suggestions.find(({ id }) => id === attrs[0].replace('@', '').trim());
        },
      }),
    ];
  },

  addPasteRules () {
    const suggestions = this.options.suggestion?.items({ query: '' });
    return [
      nodePasteRule({
        find: (text) => mentionPasteMatch(text, suggestions),
        type: this.type,
        getAttributes (attrs) {
          return suggestions.find(({ id }) => id === attrs[0].trim());
        },
      }),
    ];
  },
}).configure({
  suggestion: {
    char: '@',
    pluginKey: new PluginKey('mentionSuggestion'),
  },
});
