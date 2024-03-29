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
    root: './package.json',
    css: {
      base: './packages/dialtone-css',
      files: [
        './packages/dialtone-css/lib/dist/**',
        './packages/dialtone-css/package.json'
      ]
    },
    icons: {
      base: './packages/dialtone-icons',
      files: [
        './packages/dialtone-icons/dist/**',
        './packages/dialtone-icons/vue2/dist/**',
        './packages/dialtone-icons/vue3/dist/**',
        './packages/dialtone-icons/package.json'
      ]
    },
    tokens: {
      base: './packages/dialtone-tokens',
      files: [
        './packages/dialtone-tokens/dist/**',
        './packages/dialtone-tokens/package.json',
      ]
    },
    vue2: {
      base: './packages/dialtone-vue2',
      files: [
        './packages/dialtone-vue2/dist/**',
        './packages/dialtone-vue2/package.json',
      ],
    },
    vue3: {
      base: './packages/dialtone-vue3',
      files: [
        './packages/dialtone-vue3/dist/**',
        './packages/dialtone-vue3/package.json',
      ],
    },
    'eslint-plugin': {
      base: './packages/eslint-plugin-dialtone',
      files: [
        './packages/eslint-plugin-dialtone/lib/**',
        './packages/eslint-plugin-dialtone/package.json',
      ],
    },
    'stylelint-plugin': {
      base: './packages/stylelint-plugin-dialtone',
      files: [
        './packages/stylelint-plugin-dialtone/lib/**',
        './packages/stylelint-plugin-dialtone/package.json',
      ],
    },
  },
  output: {
    root: './dist',
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

    src(inputGlobs, {base})
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
