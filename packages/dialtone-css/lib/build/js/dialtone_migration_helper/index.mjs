#!/usr/bin/env node

import chalk from 'chalk';
import {
  confirmStart,
  doPatternSearch,
  error,
  findMatchedFiles,
  getConfigFileList,
  getAllFileContents,
  inquireForFile,
  modifyFileContents,
  readConfigFile,
} from './helpers.mjs';
import ora from 'ora';
import { dirname, normalize } from 'path';
import { fileURLToPath } from 'url';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

// eslint-disable-next-line complexity
(async () => {
  // get command line args
  const argv = yargs(hideBin(process.argv))
    .scriptName('dialtone-migration-helper')
    .usage(
      '$0 --cwd "../root/directory" --include "file1.ext" "**/*.ext2" --ignore "**/ignored/**", "**/another_ignored/**"',
    )
    .options({
      cwd: {
        type: 'string',
        description: 'Root directory for scan. Defaults to CWD.',
        default: process.cwd(),
      },
      include: {
        type: 'array',
        description: 'Glob patters to include during search, if omitted, will include all the files on the CWD.',
      },
      ignore: {
        type: 'array',
        description: 'Other glob patterns to ignore during search. .gitignore included by default.',
      },
      force: {
        boolean: true,
        description: 'Skip interactive prompts, use caution!',
        default: false,
      },
    })
    .help().argv;

  // get list of configuration files
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const CONFIG_FOLDER = __dirname + '/configs';
  const configList = await getConfigFileList(CONFIG_FOLDER).catch((err) =>
    error('getConfigFileList: ' + err),
  );

  // load configuration from arg or list
  const [configData, configFile] = await inquireForFile(CONFIG_FOLDER, configList)
      .catch((err) =>
        error('inquireForFile: ' + err),
      );

  // set up some globby defaults
  configData.globbyConfig = configData.globbyConfig || {};
  configData.globbyConfig.gitignore = configData.globbyConfig.gitignore || true;

  console.log(
    `\n${chalk.green('++')} Configuration Loaded! (${configFile}) ${chalk.green('++')}\n`,
  );

  // take CWD if specified from command line
  const cwd = !argv.cwd ? process.cwd() : normalize(argv.cwd);
  configData.globbyConfig.cwd = configData.globbyConfig.cwd || cwd;
  // push include list to configuration array
  if (argv.include) {
    configData.patterns = argv.include;
  }
  // push ignore list to configuration array
  if (argv.ignore) {
    configData.globbyConfig.ignore = argv.ignore;
  }

  // run glob search with configData.patterns
  const globSpinner = ora('Performing pattern search').start();
  const files = await doPatternSearch(configData).then((f) => {
    return findMatchedFiles(f, configData);
  });
  if (files.length <= 0) {
    console.log(
      '\n' +
        chalk.cyan('??') +
        ' No matches found! Check your patterns and cwd settings if you think this is an error ' +
        `patterns: [${configData.patterns}] | cwd: [${configData.globbyConfig.cwd}] `,
    );
    process.exit(0);
  }

  globSpinner.stop();
  console.log(`[ ${chalk.whiteBright(files.length)} ] files queued for modification:\n`);
  console.log(files);
  console.log(
    `\n${chalk.yellow('Configuration Description')}${chalk.gray(':')}\n${configData.description}\n`,
  );

  // kick off file search and replace
  const startModification = () => {
    console.log(`\n${chalk.blue('__')} Starting ...`);

    getAllFileContents(files, configData.globbyConfig.cwd)
      .then((content) => {
        modifyFileContents(content, configData.expressions).then(() => {
          console.log(`${chalk.magenta('==')} Modification complete!\n`);
        });
      })
      .catch((err) => error('getAllFileContents: ' + err));
  };

  // begin file modification based on configuration rules
  // start automatically if --force is specified
  if (!argv.force) {
    confirmStart()
      .then((val) => {
        if (val) {
          startModification();
        } else {
          console.log(`\n${chalk.red('__')} Cancelling ...\n`);
        }
      })
      .catch((err) => error('confirmStart ' + err));
  } else {
    startModification();
  }
})();
