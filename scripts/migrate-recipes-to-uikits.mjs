#!/usr/bin/env node

/**
 * migrate-recipes-to-uikits.mjs
 *
 * Migrates DtRecipe* components from @dialpad/dialtone to UI-Kit packages.
 * See: https://dialtone.dialpad.com/about/whats-new/
 *
 * Usage:
 *   node scripts/migrate-recipes-to-uikits.mjs [directory] [--dry-run]
 *
 * Options:
 *   directory   Root directory to scan (default: current working directory)
 *   --dry-run   Report changes without writing files
 *
 * Handles:
 *   - Renamed PascalCase components in JS/TS/Vue script blocks
 *   - Renamed kebab-case components in Vue templates
 *   - CSS class prefix changes (dt-recipe-* → dp-* / dt-*)
 *   - Import statement rewrites (splits by new package)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname, relative } from 'path'

// ─── Migration map ────────────────────────────────────────────────────────────

const MIGRATION_MAP = {
  // Promoted to core Dialtone
  DtRecipeComboboxMultiSelect: { newName: 'DtComboboxMultiSelect', newPackage: '@dialpad/dialtone/vue3' },
  DtRecipeComboboxWithPopover: { newName: 'DtComboboxWithPopover', newPackage: '@dialpad/dialtone/vue3' },
  DtRecipeMotionText: { newName: 'DtMotionText', newPackage: '@dialpad/dialtone/vue3' },
  // callbarkit
  DtRecipeCallbarButton: { newName: 'DpCallbarButton', newPackage: '@dialpad/callbarkit/vue3' },
  DtRecipeCallbarButtonWithPopover: { newName: 'DpCallbarButtonWithPopover', newPackage: '@dialpad/callbarkit/vue3' },
  DtRecipeCallbarButtonWithDropdown: { newName: 'DpCallbarButtonWithDropdown', newPackage: '@dialpad/callbarkit/vue3' },
  DtRecipeGroupedChip: { newName: 'DpGroupedChip', newPackage: '@dialpad/callbarkit/vue3' },
  DtRecipeTopBannerInfo: { newName: 'DpTopBannerInfo', newPackage: '@dialpad/callbarkit/vue3' },
  // chatkit
  DtRecipeAttachmentCarousel: { newName: 'DpAttachmentCarousel', newPackage: '@dialpad/chatkit/vue3' },
  DtRecipeMessageInput: { newName: 'DpMessageInput', newPackage: '@dialpad/chatkit/vue3' },
  DtRecipeContactInfo: { newName: 'DpContactInfo', newPackage: '@dialpad/chatkit/vue3' },
  DtRecipeEditor: { newName: 'DpEditor', newPackage: '@dialpad/chatkit/vue3' },
  DtRecipeEmojiRow: { newName: 'DpEmojiRow', newPackage: '@dialpad/chatkit/vue3' },
  DtRecipeFeedItemPill: { newName: 'DpFeedItemPill', newPackage: '@dialpad/chatkit/vue3' },
  DtRecipeFeedItemRow: { newName: 'DpFeedItemRow', newPackage: '@dialpad/chatkit/vue3' },
  // navigationkit
  DtRecipeContactCentersRow: { newName: 'DtContactCentersRow', newPackage: '@dialpad/navigationkit/vue3' },
  DtRecipeContactRow: { newName: 'DtContactRow', newPackage: '@dialpad/navigationkit/vue3' },
  DtRecipeGeneralRow: { newName: 'DtGeneralRow', newPackage: '@dialpad/navigationkit/vue3' },
  DtRecipeGroupRow: { newName: 'DtGroupRow', newPackage: '@dialpad/navigationkit/vue3' },
  DtRecipeUnreadPill: { newName: 'DtUnreadPill', newPackage: '@dialpad/navigationkit/vue3' },
  DtRecipeCallbox: { newName: 'DtCallbox', newPackage: '@dialpad/navigationkit/vue3' },
  DtRecipeSettingsMenuButton: { newName: 'DtSettingsMenuButton', newPackage: '@dialpad/navigationkit/vue3' },
  // workflowkit
  DtRecipeIvrNode: { newName: 'DtIvrNode', newPackage: '@dialpad/workflowkit/vue3' },
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Convert PascalCase to kebab-case. e.g. DtRecipeCallbarButton → dt-recipe-callbar-button */
function toKebabCase (pascal) {
  return pascal.replace(/([A-Z])/g, (char, _, offset) =>
    offset === 0 ? char.toLowerCase() : '-' + char.toLowerCase(),
  )
}

/** Build a CSS-class-level map from the migration map. */
const CSS_CLASS_MAP = Object.fromEntries(
  Object.entries(MIGRATION_MAP).map(([old, { newName }]) => [
    toKebabCase(old),
    toKebabCase(newName),
  ]),
)

