#!/usr/bin/env node
'use strict';

const fs = require('fs');

// Physical to logical property mappings
const PROPERTY_MAP = {
  // Margins
  'margin-left': 'margin-inline-start',
  'margin-right': 'margin-inline-end',
  'margin-top': 'margin-block-start',
  'margin-bottom': 'margin-block-end',

  // Padding
  'padding-left': 'padding-inline-start',
  'padding-right': 'padding-inline-end',
  'padding-top': 'padding-block-start',
  'padding-bottom': 'padding-block-end',

  // Positioning (inset)
  'left': 'inset-inline-start',
  'right': 'inset-inline-end',
  'top': 'inset-block-start',
  'bottom': 'inset-block-end',

  // Border
  'border-left': 'border-inline-start',
  'border-right': 'border-inline-end',
  'border-top': 'border-block-start',
  'border-bottom': 'border-block-end',
  'border-left-width': 'border-inline-start-width',
  'border-right-width': 'border-inline-end-width',
  'border-top-width': 'border-block-start-width',
  'border-bottom-width': 'border-block-end-width',
  'border-left-style': 'border-inline-start-style',
  'border-right-style': 'border-inline-end-style',
  'border-top-style': 'border-block-start-style',
  'border-bottom-style': 'border-block-end-style',
  'border-left-color': 'border-inline-start-color',
  'border-right-color': 'border-inline-end-color',
  'border-top-color': 'border-block-start-color',
  'border-bottom-color': 'border-block-end-color',

  // Border radius
  'border-top-left-radius': 'border-start-start-radius',
  'border-top-right-radius': 'border-start-end-radius',
  'border-bottom-left-radius': 'border-end-start-radius',
  'border-bottom-right-radius': 'border-end-end-radius',

  // Sizing
  'width': 'inline-size',
  'height': 'block-size',
  'min-width': 'min-inline-size',
  'max-width': 'max-inline-size',
  'min-height': 'min-block-size',
  'max-height': 'max-block-size',
};

// Value mappings for specific properties
const VALUE_MAP = {
  'text-align': {
    'left': 'start',
    'right': 'end',
  },
  'float': {
    'left': 'inline-start',
    'right': 'inline-end',
  },
  'clear': {
    'left': 'inline-start',
    'right': 'inline-end',
  },
};

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fixLogicalProperties(content) {
  // Process line by line to avoid matching in comments
  const lines = content.split('\n');
  const fixedLines = lines.map(line => {
    // Skip comment lines (LESS/CSS comments)
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return line;
    }

    let fixedLine = line;

    // Fix property names - match property at start of declaration
    for (const [physical, logical] of Object.entries(PROPERTY_MAP)) {
      // Match: whitespace + property + colon (with optional whitespace)
      // This ensures we only match actual CSS properties, not parts of other words
      const propertyRegex = new RegExp(
        `(^\\s*|[{;]\\s*)${escapeRegex(physical)}(\\s*:)`,
        'g'
      );
      fixedLine = fixedLine.replace(propertyRegex, `$1${logical}$2`);
    }

    // Fix values for specific properties
    for (const [property, values] of Object.entries(VALUE_MAP)) {
      for (const [physical, logical] of Object.entries(values)) {
        // Match: property: value (with proper boundaries)
        const valueRegex = new RegExp(
          `(${escapeRegex(property)}\\s*:\\s*)${physical}(\\s*[;!}]|\\s*$)`,
          'gi'
        );
        fixedLine = fixedLine.replace(valueRegex, `$1${logical}$2`);
      }
    }

    return fixedLine;
  });

  return fixedLines.join('\n');
}

function processStyleBlocks(content) {
  // Match all <style> blocks (with any attributes like lang, scoped, etc.)
  const styleRegex = /(<style[^>]*>)([\s\S]*?)(<\/style>)/gi;
  let hasChanges = false;

  const fixed = content.replace(styleRegex, (_match, openTag, styleContent, closeTag) => {
    const fixedStyle = fixLogicalProperties(styleContent);
    if (fixedStyle !== styleContent) {
      hasChanges = true;
    }
    return openTag + fixedStyle + closeTag;
  });

  return { fixed, hasChanges };
}

function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Split by fenced code blocks to avoid processing code examples
    // Match ``` with optional language identifier and content until closing ```
    const fencedCodeRegex = /(```[\s\S]*?```)/g;
    const parts = content.split(fencedCodeRegex);
    let hasChanges = false;

    // Process only non-code-block parts
    const fixedParts = parts.map((part, index) => {
      // Odd indices are the fenced code blocks (captured groups)
      if (index % 2 === 1) {
        return part; // Keep code blocks unchanged
      }
      // Process style blocks in non-code parts
      const result = processStyleBlocks(part);
      if (result.hasChanges) {
        hasChanges = true;
      }
      return result.fixed;
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, fixedParts.join(''), 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processFileWithStyleBlocks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = processStyleBlocks(content);

    if (result.hasChanges) {
      fs.writeFileSync(filePath, result.fixed, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processFile(filePath) {
  try {
    // Markdown: skip fenced code blocks, only process <style> tags
    if (filePath.endsWith('.md')) {
      return processMarkdownFile(filePath);
    }

    // Vue/HTML: only process <style> blocks
    if (filePath.endsWith('.vue') || filePath.endsWith('.html')) {
      return processFileWithStyleBlocks(filePath);
    }

    // CSS/LESS: process entire file
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixLogicalProperties(content);

    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main: process files passed as arguments
const files = process.argv.slice(2);

if (files.length === 0) {
  console.log('Usage: fix-logical-properties <file1> [file2] ...');
} else {
  let fixedCount = 0;
  for (const file of files) {
    if (processFile(file)) {
      fixedCount++;
    }
  }

  if (fixedCount > 0) {
    console.log(`\nFixed ${fixedCount} file(s)`);
  }
}
