//
//  ================================================================================
//  @  SETTINGS
//     Turn different build features on/off
//  ================================================================================
const settings = {
  clean: true, // Turn on/off clean tasks
  svgs: true, // Turn on/off SVG tasks
};

//  ================================================================================
//  @  PACKAGES
//     What makes everything go
//  ================================================================================
//  @@ GENERAL
const { src, dest, series } = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const fs = require("fs");
const jsonFormat = require('gulp-json-format');
const {glob} = require("glob");
const exec = require('child_process').exec;
const _ = require('lodash');

//  @@ SVGs
const path = settings.svgs ? require('path') : null;
const svgmin = settings.svgs ? require('gulp-svgmin') : null;
const replace = settings.svgs ? require('gulp-replace') : null;
const svgListIcons = glob.sync('./src/svg/icons/**/*.svg').sort();
const svgListIllustrations = glob.sync('./src/svg/illustrations/**/*.svg').sort();

//  ================================================================================
//  @  PATHS
//     Where everything is in this project
//  ================================================================================
const paths = {
  clean: {
    dist: './dist/**/*',
    icons: './src/icons/*',
    illustrations: './src/illustrations/*',
  },
  illustrations: {
    input: './src/svg/illustrations/**/*.svg',
    outputSvg: './dist/svg/illustrations/',
  },
  icons: {
    input: './src/svg/icons/**/*.svg',
    outputSvg: './dist/svg/icons/',
  },
  exports: {
    keywordsIcons: './src/keywords-icons.json',
    keywordsIllustrations: './src/keywords-illustrations.json',
    illustrationsList: './dist/illustrations.json',
    iconsList: './dist/icons.json',
    index: './index.js',
  },
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

//  --  Clean out ./dist
const cleanDist = () => {
  return cleanUp([paths.clean.dist]);
};

//  --  Clean out ./src/icons
const cleanIcons = () => {
  return cleanUp([paths.clean.icons]);
};

//  --  Clean out ./src/illustrations
const cleanIllustrations = () => {
  return cleanUp([paths.clean.illustrations]);
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
    .pipe(replace(' fill="#0D0C0F"', ' fill="currentColor"'))
    .pipe(replace(' fill="#222"', ' fill="currentColor"'))
    .pipe(replace(' fill="#222222"', ' fill="currentColor"'))
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
  .pipe(dest(paths.icons.outputSvg));
};

const buildIllustrations = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.svgs) return done();

  //  Compile icons
  return src(paths.illustrations.input)
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
      class="d-illustration d-illustration--${name}"`;
    }))
    .pipe(rename({ dirname: '' }))
  .pipe(dest(paths.illustrations.outputSvg));
};

const transformSVGtoVue = function (done) {
  exec('node ./transformSVGtoVue.cjs', (err, stdout, stderr) => {
    console.error(stderr);
    console.log(stdout);
    done(err)
  });
};

//  ================================================================================
//  @@ Updates keywords-icons.json file with any newly added icons
//  Reads previous keywords-icons.json file to extract keywords and add any new icon
//  into the respective category.
//  ================================================================================
const updateIconsJSON = function (done) {
  const rawData = fs.readFileSync(paths.exports.keywordsIcons)
  const keywordsJSON = JSON.parse(rawData).categories;
  const iconsList = [];

  const updatedKeywords = svgListIcons.reduce((acc, file) => {
    const [category, fileName] = file.split('/').slice(-2);
    const iconName = fileName.replace('.svg', '');
    const keywords = keywordsJSON[category][iconName] || [];
    acc[category] = {...acc[category], [iconName]: keywords}

    iconsList.push(iconName);

    return acc;
  }, {});

  iconsList.sort();

  fs.writeFileSync(paths.exports.keywordsIcons, JSON.stringify({ categories: {...updatedKeywords}}));
  fs.writeFileSync(paths.exports.iconsList, JSON.stringify(iconsList));

  // Copies the icons.json and keywords-icons.json to dist/
  src([paths.exports.keywordsIcons, paths.exports.iconsList])
  .pipe(dest('./dist/'));

  // Prettifies the JSON to improve readability and easier keyword adding.
  src(paths.exports.keywordsIcons)
  .pipe(jsonFormat(2))
  .pipe(dest('./src/'));

  return done();
};

const updateIllustrationsJSON = function (done) {
  const rawData = fs.readFileSync(paths.exports.keywordsIllustrations)
  const keywordsJSON = JSON.parse(rawData).categories;
  const illustrationsList = [];

  const updatedKeywords = svgListIllustrations.reduce((acc, file) => {
    const [category, fileName] = file.split('/').slice(-2);
    const illustrationName = fileName.replace('.svg', '');
    const keywords = keywordsJSON[category][illustrationName] || [];
    acc[category] = {...acc[category], [illustrationName]: keywords}

    illustrationsList.push(illustrationName);

    return acc;
  }, {});

  illustrationsList.sort();

  fs.writeFileSync(paths.exports.keywordsIllustrations, JSON.stringify({ categories: {...updatedKeywords}}));
  fs.writeFileSync(paths.exports.illustrationsList, JSON.stringify(illustrationsList));

  // Copies the illustrations.json and keywords-illustrations.json to dist/
  src([paths.exports.keywordsIllustrations, paths.exports.illustrationsList])
  .pipe(dest('./dist/'));

  // Prettifies the JSON to improve readability and easier keyword adding.
  src(paths.exports.keywordsIllustrations)
  .pipe(jsonFormat(2))
  .pipe(dest('./src/'));

  return done();
};

const updateExports = function (done) {
  let exportsListIcons = "export const icons = import.meta.glob('./src/icons/*.vue', { eager: true, import: 'default' });";
  let exportsListIllustrations = "export const illustrations = import.meta.glob('./src/illustrations/*.vue', { eager: true, import: 'default' });";

  // svgList.forEach(file => {
  //   const fileName = file.split('/').slice(-2)[1].split('.')[0];
  //   const iconName = `dt-icon-${fileName}`.toLowerCase()
  //   .split('-')
  //   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //   .join('');
  //   exportsList += `export const ${iconName} = () => import('./src/icons/${fileName}.vue');\n`;
  // });

  fs.writeFileSync(paths.exports.index, exportsListIcons + '\n' + exportsListIllustrations);

  return done();
};

//  ================================================================================
//  @   EXPORT TASKS
//  ================================================================================
//  --  CLEAN, BUILD, EXPORT THE ICONS AND COPY THE FILES

// default build task
exports.default = series(
  cleanDist,
  cleanIcons,
  cleanIllustrations,
  buildIcons,
  buildIllustrations,
  transformSVGtoVue,
  updateIconsJSON,
  updateIllustrationsJSON,
  updateExports,
);
