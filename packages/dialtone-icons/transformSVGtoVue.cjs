const fs = require('node:fs');
const _ = require('lodash');

(function () {
  if (!fs.existsSync('./src/icons')) fs.mkdirSync('./src/icons');

  fs.readdir('./dist/svg', function (err, fileNames) {
    if (err) {
      console.log(err);
      return -1;
    }

    fileNames.forEach(function (fileName) {
      const svgContent = fs.readFileSync(`./dist/svg/${fileName}`, 'utf8');
      const template = fs.readFileSync('./src/IconTemplate.vue', 'utf8');
      const iconName = 'Icon' + _.startCase(_.camelCase(fileName.split('.')[0])).replace(/ /g, '');

      let result = template.replace('__SVG_CONTENT__', svgContent);
      result = result.replace('__ICON_NAME__', iconName)
      result = result.replace(/clip-path="url\([^)]+\)"/g, ':clip-path="`url(#${uniqueID})`"')
      result = result.replace(/clipPath id="[^"]+"/g, 'clipPath :id="uniqueID"')

      fs.writeFileSync(`./src/icons/${fileName.replace('.svg', '.vue')}`, result, 'utf8');
    })
  })
})();

