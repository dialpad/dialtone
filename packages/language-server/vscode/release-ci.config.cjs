/* eslint-disable no-template-curly-in-string */
const name = 'vscode';
const srcRoot = `packages/language-server/${name}`;

/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  pkgRoot: srcRoot,
  tagFormat: name + '/v${version}',
  commitPaths: [`${srcRoot}/*`],
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
      assets: [
        `${srcRoot}/CHANGELOG.md`,
        `${srcRoot}/CHANGELOG.json`,
        `${srcRoot}/package.json`,
        `${srcRoot}/vscode-dialtone-` + '${nextRelease.version}.vsix',
      ],
      message: `chore(release): NO-JIRA ${name}` +
        '/v${nextRelease.version}\n\n${nextRelease.notes}',
    }],
    ['@semantic-release/github', {
      successComment: false,
      failTitle: false,
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
