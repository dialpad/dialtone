/* eslint-disable no-template-curly-in-string */
const name = 'dialtone-icons';
const srcRoot = `packages/${name}`;

/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  extends: 'release.config.base.js',
  pkgRoot: srcRoot,
  tagFormat: name + '/v${version}',
  commitPaths: [`${srcRoot}/*`],
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'angular',
      releaseRules: [
        { type: 'build', release: 'patch' },
        { type: 'chore', release: 'patch' },
        { type: 'ci', release: 'patch' },
        { type: 'docs', release: 'patch' },
        { type: 'refactor', release: 'patch' },
        { type: 'style', release: 'patch' },
        { type: 'test', release: 'patch' },
      ],
    }],
    ['@semantic-release/release-notes-generator', {
      config: '@dialpad/conventional-changelog-angular',
    }],
    '@semantic-release/github',
  ],
  branches: [
    'production',
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'alpha',
      prerelease: true,
    },
  ],
};
