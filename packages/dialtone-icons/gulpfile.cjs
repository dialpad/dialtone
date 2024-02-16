//
//  ================================================================================
//  @  SETTINGS
//     Turn different build features on/off
//  ================================================================================
const settings = {
  clean: true, // Turn on/off clean tasks
  svgs: true, // Turn on/off SVG tasks
  build: true, // Turn on/off build tasks
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
const fs = require("fs");
const jsonFormat = require('gulp-json-format');
const exec = require('child_process').exec;

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
  },
  icons: {
    input: './src/svg/**/*.svg',
    outputSvg: './dist/svg/',
  },
  exports: {
    keywords: './src/keywords.json',
    iconsList: './src/icons.json',
  },
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

const transformSVGtoVue = function (done) {
  exec('node ./transformSVGtoVue.cjs', (err, stdout, stderr) => {
    console.error(stderr);
    console.log(stdout);
    done(err)
  });
};

//  ================================================================================
//  @@ Updates keywords.json file with any newly added icons
//  Reads previous keywords.json file to extract keywords and add any new icon
//  into the respective category.
//  ================================================================================
const updateIconsJSON = function (done) {
  const rawData = fs.readFileSync(paths.exports.keywords)
  const keywordsJSON = JSON.parse(rawData).categories;
  const iconsList = [];

  const updatedKeywords = _getAllFiles('./src/svg')
      .filter(file => file.endsWith('.svg'))
      .reduce((acc, file) => {
        const [category, fileName] = file.split('/').slice(-2);
        const iconName = fileName.replace('.svg', '');
        const keywords = keywordsJSON[category][iconName] || [];
        acc[category] = {...acc[category], [iconName]: keywords}

        iconsList.push(iconName);

        return acc;
      }, {});

  iconsList.sort();

  fs.writeFileSync(paths.exports.keywords, JSON.stringify({ categories: {...updatedKeywords}}));
  fs.writeFileSync(paths.exports.iconsList, JSON.stringify(iconsList));

  // Prettifies the JSON to improve readability and easier keyword adding.
  src([paths.exports.keywords, paths.exports.iconsList])
    .pipe(jsonFormat(2))
    .pipe(dest('./src/'));

  return done();
};

//  ================================================================================
//  @@ Copy keywords.json and icons.json to dist
//  ================================================================================
const copyFiles = function (done) {
  src([paths.exports.keywords, paths.exports.iconsList])
      .pipe(dest('./dist'));
  return done();
};

//  ================================================================================
//  @   EXPORT TASKS
//  ================================================================================
//  --  CLEAN, BUILD, EXPORT THE ICONS AND COPY THE FILES

// default build task
exports.default = series(
  cleanSVGs,
  buildIcons,
  transformSVGtoVue,
  updateIconsJSON,
  copyFiles,
);
