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
  description:
    'Migrates base color stops from old irregular numbering to the standard 12-stop scale.\n' +
    '- Renames var(--dt-color-{color}-{oldStop}) to var(--dt-color-{color}-{newStop})\n\t' +
      'eg. var(--dt-color-purple-350) to var(--dt-color-purple-500)\n' +
    '- Renames d-{prefix}-{color}-{oldStop} utility classes\n\t' +
      'eg. d-bgc-purple-350 to d-bgc-purple-500\n' +
    '- Includes HSL variants (-h, -s, -l, -hsl)\n' +
    '- Colors affected: purple, blue, magenta, gold, green, red. Other colors were already 12-stop.\n',
  patterns: ['**/*.{css,less,html,vue,md,js,ts,jsx,tsx}'],
  expressions: [
    // CSS custom properties: var(--dt-color-{color}-{stop}) with optional HSL suffix
    {
      from: /var\(--dt-color-(purple|blue|magenta|gold|green|red)-(\d+)(-(h|s|l|hsl))?\)/g,
      to: (match, color, stop, hslGroup) => {
        const newStop = MAP[color]?.[stop];
        if (newStop == null) return match;
        return `var(--dt-color-${color}-${newStop}${hslGroup || ''})`;
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
