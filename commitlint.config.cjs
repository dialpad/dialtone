module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: './parser-preset.cjs',
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'header-max-length': [2, 'always', 120],
    'body-max-line-length': [0, 'always', 100],
    'footer-max-line-length': [0, 'always', 120],
    'subject-full-stop': [0, 'never', '.'],
    'jira-empty': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'jira-empty': ({ jira }) => {
          console.log(jira);
          const test = !!jira;
          return [
            test,
            `jira id(s) may not be empty`,
          ];
        },
      },
    },
  ],
  helpUrl: 'https://github.com/dialpad/dialtone/blob/staging/.github/COMMIT_CONVENTION.md',
};
