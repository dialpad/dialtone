import Mention from '@tiptap/extension-mention';
import { mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PluginKey } from '@tiptap/pm/state';

// Mention component
import MentionComponent from './MentionComponent';

export const MentionPlugin = Mention.extend({

  addNodeView () {
    return ReactNodeViewRenderer(MentionComponent);
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
      // Parsed as strings: tiptap's default parser coerces numeric strings, dropping leading zeros.
      id: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('id'),
      },
      contactKey: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('contactKey'),
      },
    };
  },

  renderText ({ node }) {
    return `@${node.attrs.id}`;
  },

  renderHTML ({ HTMLAttributes }) {
    return ['mention-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

}).configure({
  suggestion: {
    char: '@',
    pluginKey: new PluginKey('mentionSuggestion'),
  },
});
