/* eslint-disable complexity */
const Generator = require('yeoman-generator');
const _ = require('lodash');

module.exports = class extends Generator {
  async prompting () {
    let valid;
    do {
      this.inputValues = await this.prompt([
        {
          type: 'confirm',
          name: 'isRecipe',
          message: 'Is this component a recipe? (Is it built using other dialtone components?) (Y/n):',
          default: true,
        },
      ]);
      this.isRecipe = this.inputValues.isRecipe;
      const prefix = this.inputValues.isRecipe ? 'DtRecipe' : 'Dt';

      if (this.isRecipe) {
        this.inputValues = await this.prompt([
          {
            type: 'list',
            name: 'category',
            message: 'Does your component belong in one of these categories?',
            choices: ['No', 'Avatars', 'Badges', 'Buttons', 'Checkboxes', 'Comboboxes', 'Conversation View',
              'Dropdowns', 'Inputs', 'Leftbar', 'List Items', 'Modals', 'Notices', 'Popovers', 'Radios', 'Skeletons',
              'Tabs', 'Toasts', 'Toggles', 'Tooltips'],
          },
        ]);
        if (this.inputValues.category === 'No') {
          this.inputValues = await this.prompt([
            {
              type: 'input',
              name: 'category',
              message: 'enter the name of the new category it should belong in, or skip to put it in the root: ',
              default: '',
            },
          ]);
        }
        this.category = this.inputValues.category;
        this.subfolder = this.inputValues.category ? _.snakeCase(this.inputValues.category) : '';
      }

      this.inputValues = await this.prompt([
        {
          type: 'input',
          name: 'componentName',
          message: `What is the name of your new component? (PascalCase, prefix with ${prefix}):`,
          default: `${prefix}Component`,
        },
      ]);
      valid = true;
      // validate starts with prefix
      if (!_.startsWith(this.inputValues.componentName, prefix)) {
        valid = false;
        this.log(`Error: name must start with ${prefix}`);
      }
      // validate pascal case
      if (!this.inputValues.componentName.match(/^([A-Z][a-z]+)+$/)) {
        valid = false;
        this.log('Error: name must be in PascalCase');
      }
    } while (!valid);

    // convert to snake case and remove the 'dt' as we don't use it in the filename
    this.fileName = _.snakeCase(this.inputValues.componentName.slice(this.isRecipe ? 8 : 2));
    this.componentNameKebab = _.kebabCase(this.inputValues.componentName);
    this.componentName = this.inputValues.componentName;
    this.destinationFolder = this.isRecipe
      ? `./recipes/${this.subfolder}${this.subfolder ? '/' : ''}${this.fileName}`
      : `./components/${this.fileName}`;
  }

  writing () {
    const params = {
      componentName: this.componentName,
      componentNameKebab: this.componentNameKebab,
      fileName: this.fileName,
      isRecipe: this.isRecipe,
      category: this.category,
    };
    this.fs.copyTpl(
      this.templatePath('component.ejs'),
      `${this.destinationFolder}/${this.fileName}.vue`,
      params,
    );

    this.fs.copyTpl(
      this.templatePath('index.ejs'),
      `${this.destinationFolder}/index.js`,
      params,
    );

    this.fs.copyTpl(
      this.templatePath('constants.ejs'),
      `${this.destinationFolder}/${this.fileName}_constants.js`,
      params,
    );

    this.fs.copyTpl(
      this.templatePath('mdx.ejs'),
      `${this.destinationFolder}/${this.fileName}.mdx`,
      params,
    );

    this.fs.copyTpl(
      this.templatePath('test.ejs'),
      `${this.destinationFolder}/${this.fileName}.test.js`,
      params,
    );

    this.fs.copyTpl(
      this.templatePath('stories.ejs'),
      `${this.destinationFolder}/${this.fileName}.stories.js`,
      params,
    );

    let storyName = 'Default';
    this.fs.copyTpl(
      this.templatePath('story.ejs'),
      `${this.destinationFolder}/${this.fileName}_${_.snakeCase(storyName)}.story.vue`,
      { ...params, storyName },
    );

    storyName = 'Variants';
    this.fs.copyTpl(
      this.templatePath('story.ejs'),
      `${this.destinationFolder}/${this.fileName}_${_.snakeCase(storyName)}.story.vue`,
      { ...params, storyName },
    );
  }
};
