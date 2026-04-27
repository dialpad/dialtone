import { readFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = resolve(__dirname, '../..');

const THRESHOLD_DAYS = 90;

/**
 * Convert a raw last_verified frontmatter value to a YYYY-MM-DD string.
 * gray-matter parses unquoted YAML dates as Date objects; quoted values come through as strings.
 * Returns null when the value is absent or unrecognized.
 *
 * @param {string|Date|null|undefined} val
 * @returns {string|null}
 */
export function parseLastVerified(val) {
  if (val == null) return null;
  if (val instanceof Date) return val.toISOString().split('T')[0];
  return typeof val === 'string' ? val : null;
}

/**
 * Return true when the document is stale (last_verified missing OR older than thresholdDays).
 * The threshold is exclusive: exactly thresholdDays ago is NOT stale.
 *
 * @param {string|Date|null|undefined} lastVerified - raw frontmatter value
 * @param {Date} today - reference date
 * @param {number} thresholdDays
 * @returns {boolean}
 */
export function isStale(lastVerified, today, thresholdDays) {
  const dateStr = parseLastVerified(lastVerified);
  if (!dateStr) return true;
  const verifiedDate = new Date(dateStr);
  if (isNaN(verifiedDate.getTime())) return true;
  const diffDays = Math.floor((today.getTime() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > thresholdDays;
}

async function check() {
  const today = new Date();
  const files = await glob('src/content/standards/*.md', { cwd: packageRoot, absolute: true });

  if (files.length === 0) {
    throw new Error('No standards files found under src/content/standards/');
  }

  const checkedFiles = [];
  const stale = [];

  for (const absolutePath of files.sort()) {
    const raw = readFileSync(absolutePath, 'utf8');
    const { data } = matter(raw);
    const filePath = relative(packageRoot, absolutePath).split('\\').join('/');
    const rawVal = data.last_verified ?? null;
    const lastVerifiedStr = parseLastVerified(rawVal);

    checkedFiles.push(filePath);

    if (isStale(rawVal, today, THRESHOLD_DAYS)) {
      const parsed = lastVerifiedStr ? new Date(lastVerifiedStr) : null;
      const daysSinceVerified = parsed
        ? Math.floor((today.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      stale.push({ file: filePath, last_verified: lastVerifiedStr, days_since_verified: daysSinceVerified });
    }
  }

  process.stdout.write(JSON.stringify({
    generated_at: today.toISOString(),
    threshold_days: THRESHOLD_DAYS,
    checked_files: checkedFiles,
    stale,
  }, null, 2) + '\n');
}

check().catch(err => {
  process.stderr.write(`check-freshness error: ${err.message}\n`);
  process.exit(1);
});
