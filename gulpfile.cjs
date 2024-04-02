//
//  ================================================================================
//  @  SETTINGS
//     Turn different build features on/off
//  ================================================================================
const settings = {
  clean: true, // Turn on/off clean tasks
};

//  ================================================================================
//  @  PACKAGES
//     What makes everything go
//  ================================================================================
//  @@ GENERAL
const { src, dest, series } = require('gulp');
const del = require('del');

//  ================================================================================
//  @  PATHS
//     Where everything is in this project
//  ================================================================================
const paths = {
  clean: {
    dist: './dist/**',
  },
  input: {
    css: './packages/dialtone-css/lib/dist/**',
    vue2: './packages/dialtone-vue2/dist/**',
    vue3: './packages/dialtone-vue3/dist/**',
    'eslint-plugin': './packages/eslint-plugin-dialtone/lib/**',
    'stylelint-plugin': './packages/stylelint-plugin-dialtone/lib/**',
  },
  output: {
    css: './dist/css',
    icons: './dist/icons',
    tokens: './dist/tokens',
    vue2: './dist/vue2',
    vue3: './dist/vue3',
    'eslint-plugin': './dist/eslint-plugin',
    'stylelint-plugin': './dist/stylelint-plugin',
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

//  --  Clean out dist folder
const cleanDist = () => {
  return cleanUp([paths.clean.dist]);
};

//  ================================================================================
//  @@ Copy packages files to ./dist
//  ================================================================================
const copyFiles = function (done) {
  Object.keys(paths.input).forEach(name => {
    const base = paths.input[name].base || '.';
    const inputGlobs = paths.input[name].files || paths.input[name];

    src(inputGlobs)
      .pipe(dest(paths.output[name]));
  });
  return done();
};

//  ================================================================================
//  @   EXPORT TASKS
//  ================================================================================
//  --  CLEAN AND COPY THE FILES

// default build task
exports.default = series(
  cleanDist,
  copyFiles,
);
