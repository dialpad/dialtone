const fs = require('node:fs');
const parser = require('svg-parser');

function transformToVue(svg, fileName) {
  let clonedSVG = JSON.parse(JSON.stringify(svg));
  const renderFunction = `return () => ${extractHTMLElements(svg)}`;
  const vueSFCTemplate = fs.readFileSync('./src/IconTemplate.vue', 'utf8');
  const result = vueSFCTemplate.replace('/*SVG_RENDER_FUNCTION*/', renderFunction)
  fs.writeFileSync(`./src/icons/${fileName.replace('.svg', '.vue')}`, result, 'utf8');
}

function extractHTMLElements(el) {
  const children = [];

  while (el.children.length > 0) {
    const child = el.children.shift();
    children.push(extractHTMLElements(child));
  }

  if (el.properties.hasOwnProperty('clip-path')) el.properties['clip-path'] = '`url(#${uniqueID})`';
  if (el.properties.hasOwnProperty('id')) el.properties['id'] = '`${uniqueID}`';

  const attrs = JSON.stringify(el.properties).replace(/"`|`"/g, "`");

  return `h('${el.tagName}', (isVue3 ? ${attrs} : {attrs: ${attrs}}) ${children.length > 0 ? `,[${children}])` : ')'}`;
}

(function () {
  if (!fs.existsSync('./src/icons')) fs.mkdirSync('./src/icons');

  fs.readdir('./dist/svg', function (err, fileNames) {
    if (err) {
      console.log(err);
      return -1;
    }

    fileNames.forEach(function (fileName) {
      const svgContent = fs.readFileSync(`./dist/svg/${fileName}`, 'utf8');
      const root = parser.parse(svgContent);
      transformToVue(root.children[0], fileName);
    })
  })
})();

