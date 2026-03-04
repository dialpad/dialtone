import matter from 'gray-matter';
import fs from 'fs';

/**
 * Parse YAML frontmatter from markdown content or file
 * @param {string} source - Either file path or markdown content string
 * @param {Object} options - Configuration options
 * @param {boolean} options.isFilePath - If true, treats source as file path. Default: auto-detect
 * @returns {Object} Parsed result with { data, content, isEmpty, excerpt }
 */
export function parseFrontmatter(source, options = {}) {
  const { isFilePath = isLikelyFilePath(source) } = options;

  let content;

  try {
    content = isFilePath ? fs.readFileSync(source, 'utf8') : source;
  } catch (error) {
    throw new Error(`Failed to read source: ${error.message}`);
  }

  try {
    return normalizeMatterResult(matter(content), content);
  } catch (error) {
    throw new Error(`Failed to parse frontmatter: ${error.message}`);
  }
}

function normalizeMatterResult(parsed, raw) {
  const data = parsed.data || {};
  return {
    data,
    content: parsed.content || '',
    isEmpty: Object.keys(data).length === 0,
    excerpt: parsed.excerpt || null,
    raw,
  };
}

/**
 * Validate required frontmatter fields
 * @param {Object} frontmatter - Parsed frontmatter data
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} Validation result with { valid, missing }
 */
export function validateRequiredFields(frontmatter, requiredFields = []) {
  const data = frontmatter.data || frontmatter;
  const missing = requiredFields.filter(field => !data[field]);

  return {
    valid: missing.length === 0,
    missing,
    hasAll: missing.length === 0,
  };
}

/**
 * Extract specific field from frontmatter
 * @param {Object} frontmatter - Parsed frontmatter data
 * @param {string} fieldName - Field name to extract
 * @param {*} defaultValue - Default value if field doesn't exist
 * @returns {*} Field value or default
 */
export function getField(frontmatter, fieldName, defaultValue = null) {
  const data = frontmatter.data || frontmatter;
  return data[fieldName] !== undefined ? data[fieldName] : defaultValue;
}

/**
 * Check if frontmatter has specific field
 * @param {Object} frontmatter - Parsed frontmatter data
 * @param {string} fieldName - Field name to check
 * @returns {boolean} True if field exists
 */
export function hasField(frontmatter, fieldName) {
  const data = frontmatter.data || frontmatter;
  return data[fieldName] !== undefined;
}

/**
 * Auto-detect if source is a file path
 * @private
 * @param {string} source - Source string to check
 * @returns {boolean} True if likely a file path
 */
function isLikelyFilePath(source) {
  // Simple heuristic: file paths typically have extensions and path separators
  // and don't contain newlines
  return !source.includes('\n') &&
         (source.includes('/') || source.includes('\\')) &&
         (source.endsWith('.md') || source.endsWith('.markdown'));
}
