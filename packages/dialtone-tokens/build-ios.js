#!/usr/bin/env node

/**
 * Builds the ios tokens to the correct final package format (output to dist_ios)
 */
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const OUTPUT_DIRECTORY = 'dist_ios/Sources/DialtoneTokens';

// Reset the directory rather than unlinking a filename pattern, so themes that
// were renamed or removed can't survive a rebuild. Everything under Sources/ is
// generated; the package's tracked files (Package.swift, VERSION) sit above it.
fs.rmSync(OUTPUT_DIRECTORY, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

for (const source of glob.sync('dist/ios/tokens-*.swift')) {
  const themeName = path.basename(source);
  fs.copyFileSync(source, path.join(OUTPUT_DIRECTORY, themeName));
  console.log(`Copied ${themeName} to dist_ios`);
}
