const name = 'dialtone-icons-vue2';
const srcRoot = `packages/${name}`;

module.exports = {
  extends: 'release.config.base.js',
  pkgRoot: `${srcRoot}/dist`,
  tagFormat: name + '-v${version}',
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
    ['@semantic-release/changelog', { changelogFile: `${srcRoot}/CHANGELOG.md` }],
    ['@dialpad/semantic-release-changelog-json', { changelogJsonFile: `${srcRoot}/CHANGELOG.json` }],
    ['@semantic-release/npm', { npmPublish: false }],
    ['@semantic-release/git', {
      assets: [`${srcRoot}/CHANGELOG.md`, `${srcRoot}/CHANGELOG.json`, `${srcRoot}/package.json`, `${srcRoot}/package-lock.json`],
      /* eslint-disable-next-line no-template-curly-in-string */
      message: 'chore(release): ${nextRelease.version} \n\n${nextRelease.notes}',
    }],
  ],
  branches: [
    'staging',
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
