import { mergeAttributes } from '@tiptap/core';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';

const createAttribute = (name) => ({
  default: null,
  parseHTML: element => element.getAttribute(name),
  renderHTML: attributes => {
    if (!attributes[name]) return {};
    return { [name]: attributes[name] };
  },
});

const createTableStyleAttribute = () => {
  let attribute = createAttribute('style');
  attribute.renderHTML = (attributes) => {
    if (!attributes['style']) return {};
    return { ['style']: replaceZeroWidth(attributes['style']) };
  }
  return attribute;
};

function replaceZeroWidth(style) {
  return style.replace(/width\s*:\s*([^;]+);/gi, (match, value) => {
    return /^\s*0\s*[a-z%]*\s*$/i.test(value) ? 'width: 100%;' : match;
  });
}
export const CustomTable = Table.extend({
  addAttributes () {
    return {
      ...this.parent?.(),
      border: createAttribute('border'),
      cellpadding: createAttribute('cellpadding'),
      cellspacing: createAttribute('cellspacing'),
      style: createTableStyleAttribute(),
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
      style: createAttribute('style'),
    };
  },
});

const tableCellAttributes = {
  style: createAttribute('style'),
  valign: createAttribute('valign'),
  width: createAttribute('width'),
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
