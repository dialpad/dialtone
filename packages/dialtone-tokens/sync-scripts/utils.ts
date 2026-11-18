export function green(msg: string) {
  return `\x1b[32m${msg}\x1b[0m`
}

export function brightRed(msg: string) {
  return `\x1b[1;31m${msg}\x1b[0m`
}

export function areSetsEqual<T>(a: Set<T>, b: Set<T>) {
  return a.size === b.size && [...a].every((item) => b.has(item))
}

/**
 * One optional decimal point, not the greedier `[\d.]+`, which accepts
 * "1.2.3px" and silently truncates it via parseFloat. Shared because the same
 * regex — and the same bug, once — already existed independently in
 * build_variables.ts, build_materials.ts and check_against_css.ts.
 */
export const NUMBER_PATTERN = String.raw`-?(?:\d+(?:\.\d+)?|\.\d+)`

/** `"4px"` becomes `4`. Returns null when there is no number to be had. */
export function toNumber(value: unknown, units: string): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const re = new RegExp(`^(${NUMBER_PATTERN})(${units})?$`)
  const match = String(value).trim().match(re)
  if (!match) return null
  const n = Number.parseFloat(match[1])
  return Number.isFinite(n) ? n : null
}

export interface CollectionTarget { name: string; fileKey: string | undefined }

/**
 * The parent collection every sync writes, and the Figma file it goes to.
 *
 * The preview file names its base collection differently (COLLECTION_NAME), and
 * `--file-key` points the sync at another file, such as a scratch file.
 */
export function collectionTarget(
  base = process.env.COLLECTION_NAME ?? 'Dialtone 2026',
  args = process.argv.slice(2),
): CollectionTarget {
  const i = args.indexOf('--file-key')
  // An unset GitHub variable arrives as an empty string, which is no file at all.
  return { name: base, fileKey: ((i >= 0 ? args[i + 1] : undefined) ?? process.env.FILE_KEY) || undefined }
}
