#!/usr/bin/env node

/**
 * Build script to generate split tokens (core vs brand-specific)
 * This is a proof-of-concept for the new token architecture
 */

import { runSplitTokens } from './build-sd-transforms-split.js';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Starting split token build process...\n');

  // Create output directory
  const outputDir = './dist/css/split';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  }

  try {
    // Run the split token generation
    await runSplitTokens();

    console.log('\n✅ Split token build complete!');
    console.log('\nGenerated files:');

    // List generated files
    const files = fs.readdirSync(outputDir);
    files.forEach(file => {
      const filePath = path.join(outputDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  - ${file} (${sizeKB} KB)`);
    });

    // Compare with original file sizes
    console.log('\nComparison with original files:');
    const originalFiles = [
      'tokens-dp-light.css',
      'tokens-dp-dark.css',
      'tokens-base-light.css',
      'tokens-base-dark.css',
    ];

    let originalTotalSize = 0;
    originalFiles.forEach(file => {
      const filePath = `./dist/css/${file}`;
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = stats.size / 1024;
        originalTotalSize += sizeKB;
        console.log(`  Original ${file}: ${sizeKB.toFixed(2)} KB`);
      }
    });

    let splitTotalSize = 0;
    files.forEach(file => {
      const filePath = path.join(outputDir, file);
      const stats = fs.statSync(filePath);
      splitTotalSize += stats.size / 1024;
    });

    console.log(`\n📊 Size reduction: ${((1 - splitTotalSize / originalTotalSize) * 100).toFixed(1)}%`);
    console.log(`   Original total: ${originalTotalSize.toFixed(2)} KB`);
    console.log(`   Split total: ${splitTotalSize.toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error during split token build:', error);
    process.exit(1);
  }
}

main();