import { parse } from 'vue-docgen-api';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import fs, { readdirSync, writeFile } from 'fs';

import componentsList from '../common/components_list.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const version = process.argv[2];

if (!version) {
  console.info(`Usage: build-dialtone-vue-docs.mjs 2 or build-dialtone-vue-docs.mjs 3`);
  process.exit(-1);
}

const distPath = join(__dirname, `../packages/dialtone-vue${version}/dist`);
const componentsRootFolder = join(__dirname, `../packages/dialtone-vue${version}/components`);
const outputPath = `${distPath}/component-documentation.json`;
const fileList = getFileList(componentsRootFolder);

function getFileList (folder) {
  let files = [];
  const items = readdirSync(folder, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(getFileList(`${folder}/${item.name}`))];
    } else if (componentsList.includes(item.name)) {
      files.push(`${folder}/${item.name}`);
    }
  }

  return files;
}

function writeDocumentationFile (data) {
  const jsonData = JSON.stringify(data);

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }

  writeFile(outputPath, jsonData, 'utf8', (err) => {
    if (err) throw new Error('An error occurred while writing JSON Object to File.');
    console.info('Documentation created successfully');
  });
}

async function parseDocumentation (fileList) {
  const config = {
    alias: { '@': join(__dirname, `../packages/dialtone-vue${version}/`) },
  };
  const parsedDocumentationPromises = [];

  fileList.forEach(filePath => {
    parsedDocumentationPromises.push(parse(filePath, config));
  });

  try {
    return Promise.all(parsedDocumentationPromises);
  } catch (err) {
    throw new Error('Parsing documentation');
  }
}

parseDocumentation(fileList).then(docs => {
  writeDocumentationFile(docs);
}).catch(err => {
  console.error(err);
});
