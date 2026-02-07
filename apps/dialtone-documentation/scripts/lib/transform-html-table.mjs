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
  const openRegex = /<(th|td)\b[^>]*>/gi;
  let openMatch;
  const openings = [];

  while ((openMatch = openRegex.exec(rowHtml)) !== null) {
    openings.push({
      type: openMatch[1].toLowerCase(),
      start: openMatch.index + openMatch[0].length,
      tagStart: openMatch.index,
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
    cells.push({ type: tagType, text: escapeTableCell(text) });
  }

  return cells;
}

/**
 * Process accumulated lines from an HTML <table> block.
 * @param {string[]} lines - All lines between <table> and </table> inclusive
 * @returns {string[]} - Output markdown lines
 */
export function transformHtmlTable (lines) {
  const html = lines.join('\n');

  // Extract rows by tracking <tr> depth
  const rows = [];
  const trOpenRegex = /<tr[\s>]/gi;
  let trMatch;

  while ((trMatch = trOpenRegex.exec(html)) !== null) {
    const trStart = trMatch.index;
    // Find matching </tr>
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

    const rowHtml = html.slice(trStart, trEnd);
    const cells = extractCells(rowHtml);
    if (cells.length === 0) continue;

    const allTh = cells.every(c => c.type === 'th');

    rows.push({
      cells: cells.map(c => c.text),
      isHeaderRow: allTh && rows.length === 0,
    });
  }

  if (rows.length === 0) return [];

  const output = [];

  // Determine column count from the widest row
  const colCount = Math.max(...rows.map(r => r.cells.length));

  // If first row is a header, use it as the header
  let headerRow;
  let dataRows;
  if (rows[0].isHeaderRow) {
    headerRow = rows[0].cells;
    dataRows = rows.slice(1);
  } else {
    // Generate generic column headers
    headerRow = Array.from({ length: colCount }, (_, i) => `Col ${i + 1}`);
    dataRows = rows;
  }

  // Pad to colCount
  const pad = arr => {
    while (arr.length < colCount) arr.push('');
    return arr;
  };

  // Emit header
  output.push('| ' + pad([...headerRow]).join(' | ') + ' |');
  output.push('| ' + Array(colCount).fill('---').join(' | ') + ' |');

  // Emit data rows
  for (const row of dataRows) {
    output.push('| ' + pad([...row.cells]).join(' | ') + ' |');
  }

  output.push('');
  return output;
}
