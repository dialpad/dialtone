import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Check if file or directory exists
 * @param {string} filePath - Path to check (relative or absolute)
 * @param {Object} options - Configuration options
 * @param {string} options.cwd - Current working directory for relative paths
 * @returns {boolean} True if exists
 */
export function fileExists(filePath, options = {}) {
  const { cwd = process.cwd() } = options;
  const fullPath = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);

  try {
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}

/**
 * Read file contents
 * @param {string} filePath - Path to file
 * @param {Object} options - Configuration options
 * @param {string} options.encoding - File encoding, default 'utf8'
 * @param {string} options.cwd - Current working directory for relative paths
 * @returns {string} File contents
 * @throws {Error} If file doesn't exist or can't be read
 */
export function readFile(filePath, options = {}) {
  const { encoding = 'utf8', cwd = process.cwd() } = options;
  const fullPath = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  try {
    return fs.readFileSync(fullPath, encoding);
  } catch (error) {
    throw new Error(`Failed to read file ${fullPath}: ${error.message}`);
  }
}

/**
 * Find files matching a glob pattern
 * @param {string} pattern - Glob pattern (e.g., "**\/*.md")
 * @param {Object} options - Configuration options
 * @param {string} options.cwd - Current working directory
 * @param {string[]} options.ignore - Patterns to ignore
 * @returns {Promise<string[]>} Array of matching file paths
 */
export async function findFiles(pattern, options = {}) {
  const { cwd = process.cwd(), ignore = ['**/node_modules/**'] } = options;

  try {
    const files = await glob(pattern, {
      cwd,
      ignore,
      nodir: true,
      absolute: false,
    });

    return files.sort();
  } catch (error) {
    throw new Error(`Failed to find files matching ${pattern}: ${error.message}`);
  }
}

/**
 * Check if path is a directory
 * @param {string} dirPath - Path to check
 * @param {Object} options - Configuration options
 * @param {string} options.cwd - Current working directory for relative paths
 * @returns {boolean} True if path is a directory
 */
export function isDirectory(dirPath, options = {}) {
  const { cwd = process.cwd() } = options;
  const fullPath = path.isAbsolute(dirPath) ? dirPath : path.resolve(cwd, dirPath);

  try {
    const stats = fs.statSync(fullPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Get file stats
 * @param {string} filePath - Path to file
 * @param {Object} options - Configuration options
 * @param {string} options.cwd - Current working directory for relative paths
 * @returns {Object|null} File stats object or null if file doesn't exist
 */
export function getFileStats(filePath, options = {}) {
  const { cwd = process.cwd() } = options;
  const fullPath = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);

  try {
    const stats = fs.statSync(fullPath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
    };
  } catch {
    return null;
  }
}

/**
 * Read multiple files at once
 * @param {string[]} filePaths - Array of file paths
 * @param {Object} options - Configuration options
 * @param {string} options.encoding - File encoding, default 'utf8'
 * @param {string} options.cwd - Current working directory for relative paths
 * @returns {Object} Map of filePath -> content
 */
export function readFiles(filePaths, options = {}) {
  const { encoding = 'utf8', cwd = process.cwd() } = options;
  const results = {};

  for (const filePath of filePaths) {
    try {
      results[filePath] = readFile(filePath, { encoding, cwd });
    } catch (error) {
      results[filePath] = { error: error.message };
    }
  }

  return results;
}
