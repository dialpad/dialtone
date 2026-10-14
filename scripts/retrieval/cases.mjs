const contains = (id, value) => ({ id, kind: 'contains', value });
const order = (value) => ({ id: 'top-results', kind: 'order', value });
const baseline = (id, domain, query, checks, options = {}) => ({
  id,
  domain,
  query,
  adapters: ['core', 'cli', 'mcp'],
  limit: 3,
  checks,
  ...options,
});
const missing = (id, domain, query, diagnostic) =>
  baseline(id, domain, query, [{ id: 'negative', kind: 'empty' }], {
    checksByAdapter: {
      mcp: [contains('meaningful-negative', diagnostic)],
    },
  });
export const cases = [
  baseline('button-exact', 'components', 'DtButton', [
    order(['DtButton']),
    contains('description', 'allows users to take an action'),
  ]),
  baseline('input-exact', 'components', 'DtInput', [
    order(['DtInput', 'DtInputGroup']),
    contains('label-slot', 'label'),
  ]),
  baseline('text-exact', 'components', 'DtText', [
    order(['DtText']),
    contains('variant-prop', 'variant'),
  ]),
  baseline(
    'box-exact',
    'components',
    'DtBox',
    [order(['DtBox']), contains('padding-prop', 'padding')],
    {
      mcp: {
        tool: 'get_component',
        arguments: { component: 'DtBox', projection: 'props', field: 'padding' },
      },
    },
  ),
  baseline('button-ambiguous', 'components', 'button', [
    order(['DtButton', 'DtButtonGroup', 'DtSplitButton']),
  ]),
  missing(
    'component-missing',
    'components',
    'DLT3652MissingWidget',
    'No components found for "DLT3652MissingWidget".',
  ),
  baseline('breadcrumb-public-name', 'components', 'DtBreadcrumbItem', [
    order(['DtBreadcrumbItem']),
    contains('canonical-subject', 'DtBreadcrumbItem'),
  ]),
  baseline('breadcrumb-family', 'components', 'DtBreadcrumbs', [
    order(['DtBreadcrumbs']),
    contains('context', 'currently-viewed page'),
  ]),
  baseline(
    'button-complete-prop',
    'components',
    'DtButton',
    [
      order(['DtButton']),
      contains('description', 'allows users to take an action'),
      contains('late-prop', 'assertiveOnFocus'),
    ],
    {
      adapters: ['mcp'], limit: 1,
      mcp: {
        tool: 'get_component',
        arguments: { component: 'DtButton', projection: 'props', field: 'assertiveOnFocus' },
      },
    },
  ),
  baseline(
    'utility-pixel-ranking',
    'utilities',
    'padding 8px',
    [order(['d-p-100']), contains('spacing-value', '--dt-spacing-100')],
    {
      checksByAdapter: {
        core: [contains('padding-property', '"prop":"padding"')],
        cli: [contains('padding-property', '"prop":"padding"')],
        mcp: [contains('padding-property', 'padding:')],
      },
    },
  ),
  baseline(
    'utility-display-facts',
    'utilities',
    'display flex',
    [contains('flex-value', 'flex')],
    { limit: 1 },
  ),
  missing(
    'utility-missing',
    'utilities',
    'DLT3652MissingProperty',
    'No results found for "DLT3652MissingProperty".',
  ),
  baseline('spacing-token', 'tokens', '--dt-spacing-100', [
    order(['--dt-spacing-100']),
    contains('value', '8px'),
  ]),
  baseline(
    'foreground-token',
    'tokens',
    '--dt-color-foreground-primary',
    [
      order(['--dt-color-foreground-primary']),
      contains('description', 'Default text color'),
    ],
    { limit: 1 },
  ),
  missing(
    'token-missing',
    'tokens',
    'DLT3652MissingToken',
    'No token results found for "DLT3652MissingToken".',
  ),
  baseline(
    'icon-exact-import',
    'icons',
    'alert-circle',
    [order(['alert-circle']), contains('keyword', 'warning')],
    {
      checksByAdapter: {
        mcp: [
          contains('public-import', '@dialpad/dialtone-icons/vue'),
          {
            id: 'wrong-import',
            kind: 'absent',
            value: `from '@dialpad/dialtone-vue'`,
          },
        ],
      },
    },
  ),
  baseline('icon-keyword-order', 'icons', 'notification', [
    order(['bell-off', 'bell-plus', 'bell-ring']),
  ]),
  missing(
    'icon-missing',
    'icons',
    'DLT3652MissingIcon',
    'No icons found for "DLT3652MissingIcon".',
  ),
  baseline(
    'modal-dismissal',
    'documentation',
    'modal outside click',
    [
      contains(
        'intentional-dismissal',
        'clicking outside the DtModal dialog does not close it',
      ),
    ],
    { limit: 1 },
  ),
  baseline(
    'checkbox-accessibility-literal',
    'documentation',
    'checkbox aria-describedby',
    [
      order(['Checkbox > Accessibility']),
      contains('checkbox-label', 'Associate checkbox labels'),
      contains('aria-literal', 'aria-describedby'),
    ],
    {
      limit: 1,
      mcp: {
        tool: 'get_documentation',
        arguments: { id: 'components/checkbox#accessibility' },
      },
    },
  ),
  baseline(
    'popover-migration',
    'documentation',
    'migrate DtOldPopover',
    [
      order(['Popover > Usage']),
      contains('deprecated-name', 'DtOldPopover is deprecated'),
      contains('replacement', 'DtPopover'),
    ],
    {
      limit: 1,
      mcp: {
        tool: 'get_documentation',
        arguments: { id: 'components/popover#usage' },
      },
    },
  ),
  baseline(
    'tooltip-wrapper-literal',
    'documentation',
    'tooltip disabled',
    [
      order(['Tooltip > Tooltip as a Component']),
      contains('disabled-button', 'disabled DtButton'),
      contains('span-literal', '<span>'),
    ],
    { limit: 1 },
  ),
  missing(
    'documentation-negative',
    'documentation',
    'DLT3652MissingDocument',
    'No documentation',
  ),
  baseline(
    'legacy-import-qualification',
    'components',
    'DtButton',
    [
      order(['DtButton']),
      contains('legacy-value', 'xs'),
      {
        id: 'unverified-import',
        kind: 'absent',
        value: `import { DtButton } from '@dialpad/dialtone-vue'`,
      },
    ],
    { adapters: ['core'], fixture: 'legacy', limit: 1 },
  ),
  baseline(
    'mcp-answer-provenance',
    'components',
    'DtButton',
    [
      order(['DtButton']),
      contains('description', 'allows users to take an action'),
      contains(
        'answer-provenance',
        '**Source:** bundled; installed compatibility not checked.',
      ),
    ],
    { adapters: ['mcp'], limit: 1, wire: true },
  ),
  baseline(
    'legacy-cli-local-selection',
    'components',
    'DtButton',
    [
      order(['DtButton']),
      contains('old-size-values', '"values":["xs","sm","md","lg","xl"]'),
    ],
    { adapters: ['cli'], fixture: 'legacy-cli', limit: 1 },
  ),
];
// The checks one adapter must satisfy, including its transmitted-size budget.
export const checksFor = (testCase, adapter) => [
  ...testCase.checks,
  ...(testCase.checksByAdapter?.[adapter] ?? []),
  {
    id: 'output-budget',
    kind: 'bytes',
    value: adapter === 'mcp' ? 16000 : 100000,
  },
];
const failure = (issue, owner, assertion, removeWhen) => ({
  issue,
  owner,
  assertion,
  removeWhen,
});
// One owned failure for every adapter that runs the case.
const everyAdapter = (caseId, entry) =>
  Object.fromEntries(
    cases
      .find((value) => value.id === caseId)
      .adapters.map((adapter) => [`${caseId}/${adapter}`, entry]),
  );
export const expectedFailures = {
  ...everyAdapter(
    'utility-pixel-ranking',
    failure(
      'DLT-3651',
      'ranking and migration guidance',
      'top-results',
      'padding 8px ranks the value-preserving d-p-100 utility before component internals',
    ),
  ),
  ...everyAdapter(
    'tooltip-wrapper-literal',
    failure(
      'DLT-3653',
      'documentation fidelity',
      'span-literal',
      'raw inline HTML literal survives generation and retrieval',
    ),
  ),
};
