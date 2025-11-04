#!/usr/bin/env node

/**
 * Interactive search tool for testing the Dialtone MCP server
 * Run: node interactive-search.js
 */

import { createRequire } from 'module';
import * as readline from 'readline';

const require = createRequire(import.meta.url);

const utilityClasses = require('@dialpad/dialtone-css/lib/dist/dialtone-docs.json');
const tokens = require('@dialpad/dialtone-css/lib/dist/tokens-docs.json');
const components = require('@dialpad/dialtone-vue/component-documentation.json');

console.log('='.repeat(80));
console.log('Dialtone MCP Server - Interactive Search Tool');
console.log('='.repeat(80));
console.log();
console.log('This tool lets you test search queries interactively.');
console.log();
console.log('Query Format:');
console.log('  ✓ Use keywords: "padding 8px", "color primary", "button"');
console.log('  ✗ Not questions: "how do I add padding?" or "what button component exists?"');
console.log();
console.log('Available Search Tools:');
console.log('  1. Utility Classes - CSS classes like d-p8, d-d-flex, d-w100p');
console.log('  2. Design Tokens   - CSS variables like --dt-color-foreground-primary');
console.log('  3. Components      - Vue components like DtButton, DtModal');
console.log();
console.log('Type "help" for examples, "quit" to exit');
console.log('='.repeat(80));
console.log();

// Simple search implementations (copied from test-search.js)
function createUnitRegex(word) {
  if (word.endsWith('px')) {
    const px = parseFloat(word);
    const rem = `${px / 10}rem`;
    return new RegExp(`(${word.replace(/\./g, '\\.')}|${rem.replace(/\./g, '\\.')})`, 'i');
  }
  if (word.endsWith('rem')) {
    const remValue = parseFloat(word);
    const px = `${remValue * 10}px`;
    return new RegExp(`(${word.replace(/\./g, '\\.')}|${px.replace(/\./g, '\\.')})`, 'i');
  }
  return new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

function buildUtilitySearchText(className, classData) {
  const searchableTexts = [className.toLowerCase()];
  for (const valueObj of classData.values) {
    searchableTexts.push(valueObj.prop?.toLowerCase() || '');
    searchableTexts.push(valueObj.value?.toLowerCase() || '');
    searchableTexts.push(valueObj.description?.toLowerCase() || '');
  }
  return searchableTexts.join(' ');
}

function buildTokenSearchText(tokenName, themeVariants) {
  const searchableTexts = [tokenName.toLowerCase()];
  for (const [themeName, themeData] of Object.entries(themeVariants)) {
    if (themeName === 'metadata') continue;
    if (themeData?.value) searchableTexts.push(String(themeData.value).toLowerCase());
    if (themeData?.description) searchableTexts.push(String(themeData.description).toLowerCase());
  }
  return searchableTexts.join(' ');
}

function buildComponentSearchText(component) {
  const searchableTexts = [
    (component.displayName || '').toLowerCase(),
    (component.description || '').toLowerCase(),
  ];
  for (const prop of component.props || []) {
    searchableTexts.push((prop.name || '').toLowerCase());
    searchableTexts.push((prop.description || '').toLowerCase());
  }
  return searchableTexts.join(' ');
}

function searchUtilityClasses(query, data) {
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  const regexArray = words.map(createUnitRegex);

  const results = [];
  for (const [className, classData] of Object.entries(data)) {
    const searchableText = buildUtilitySearchText(className, classData);
    if (regexArray.every(r => r.test(searchableText))) {
      results.push({ name: className, data: classData });
    }
  }

  return results.filter(r => !r.data.metadata?.deprecated);
}

function searchTokens(query, data) {
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  const regexArray = words.map(createUnitRegex);

  const results = [];
  for (const [tokenName, themeVariants] of Object.entries(data)) {
    if (!tokenName.startsWith('--dt-') && !tokenName.startsWith('--base--')) continue;

    const searchableText = buildTokenSearchText(tokenName, themeVariants);
    if (regexArray.every(r => r.test(searchableText))) {
      results.push({ name: tokenName, data: themeVariants });
    }
  }

  return results.filter(r => !r.data.metadata?.deprecated);
}

function searchComponents(query, components) {
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  const regexArray = words.map(word => {
    return new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  });

  const results = [];
  for (const component of components) {
    const searchableText = buildComponentSearchText(component);
    if (regexArray.every(r => r.test(searchableText))) {
      results.push({ name: component.displayName, data: component });
    }
  }

  return results.filter(r => !r.data.metadata?.deprecated);
}

function showHelp() {
  console.log('\nExample Queries:\n');
  console.log('Utility Classes:');
  console.log('  "padding 8px"          → d-p8, d-pt8, d-pr8, d-pb8, ...');
  console.log('  "display flex"         → d-d-flex, d-d-inline-flex');
  console.log('  "width 100%"           → d-w100p');
  console.log('  "margin top auto"      → d-mt-auto');
  console.log();
  console.log('Design Tokens:');
  console.log('  "color foreground"     → --dt-color-foreground-primary, ...');
  console.log('  "space 400"            → --dt-space-400');
  console.log('  "font family"          → --dt-font-family-body, ...');
  console.log();
  console.log('Components:');
  console.log('  "button"               → DtButton, DtButtonGroup, ...');
  console.log('  "modal"                → DtModal, DtBanner, ...');
  console.log('  "checkbox"             → DtCheckbox, DtCheckboxGroup, ...');
  console.log();
}

function formatResults(results, limit = 15) {
  if (results.length === 0) {
    return '  No results found';
  }

  const limited = results.slice(0, limit);
  let output = `  Found ${results.length} result${results.length > 1 ? 's' : ''}`;
  if (results.length > limit) {
    output += ` (showing first ${limit})`;
  }
  output += ':\n\n';

  limited.forEach((result, i) => {
    output += `  ${i + 1}. ${result.name}\n`;
  });

  return output;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n> ',
});

