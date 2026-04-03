import { parse } from 'vue-docgen-api';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import fs, { writeFile } from 'fs';
import { getValidFileList } from '../common/utils/server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  'DtIcon': {
    replacement: 'Individual tree-shakable icon components from @dialpad/dialtone-icons/vue (e.g., DtIconBell, DtIconAlertCircle)',
    docs: 'https://dialtone.dialpad.com/components/icon.html',
  },
};

const distPath = join(__dirname, `../packages/dialtone-vue/dist`);
const dialtoneVueRootFolder = join(__dirname, `../packages/dialtone-vue`);
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

/**
 * vue-docgen-api does not support defineOptions(), so <script setup> components
 * get the filename as their displayName. This reads the source file and extracts
 * the name from defineOptions({ name: '...' }) when present.
 */
function extractDefineOptionsName (filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const match = source.match(/defineOptions\(\s*\{[^}]*name:\s*['"]([^'"]+)['"]/);
  return match?.[1] ?? null;
}

async function parseDocumentation (fileList) {
  const config = {
    alias: { '@': join(__dirname, `../packages/dialtone-vue/`) },
  };
  const parsedDocumentationPromises = [];

  fileList.forEach(filePath => {
    parsedDocumentationPromises.push(
      parse(filePath, config).then(doc => ({ doc, filePath })),
    );
  });

  try {
    const results = await Promise.all(parsedDocumentationPromises);

    return results.map(({ doc, filePath }) => {
      // Fix displayName for <script setup> components using defineOptions
      const defineOptionsName = extractDefineOptionsName(filePath);
      if (defineOptionsName) {
        doc.displayName = defineOptionsName;
      }

      // Add metadata to deprecated components
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
