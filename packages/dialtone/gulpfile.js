/* eslint-disable max-lines */
//
//  ================================================================================
//  @  SETTINGS
//     Turn different build features on/off
//  ================================================================================
const settings = {
  clean: true, // Turn on/off clean tasks
  scripts: true, // Turn on/off script tasks
  styles: true, // Turn on/off style tasks
  svgs: true, // Turn on/off SVG tasks
  patterns: true, // Turn on/off SVG Pattern tasks
  spot: true, // Turn on/off SVG spot illustration tasks
  fonts: true, // Turn on/off webfonts
  favicons: false, // Turn on/off Favicons tasks
  sync: true, // Turn on/off sync tasks
  build: true, // Turn on/off build tasks
  watch: true, // Turn on/off watch tasks
};

//  ================================================================================
//  @@  RESPONSIVE CLASSES GENERATION
//  ================================================================================
//  -- BREAK POINTS
const breakpoints = [
  { prefix: 'sm\\:', mediaQuery: '(max-width: 480px)' },
  { prefix: 'md\\:', mediaQuery: '(max-width: 640px)' },
  { prefix: 'lg\\:', mediaQuery: '(max-width: 980px)' },
  { prefix: 'xl\\:', mediaQuery: '(max-width: 1264px)' },
];
//  -- CLASSES
const classes = [
  /\.d-d-(flex|none|block)$/, // Display Flex, None and Block
  '.d-t0',
  /\.d-p[t|r|l|b]([0-9]*|-unset)$/, // Padding Top and Right
  '.d-fd-column',
  '.d-ai-stretch',
  '.d-ps-relative',
  /\.d-mx([0-9]*|-(auto|unset))$/, // Margin X
  /\.d-g-cols[0-9]*$/, // Grid columns
  /\.d-(stack|flow|h|w|fs-)[0-9]*$/, // Stack, Flow, Height, Widths and Font sizes
  '.d-w100p',
  /\.d-wmx(-(auto|unset)|[0-9]*(ch|p))$/, // Max widths
];

//  ================================================================================
//  @  PACKAGES
//     What makes everything go
//  ================================================================================
//  @@ GENERAL
const { src, dest, watch, series, parallel } = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const cache = require('gulp-cached');
const through2 = require('through2');
const argv = require('yargs').argv;

//  @@ STYLES
const postCSS = settings.styles ? require('gulp-postcss') : null;
// crawls .less dependencies for incremental building
const postCSSNano = settings.styles ? require('cssnano') : null;
const less = settings.styles ? require('gulp-less') : null;
const postCSSResponsify = settings.styles
  ? require('@dialpad/postcss-responsive-variations')({ breakpoints, classes })
  : null;
const postCSSDialtoneGenerator = settings.styles ? require('./postcss/dialtone-generators') : null;
const sourcemaps = settings.styles ? require('gulp-sourcemaps') : null;
const autoprefixer = settings.styles ? require('autoprefixer') : null;

//  @@ SVGS
const path = settings.svgs ? require('path') : null;
const svgmin = settings.svgs ? require('gulp-svgmin') : null;
const replace = settings.svgs ? require('gulp-replace') : null;
const svgStrokeToFill = settings.svgs ? require('./svg-stroke-to-fill') : null;
const categories = [
  'alerts',
  'arrows',
  'brand',
  'communications',
  'controls',
  'data',
  'devices',
  'editing',
  'general',
  'os',
  'people',
  'places',
  'time',
  'weather',
];

//  @@ FAVICONS
// var favicon = settings.favicons ? require('gulp-favicons') : null;

//  @@ BUILD
const cp = settings.build ? require('child_process') : null;