let currentTool = null;

function askForTool() {
  console.log('\nSelect a search tool:');
  console.log('  1. Utility Classes');
  console.log('  2. Design Tokens');
  console.log('  3. Components');
  console.log('  Type "quit" to exit\n');

  rl.question('Enter 1, 2, or 3: ', (answer) => {
    const choice = answer.trim();

    if (choice === 'quit' || choice === 'exit' || choice === 'q') {
      console.log('\nGoodbye!\n');
      rl.close();
      process.exit(0);
    }

    if (choice === '1') {
      currentTool = 'utility';
      console.log('\n✓ Selected: Utility Classes');
      console.log('Example: "padding 8px", "display flex", "margin top auto"\n');
      rl.prompt();
    } else if (choice === '2') {
      currentTool = 'tokens';
      console.log('\n✓ Selected: Design Tokens');
      console.log('Example: "color foreground", "space 400", "font family"\n');
      rl.prompt();
    } else if (choice === '3') {
      currentTool = 'components';
      console.log('\n✓ Selected: Components');
      console.log('Example: "button", "modal", "checkbox"\n');
      rl.prompt();
    } else {
      console.log('\nInvalid choice. Please enter 1, 2, or 3.\n');
      askForTool();
    }
  });
}

function handleSpecialCommand(query) {
  if (query === 'quit' || query === 'exit' || query === 'q') {
    console.log('\nGoodbye!\n');
    rl.close();
    process.exit(0);
  }

  if (query === 'help' || query === 'h') {
    showHelp();
    rl.prompt();
    return true;
  }

  if (query === 'switch' || query === 'back') {
    currentTool = null;
    askForTool();
    return true;
  }

  return false;
}

function handleLineInput(query) {
  if (handleSpecialCommand(query)) {
    return;
  }

  if (!query) {
    rl.prompt();
    return;
  }

  if (!currentTool) {
    console.log('Please select a tool first (enter 1, 2, or 3)');
    askForTool();
    return;
  }

  performSearch(query);
}

function performSearch(query) {
  console.log(`\nSearching for: "${query}"\n`);

  let results;
  if (currentTool === 'utility') {
    results = searchUtilityClasses(query, utilityClasses);
  } else if (currentTool === 'tokens') {
    results = searchTokens(query, tokens);
  } else if (currentTool === 'components') {
    results = searchComponents(query, components);
  }

  console.log(formatResults(results));
  console.log('\nTip: Type "switch" to change search tool, "help" for examples, "quit" to exit');
  rl.prompt();
}

rl.on('line', (line) => {
  const query = line.trim();
  handleLineInput(query);
});

rl.on('close', () => {
  console.log('\nGoodbye!\n');
  process.exit(0);
});

// Start by asking for tool selection
askForTool();
