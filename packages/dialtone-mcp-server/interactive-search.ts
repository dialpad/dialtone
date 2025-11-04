#!/usr/bin/env tsx

/**
 * Interactive search tool for testing the Dialtone MCP server
 * Run: pnpm run interactive
 */

import * as readline from 'readline';
import { searchUtilityClasses } from './src/tools/utility-classes.js';
import { searchTokens } from './src/tools/tokens.js';
import { searchComponents } from './src/tools/components.js';
import { utilityClasses, tokens, components } from './src/data.js';
import type { UtilityClassesData, TokensData, Component } from './src/types.js';

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

function showHelp(): void {
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

function formatResults(results: any[], limit: number = 15): string {
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

let currentTool: string | null = null;

function askForTool(): void {
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

function handleSpecialCommand(query: string): boolean {
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

function handleLineInput(query: string): void {
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

function performSearch(query: string): void {
  console.log(`\nSearching for: "${query}"\n`);

  let searchResult;
  if (currentTool === 'utility') {
    searchResult = searchUtilityClasses(query, utilityClasses as UtilityClassesData);
  } else if (currentTool === 'tokens') {
    searchResult = searchTokens(query, tokens as TokensData);
  } else if (currentTool === 'components') {
    searchResult = searchComponents(query, components as Component[]);
  }

  if (searchResult) {
    console.log(formatResults(searchResult.results));
    if (searchResult.notes && searchResult.notes.length > 0) {
      console.log('\nNotes:');
      searchResult.notes.forEach(note => console.log(`  - ${note}`));
    }
  }

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
