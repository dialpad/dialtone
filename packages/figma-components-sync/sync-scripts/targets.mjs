/**
 * WHERE THE COMPONENTS GET BUILT.
 *
 * A target is a Figma file that OWNS the Dialtone tokens: it holds the base variable collection (with
 * the tokens only components need hidden from publishing), the text and effect styles, and the
 * components built from them. Building where the variables are local is what keeps a component on
 * ONE variable collection, and therefore one appearance toggle for whoever uses it.
 *
 *   node sync-scripts/run-batch.mjs button --target preview
 *
 * No default, on purpose: a build that silently picks a file is how the wrong one gets rewritten.
 *
 * This file holds NO file keys (the repository is public). A target names the environment variable
 * that does, read from `.env` locally:
 *
 *   PREVIEW_FILE_KEY=…   the preview file (the one a `/sync-tokens` comment syncs the tokens into)
 *   MAIN_FILE_KEY=…      the main tokens file
 *
 * A personal copy of the tokens file works the same way. Add it to `targets.local.mjs`, which is
 * gitignored, with the same shape as the entries below.
 */
export const TARGETS = {
  preview: {
    label: 'Preview tokens file',
    fileKeyEnv: 'PREVIEW_FILE_KEY',
    // The preview sync names the base collection after itself (COLLECTION_NAME).
    homeCollection: 'Dialtone 2026 Preview',
  },
  main: {
    label: 'Main tokens file',
    fileKeyEnv: 'MAIN_FILE_KEY',
    homeCollection: 'Dialtone 2026',
    // The real file: a build needs `--yes`.
    confirm: true,
  },
};
