#!/usr/bin/env node
const fs = require('fs');

if (!fs.existsSync('dist_ios/Sources')) {
  fs.mkdirSync('dist_ios/Sources')
}

fs.copyFile('dist/ios/tokens.swift', 'dist_ios/Sources/tokens.swift', (err) => {
  if (err) throw err;
  console.log('dialtone.swift was copied to dist_ios/Sources/tokens.swift');
});
