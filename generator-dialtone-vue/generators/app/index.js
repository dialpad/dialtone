const Generator = require('yeoman-generator');
const _ = require('lodash');

module.exports = class extends Generator {
  async prompting () {
    let valid;
    do {
      this.inputValues = await this.prompt([
        {
          type: 'input',
          name: 'componentName',
          message: 'What is the name of your new component? (PascalCase, prefix with Dt):',
          default: 'DtComponent',
        },
      ]);
      valid = true;
      // validate starts with Dt
      if (!_.startsWith(this.inputValues.componentName, 'Dt')) {
        valid = false;
        this.log('Error: name must start with Dt');
      }
      // validate pascal case
      if (!this.inputValues.componentName.match(/^([A-Z][a-z]+)+$/)) {
        valid = false;
        this.log('Error: name must be in PascalCase');
      }
    } while (!valid);

    // convert to snake case and remove the 'hs' as we don't use it in the filename
    this.fileName = _.snakeCase(this.inputValues.componentName.slice(2));
    this.componentNameKebab = _.kebabCase(this.inputValues.componentName);
    this.componentName = this.inputValues.componentName;
    this.destinationFolder = `./components/${this.fileName}`;
  }

  writing () {
    const params = {
      componentName: this.componentName,
      componentNameKebab: this.componentNameKebab,
      fileName: this.fileName,
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
      { ...params, storyName: storyName },
    );

    storyName = 'Variants';
    this.fs.copyTpl(
      this.templatePath('story.ejs'),
      `${this.destinationFolder}/${this.fileName}_${_.snakeCase(storyName)}.story.vue`,
      { ...params, storyName: storyName },
    );
  }
};