//  ================================================================================
//  @  PATHS
//     Where everything is in this project
//  ================================================================================
const paths = {
  clean: {
    libCss: './lib/dist/css/**/*',
    libSvg: './lib/dist/svg/**/*',
    libVueIcons: './lib/dist/vue/**/*',
    libFonts: './dist/fonts/**/*',
    libJS: './lib/dist/js/**/*.{mjs,js}',
  },
  scripts: {
    input: './lib/build/js/**/*',
    output: './lib/dist/js/',
  },
  styles: {
    inputLib: './lib/build/less/dialtone.less',
    outputLib: './lib/dist/css/',
  },
  svgs: {
    sysInput: './lib/build/svg/system/**/*.svg',
    sysOutputLib: './lib/dist/svg/system/',
    brandInput: './lib/build/svg/brand/**/*.svg',
    brandOutputLib: './lib/dist/svg/brand/',
    outputVue: './lib/dist/vue/icons/',
    newInputRoot: './newIcons',
    newOutputRoot: './lib/build/svg/v7',
  },
  version7: {
    input: './lib/build/svg/v7/**/*.svg',
    outputLib: './lib/dist/svg/v7/',
    outputVue: './lib/dist/vue/v7/',
  },
  patterns: {
    input: './lib/build/svg/patterns/**/*.svg',
    outputLib: './lib/dist/svg/patterns/',
    outputVue: './lib/dist/vue/patterns/',
  },
  spot: {
    input: './lib/build/svg/spot/**/*.svg',
    outputLib: './lib/dist/svg/spot/',
    outputVue: './lib/dist/vue/spot/',
  },
  favicons: {
    dpName: 'Dialpad',
    dpBgColor: '#FFFFFF',
    dpInput: './lib/build/favicons/dialpad/',
    dpOutput: './lib/dist/favicons/dialpad/',
    ucInput: './lib/build/favicons/uberconference/',
    ucOutput: './lib/dist/favicons/uberconference/',
    docsInput: './lib/build/favicons/',
    docsOutput: './docs/assets/images/favicons/',
    docsIcon: 'favicon-dialtone__512.png',
    dp: 'favicon__512.png',
    dpNotify: 'favicon-notification__512.png',
    dpBeta: 'favicon-beta__512.png',
    dpBetaNotify: 'favicon-beta-notification__512.png',
    dpCsr: 'favicon-csr__512.png',
    dpStaging: 'favicon-staging__512.png',
    dpStagingNotify: 'favicon-staging-notification__512.png',
    uc: 'favicon-uberconference__512.png',
  },
  fonts: {
    input: './lib/build/fonts/*.woff2',
    outputLib: './lib/dist/fonts/',
    outputDocs: './docs/.vuepress/public/fonts/',
  },
  mobile: {
    output: './lib/dist/ios/',
  },
  watch: {
    lib: './lib/build/less/**/*',
  },
};

//  ================================================================================
//  @   TASKS
//      Where everything happens
//  ================================================================================
//  @@  CLEAN UP
//  ================================================================================
//  --  Function to clean out folders / files
const cleanUp = () => {
  // Make sure the feature is active before running
  if (!settings.clean) return;

  const items = Object.values(paths.clean);

  // Clean dist folders
  return Promise.all([
    del.sync(items),
  ]);
};

const libScripts = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.scripts) return done();

  //  Compile library files
  return src(paths.scripts.input)
    .pipe(dest(paths.scripts.output));
};

//  ================================================================================
//  @@  COMPILE CSS
//      Lint, minify, and concatenate style files
//  ================================================================================
//  --  LIBRARY FILES
const libStyles = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.styles) return done();

  //  Compile library files
  return src(paths.styles.inputLib)
    .pipe(less()) // compile less to css
    .pipe(replace('../../fonts/', '../fonts/'))
    .pipe(postCSS([postCSSDialtoneGenerator, postCSSResponsify]))
    .pipe(postCSS([autoprefixer()]))
    .pipe(dest(paths.styles.outputLib))
    .pipe(postCSS([postCSSNano]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.styles.outputLib));
};

const libStylesDev = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.styles) return done();

  //  Compile library files
  return src(paths.styles.inputLib)
    .pipe(sourcemaps.init())
    .pipe(less()) // compile less to css
    .pipe(postCSS([postCSSDialtoneGenerator, postCSSResponsify]))
    .pipe(postCSS([autoprefixer()]))
    .pipe(sourcemaps.mapSources(function (sourcePath) {
      return '../../build/less/' + sourcePath;
    }))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.styles.outputLib));
};

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
// TODO: Remove this scripts once old icon set is deprecated
const buildSystemSVGs = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.svgs) return done();

  //  Compile system icons
  return src(paths.svgs.sysInput)
    .pipe(cache('buildSystemSVGs'))
    .pipe(replace(' fill="none"', ''))
    .pipe(replace(' fill="#000"', ''))
    .pipe(replace(' fill="#000000"', ''))
    .pipe(replace(' fill="#0D0C0F"', ''))
    .pipe(replace(' fill="black"', ''))
    .pipe(replace(' fill="#141721"', ''))
    .pipe(replace('<svg width="24" height="24"', '<svg '))
    .pipe(replace('<svg', function (match) {
      const name = path.parse(this.file.path).name;
      const converted = name.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
      });
      const title = name
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/[-]+/g, ' ');

      return `${match}
      aria-hidden="true"
      focusable="false"
      aria-label="${title}"
      class="d-svg d-svg--system d-svg__${converted}"`;
    }))
    .pipe(svgmin())
    .pipe(dest(paths.svgs.sysOutputLib))
    .pipe(replace('<svg', '<template>\n  <svg'))
    .pipe(replace('</svg>', '</svg>\n</template>'))
  // move any style tags within the svg into style tags of the vue component
    .pipe(through2.obj(moveStyleTagsToEOF))
    .pipe(replace('<style>', '<style scoped>'))
    .pipe(rename(function (file) {
      const converted = file.basename.replace(/\b\S/g, t => t.toUpperCase()).replace(/[-]+/g, '');

      file.basename = 'Icon' + converted;
      file.extname = '.vue';
    }))
    .pipe(dest(paths.svgs.outputVue));
};

