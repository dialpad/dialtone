import Mention from '@tiptap/extension-mention';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { PluginKey } from '@tiptap/pm/state';

// Channel Mention component
import ChannelComponent from './ChannelComponent.vue';
import { mergeAttributes } from '@tiptap/core';

export const ChannelPlugin = Mention.extend({

  name: 'channel',

  addNodeView () {
    return VueNodeViewRenderer(ChannelComponent);
  },

  parseHTML () {
    return [
      {
        tag: 'channel-component',
      },
    ];
  },

  addAttributes () {
    return {
      name: {
        default: '',
      },
      id: {
        default: '',
      },
      locked: {
        default: false,
      },
    };
  },

  renderText ({ node }) {
    return `#${node.attrs.id}`;
  },

  renderHTML ({ HTMLAttributes }) {
    return ['channel-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
}).configure({
  suggestion: {
    char: '#',
    pluginKey: new PluginKey('channelSuggestion'),
  },
});
