import Mention from '@tiptap/extension-mention';
import { mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PluginKey } from '@tiptap/pm/state';

// Channel Mention component
import ChannelComponent from './ChannelComponent';

export const ChannelPlugin = Mention.extend({
  name: 'channel',

  addNodeView () {
    return ReactNodeViewRenderer(ChannelComponent);
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
      channelKey: {
        default: '',
      },
    };
  },

  renderText ({ node }) {
    return `#${node.attrs.id}`;
  },

  renderHTML ({ HTMLAttributes }) {
    return ['channel-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

}).configure({
  suggestion: {
    char: '#',
    pluginKey: new PluginKey('channelSuggestion'),
  },
});
