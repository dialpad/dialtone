#!/usr/bin/env node
/**
 * Syncs .devcontainer/devcontainer.json extensions from .vscode/extensions.json.
 * Run automatically by the pre-commit hook when extensions.json is staged.
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const extensionsPath = '.vscode/extensions.json';
const devcontainerPath = '.devcontainer/devcontainer.json';

const extensions = JSON.parse(readFileSync(extensionsPath, 'utf8'));
const devcontainer = JSON.parse(readFileSync(devcontainerPath, 'utf8'));

const recommendations = extensions.recommendations;
const current = devcontainer.customizations.vscode.extensions;

const sorted = (arr) => [...arr].sort();
if (JSON.stringify(sorted(recommendations)) === JSON.stringify(sorted(current))) {
  process.exit(0);
}

devcontainer.customizations.vscode.extensions = recommendations;
writeFileSync(devcontainerPath, JSON.stringify(devcontainer, null, 2) + '\n');
execSync(`git add ${devcontainerPath}`);
console.log(`Synced ${devcontainerPath} from ${extensionsPath}`);
