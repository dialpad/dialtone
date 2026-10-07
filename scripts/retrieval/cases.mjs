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
  baseline('box-exact', 'components', 'DtBox', [
    order(['DtBox']),
    contains('padding-prop', 'padding'),
  ]),
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
  ]),
  baseline(
    'button-complete-prop',
    'components',
    'DtButton',
    [contains('late-prop', 'assertiveOnFocus')],
    { adapters: ['mcp'], limit: 1 },
  ),
  baseline('utility-pixel-ranking', 'utilities', 'padding 8px', [
    order(['d-p-100']),
  ]),
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
    [contains('aria-literal', 'aria-describedby')],
    { limit: 1 },
  ),
  baseline(
    'popover-migration',
    'documentation',
    'migrate DtOldPopover',
    [
      contains('deprecated-name', 'DtOldPopover is deprecated'),
      contains('replacement', 'DtPopover'),
    ],
    { limit: 1 },
  ),
  baseline(
    'tooltip-wrapper-literal',
    'documentation',
    'tooltip disabled',
    [contains('span-literal', '<span>')],
    { limit: 1 },
  ),
  baseline(
    'documentation-negative',
    'documentation',
    'DLT3652MissingDocument',
    [{ id: 'negative', kind: 'empty' }],
    {
      checksByAdapter: {
        mcp: [contains('meaningful-negative', 'No documentation')],
      },
    },
  ),
  baseline(
    'legacy-import-qualification',
    'components',
    'DtButton',
    [
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
    [contains('answer-provenance', 'provenance')],
    { adapters: ['mcp'], limit: 1, wire: true },
  ),
];
const failure = (issue, owner, assertion, removeWhen) => ({
  issue,
  owner,
  assertion,
  removeWhen,
});
export const expectedFailures = {
  'box-exact/mcp': failure(
    'DLT-3650',
    'focused MCP retrieval',
    'padding-prop',
    'focused box detail retains padding beyond the first five summary props',
  ),
  'popover-migration/mcp': failure(
    'DLT-3650',
    'focused MCP retrieval',
    'replacement',
    'selected migration detail retains the replacement beyond the summary excerpt',
  ),
  'breadcrumb-public-name/core': failure(
    'DLT-3649',
    'public API identity',
    'top-results',
    'integrated canonical public names rank DtBreadcrumbItem first',
  ),
  'breadcrumb-public-name/cli': failure(
    'DLT-3649',
    'public API identity',
    'top-results',
    'integrated canonical public names rank DtBreadcrumbItem first',
  ),
  'breadcrumb-public-name/mcp': failure(
    'DLT-3649',
    'public API identity',
    'top-results',
    'integrated canonical public names rank DtBreadcrumbItem first',
  ),
  'button-complete-prop/mcp': failure(
    'DLT-3650',
    'focused MCP retrieval',
    'late-prop',
    'focused component detail returns the requested later prop; replace with the integrated detail tool assertion',
  ),
  'utility-pixel-ranking/core': failure(
    'DLT-3651',
    'ranking and migration guidance',
    'top-results',
    'padding 8px ranks the value-preserving d-p-100 utility before component internals',
  ),
  'utility-pixel-ranking/cli': failure(
    'DLT-3651',
    'ranking and migration guidance',
    'top-results',
    'padding 8px ranks the value-preserving d-p-100 utility before component internals',
  ),
  'utility-pixel-ranking/mcp': failure(
    'DLT-3651',
    'ranking and migration guidance',
    'top-results',
    'padding 8px ranks the value-preserving d-p-100 utility before component internals',
  ),
  'checkbox-accessibility-literal/mcp': failure(
    'DLT-3650',
    'focused MCP retrieval',
    'aria-literal',
    'selected documentation detail retains aria-describedby beyond the summary excerpt',
  ),
  'tooltip-wrapper-literal/core': failure(
    'DLT-3653',
    'documentation fidelity',
    'span-literal',
    'raw inline HTML literal survives generation and retrieval',
  ),
  'tooltip-wrapper-literal/cli': failure(
    'DLT-3653',
    'documentation fidelity',
    'span-literal',
    'raw inline HTML literal survives generation and retrieval',
  ),
  'tooltip-wrapper-literal/mcp': failure(
    'DLT-3653',
    'documentation fidelity',
    'span-literal',
    'raw inline HTML literal survives generation and retrieval',
  ),
  'documentation-negative/mcp': failure(
    'DLT-3650',
    'focused MCP retrieval',
    'meaningful-negative',
    'zero matches produce an explicit negative response instead of empty text',
  ),
  'legacy-import-qualification/core': failure(
    'DLT-3649',
    'public API identity',
    'unverified-import',
    'legacy metadata without identity/export verification emits no guessed import',
  ),
  'mcp-answer-provenance/mcp': failure(
    'DLT-3650',
    'bundled answer provenance',
    'answer-provenance',
    'integrated C2 provenance is present on the wire; replace this detection with exact C2 stamp/data assertions',
  ),
};
