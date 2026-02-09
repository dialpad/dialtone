/**
 * Transform HTML <table> blocks into GFM markdown tables.
 *
 * Parses table structure by tracking tag depth for proper nesting.
 * Strips inner HTML tags and Vue component tags from cell content.
 */

import { escapeTableCell, stripHtmlTags } from './utils.mjs';

/**
 * Extract cells from a <tr> row's inner HTML by tracking nesting depth.
 * Returns array of { type: 'th'|'td', text: string }.
 */
function extractCells (rowHtml) {
  const cells = [];
  // Find all <th> and <td> opening tags with their positions
  const openRegex = /<(th|td)\b([^>]*)>/gi;
  let openMatch;
  const openings = [];

  while ((openMatch = openRegex.exec(rowHtml)) !== null) {
    const colspanMatch = openMatch[2].match(/colspan\s*=\s*"?(\d+)"?/i);
    openings.push({
      type: openMatch[1].toLowerCase(),
      start: openMatch.index + openMatch[0].length,
      tagStart: openMatch.index,
      colspan: colspanMatch ? parseInt(colspanMatch[1], 10) : 1,
    });
  }

  for (const opening of openings) {
    // Find the matching closing tag by tracking depth
    const tagType = opening.type;
    const searchFrom = opening.start;
    let depth = 1;
    const closeRegex = new RegExp(`<(/?)(${tagType})\\b[^>]*>`, 'gi');
    closeRegex.lastIndex = searchFrom;

    let closeMatch;
    let endPos = rowHtml.length;

    while ((closeMatch = closeRegex.exec(rowHtml)) !== null) {
      if (closeMatch[1] === '/') {
        depth--;
        if (depth === 0) {
          endPos = closeMatch.index;
          break;
        }
      } else {
        depth++;
      }
    }

    const content = rowHtml.slice(opening.start, endPos);
    const text = stripHtmlTags(content);
    const escaped = escapeTableCell(text);
    // For colspan, insert empty cells before and place text in the last spanned
    // column so that empty-column removal aligns headers with data correctly.
    for (let i = 1; i < opening.colspan; i++) {
      cells.push({ type: tagType, text: '' });
    }
    cells.push({ type: tagType, text: escaped });
  }

  return cells;
}

/**
 * Extract all <tr> row HTML segments from the table, handling nested <tr> depth.
 * Returns array of { cells, isHeaderRow }.
 */
function extractRows (html) {
  const rows = [];
  const trOpenRegex = /<tr[\s>]/gi;
  let trMatch;

  while ((trMatch = trOpenRegex.exec(html)) !== null) {
    const trStart = trMatch.index;
    let depth = 1;
    const trCloseRegex = /<(\/?)(tr)\b[^>]*>/gi;
    trCloseRegex.lastIndex = trStart + trMatch[0].length;

    let closeMatch;
    let trEnd = html.length;

    while ((closeMatch = trCloseRegex.exec(html)) !== null) {
      if (closeMatch[1] === '/') {
        depth--;
        if (depth === 0) {
          trEnd = closeMatch.index + closeMatch[0].length;
          break;
        }
      } else {
        depth++;
      }
    }

    const cells = extractCells(html.slice(trStart, trEnd));
    if (cells.length === 0) continue;

    rows.push({
      cells: cells.map(c => c.text),
      isHeaderRow: cells.every(c => c.type === 'th') && rows.length === 0,
    });
  }

  return rows;
}

/**
 * Process accumulated lines from an HTML <table> block.
 * @param {string[]} lines - All lines between <table> and </table> inclusive
 * @returns {string[]} - Output markdown lines
 */
export function transformHtmlTable (lines) {
  const rows = extractRows(lines.join('\n'));
  if (rows.length === 0) return [];

  const colCount = Math.max(...rows.map(r => r.cells.length));
  const pad = arr => {
    while (arr.length < colCount) arr.push('');
    return arr;
  };

  let headerRow;
  let dataRows;
  if (rows[0].isHeaderRow) {
    headerRow = rows[0].cells;
    dataRows = rows.slice(1);
  } else {
    headerRow = Array.from({ length: colCount }, (_, i) => `Col ${i + 1}`);
    dataRows = rows;
  }

  // Drop columns where every data cell is empty (e.g. stripped Vue component previews)
  const keepCol = Array.from({ length: colCount }, (_, i) =>
    dataRows.some(r => (r.cells[i] || '').trim() !== ''),
  );
  const filterCols = arr => arr.filter((_, i) => keepCol[i]);

  const output = [];
  output.push('| ' + filterCols(pad([...headerRow])).join(' | ') + ' |');
  output.push('| ' + filterCols(Array(colCount).fill('---')).join(' | ') + ' |');
  for (const row of dataRows) {
    output.push('| ' + filterCols(pad([...row.cells])).join(' | ') + ' |');
  }
  output.push('');
  return output;
}