const buildBrandSVGs = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.svgs) return done();
  //  Compile brand icons
  return src(paths.svgs.brandInput)
    .pipe(cache('buildBrandSVGs'))
    .pipe(replace('<svg width="24" height="24"', '<svg '))
    .pipe(replace('<svg', function (match) {
      const name = path.parse(this.file.path).name;
      const converted = name.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
      });
      const title = name
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/[-]+/g, ' ');

      return `${match}
      aria-hidden="true"
      focusable="false"
      aria-label="${title}"
      class="d-svg d-svg--native d-svg__${converted}"`;
    }))
    .pipe(svgmin())
    .pipe(dest(paths.svgs.brandOutputLib))
    .pipe(replace('<svg', '<template>\n  <svg'))
    .pipe(replace('</svg>', '</svg>\n</template>'))
  // move any style tags within the svg into style tags of the vue component
    .pipe(through2.obj(moveStyleTagsToEOF))
    .pipe(replace('<style>', '<style scoped>'))
    .pipe(rename(function (file) {
      const converted = file.basename.replace(/\b\S/g, t => t.toUpperCase()).replace(/[-]+/g, '');
      file.basename = 'Icon' + converted;
      file.extname = '.vue';
    }))
    .pipe(dest(paths.svgs.outputVue));
};

const buildPatternSVGs = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.patterns) return done();

  //  Compile system icons
  return src(paths.patterns.input)
    .pipe(cache('buildPatternSVGs'))
    .pipe(replace('<svg', function (match) {
      const name = path.parse(this.file.path).name;
      const converted = name.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
      });
      const title = name
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/[-]+/g, ' ');

      return `${match}
      aria-hidden="true"
      focusable="false"
      aria-label="${title}"
      class="d-svg d-svg--pattern d-svg__${converted}"
      xmlns="http://www.w3.org/2000/svg"`;
    }))
    .pipe(svgmin())
    .pipe(dest(paths.patterns.outputLib))
    .pipe(replace('<svg', '<template>\n  <svg'))
    .pipe(replace('</svg>', '</svg>\n</template>'))
  // move any style tags within the svg into style tags of the vue component
    .pipe(through2.obj(moveStyleTagsToEOF))
    .pipe(replace('<style>', '<style scoped>'))
    .pipe(rename(function (file) {
      const converted = file.basename
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/[-]+/g, '');

      file.basename = 'Pattern' + converted;
      file.extname = '.vue';
    }))
    .pipe(dest(paths.patterns.outputVue));
};

const buildSpotIllustrationSVGs = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.spot) return done();
  //  Compile system icons
  return src(paths.spot.input)
    .pipe(cache('buildSpotIllustrationSVGs'))
    // replace any instances of the primary color in SVG with the theme class
    .pipe(replace('<svg', function (match) {
      const name = path.parse(this.file.path).name;
      const converted = name.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
      });
      const title = name
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/[-]+/g, ' ');

      return `${match}
      aria-hidden="true"
      focusable="false"
      aria-label="${title}"
      class="${converted}"
      xmlns="http://www.w3.org/2000/svg"`;
    }))
    .pipe(svgmin())
    .pipe(dest(paths.spot.outputLib))
    .pipe(replace('<svg', '<template>\n  <svg'))
    .pipe(replace('</svg>', '</svg>\n</template>'))
  // move any style tags within the svg into style tags of the vue component
    .pipe(through2.obj(moveStyleTagsToEOF))
    .pipe(replace('<style>', '<style scoped>'))
    .pipe(rename(function (file) {
      const converted = file.basename
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/[-]+/g, '');

      file.basename = 'Spot' + converted;
      file.extname = '.vue';
    }))
    .pipe(dest(paths.spot.outputVue));
};

