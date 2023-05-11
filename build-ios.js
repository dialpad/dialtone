#!/usr/bin/env node
const fs = require('fs');

const THEMES = require('./build').THEMES;

if (!fs.existsSync('dist_ios/Sources')) {
  fs.mkdirSync('dist_ios/Sources')
}

THEMES.forEach(theme => {
  fs.copyFile(`dist/ios/tokens-${theme}.swift`, `dist_ios/Sources/tokens-${theme}.swift`, (err) => {
    if (err) throw err;
    console.log(`dialtone.swift was copied to dist_ios/Sources/tokens-${theme}.swift`);
  });
});
