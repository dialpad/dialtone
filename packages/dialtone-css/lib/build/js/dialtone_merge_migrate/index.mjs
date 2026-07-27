#!/usr/bin/env node

import { normalize } from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import {
  error,
  getAllFileContents,
  getConfigFileList,
  inquireForFile,
  modifyFileContents,
  readConfigFile,
} from '../dialtone_migration_helper/helpers.mjs';
import { runMergeMigration } from './merge-migrate.mjs';

const CONFIG_FOLDER = new URL('../dialtone_migration_helper/configs', import.meta.url).pathname;

(async () => {
  const argv = yargs(hideBin(process.argv))
    .scriptName('dialtone-merge-migrate')
    .usage(
      '$0 --config color-stops --merge-from staging\n\n' +
      'Runs a dialtone_migration_helper migration config scoped only to files changed on\n' +
      '--merge-from, relative to your currently checked out branch. Files changed only on\n' +
      '--merge-from are safe to auto-migrate; files also touched on your current branch are\n' +
      'flagged for manual review instead of being auto-rewritten.\n\n' +
      'Use this when migrating a long-running branch to Dialtone 10 without clobbering\n' +
      'manual edits your branch already made to the same files.',
    )
    .options({
      config: {
        type: 'string',
        description: 'Migration config to run (filename in dialtone_migration_helper/configs, with or without .mjs). Prompts interactively if omitted.',
      },
      'merge-from': {
        type: 'string',
        description: 'Branch to scope the migration to.',
        default: 'staging',
      },
      cwd: {
        type: 'string',
        description: 'Repository root to run against. Defaults to CWD.',
        default: process.cwd(),
      },
      'dry-run': {
        boolean: true,
        description: 'Preview without modifying files.',
        default: false,
      },
      force: {
        boolean: true,
        description: 'Skip the confirmation prompt before modifying safe files.',
        default: false,
      },
      verbose: {
        boolean: true,
        description: 'Show line-level details for overlap files.',
        default: false,
      },
    })
    .help().argv;

  const cwd = !argv.cwd ? process.cwd() : normalize(argv.cwd);

  // resolve the config: from --config if provided, otherwise prompt from the list
  const configList = await getConfigFileList(CONFIG_FOLDER).catch((err) =>
    error('getConfigFileList: ' + err),
  );

  let configData;
  let configFile;
  if (argv.config) {
    const requested = argv.config.endsWith('.mjs') ? argv.config : `${argv.config}.mjs`;
    const match = configList.find((c) => c.value === requested);
    if (!match) {
      error(
        `Unknown --config '${argv.config}'. Available configs: ` +
        configList.map((c) => c.value.replace(/\.mjs$/, '')).join(', '),
      );
    }
    [configData, configFile] = await readConfigFile(`${CONFIG_FOLDER}/${match.value}`);
  } else {
    [configData, configFile] = await inquireForFile(CONFIG_FOLDER, configList).catch((err) =>
      error('inquireForFile: ' + err),
    );
  }

  console.log(`\nConfiguration: ${configFile}`);

  await runMergeMigration({
    cwd,
    sourceBranch: argv['merge-from'],
    dryRun: argv['dry-run'],
    force: argv.force,
    verbose: argv.verbose,
    config: configData,
    configLabel: configFile.replace(/\.mjs$/, ''),
    configPath: `dialtone_migration_helper/configs/${configFile}`,
    getAllFileContents,
    modifyFileContents,
  });
})();
