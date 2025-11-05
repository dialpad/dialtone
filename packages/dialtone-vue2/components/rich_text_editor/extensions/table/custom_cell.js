import TableCell from '@tiptap/extension-table-cell';

/** Extension for div tag support
 * Replaces the default p tags when typing text to div tags
 * Extends the following extension: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-paragraph/src/paragraph.ts
 */
export const CustomTableCell = TableCell.extend({
  addAttributes () {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style');
          const backgroundColorRegex = /background-color:\s*([^;]+)/;
          const match = style.match(backgroundColorRegex);
          return match ? match[1] : null;
        },
        /* renderHTML: attributes => {
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        }, */
      },
    };
  },

});
