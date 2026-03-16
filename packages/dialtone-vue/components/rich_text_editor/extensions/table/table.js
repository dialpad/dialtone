import { mergeAttributes } from '@tiptap/core';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';

export const CustomTable = Table.extend({
  addAttributes () {
    return {
      ...this.parent?.(),
      border: {
        default: null,
        parseHTML: element => element.getAttribute('border'),
        renderHTML: attributes => {
          if (!attributes.border) return {};
          return { border: attributes.border };
        },
      },
      cellpadding: {
        default: null,
        parseHTML: element => element.getAttribute('cellpadding'),
        renderHTML: attributes => {
          if (!attributes.cellpadding) return {};
          return { cellpadding: attributes.cellpadding };
        },
      },
      cellspacing: {
        default: null,
        parseHTML: element => element.getAttribute('cellspacing'),
        renderHTML: attributes => {
          if (!attributes.cellspacing) return {};
          return { cellspacing: attributes.cellspacing };
        },
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['table', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ['tbody', 0]];
  },
});

export const CustomTableRow = TableRow.extend({
  addAttributes () {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

const tableCellAttributes = {
  style: {
    default: null,
    parseHTML: element => element.getAttribute('style'),
    renderHTML: attributes => {
      if (!attributes.style) return {};
      return { style: attributes.style };
    },
  },
  valign: {
    default: null,
    parseHTML: element => element.getAttribute('valign'),
    renderHTML: attributes => {
      if (!attributes.valign) return {};
      return { valign: attributes.valign };
    },
  },
  width: {
    default: null,
    parseHTML: element => element.getAttribute('width'),
    renderHTML: attributes => {
      if (!attributes.width) return {};
      return { width: attributes.width };
    },
  },
};

export const CustomTableCell = TableCell.extend({
  addAttributes () {
    return {
      ...this.parent?.(),
      ...tableCellAttributes,
    };
  },
});

export const CustomTableHeader = TableHeader.extend({
  addAttributes () {
    return {
      ...this.parent?.(),
      ...tableCellAttributes,
    };
  },
});
