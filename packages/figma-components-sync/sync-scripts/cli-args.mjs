/**
 * The value that follows a `--flag`, or undefined when the flag is absent or last.
 *
 * `args[args.indexOf('--flag') + 1]` reads the COMPONENT NAME when the flag is missing
 * (indexOf is -1, so the index is 0): `--set` became the component name and passed a "was a set
 * given" check, and `--limit` became `Number('checkbox')`, which is NaN.
 */
export function flagValue (args, flag) {
  const i = args.indexOf(flag);
  if (i < 0) return undefined;
  const v = args[i + 1];
  return v === undefined || v.startsWith('--') ? undefined : v;
}
