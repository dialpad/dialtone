// chalk, globby, inquirer and yargs are declared as optional peerDependencies
// on @dialpad/dialtone-css because they're only needed by the migration CLIs
// (dialtone-migrate, dialtone-migration-helper, dialtone-merge-migrate), not
// by consumers who only use the published CSS/tokens. This checks they're
// actually present before the CLI runs, so a missing one fails with an
// install instruction instead of a raw ERR_MODULE_NOT_FOUND stack trace.
export const assertOptionalPeerDeps = async (names) => {
  const missing = [];
  for (const name of names) {
    try {
      await import(name);
    } catch {
      missing.push(name);
    }
  }

  if (missing.length > 0) {
    console.error(
      `\nThis command requires the following package${missing.length > 1 ? 's' : ''}, which ` +
      `${missing.length > 1 ? 'are' : 'is'} not installed: ${missing.join(', ')}.\n` +
      `Install ${missing.length > 1 ? 'them' : 'it'} with:\n\n` +
      `  npm install -D ${missing.join(' ')}\n`,
    );
    process.exit(1);
  }
};
