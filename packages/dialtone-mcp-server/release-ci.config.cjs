
const name = 'dialtone-mcp-server';
const srcRoot = `packages/${name}`;
const lookupRelease = require('../../scripts/lib/lookup-release.cjs');

/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  pkgRoot: srcRoot,
  tagFormat: name + '/v${version}',
  // semantic-release-plus passes these Git pathspecs to git log.
  commitPaths: [`${srcRoot}/*`, ...lookupRelease.commitPaths],
  plugins: [
    [require.resolve('../../scripts/lib/lookup-release.cjs'), { adapterRoot: srcRoot }],
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
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'alpha',
      prerelease: true,
    },
    {
      name: 'next',
      prerelease: true,
    },
  ],
};
