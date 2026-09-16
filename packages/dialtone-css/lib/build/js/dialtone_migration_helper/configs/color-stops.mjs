// Rename map: MAP[color][oldStop] = newStop
// Only entries that changed are listed; unlisted stops (50, 100, 200, 1000, etc.) are unchanged.
const MAP = {
  purple: { 250: 300, 300: 400, 350: 500, 400: 600, 450: 700, 500: 800, 550: 900, 600: 950 },
  blue: { 425: 500, 450: 600, 475: 700, 500: 800, 600: 900, 900: 950 },
  magenta: { 250: 300, 300: 400, 400: 500, 425: 600, 475: 700, 500: 800, 600: 900, 900: 950 },
  gold: { 350: 400, 400: 500, 450: 600, 500: 700, 600: 800, 700: 900, 900: 950 },
  green: { 350: 400, 400: 500, 425: 600, 475: 700, 500: 800, 600: 900, 900: 950 },
  red: { 350: 400, 400: 500, 450: 600, 500: 700, 600: 800, 700: 900, 900: 950 },
};

export default {
  // Old and new stop numbers overlap (e.g. purple 250→300, but 300 is itself
  // an old key that maps to 400, which maps to 600, then 950). The master
  // migration script re-applies expressions to already-rewritten content
  // until nothing changes; without singlePass that convergence loop cascades
  // a single value through the whole chain in one run.
  singlePass: true,
  description:
    'Migrates base color stops from old irregular numbering to the standard 12-stop scale.\n' +
    '- Renames var(--dt-color-{color}-{oldStop}) to var(--dt-color-{color}-{newStop})\n\t' +
      'eg. var(--dt-color-purple-350) to var(--dt-color-purple-500)\n' +
    '- Renames d-{prefix}-{color}-{oldStop} utility classes\n\t' +
      'eg. d-bgc-purple-350 to d-bgc-purple-500\n' +
    '- Includes HSL variants (-h, -s, -l, -a, -hsl, -hsla) and OKLCH variants (-h, -c, -l, -a, -oklch, -oklcha)\n' +
    '- Colors affected: purple, blue, magenta, gold, green, red. Other colors were already 12-stop.\n' +
    '- SAFE TO RE-RUN: singlePass prevents the master script\'s convergence loop from\n' +
      'cascading a value through multiple stop hops in the same run.\n',
  patterns: ['**/*.{css,less,html,vue,md,js,ts,jsx,tsx}'],
  expressions: [
    // CSS custom properties: var(--dt-color-{color}-{stop}) with optional HSL/OKLCH suffix
    {
      from: /var\(--dt-color-(purple|blue|magenta|gold|green|red)-(\d+)(-(h|s|c|l|a|hsl|hsla|oklch|oklcha))?\)/g,
      to: (match, color, stop, suffixGroup) => {
        const newStop = MAP[color]?.[stop];
        if (newStop == null) return match;
        return `var(--dt-color-${color}-${newStop}${suffixGroup || ''})`;
      },
    },
    // CSS utility classes: d-{prefix}-{color}-{stop}
    {
      from: /d-(bgc|fc|bc|bgg-from|bgg-to)-(purple|blue|magenta|gold|green|red)-(\d+)/g,
      to: (match, prefix, color, stop) => {
        const newStop = MAP[color]?.[stop];
        if (newStop == null) return match;
        return `d-${prefix}-${color}-${newStop}`;
      },
    },
  ],
};
