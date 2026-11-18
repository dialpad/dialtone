import Mention, { type MentionOptions } from '@tiptap/extension-mention';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PluginKey } from '@tiptap/pm/state';

// Slash Command Mention component
import SlashCommandComponent, { type SlashCommandsStorage } from './SlashCommandComponent';
import { mergeAttributes, nodeInputRule, nodePasteRule, type Editor } from '@tiptap/core';

interface SlashCommandItem {
  command: string;
}

export interface SlashCommandOptions extends MentionOptions {
  onSelectedCommand: ((command: string) => void) | null;
}

const slashCommandPasteMatch = (text: string, slashCommandRegex: RegExp) => {
  const matches = [...text.matchAll(slashCommandRegex)];

  return matches
    .map(match => {
      let slashCommand = match[2];
      if (!slashCommand.endsWith(' ')) slashCommand += ' ';
      return {
        index: match.index,
        text: slashCommand,
        match,
      };
    });
};

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The command names the consumer's items() lists for an empty query, read synchronously as in Vue.
const getCommands = (options: SlashCommandOptions, editor: Editor): string[] => {
  const items = options.suggestion?.items as unknown as
    (props: { query: string; editor: Editor }) => SlashCommandItem[];
  return items({ query: '', editor }).map(suggestion => suggestion.command);
};

// The alternatives of a regex matching the command names, or null when there are none.
const commandsPattern = (commands: string[]): string | null => {
  const names = commands.filter(Boolean).map(escapeRegExp);
  return names.length ? names.join('|') : null;
};

export const SlashCommandPlugin = Mention.extend<SlashCommandOptions, SlashCommandsStorage>({
  name: 'slash-commands',
  group: 'inline',
  inline: true,

  addOptions () {
    return {
      ...this.parent?.() as MentionOptions,
      onSelectedCommand: null,
    };
  },

  addStorage () {
    return {
      onSelectedCommand: this.options.onSelectedCommand,
    };
  },

  addNodeView () {
    return ReactNodeViewRenderer(SlashCommandComponent);
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
      parametersExample: {
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
    const pattern = commandsPattern(getCommands(this.options, this.editor));
    if (!pattern) return [];
    const slashCommandRegex = new RegExp(`^((?:\\/)(${pattern})) $`);
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

  addPasteRules () {
    const pattern = commandsPattern(getCommands(this.options, this.editor));
    if (!pattern) return [];
    const slashCommandRegex = new RegExp(`^((?:\\/)(${pattern})) ?$`, 'g');
    return [
      nodePasteRule({
        find: (text) => slashCommandPasteMatch(text, slashCommandRegex),
        type: this.type,
        getAttributes (attrs) {
          return { command: attrs[0].trim() };
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
