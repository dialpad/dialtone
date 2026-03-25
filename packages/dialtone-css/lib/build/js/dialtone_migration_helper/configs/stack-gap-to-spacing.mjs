// Mapping: old DtStack/DtDescriptionList gap prop values → new spacing stop numbers
// The old gap values used --dt-size-* stop numbers; the new values use --dt-spacing-* stop numbers.
const GAP_MAP = {
  0: '0',       // 0px
  50: '1',      // 0.5px → 1px
  100: '1',     // 1px
  200: '25',    // 2px
  300: '50',    // 4px
  350: '75',    // 6px
  400: '100',   // 8px
  450: '150',   // 12px
  500: '200',   // 16px
  525: '250',   // 20px
  550: '300',   // 24px
  600: '400',   // 32px
  625: '525',   // 42px
  650: '600',   // 48px
  700: '800',   // 64px
  // 50 (0.5px) maps to 1 (1px) — closest non-subpixel stop
};

// Values that only exist in the NEW system — if a file contains these,
// it has already been migrated. Used to detect and skip double-migration.
const NEW_ONLY_VALUES = new Set(['25', '75', '150', '250', '525']);

function isAlreadyMigrated (content) {
  // Check for gap values that only exist in the new system
  // If any are found, this file was already migrated
  return [...NEW_ONLY_VALUES].some(v =>
    content.includes(`gap="${v}"`) ||
    content.includes(`gap="'${v}'"`) ||
    content.includes(`d-stack--gap-${v}`) ||
    content.includes(`d-description-list--gap-${v}`),
  );
}

export default {
  description:
    'Migrates DtStack and DtDescriptionList gap prop values from old size stops to new spacing stops.\n' +
    '- Replaces gap="400" with gap="100" (8px)\n' +
    '- Replaces :gap="\'400\'" with :gap="\'100\'" (8px)\n' +
    '- Also handles d-stack--gap-* and d-description-list--gap-* CSS class references.\n' +
    '- gap="50" (0.5px) maps to gap="1" (1px) — closest non-subpixel stop.\n' +
    '- SAFE TO RE-RUN: detects already-migrated files by checking for new-only values (25, 75, 150, 250, 525).\n',
  patterns: ['**/*.{vue,html,js,ts,jsx,tsx,md}'],
  globbyConfig: {
    ignore: ['**/dialtone_migration_helper/tests/**'],
  },
  expressions: [
    // gap="400" → gap="100" (static prop)
    {
      from: /gap="([0-9]+)"/g,
      to: (match, value) => {
        const mapped = GAP_MAP[Number(value)];
        return mapped != null ? `gap="${mapped}"` : match;
      },
    },
    // :gap="'400'" → :gap="'100'" (dynamic prop with string literal)
    {
      from: /:gap="'([0-9]+)'"/g,
      to: (match, value) => {
        const mapped = GAP_MAP[Number(value)];
        return mapped != null ? `:gap="'${mapped}'"` : match;
      },
    },
    // d-stack--gap-400 → d-stack--gap-100 (CSS class references in templates/JS)
    {
      from: /d-stack--gap-([0-9]+)/g,
      to: (match, value) => {
        const mapped = GAP_MAP[Number(value)];
        return mapped != null ? `d-stack--gap-${mapped}` : match;
      },
    },
    // d-description-list--gap-400 → d-description-list--gap-100 (CSS class references)
    {
      from: /d-description-list--gap-([0-9]+)/g,
      to: (match, value) => {
        const mapped = GAP_MAP[Number(value)];
        return mapped != null ? `d-description-list--gap-${mapped}` : match;
      },
    },
  ],
  // Called by the migration helper before processing each file.
  // Return false to skip the file (already migrated).
  shouldProcessFile (content) {
    return !isAlreadyMigrated(content);
  },
};
