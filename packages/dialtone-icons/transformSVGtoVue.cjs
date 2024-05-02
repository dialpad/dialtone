const fs = require('node:fs');
const _ = require('lodash');

(function () {
  /**
   * ICONS BUILD
   */

  if (!fs.existsSync('./src/icons')) fs.mkdirSync('./src/icons');

  fs.readdir('./dist/svg/icons', function (err, fileNames) {
    if (err) {
      console.log(err);
      return -1;
    }

    fileNames.forEach(function (fileName) {
        const svgContent = fs.readFileSync(`./dist/svg/icons/${fileName}`, 'utf8');
        const template = fs.readFileSync('./src/IconTemplate.vue', 'utf8');
        const iconName = `dt-icon-${fileName.replace('.svg', '')}`.toLowerCase()
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

        let result = template.replace('__SVG_CONTENT__', svgContent);
        result = result.replaceAll('__ICON_NAME__', iconName);

        // result = result.replace('<svg', '<svg :aria-label="ariaLabel" :class="[iconSizeClass]"')
        result = result.replace('<svg', '<svg :aria-label="ariaLabel" :class="iconSizeClass"')

        result = result.replace('aria-hidden="true"', ':aria-hidden="ariaHidden"')

        // Create unique IDs
        result = result.replace(/(clip-path|fill)="url\(#([^)]+)\)"/g, ':$1="`url(#${uniqueID}$2)`"')
        result = result.replace(/(clipPath|linearGradient|radialGradient) id="([^"]+)"/g, '$1 :id="`${uniqueID}$2`"')

        if (!/\${uniqueID}/g.test(result)) {
          // Remove created function if not needed
          result = result.replace(/\n\s+this.uniqueID.*;/, '');
          result = result.replace(/import \{ getUniqueString \} from '\.\.\/utils';\n+/, '');
        }

        fs.writeFileSync(`./src/icons/${fileName.replace('.svg', '.vue')}`, result, 'utf8');
    })
  })

  /**
   * ILLUSTRATIONS BUILD
   */

  if (!fs.existsSync('./src/illustrations')) fs.mkdirSync('./src/illustrations');

  fs.readdir('./dist/svg/illustrations', function (err, fileNames) {
    if (err) {
      console.log(err);
      return -1;
    }

    fileNames.forEach(function (fileName) {
        const svgContent = fs.readFileSync(`./dist/svg/illustrations/${fileName}`, 'utf8');
        const template = fs.readFileSync('./src/IllustrationTemplate.vue', 'utf8');
        const illustrationName = `dt-illustration-${fileName.replace('.svg', '')}`.toLowerCase()
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

        let result = template.replace('__SVG_CONTENT__', svgContent);
        result = result.replaceAll('__ILLUSTRATION_NAME__', illustrationName);

        result = result.replace('<svg', '<svg :aria-label="ariaLabel"')

        result = result.replace('aria-hidden="true"', ':aria-hidden="ariaHidden"')

        // Create unique IDs
        result = result.replace(/(clip-path|fill)="url\(#([^)]+)\)"/g, ':$1="`url(#${uniqueID}$2)`"')
        result = result.replace(/(clipPath|linearGradient|radialGradient) id="([^"]+)"/g, '$1 :id="`${uniqueID}$2`"')

        if (!/\${uniqueID}/g.test(result)) {
          // Remove created function if not needed
          result = result.replace(/\n\s+this.uniqueID.*;/, '');
          result = result.replace(/import \{ getUniqueString \} from '\.\.\/utils';\n+/, '');
        }

        fs.writeFileSync(`./src/illustrations/${fileName.replace('.svg', '.vue')}`, result, 'utf8');
    })
  })

})();

