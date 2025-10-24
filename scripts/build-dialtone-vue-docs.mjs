import { parse } from 'vue-docgen-api';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import fs, { writeFile } from 'fs';
import { getValidFileList } from '../common/utils/server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const version = process.argv[2];

/**
 * Deprecated components metadata
 * Based on eslint-plugin-dialtone/lib/rules/deprecated-component.js
 */
const deprecatedComponents = {
  'SelectMenu': {
    replacement: 'DtComboboxWithPopover',
    docs: 'https://dialtone.dialpad.com/vue/?path=/story/recipes-comboboxes-combobox-with-popover--default',
  },
  'DropdownMenu': {
    replacement: 'DtSelectMenu',
    docs: 'https://dialtone.dialpad.com/vue/?path=/story/components-select-menu--default',
  },
  'BaseToggle': {
    replacement: 'DtToggle',
    docs: 'https://dialtone.dialpad.com/vue/?path=/story/components-toggle--default',
  },
  'BaseDatePicker': {
    replacement: 'DtDatepicker',
    docs: 'https://dialtone.dialpad.com/vue/?path=/story/components-datepicker--default',
  },
  'Checkbox': {
    replacement: 'DtCheckbox',
    docs: 'https://dialtone.dialpad.com/vue/?path=/story/components-checkbox--default',
  },
};

if (!version) {
  console.info(`Usage: build-dialtone-vue-docs.mjs 2 or build-dialtone-vue-docs.mjs 3`);
  process.exit(-1);
}

const distPath = join(__dirname, `../packages/dialtone-vue${version}/dist`);
const dialtoneVueRootFolder = join(__dirname, `../packages/dialtone-vue${version}`);
const outputPath = `${distPath}/component-documentation.json`;
const fileList = [
  ...getValidFileList(dialtoneVueRootFolder + '/components'),
  ...getValidFileList(dialtoneVueRootFolder + '/recipes'),
];

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
    const docs = await Promise.all(parsedDocumentationPromises);

    // Add metadata to deprecated components
    return docs.map(doc => {
      const componentName = doc.displayName;
      if (deprecatedComponents[componentName]) {
        return {
          ...doc,
          metadata: {
            deprecated: true,
            reason: 'Replaced by Dialtone Vue component',
            ...deprecatedComponents[componentName],
          },
        };
      }
      return doc;
    });
  } catch {
    throw new Error('Parsing documentation');
  }
}

parseDocumentation(fileList).then(docs => {
  writeDocumentationFile(docs);
}).catch(err => {
  console.error(err);
});
