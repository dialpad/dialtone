#!/usr/bin/env node

/**
 * Builds the ios tokens to the correct final package format (output to dist_ios)
 */
import fs from 'fs';

import { THEMES } from './build-token-transformer.js';

if (!fs.existsSync('dist_ios/Sources/DialtoneTokens')) {
  fs.mkdirSync( 'dist_ios/Sources/DialtoneTokens', { recursive: true })
}

THEMES.forEach(theme => {
  fs.copyFile(`dist/ios/tokens-${theme}.swift`, `dist_ios/Sources/DialtoneTokens/tokens-${theme}.swift`, (err) => {
    if (err) throw err;
    console.log(`dialtone.swift was copied to dist_ios/Sources/DialtoneTokens/tokens-${theme}.swift`);
  });
});
