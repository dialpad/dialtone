export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}


export function chunkSections(body) {
  const lines = body.split('\n');
  const sections = [];
  let currentH2 = null;
  let currentH3 = null;
  let currentLines = [];
  let startLine = 0;
  let inFence = false;
  let fenceChar = null;
  let fenceLength = 0;

  function flush() {
    const raw = currentLines.join('\n').trim();
    if (!raw) return;
    const headingPath = [];
    if (currentH2) headingPath.push(currentH2);
    if (currentH3) headingPath.push(currentH3);
    const firstLine = currentLines.findIndex(line => line.trim());
    sections.push({ headingPath, raw, baseSlug: headingPath.length ? slugify(headingPath.join('-')) : 'intro',
      sourceStartLine: startLine + Math.max(0, firstLine) });
  }

  for (const [lineIndex, line] of lines.entries()) {
    // Track fenced code blocks (3+ backticks or tildes)
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      const char = fenceMatch[1][0];
      const len = fenceMatch[1].length;
      const trailing = fenceMatch[2];
      if (!inFence) {
        inFence = true;
        fenceChar = char;
        fenceLength = len;
      } else if (char === fenceChar && len >= fenceLength && /^[ \t]*$/.test(trailing)) {
        // CommonMark §4.5: closing fences must have no trailing text (info strings are only valid on openers)
        inFence = false;
        fenceChar = null;
        fenceLength = 0;
      }
      currentLines.push(line);
      continue;
    }

    if (inFence) {
      currentLines.push(line);
      continue;
    }

    // Check for H2 before H3 — H3 regex (###) is a subset of H2 (##)
    const h2 = line.match(/^##(?!#)\s+(.+)$/);
    const h3 = !h2 && line.match(/^###(?!#)\s+(.+)$/);

    if (h2) {
      flush();
      currentH2 = h2[1].replace(/[*_`]/g, '').trim();
      currentH3 = null;
      currentLines = [];
      startLine = lineIndex + 1;
    } else if (h3) {
      flush();
      // H3 inherits the current H2 context (or stands alone if no H2 seen yet)
      currentH3 = h3[1].replace(/[*_`]/g, '').trim();
      currentLines = [];
      startLine = lineIndex + 1;
    } else {
      currentLines.push(line);
    }
  }
  flush();
  return sections;
}
