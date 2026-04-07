import { stripMarkdown, stripFrontmatter } from '@src/utils/strip-markdown.mjs';
export { stripMarkdown, stripFrontmatter };

// Regex patterns kept as named constants so callers can understand intent
// and future maintainers can update them in one place.
const PATTERNS = {
  headingGlobal: /^(#{1,6})\s+(.+?)(?:\s+#+)?$/gm,
  codeBlockFenced: /^`{3,}([^\n]*)\n([\s\S]*?)^`{3,}/gm,
  codeInline: /`([^`]+)`/g,
  link: /\[([^\]]*)\]\(([^)]+)\)/g,
  image: /!\[([^\]]*)\]\(([^)]+)\)/g,
  htmlComment: /<!--[\s\S]*?-->/g,
  htmlTag: /<[^>]+>/g,
  blockquote: /^>\s?.*/gm,
  horizontalRule: /^(?:[-*_]){3,}\s*$/gm,
  emphasis: /[*_]{1,2}([^*_]+)[*_]{1,2}/g,
};


/**
 * Extract all headings from markdown content.
 *
 * @param {string} markdown - Markdown string (frontmatter is automatically stripped)
 * @param {Object} [options]
 * @param {number} [options.minLevel=1] - Minimum heading level to include (1–6)
 * @param {number} [options.maxLevel=6] - Maximum heading level to include (1–6)
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {Array<{ level: number, text: string, slug: string, index: number }>}
 */
export function extractHeadings(markdown, options = {}) {
  const { minLevel = 1, maxLevel = 6, stripFrontmatter: strip = true } = options;
  const body = strip ? stripFrontmatter(markdown) : markdown;
  return [...body.matchAll(PATTERNS.headingGlobal)]
    .map(buildHeading)
    .filter(h => h.level >= minLevel && h.level <= maxLevel);
}

/**
 * Check whether the markdown contains a heading with the given text.
 *
 * @param {string} markdown - Markdown string
 * @param {string} headingText - Heading text to search for
 * @param {Object} [options]
 * @param {boolean} [options.caseSensitive=false] - Exact case match
 * @param {number} [options.level] - Restrict to a specific heading level
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {boolean}
 */
export function hasHeading(markdown, headingText, options = {}) {
  const { caseSensitive = false, level, stripFrontmatter: strip = true } = options;
  const headings = extractHeadings(markdown, { stripFrontmatter: strip });
  return headings.some(h => {
    const a = caseSensitive ? h.text : h.text.toLowerCase();
    const b = caseSensitive ? headingText : headingText.toLowerCase();
    const textMatch = a === b;
    const levelMatch = level === undefined || h.level === level;
    return textMatch && levelMatch;
  });
}

/**
 * Split markdown into sections, where each section is the content under a heading.
 * Sections start at a heading and end at the next heading of the same or higher level,
 * or at the end of the document.
 *
 * @param {string} markdown - Markdown string
 * @param {Object} [options]
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {Array<{ heading: { level: number, text: string, slug: string } | null, body: string }>}
 *   The first element has `heading: null` if there is content before the first heading.
 */
export function extractSections(markdown, options = {}) {
  const { stripFrontmatter: strip = true } = options;
  const body = strip ? stripFrontmatter(markdown) : markdown;
  const headings = extractHeadings(body, { stripFrontmatter: false });

  if (headings.length === 0) {
    return [{ heading: null, body: body.trim() }];
  }

  const sections = [];

  // Content before the first heading (preamble)
  const preamble = body.slice(0, headings[0].index).trim();
  if (preamble.length > 0) {
    sections.push({ heading: null, body: preamble });
  }

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    const start = h.index + getHeadingLineLength(body, h.index);

    // Find the next heading at the same or higher (lower number) level.
    let end = body.length;
    for (let j = i + 1; j < headings.length; j++) {
      if (headings[j].level <= h.level) {
        end = headings[j].index;
        break;
      }
    }

    sections.push({
      heading: { level: h.level, text: h.text, slug: h.slug },
      body: body.slice(start, end).trim(),
    });
  }

  return sections;
}

/**
 * Get the body text of a specific section by its heading text.
 * Returns null if the section is not found.
 *
 * @param {string} markdown - Markdown string
 * @param {string} headingText - Heading text to look up
 * @param {Object} [options]
 * @param {boolean} [options.caseSensitive=false] - Exact case match
 * @param {number} [options.level] - Restrict to a specific heading level
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {string | null}
 */
export function getSection(markdown, headingText, options = {}) {
  const { caseSensitive = false, level, stripFrontmatter: strip = true } = options;
  const sections = extractSections(markdown, { stripFrontmatter: strip });

  const found = sections.find(s => {
    if (!s.heading) return false;
    const a = caseSensitive ? s.heading.text : s.heading.text.toLowerCase();
    const b = caseSensitive ? headingText : headingText.toLowerCase();
    const textMatch = a === b;
    const levelMatch = level === undefined || s.heading.level === level;
    return textMatch && levelMatch;
  });

  return found ? found.body : null;
}

/**
 * Check whether a section exists and has non-empty body content.
 *
 * @param {string} markdown - Markdown string
 * @param {string} headingText - Heading text to look up
 * @param {Object} [options] - Same options as getSection
 * @returns {boolean}
 */
export function hasSection(markdown, headingText, options = {}) {
  const body = getSection(markdown, headingText, options);
  return body !== null && body.trim().length > 0;
}

/**
 * Extract all hyperlinks from markdown content.
 * Images (prefixed with !) are excluded by default.
 *
 * @param {string} markdown - Markdown string
 * @param {Object} [options]
 * @param {boolean} [options.includeImages=false] - Also include image links
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {Array<{ text: string, href: string, isImage: boolean }>}
 */
export function extractLinks(markdown, options = {}) {
  const { includeImages = false, stripFrontmatter: strip = true } = options;
  const body = strip ? stripFrontmatter(markdown) : markdown;
  // Remove fenced code blocks first to avoid matching links inside code samples
  const noCode = body.replace(PATTERNS.codeBlockFenced, '');

  // Collect image positions to distinguish images from regular links
  const imagePositions = new Set(
    [...noCode.matchAll(PATTERNS.image)].map(m => m.index),
  );

  return [...noCode.matchAll(PATTERNS.link)]
    .filter(m => {
      const isImage = imagePositions.has(m.index - 1);
      return includeImages || !isImage;
    })
    .map(m => ({ text: m[1], href: m[2], isImage: imagePositions.has(m.index - 1) }));
}

/**
 * Extract fenced code blocks from markdown.
 *
 * @param {string} markdown - Markdown string
 * @param {Object} [options]
 * @param {string} [options.language] - Filter to a specific language tag (e.g. 'js', 'bash')
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {Array<{ lang: string, code: string }>}
 */
export function extractCodeBlocks(markdown, options = {}) {
  const { language, stripFrontmatter: strip = true } = options;
  const body = strip ? stripFrontmatter(markdown) : markdown;

  return [...body.matchAll(PATTERNS.codeBlockFenced)]
    .filter(m => language === undefined || m[1].trim() === language)
    .map(m => ({ lang: m[1].trim(), code: m[2] }));
}

/**
 * Audit code blocks for language tag presence.
 * Useful for enforcing the AI documentation standard that all code samples
 * must declare their language so AI tools can syntax-highlight and index them.
 *
 * @param {string} markdown - Markdown string
 * @param {Object} [options]
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {{ total: number, withLanguage: number, withoutLanguage: number }}
 */
export function auditCodeBlocks(markdown, options = {}) {
  const blocks = extractCodeBlocks(markdown, options);
  const withLanguage = blocks.filter(b => b.lang.length > 0).length;
  return {
    total: blocks.length,
    withLanguage,
    withoutLanguage: blocks.length - withLanguage,
  };
}


/**
 * Count words in markdown content.
 * Frontmatter and fenced code blocks are excluded from the count.
 *
 * @param {string} markdown - Markdown string
 * @param {Object} [options]
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {number}
 */
export function countWords(markdown, options = {}) {
  const plain = stripMarkdown(markdown, options);
  if (!plain) return 0;
  return plain.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Validate that a markdown document conforms to a structural schema.
 * Returns a result object describing all failures so tests can produce
 * actionable error messages rather than simple pass/fail assertions.
 *
 * @param {string} markdown - Markdown string
 * @param {Object} schema - Validation rules
 * @param {string[]} [schema.requiredSections=[]] - Headings that must be present AND non-empty
 * @param {string[]} [schema.requiredHeadings=[]] - Headings that must exist (body may be empty)
 * @param {number} [schema.minWords=0] - Minimum word count for the full document
 * @param {number} [schema.minLinks=0] - Minimum number of hyperlinks
 * @param {boolean} [schema.requireLanguageOnCodeBlocks=false] - All code blocks must have a language tag
 * @param {Object} [options]
 * @param {boolean} [options.caseSensitive=false] - Case-sensitive heading matching
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateStructure(markdown, schema = {}, options = {}) {
  const {
    requiredSections = [],
    requiredHeadings = [],
    minWords = 0,
    minLinks = 0,
    requireLanguageOnCodeBlocks = false,
  } = schema;

  const errors = [
    ...checkRequiredHeadings(markdown, requiredHeadings, options),
    ...checkRequiredSections(markdown, requiredSections, options),
    ...checkMinWords(markdown, minWords, options),
    ...checkMinLinks(markdown, minLinks, options),
    ...checkCodeBlockLanguages(markdown, requireLanguageOnCodeBlocks, options),
  ];

  return { valid: errors.length === 0, errors };
}

// ─── Private helpers ─────────────────────────────────────────────────────────

function buildHeading(match) {
  const text = match[2].trim();
  return { level: match[1].length, text, slug: toSlug(text), index: match.index };
}

function checkRequiredHeadings(markdown, headings, options) {
  return headings
    .filter(h => !hasHeading(markdown, h, options))
    .map(h => `Missing required heading: "${h}"`);
}

function checkRequiredSections(markdown, sections, options) {
  return sections
    .filter(s => !hasSection(markdown, s, options))
    .map(s => `Missing or empty required section: "${s}"`);
}

function checkMinWords(markdown, minWords, options) {
  if (minWords <= 0) return [];
  const words = countWords(markdown, options);
  return words < minWords ? [`Word count too low: ${words} < ${minWords} required`] : [];
}

function checkMinLinks(markdown, minLinks, options) {
  if (minLinks <= 0) return [];
  const links = extractLinks(markdown, options);
  return links.length < minLinks ? [`Not enough links: ${links.length} < ${minLinks} required`] : [];
}

function checkCodeBlockLanguages(markdown, required, options) {
  if (!required) return [];
  const audit = auditCodeBlocks(markdown, options);
  return audit.withoutLanguage > 0 ? [`${audit.withoutLanguage} code block(s) missing a language tag`] : [];
}

/**
 * Convert heading text to a URL-safe slug.
 * @param {string} text
 * @returns {string}
 */
function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Return the length (in characters) of the heading line starting at `index`,
 * including the trailing newline character if present.
 * @param {string} body
 * @param {number} index
 * @returns {number}
 */
function getHeadingLineLength(body, index) {
  const eol = body.indexOf('\n', index);
  return eol === -1 ? body.length - index : eol - index + 1;
}
