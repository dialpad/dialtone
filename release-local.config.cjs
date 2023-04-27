/* eslint-disable no-template-curly-in-string */
module.exports = {
  branches: [
    'production',
    'staging',
    'vue3-staging',
    'vue3',
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'alpha',
      prerelease: true,
    },
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
    '@semantic-release/changelog',
    '@dialpad/semantic-release-changelog-json',
    ['@semantic-release/npm', {
      npmPublish: false,
    }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'CHANGELOG.json', 'package.json', 'package-lock.json', 'npm-shrinkwrap.json'],
      /* eslint-disable-next-line no-template-curly-in-string */
      message: 'chore(release): ${nextRelease.version} \n\n${nextRelease.notes}',
    }],
  ],
};
