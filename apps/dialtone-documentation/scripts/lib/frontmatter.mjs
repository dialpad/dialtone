import matter from 'gray-matter';

/**
 * Parse a Markdown document into structured frontmatter and body content.
 *
 * @param {string} source - Complete Markdown source
 * @param {object} [options]
 * @param {string} [options.filePath] - Source path used to contextualize parse errors
 * @returns {{ data: Record<string, unknown>, content: string }}
 */
export function parseMarkdownFrontmatter (source, { filePath } = {}) {
  try {
    const { data, content } = matter(source);
    return { data, content };
  } catch (error) {
    const sourceContext = filePath ? ` in ${filePath}` : '';
    throw new Error(`Invalid frontmatter${sourceContext}: ${error.message}`, { cause: error });
  }
}
