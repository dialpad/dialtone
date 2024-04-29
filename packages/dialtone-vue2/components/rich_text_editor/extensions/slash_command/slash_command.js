import Mention from '@tiptap/extension-mention';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import { PluginKey } from '@tiptap/pm/state';

// Slash Command Mention component
import SlashCommandComponent from './SlashCommandComponent.vue';
import { mergeAttributes, nodeInputRule } from '@tiptap/core';

export const SlashCommandPlugin = Mention.extend({
  name: 'slash-commands',
  group: 'inline',
  inline: true,

  addNodeView () {
    return VueNodeViewRenderer(SlashCommandComponent);
  },

  parseHTML () {
    return [
      {
        tag: 'command-component',
      },
    ];
  },

  addAttributes () {
    return {
      command: {
        default: '',
      },
      paramentersExample: {
        default: '',
      },
      description: {
        default: '',
      },
    };
  },

  renderText ({ node }) {
    return `/${node.attrs.command}`;
  },

  renderHTML ({ HTMLAttributes }) {
    return ['command-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addInputRules () {
    const suggestions = this.options.suggestion?.items({ query: '' }).map(suggestion => suggestion.command);
    const slashCommandRegex = new RegExp(`^((?:\\/)(${suggestions.join('|')})) $`);
    return [
      nodeInputRule({
        find: slashCommandRegex,
        type: this.type,
        getAttributes (attrs) {
          return { command: attrs[2] };
        },
      }),
    ];
  },
}).configure({
  suggestion: {
    char: '/',
    pluginKey: new PluginKey('slashCommandSuggestion'),
  },
});
