module.exports = {
  branches: [
    'production',
    'staging',
    {
      name: 'next',
      channel: 'next',
      prerelease: 'next',
    },
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
    '@semantic-release/github',
  ],
};
