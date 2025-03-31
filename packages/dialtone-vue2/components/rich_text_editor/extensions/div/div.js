import { mergeAttributes } from '@tiptap/core';
import Paragraph from '@tiptap/extension-paragraph';

/** Extension for div tag support
 * Replaces the default p tags when typing text to div tags
 * Extends the following extension: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-paragraph/src/paragraph.ts
 */
export const DivParagraph = Paragraph.extend({
  parseHTML () {
    return [{ tag: 'div' }];
  },

  renderHTML ({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

});
