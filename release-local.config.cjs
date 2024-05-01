/* eslint-disable no-template-curly-in-string */
const name = 'dialtone';
const srcRoot = `.`;

/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  extends: 'release.config.base.js',
  ci: false,
  pkgRoot: srcRoot,
  tagFormat: name + '/v${version}',
  commitPaths: [`${srcRoot}/*`],
  assets: [
    `${srcRoot}/CHANGELOG.md`,
    `${srcRoot}/CHANGELOG.json`,
    `${srcRoot}/package.json`,
    `${srcRoot}/pnpm-lock.yaml`,
  ],
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'angular',
      releaseRules: [
        { type: 'refactor', release: 'patch' },
      ],
    }],
    ['@semantic-release/release-notes-generator', {
      config: '@dialpad/conventional-changelog-angular',
    }],
    ['@dialpad/semantic-release-changelog-json', {
      changelogFile: `${srcRoot}/CHANGELOG.md`,
      changelogJsonFile: `${srcRoot}/CHANGELOG.json`,
    }],
    ['@semantic-release/changelog', { changelogFile: `${srcRoot}/CHANGELOG.md` }],
    ['@semantic-release/npm', { npmPublish: false }],
    ['@semantic-release/git', {
      message: `chore(release): NO-JIRA ${name}` +
        '/v${nextRelease.version}\n\n${nextRelease.notes}',
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
