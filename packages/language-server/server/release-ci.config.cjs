/* eslint-disable no-template-curly-in-string */
const srcRoot = 'packages/language-server/server';

/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  pkgRoot: srcRoot,
  tagFormat: 'language-server/v${version}',
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
    ['@semantic-release/changelog', { changelogFile: `${srcRoot}/CHANGELOG.md` }],
    ['@dialpad/semantic-release-changelog-json', {
      changelogFile: `${srcRoot}/CHANGELOG.md`,
      changelogJsonFile: `${srcRoot}/CHANGELOG.json`,
    }],
    ['@semantic-release/npm', { npmPublish: false }],
    ['@semantic-release/git', {
      assets: [
        `${srcRoot}/CHANGELOG.md`,
        `${srcRoot}/CHANGELOG.json`,
        `${srcRoot}/package.json`,
      ],
      message: 'chore(release): NO-JIRA language-server/v${nextRelease.version}\n\n${nextRelease.notes}',
    }],
  ],
  branches: [
    'staging',
    'next',
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
