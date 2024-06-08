/* eslint-disable no-template-curly-in-string */
const name = 'dialtone-tokens';
const srcRoot = `packages/${name}`;

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
      ],
      message: `chore(release): NO-JIRA ${name}` +
        '/v${nextRelease.version}\n\n${nextRelease.notes}',
    }],
    ['@semantic-release/exec', {
      prepareCmd: './gradlew setProperties -Pversion=${nextRelease.version} && echo \'${nextRelease.version}\' > ./dist_ios/VERSION && git add -A && git commit -m \'chore(release): NO-JIRA ' + name + '/v${nextRelease.version} gradle\' && git push',
      execCwd: srcRoot,
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
