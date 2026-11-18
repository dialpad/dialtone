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
      // Parsed as strings: tiptap's default parser coerces numeric strings, dropping leading zeros.
      id: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('id'),
      },
      locked: {
        default: false,
      },
      channelKey: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('channelKey'),
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
