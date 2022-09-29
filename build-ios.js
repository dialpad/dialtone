#!/usr/bin/env node
const fs = require('fs');

fs.copyFile('dist/ios/dialtone.swift', 'dist_ios/Sources', (err) => {
  if (err) throw err;
  console.log('dialtone.swift was copied to dist_ios/Sources');
});
