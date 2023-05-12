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
const jsonFormat = require('gulp-json-format');

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
  },
  templates: {
    baseIcon: './src/baseIconTemplate.vue',
  }
};

// ====
// Util Functions
// ====
const _getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath)
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = _getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

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
  if (!file.isBuffer()) return cb(null, file);

  const styleTagsRegex = /<style[\s\S]*<\/style>/gmi;
  let content = file.contents.toString();
  const result = styleTagsRegex.exec(content);

  if (!result) return cb(null, file);

  const matchedText = result[0];
  content = content.replace(styleTagsRegex, '');
  content = content + matchedText;
  file.contents = Buffer.from(content);

  return cb(null, file);
};

const replaceTemplateContent = function (file, enc, cb) {
  if (!file.isBuffer()) return cb(null, file);

  const template = fs.readFileSync(paths.templates.baseIcon).toString();
  let content = file.contents.toString();
  content = template.replace('/*SVG-CONTENT*/', content);
  file.contents = Buffer.from(content);

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
    .pipe(replace(/<svg.*(width="[0-9]+|height="[0-9]+)"/g, (match) => {
      return match
          .replace(/width="[0-9]+"/, '')
          .replace(/height="[0-9]+"/, '');
    }))
    .pipe(replace('<svg', function (match) {
      const name = path.parse(this.file.path).name;
      const title = name
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/-+/g, ' ');
      return `${match}
      aria-hidden="true"
      focusable="false"
      role="img"
      data-name="${title}"
      class="d-icon d-icon--${name}"`;
    }))
    .pipe(svgmin(function getOptions () {
      return {
        multipass: true,
        plugins: [
          {
            removeUnknownsAndDefaults: {
              keepRoleAttr: true,
            },
          },
          {
            cleanupIDs: {
              minify: true,
            },
          }
        ],
      }
    }))
    .pipe(rename({ dirname: '' }))
    .pipe(dest(paths.icons.outputSvg))
    .pipe(replace(/(clip-path|fill|mask|filter)="url\(#[a-z]\)"/g, (match) => {
      return ':'+ match
          .replace(/url\(#[a-z]\)/, (match) => `\`${match}\``)
          .replace(/#[a-z]/, (id) => '#${uniqueID}__' + id.charAt(1))
    }))
    .pipe(replace(/id="[a-z]"/g, (match) => {
      const oldID = /"[a-z]"/.exec(match)[0].charAt(1);
      return `:id="\`\${uniqueID}__${oldID}\`"`;
    }))
    // replace the SVG content into the vue template
    .pipe(through2.obj(replaceTemplateContent))
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
//  @@ Updates icons.json file with any newly added icons
//  Reads previous icons.json file to extract keywords and add any new icon
//  into the respective category.
//  ================================================================================
const updateIconsJSON = function (done) {
  const rawData = fs.readFileSync(paths.exports.iconsList)
  const iconsJSON = JSON.parse(rawData).categories;

  const result = _getAllFiles('./src/svg')
      .filter(file => file.endsWith('.svg'))
      .reduce((acc, file) => {
        const [category, fileName] = file.split('/').slice(-2);
        const iconName = fileName.replace('.svg', '');
        const keywords = iconsJSON[category][iconName] || [];
        acc[category] = {...acc[category], [iconName]: keywords}
        return acc;
      }, {});

  fs.writeFileSync(paths.exports.iconsList, JSON.stringify({ categories: {...result}}));

  // Prettifies the JSON to improve readability and easier keyword adding.
  src(paths.exports.iconsList)
    .pipe(jsonFormat(2))
    .pipe(dest('./src/'));

  return done();
};

//  ================================================================================
//  @   EXPORT TASKS
//  ================================================================================
//  --  CLEAN, BUILD, EXPORT THE ICONS AND COPY THE FILES

// default build task
exports.default = series(
  cleanSVGs,
  cleanVueIcons,
  buildIcons,
  exportIcons,
  updateIconsJSON,
  copyFiles,
);
