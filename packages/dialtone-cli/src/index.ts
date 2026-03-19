import { defineCommand, runMain } from 'citty';
import pkg from '../package.json' with { type: 'json' };
import { silenceDebug } from './silence-debug.js';
import { searchCommand } from './commands/search.js';
import { componentCommand } from './commands/component.js';
import { tokenCommand } from './commands/token.js';
import { promptCommand } from './commands/prompt.js';
import { utilityCommand } from './commands/utility.js';

silenceDebug();

async function checkVersion() {
  try {
    const response = await fetch(`https://registry.npmjs.org/${pkg.name}/latest`);
    const data = await response.json();
    if (data.version && data.version !== pkg.version) {
      console.error('');
      console.error(`  Update available: v${pkg.version} → v${data.version}`);
      console.error(`  Run: npm install -g ${pkg.name}@latest`);
      console.error('');
    }
  } catch {
    // Fail silently if offline
  }
}

// Fire version check in the background — don't block CLI startup
checkVersion();

const main = defineCommand({
  meta: {
    name: 'dialtone',
    version: pkg.version,
    description: 'CLI for searching and exploring the Dialtone Design System',
  },
  subCommands: {
    search: searchCommand,
    component: componentCommand,
    token: tokenCommand,
    utility: utilityCommand,
    prompt: promptCommand,
  },
});

runMain(main);
