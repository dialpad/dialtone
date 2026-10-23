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

export interface CollectionTarget { name: string; publishAll: boolean; fileKey: string | undefined }

/**
 * The parent collections every sync writes, each to its own Figma file: the
 * restricted one, which keeps each token's `hiddenFromPublishing` flag, and an
 * unrestricted sibling that publishes every emitted variable, for people
 * building libraries on Dialtone. Separate files keep the two libraries apart,
 * so published names never collide and designers only see the one they link.
 *
 * The preview file names its base collection differently (COLLECTION_NAME), so
 * the sibling follows that name. The unrestricted file is skipped, out loud,
 * when no key is configured, so a machine or job without one still syncs the
 * restricted file.
 */
export function collectionTargets(
  base = process.env.COLLECTION_NAME ?? 'Dialtone 2026',
  args = process.argv.slice(2),
): CollectionTarget[] {
  const flag = (name: string): string | undefined => {
    const i = args.indexOf(`--${name}`)
    return i >= 0 ? args[i + 1] : undefined
  }
  const unrestrictedKey = flag('unrestricted-file-key') ?? process.env.UNRESTRICTED_FILE_KEY
  if (!unrestrictedKey) {
    console.log('UNRESTRICTED_FILE_KEY is not set, skipping the unrestricted collection\n')
  }
  return [
    { name: base, publishAll: false, fileKey: flag('file-key') ?? process.env.FILE_KEY },
    ...(unrestrictedKey
      ? [{ name: `${base} Unrestricted`, publishAll: true, fileKey: unrestrictedKey }]
      : []),
  ]
}
