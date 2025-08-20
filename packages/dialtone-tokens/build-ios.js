#!/usr/bin/env node

/**
 * Builds the ios tokens to the correct final package format (output to dist_ios)
 */
import fs from 'fs';
import { glob } from 'glob';

const THEMES = glob.sync('dist/ios/tokens-*.swift');

if (!fs.existsSync('dist_ios/Sources/DialtoneTokens')) {
  fs.mkdirSync('dist_ios/Sources/DialtoneTokens', { recursive: true });
}

THEMES
  .map(theme => theme.replace('dist/ios/', ''))
  .forEach(themeName => {
    fs.copyFile(`dist/ios/${themeName}`, `dist_ios/Sources/DialtoneTokens/${themeName}`, (err) => {
      if (err) throw err;
      console.log(`Copied ${themeName} to dist_ios`);
    });
  });
