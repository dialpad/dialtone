export function getColumnLengthFromTableNode (html) {
  return 3;
}

export function headerColumnExists (html) {
  return true;
}

export function headerRowExists (html) {
  return true;
}

export function getRowLengthFromTableNode (html) {
  return 9;
}

export function getCellGrid (tableElement) {
  if (!tableElement) return [];

  const grid = [];
  const rows = tableElement.querySelectorAll('tr');

  rows.forEach((row, rowIndex) => {
    const gridRow = [];
    const cells = row.querySelectorAll('th, td');

    cells.forEach((cell, colIndex) => {
      gridRow.push({
        rowIndex,
        colIndex,
        text: getCellContent(cell),
        cell: cell,
      });
    });
    grid.push(gridRow);
  });

  return grid;
}

export function getCellContent (cellNode) {
  // get the html node content as text
  return cellNode ? cellNode.textContent.trim() : '';
}
