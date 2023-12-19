#!/usr/bin/env node

/* Will search the files in the provided directory for any properties that are not set to dialtone values.
   It does this by simply checking whether the property is set to a less @variable or CSS var such as var(--val).
   It does not compare to an actual list of dialtone token values so it is not perfect, and sometimes gives false
   positives. This will however give a pretty good idea of where dialtone values aren't being used that should.

   Searches some key properties by default as shown in the defaultSearch array below. You are however not limited to
   this, you can make this application search any css property you wish. See the below options or run this application
   with the -h switch for more details. */

const path = require('path');
const fs = require('fs');
const { exit } = require('process');
const { docopt } = require('docopt');
const nonDialtoneProperties = require('./non_dialtone_properties');
const deprecatedIcons = require('./deprecated_icons');

const doc = `
Usage:
  ./dialtone_health_check <path> [options] (--icons|--properties) [<properties>]

Examples:
  ./dialtone_health_check <path> --ext=vue,js --no-line-numbers --icons
  ./dialtone_health_check <path> --ext=vue,js --properties color,background-color
  ./dialtone_health_check <path> --ext=vue,js --icons --properties color,background-color

Arguments:
  <properties>                CSS Properties to search. Default properties if list is not provided:
                              color,background-color,border-color,font-family
  <path>                      The directory to recursively search all files in.

Options:
  -p --properties             Verify the usage of non-dialtone properties.
  -i --icons                  Verify the status of icons migration.
  -h --help                   Show this screen.
  --ext=<ext>                 Filter by file extension. comma separate to filter multiple. ex: js,vue
  --no-line-numbers           Only output files and their total count, do not output individual instances and 
                              their line number.
`;
const options = docopt(doc);
const extensionFilters = options['--ext']?.split(',') ?? [''];
const searchProperties = options['--properties'];
const properties = options['<properties>']?.split(',');
const noLineNumbers = options['--no-line-numbers'];
const searchIcons = options['--icons'];
const files = [];

function fromDir (startPath, fileExtension) {
  if (!fs.existsSync(startPath)) {
    console.error('Directory not found');
    exit(1);
  }

  const results = [];
  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      results.push(...fromDir(filename, fileExtension)); // recurse
    } else if (filename.endsWith(fileExtension)) {
      results.push(filename);
    }
  }
  return results;
}

extensionFilters.forEach(extension => {
  files.push(...fromDir(options['<path>'], extension));
});
if (files.length <= 0) {
  console.error('No files found in directory');
  exit(1);
}
if (!searchProperties && !searchIcons) {
  console.error('You must set at least one flag [--icons|--properties]');
  exit(1);
}

searchProperties && nonDialtoneProperties(properties, files, noLineNumbers);
searchIcons && deprecatedIcons(files, noLineNumbers);
