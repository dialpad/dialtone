import { testRule } from 'stylelint-test-rule-node';

import plugin from '../../../lib/rules/no-deprecated-success-tokens.js';

const {
  rule: { messages, ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,
  customSyntax: 'postcss-less',

  accept: [
    {
      code: '.card { background-color: var(--dt-color-surface-positive); }',
      description: 'positive surface token (correct)',
    },
    {
      code: '.card { color: var(--dt-color-foreground-positive); }',
      description: 'positive foreground token (correct)',
    },
    {
      code: '.card { border-color: var(--dt-color-border-positive-subtle); }',
      description: 'positive border subtle token (correct)',
    },
    {
      code: '.card { color: var(--dt-color-foreground-positive-inverted); }',
      description: 'positive foreground inverted token (correct)',
    },
    {
      code: '.card { color: var(--my-app-success); }',
      description: 'unrelated custom property containing the word success (correct)',
    },
    {
      code: '.card { --my-success-flag: 1; }',
      description: 'unrelated custom property declaration containing success (correct)',
    },
  ],

  reject: [
    {
      code: '.card { background-color: var(--dt-color-surface-success); }',
      description: 'surface success token (deprecated)',
      message: messages.deprecated('--dt-color-surface-success', '--dt-color-surface-positive'),
    },
    {
      code: '.card { border-color: var(--dt-color-border-success-subtle); }',
      description: 'border success-subtle token (deprecated)',
      message: messages.deprecated(
        '--dt-color-border-success-subtle',
        '--dt-color-border-positive-subtle',
      ),
    },
    {
      code: '.card { color: var(--dt-color-link-success); }',
      description: 'link success token (deprecated)',
      message: messages.deprecated('--dt-color-link-success', '--dt-color-link-positive'),
    },
    {
      code: '.card { color: var(--dt-color-foreground-success); }',
      description: 'foreground success token (deprecated)',
      message: messages.deprecated(
        '--dt-color-foreground-success',
        '--dt-color-foreground-positive',
      ),
    },
    {
      code: '.card { color: var(--dt-color-foreground-success-inverted); }',
      description: 'foreground success-inverted token (deprecated)',
      message: messages.deprecated(
        '--dt-color-foreground-success-inverted',
        '--dt-color-foreground-positive-inverted',
      ),
    },
    {
      code: '.card { background-color: var(--dt-color-surface-success-strong-inverted); }',
      description: 'surface success-strong-inverted token (deprecated)',
      message: messages.deprecated(
        '--dt-color-surface-success-strong-inverted',
        '--dt-color-surface-positive-strong-inverted',
      ),
    },
    {
      code: '.card { background-color: var(--dt-color-surface-success); color: var(--dt-color-foreground-success); }',
      description: 'multiple success tokens across declarations (deprecated)',
      warnings: [
        {
          message: messages.deprecated(
            '--dt-color-surface-success',
            '--dt-color-surface-positive',
          ),
        },
        {
          message: messages.deprecated(
            '--dt-color-foreground-success',
            '--dt-color-foreground-positive',
          ),
        },
      ],
    },
    {
      code: '.card { border: 1px solid var(--dt-color-border-success); background: var(--dt-color-surface-success-subtle); }',
      description: 'multiple success tokens of different roles (deprecated)',
      warnings: [
        {
          message: messages.deprecated(
            '--dt-color-border-success',
            '--dt-color-border-positive',
          ),
        },
        {
          message: messages.deprecated(
            '--dt-color-surface-success-subtle',
            '--dt-color-surface-positive-subtle',
          ),
        },
      ],
    },
  ],
});
