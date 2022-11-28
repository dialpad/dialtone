//
//  ================================================================================
//  @  SETTINGS
//     Turn different build features on/off
//  ================================================================================
const settings = {
  clean: true, // Turn on/off clean tasks
  svgs: true, // Turn on/off SVG tasks
  build: true, // Turn on/off build tasks
  exportIcons: true, // Turn on/off export icons tasks
  iconList: true, // Turn on/off icon list tasks
};

//  ================================================================================
//  @  PACKAGES
//     What makes everything go
//  ================================================================================
//  @@ GENERAL
const { src, dest, series } = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const through2 = require('through2');
const fs = require("fs");

//  @@ SVGS
const path = settings.svgs ? require('path') : null;
const svgmin = settings.svgs ? require('gulp-svgmin') : null;
const replace = settings.svgs ? require('gulp-replace') : null;

//  ================================================================================
//  @  PATHS
//     Where everything is in this project
//  ================================================================================
const paths = {
  clean: {
    svgs: './dist/svg/**/*.svg',
    vueIcons: './src/icons/*.vue',
  },
  icons: {
    input: './src/svg/**/*.svg',
    outputSvg: './dist/svg/',
    outputVue: './src/icons/',
  },
  exports: {
    vueIcons: './src/icons/',
    index: './src/icons.js',
    iconsList: './src/icons.json',
  }
};

//  ================================================================================
//  @   TASKS
//      Where everything happens
//  ================================================================================
//  @@  CLEAN UP
//  ================================================================================
//  --  Function to clean out folders / files
const cleanUp = (items) => {
  // Make sure the feature is active before running
  if (!settings.clean) return;

  // Clean dist folders
  return Promise.all([
    del.sync(items),
  ]);
};

//  --  Clean out SVGs
const cleanSVGs = () => {
  return cleanUp([paths.clean.svgs]);
};

//  --  Clean out Vue icons
const cleanVueIcons = () => {
  return cleanUp([paths.clean.vueIcons]);
};

//  ================================================================================
//  @@  COMPILE CSS
//      Lint, minify, and concatenate style files
//  ================================================================================
const moveStyleTagsToEOF = function (file, enc, cb) {
  if (file.isBuffer()) {
    const styleTagsRegex = /<style[\s\S]*<\/style>/gmi;
    let code = file.contents.toString();
    const result = styleTagsRegex.exec(code);
    if (!result) return cb(null, file);
    const matchedText = result[0];
    code = code.replace(styleTagsRegex, '');
    code = code + matchedText;
    file.contents = Buffer.from(code);
  }
  return cb(null, file);
};

//  ================================================================================
//  @@  COMPILE SVGS
//      Lint and optimize SVG files
//  ================================================================================
const buildIcons = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.svgs) return done();

  //  Compile icons
  return src(paths.icons.input)
    .pipe(replace(' fill="none"', ''))
    .pipe(replace(' fill="#000"', ' fill="currentColor"'))
    .pipe(replace(' fill="#000000"', ' fill="currentColor"'))
    .pipe(replace(' fill="black"', ' fill="currentColor"'))
    .pipe(replace('width="12" height="12"', ''))
    .pipe(replace('<svg', function (match) {
      const name = path.parse(this.file.path).name;
      const converted = name.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
      });
      const title = name
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/-+/g, ' ');
      return `${match}
      aria-hidden="true"
      focusable="false"
      data-name="${title}"
      class="d-icon d-icon--${converted}"
      xmlns="http://www.w3.org/2000/svg"`;
    }))
    .pipe(svgmin())
    .pipe(rename({ dirname: '' }))
    .pipe(dest(paths.icons.outputSvg))
    .pipe(replace('<svg', '<template><svg'))
    .pipe(replace('</svg>', '</svg></template>'))
  // move any style tags within the svg into style tags of the vue component
    .pipe(through2.obj(moveStyleTagsToEOF))
    .pipe(replace('<style>', '<style scoped>'))
    .pipe(rename(function (file) {
      file.basename = file.basename
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/-+/g, '');
      file.extname = '.vue';
    }))
    .pipe(dest(paths.icons.outputVue));
};

//  ================================================================================
// @@ Build the main.js file
//    Read the vue icon files and export them all
//  ================================================================================
const exportIcons = async function (done) {
  if (!settings.exportIcons) return done();

  const iconsList = fs
      .readdirSync(paths.exports.vueIcons)
      .map(icon => {
        const iconName = icon.split('.')[0];
        return `export { default as ${iconName} } from './icons/${icon}'`;
      });
  await fs.writeFileSync('./src/main.js', iconsList.join('\n'));
  return done();
};

//  ================================================================================
//  @@ Copy icons.json to dist
//  ================================================================================
const copyFiles = function (done) {
  src(paths.exports.iconsList)
      .pipe(dest('./dist'));
  return done();
};

//  ================================================================================
//  @   EXPORT TASKS
//  ================================================================================
//  --  BUILD OUT THE SITE BUT DON'T START THE SERVER

exports.clean = series(
  cleanSVGs,
  cleanVueIcons,
);

exports.icons = series(
  buildIcons,
  exportIcons,
  copyFiles,
);

// default build task
exports.default = series(
  exports.clean,
  exports.icons,
);
