const { parse } = require('vue-docgen-api');
const { join } = require('path');
const { readdirSync, writeFile } = require('fs');

const componentsRootFolder = join(__dirname, '../components');
const outputPath = join(__dirname, '../dist/component-documentation.json');
const componentsList = [
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
  'collapsible.vue',
  'combobox.vue',
  'dropdown.vue',
  'emoji.vue',
  'emoji_text_wrapper.vue',
  'icon.vue',
  'input.vue',
  'input_group.vue',
  'keyboard_shortcut.vue',
  'lazy_show.vue',
  'link.vue',
  'list_item.vue',
  'list_section.vue',
  'modal.vue',
  'notice.vue',
  'pagination.vue',
  'presence.vue',
  'popover.vue',
  'radio.vue',
  'radio_group.vue',
  'root_layout.vue',
  'select_menu.vue',
  'skeleton.vue',
  'stack.vue',
  'tab_group.vue',
  'tab_panel.vue',
  'tab.vue',
  'toast.vue',
  'toggle.vue',
  'tooltip.vue',
  'validation_messages.vue',
];
const vueDocsConfig = {
  ...require('../vue.config').configureWebpack.resolve, // inform vue-docgen-api of your webpack aliases
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
const parseDocumentation = (componentsPath) => {
  const fileList = getFileList(componentsPath);
  const parsedDocumentationPromises = [];

  fileList.forEach(filePath => {
    parsedDocumentationPromises.push(parse(filePath, vueDocsConfig));
  });

  Promise.all(parsedDocumentationPromises).then(result => {
    writeDocumentationFile(result);
  });
};

parseDocumentation(componentsRootFolder);
