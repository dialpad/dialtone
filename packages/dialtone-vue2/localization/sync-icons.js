#!/usr/bin/node

import iconsList from '@dialpad/dialtone-icons/icons.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { toFluentKeyString } from '@/common/utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fluentFilePath = path.join(__dirname, 'en-US.ftl');

const dialtoneFluentFile = readFileSync(fluentFilePath, 'utf-8');
let result = '';

const fluentKeys = iconsList.reduce((keys, item) => {
  const fluentKey = toFluentKeyString(item);

  const iconName = item[0].toUpperCase() +
    item.replaceAll('-', ' ').slice(1) +
    ' icon';

  keys += `DIALTONE_ICON_${fluentKey} = ${iconName}\n`;
  return keys;
}, '');

result = dialtoneFluentFile.replace(/# Icons Begin.*# Icons End/gs, `# Icons Begin\n${fluentKeys}# Icons End`);

writeFileSync(fluentFilePath, result, 'utf-8');