// Escape a string for use inside a RegExp literal
function escapeRegExp (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ─── File extensions to process ───────────────────────────────────────────────

const PROCESSABLE_EXTENSIONS = new Set(['.vue', '.js', '.ts', '.jsx', '.tsx'])

// Directories to skip entirely
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.nuxt', '.output', 'coverage'])

// ─── Transform logic ─────────────────────────────────────────────────────────

/**
 * Rewrite a single named-import statement from @dialpad/dialtone/vue3.
 * Splits recipe imports out into their new packages.
 */
function rewriteDialtoneImport (importedNames, quote) {
  const names = importedNames.split(',').map(n => n.trim()).filter(Boolean)

  /** @type {Record<string, string[]>} package → list of import specifiers */
  const byPackage = {}

  for (const specifier of names) {
    // Handle `Name as Alias` form
    const [importedName, alias] = specifier.split(/\s+as\s+/).map(s => s.trim())
    const migration = MIGRATION_MAP[importedName]
    const targetPkg = migration ? migration.newPackage : '@dialpad/dialtone/vue3'
    const targetName = migration ? migration.newName : importedName
    const entry = alias ? `${targetName} as ${alias}` : targetName

    if (!byPackage[targetPkg]) byPackage[targetPkg] = []
    byPackage[targetPkg].push(entry)
  }

  // Stable order: dialtone first, then kits alphabetically
  const sorted = Object.entries(byPackage).sort(([a], [b]) => {
    if (a === '@dialpad/dialtone/vue3') return -1
    if (b === '@dialpad/dialtone/vue3') return 1
    return a.localeCompare(b)
  })

  return sorted
    .map(([pkg, pkgNames]) => `import { ${pkgNames.join(', ')} } from ${quote}${pkg}${quote}`)
    .join('\n')
}

/**
 * Apply all migrations to the given file content string.
 * Returns the new content, or null if nothing changed.
 */
function migrateContent (content) {
  let result = content

  // 1. Rewrite named imports from @dialpad/dialtone/vue3
  result = result.replace(
    /import\s*\{([^}]+)\}\s*from\s*(['"])@dialpad\/dialtone\/vue3\2/g,
    (_, importedNames, quote) => rewriteDialtoneImport(importedNames, quote),
  )

  // 2. Replace PascalCase component names (whole-word, handles JS/TS/JSX and Vue templates)
  //    Process longer names first to avoid partial replacements (e.g. CallbarButton before Button)
  const sortedEntries = Object.entries(MIGRATION_MAP).sort(
    ([a], [b]) => b.length - a.length,
  )
  for (const [oldName, { newName }] of sortedEntries) {
    result = result.replace(new RegExp(`\\b${escapeRegExp(oldName)}\\b`, 'g'), newName)
  }

  // 3. Replace kebab-case component names in templates (e.g. <dt-recipe-callbar-button>)
  //    Also sort longest first to prevent partial collisions
  const sortedCssEntries = Object.entries(CSS_CLASS_MAP).sort(
    ([a], [b]) => b.length - a.length,
  )
  for (const [oldClass, newClass] of sortedCssEntries) {
    if (oldClass !== newClass) {
      result = result.replace(new RegExp(escapeRegExp(oldClass), 'g'), newClass)
    }
  }

  return result === content ? null : result
}

// ─── File walking ─────────────────────────────────────────────────────────────

function* walkFiles (dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walkFiles(join(dir, entry.name))
    } else if (entry.isFile() && PROCESSABLE_EXTENSIONS.has(extname(entry.name))) {
      yield join(dir, entry.name)
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main () {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const targetDir = args.find(a => !a.startsWith('--')) ?? process.cwd()

  let targetStat
  try {
    targetStat = statSync(targetDir)
  } catch {
    console.error(`Error: directory not found — ${targetDir}`)
    process.exit(1)
  }
  if (!targetStat.isDirectory()) {
    console.error(`Error: not a directory — ${targetDir}`)
    process.exit(1)
  }

  console.log(`Scanning ${targetDir}${dryRun ? ' (dry run)' : ''}…\n`)

  const changedFiles = []
  const skippedFiles = []

  for (const filePath of walkFiles(targetDir)) {
    let content
    try {
      content = readFileSync(filePath, 'utf8')
    } catch (err) {
      console.warn(`  SKIP  ${relative(targetDir, filePath)} — read error: ${err.message}`)
      skippedFiles.push(filePath)
      continue
    }

    const migrated = migrateContent(content)
    if (migrated === null) continue

    changedFiles.push(filePath)
    console.log(`  ${dryRun ? 'WOULD UPDATE' : 'UPDATED'}  ${relative(targetDir, filePath)}`)

    if (!dryRun) {
      writeFileSync(filePath, migrated, 'utf8')
    }
  }

  console.log(`\n${dryRun ? '[Dry run] ' : ''}${changedFiles.length} file(s) ${dryRun ? 'would be' : 'were'} updated.`)

  if (changedFiles.length > 0) {
    console.log('\nNext steps:')
    console.log('  1. Install new packages in your project:')
    console.log('       npm install @dialpad/callbarkit @dialpad/chatkit @dialpad/navigationkit @dialpad/workflowkit')
    console.log('  2. Review the diff and verify component prop APIs match the new package docs.')
    console.log('  3. Run your lint + test suite to catch any remaining issues.')
    console.log('  4. See DLT-3063 for migration examples: https://github.com/dialpad/firespotter/pull/72240')
  }
}

main()
