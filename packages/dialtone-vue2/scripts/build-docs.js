import { parse } from 'vue-docgen-api';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, writeFile } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsRootFolder = join(__dirname, '../components');
const outputPath = join(__dirname, '../dist/component-documentation.json');
const componentsList = [
  'DtDatepicker.vue',
  'avatar.vue',
  'badge.vue',
  'banner.vue',
  'breadcrumbs.vue',
  'button.vue',
  'button_group.vue',
  'card.vue',
  'checkbox.vue',
  'checkbox_group.vue',
  'chip.vue',
  'codeblock.vue',
  'collapsible.vue',
  'combobox.vue',
  'description_list.vue',
  'dropdown.vue',
  'emoji.vue',
  'emoji_picker.vue',
  'emoji_text_wrapper.vue',
  'icon.vue',
  'input.vue',
  'input_group.vue',
  'item_layout.vue',
  'keyboard_shortcut.vue',
  'lazy_show.vue',
  'link.vue',
  'list_item.vue',
  'list_section.vue',
  'modal.vue',
  'notice.vue',
  'pagination.vue',
  'popover.vue',
  'presence.vue',
  'radio.vue',
  'radio_group.vue',
  'root_layout.vue',
  'scroller.vue',
  'select_menu.vue',
  'skeleton.vue',
  'stack.vue',
  'tab.vue',
  'tab_group.vue',
  'tab_panel.vue',
  'toast.vue',
  'toggle.vue',
  'tooltip.vue',
  'validation_messages.vue',
];

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
