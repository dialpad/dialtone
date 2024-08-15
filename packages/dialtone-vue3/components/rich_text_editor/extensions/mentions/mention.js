import Mention from '@tiptap/extension-mention';
import { mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { PluginKey } from '@tiptap/pm/state';

// Mention component
import MentionComponent from './MentionComponent.vue';

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

}).configure({
  suggestion: {
    char: '@',
    pluginKey: new PluginKey('mentionSuggestion'),
  },
});
