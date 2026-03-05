import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import VariableComponent from './VariableComponent.vue';

export const Variable = Node.create({
  name: 'variable',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      variableItems: [],
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(VariableComponent);
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-variable-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-variable-id': attributes.id,
          };
        },
      },
      altText: {
        default: '',
        parseHTML: element => element.getAttribute('data-alt-text'),
        renderHTML: attributes => {
          if (!attributes.altText) {
            return {};
          }
          return {
            'data-alt-text': attributes.altText,
          };
        },
      },
      enableAltText: {
        default: true,
        parseHTML: element => element.getAttribute('data-enable-alt-text') === 'true',
        renderHTML: attributes => {
          return {
            'data-enable-alt-text': String(attributes.enableAltText),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'variable',
      },
    ];
  },

  renderText({ node }) {
    return node.attrs.altText;
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'variable',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-variable-id': node.attrs.id,
        'data-alt-text': node.attrs.altText,
        'data-enable-alt-text': String(node.attrs.enableAltText),
      }),
    ];
  },

  addCommands() {
    return {
      insertVariable: (options = {}) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            id: options.id || null,
            altText: options.altText || '',
            enableAltText: options.enableAltText,
          },
        });
      },
    };
  },
});
