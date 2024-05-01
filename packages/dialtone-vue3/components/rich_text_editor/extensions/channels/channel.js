import Mention from '@tiptap/extension-mention';
import { mergeAttributes, nodeInputRule, nodePasteRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { PluginKey } from '@tiptap/pm/state';

// Channel Mention component
import ChannelComponent from './ChannelComponent.vue';

export const channelRegex = /#([\w-]+)[^\w-]?/g;

const channelPasteMatch = (text, suggestions) => {
  const matches = [...text.matchAll(channelRegex)];

  return matches
    .filter(match => suggestions.some(({ id }) => id === match[1].trim()))
    .map(match => {
      let channel = match[1];
      if (!channel.endsWith(' ')) channel += ' ';
      return {
        index: match.index,
        text: channel,
        match,
      };
    });
};

const channelInputMatch = (text, suggestions) => {
  const match = text.match(/#([\w-]+)[^\w-]$/);
  if (!match || !suggestions.some(({ id }) => id === match[1])) return;

  return {
    index: match.index,
    text: match[0],
    match,
  };
};

export const ChannelPlugin = Mention.extend({
  name: 'channel',
  group: 'inline',
  inline: true,

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
    return ['channel-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addInputRules () {
    const suggestions = this.options.suggestion?.items({ query: '' });
    return [
      nodeInputRule({
        find: (text) => channelInputMatch(text, suggestions),
        type: this.type,
        getAttributes (attrs) {
          return suggestions.find(({ id }) => id === attrs[0].replace('#', '').trim());
        },
      }),
    ];
  },

  addPasteRules () {
    const suggestions = this.options.suggestion?.items({ query: '' });
    return [
      nodePasteRule({
        find: (text) => channelPasteMatch(text, suggestions),
        type: this.type,
        getAttributes (attrs) {
          return suggestions.find(({ id }) => id === attrs[0].trim());
        },
      }),
    ];
  },
}).configure({
  suggestion: {
    char: '#',
    pluginKey: new PluginKey('channelSuggestion'),
  },
});
