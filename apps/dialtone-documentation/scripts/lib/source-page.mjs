import { basename, dirname } from 'node:path';

/** Shared raw-Markdown output policy. Permalinks do not change source outputs. */
export function mapOutputPath(relPath) {
  const base = basename(relPath);
  const dir = dirname(relPath);
  if (base === 'index.md') return dir === '.' ? 'index.md' : dir + '.md';
  return relPath;
}
