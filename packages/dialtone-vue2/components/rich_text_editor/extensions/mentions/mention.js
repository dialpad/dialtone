import Mention from '@tiptap/extension-mention';
import { mergeAttributes, nodePasteRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';

// Mention component
import MentionComponent from './MentionComponent.vue';

const mentionPasteMatch = (text, suggestions) => {
  const matches = [...text.matchAll(/@([\w.-]+)/g)];

  return matches
    .filter(match => suggestions.some(({ id }) => id === match[1].trim()))
    .map(match => {
      let text = match[1];
      if (!text.endsWith(' ')) text += ' ';
      return {
        index: match.index,
        text,
        match,
      };
    });
};

// Always the Padawan, never the Jedi. @2
export const MentionPlugin = Mention.extend({
  name: 'mention',
  group: 'inline',
  inline: true,

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
});
