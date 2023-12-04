import { parse } from 'vue-docgen-api';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, writeFile } from 'fs';

import componentsList from '../common/components_list.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsRootFolder = join(__dirname, '../components');
const outputPath = join(__dirname, '../dist/component-documentation.json');

const getConfig = async () => {
  const config = await import('../vite.config.js');
  return config.default;
};

const getFileList = (folder) => {
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
};
const writeDocumentationFile = (data) => {
  const jsonData = JSON.stringify(data);

  writeFile(outputPath, jsonData, 'utf8', (err) => {
    if (err) return console.error('An error occurred while writing JSON Object to File.', err);

    console.info('Documentation created successfully');
  });
};
const parseDocumentation = async (componentsPath) => {
  const config = await getConfig();
  const fileList = getFileList(componentsPath);
  const parsedDocumentationPromises = [];

  fileList.forEach(filePath => {
    parsedDocumentationPromises.push(parse(filePath, config.resolve));
  });

  Promise.all(parsedDocumentationPromises).then(result => {
    writeDocumentationFile(result);
  });
};

parseDocumentation(componentsRootFolder);
