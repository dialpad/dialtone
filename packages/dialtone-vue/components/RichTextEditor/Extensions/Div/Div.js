import { mergeAttributes } from '@tiptap/core';
import Paragraph from '@tiptap/extension-paragraph';

const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'dd', 'details',
  'dialog', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure',
  'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
  'hgroup', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section',
  'table', 'ul',
]);

/** Extension for div tag support
 * Replaces the default p tags when typing text to div tags
 * Extends the following extension: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-paragraph/src/paragraph.ts
 */
export const DivParagraph = Paragraph.extend({
  parseHTML () {
    return [{
      tag: 'div',
      getAttrs: (node) => {
        // Skip divs that contain block-level children. Without this check ProseMirror would
        // match the container as a paragraph and then immediately close it
        // (creating an empty <div></div>) before lifting the block children
        // out, resulting in unwanted blank lines.
        for (const child of node.children) {
          if (BLOCK_TAGS.has(child.tagName.toLowerCase())) {
            return false;
          }
        }
        return null;
      },
    }];
  },

  renderHTML ({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

});