//  ================================================================================
//  @@  FONTS
//  ================================================================================
const webfonts = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.fonts) return done();

  return src(paths.fonts.input)
    .pipe(cache('webfonts'))
    .pipe(dest(paths.fonts.outputLib))
    .pipe(dest(paths.fonts.outputDocs));
};

//  ================================================================================
//  @@  BUILD SITE
//  ================================================================================
const buildDocs = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.build) return done();

  return cp.spawn(
    'vuepress', [
      'build',
            `docs`,
    ], {
      stdio: 'inherit',
      env: { ...process.env, VUEPRESS_BASE_URL: argv.deploySubdir ?? '/' },
    },
  );
};

// copies the .nojekyll file to the output directory.
// this is necessary to get around a problem with github pages where files starting with _ are not served.
const copyNoJekyll = function (done) {
  return src('./.nojekyll')
    .pipe(dest('docs/.vuepress/dist'));
};

const watchDocs = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.watch) return done();

  return cp.spawn(
    'vuepress', [
      'dev',
      'docs',
    ], {
      stdio: 'inherit',
      env: { ...process.env },
    },
  );
};

//  ================================================================================
//  @@  WATCH CHANGES
//  ================================================================================
const watchFiles = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.watch) return done();

  //  Watch files
  watch([
    paths.watch.lib,
  ], series(exports.buildWatch));
  done();
};

//  ================================================================================
//  @@  NEW ICONS BUILD PROCESS
//  ================================================================================
const transformStrokeToFill = function (done) {
  const promises = [];

  categories.forEach(category => {
    promises
      .push(
        svgStrokeToFill
          .transform(
              `${paths.svgs.newInputRoot}/${category}/`,
              `${paths.svgs.newOutputRoot}/${category}/`,
              { traceResolution: 600, showProgressBar: true },
          ),
      );
  });

  Promise
    .all(promises)
    .then(() => done());
};

const buildNewSVGIcons = function (done) {
  //  Make sure this feature is activated before running
  if (!settings.svgs) return done();

  //  Compile icons
  return src(paths.version7.input)
    .pipe(cache('buildNewSVGIcons'))
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
    .pipe(dest(paths.version7.outputLib))
    .pipe(replace('<svg', '<template>\n  <svg'))
    .pipe(replace('</svg>', '</svg>\n</template>'))
  // move any style tags within the svg into style tags of the vue component
    .pipe(through2.obj(moveStyleTagsToEOF))
    .pipe(replace('<style>', '<style scoped>'))
    .pipe(rename(function (file) {
      file.basename = file.basename
        .replace(/\b\S/g, t => t.toUpperCase())
        .replace(/-+/g, '');
      file.extname = '.vue';
    }))
    .pipe(dest(paths.version7.outputVue));
};

//  ================================================================================
//  @   EXPORT TASKS
//  ================================================================================
//  --  BUILD OUT THE SITE BUT DON'T START THE SERVER

exports.clean = series(
  cleanUp,
);

exports.svg = series(
  buildSystemSVGs,
  buildBrandSVGs,
  buildPatternSVGs,
  buildSpotIllustrationSVGs,
  buildNewSVGIcons,
);

// default build task
exports.default = series(
  exports.clean,
  webfonts,
  exports.svg,
  libStyles,
  libScripts,
);

// tasks are similar to default build when we are watching but there are some
// differences. We use caching, and do not postprocess/minify for build performance gains. Also set the env
exports.buildWatch = series(
  webfonts,
  exports.svg,
  libStylesDev,
);

// build and run the gulp watch.
exports.watch = series(
  exports.clean,
  exports.buildWatch,
  parallel(
    watchFiles,
    watchDocs,
  ),
);

// build the library and docsite
exports.docsite = series(
  exports.clean,
  webfonts,
  exports.svg,
  libStyles,
  buildDocs,
  copyNoJekyll,
);

//  --  CONVERT WEBFONTS
exports.fonts = series(
  webfonts,
);
// NEW ICONS BUILD PROCESS
exports.icons = series(
  transformStrokeToFill,
  buildNewSVGIcons,
);

//  --  GENERATES ALL DIALPAD / UC FAVICONS
// exports.favicons = series(
//     cleanFavicons,
//     faviconDp,
//     faviconDpNotify,
//     faviconDpBeta,
//     faviconDpBetaNotify,
//     faviconDpCsr,
//     faviconDpStaging,
//     faviconDpStagingNotify,
//     faviconDialtone,
//     faviconUberConference,
// );
