module.exports = {
  branches: [
    'staging-vue3',
    'vue3',
    {
      name: 'next-vue3',
      channel: 'next3',
      prerelease: 'next3',
    },
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'alpha',
      prerelease: true,
    },
    {
      name: 'dialtone8-vue3',
      prerelease: 'next3',
      channel: 'next3',
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
