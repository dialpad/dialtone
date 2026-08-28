/**
 * @fileoverview Detect raw anchor / router-link with d-btn or d-link classes,
 * and DtLink with d-td-* classes — all should migrate to DtButton/DtLink props
 * via `npx dialtone-migrate-link-rendering`.
 */
'use strict';

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function getStaticClassValue (node) {
  for (const attr of node.startTag.attributes) {
    if (attr.directive) continue;
    const name = attr.key && (attr.key.rawName || attr.key.name);
    if (name !== 'class' || !attr.value) continue;
    return { value: attr.value.value, attr };
  }
  return null;
}

function tokenize (classValue) {
  return classValue.split(/\s+/).filter(Boolean);
}

const D_TD_TOKEN_RE = /^(?:[\w-]+:)?d-td-[\w-]+$/;

const RELEVANT_TAGS = new Set(['a', 'router-link', 'dt-link']);

const TAG_TOKEN_CHECKS = [
  { tag: 'a', test: tokens => tokens.includes('d-btn'), messageId: 'anchorWithDBtn' },
  { tag: 'a', test: tokens => tokens.includes('d-link'), messageId: 'anchorWithDLink' },
  { tag: 'router-link', test: tokens => tokens.includes('d-btn'), messageId: 'routerLinkWithDBtn' },
  { tag: 'router-link', test: tokens => tokens.includes('d-link'), messageId: 'routerLinkWithDLink' },
  { tag: 'dt-link', test: tokens => tokens.some(t => D_TD_TOKEN_RE.test(t)), messageId: 'dtLinkWithDTd' },
];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detects legacy link and button classes that should use `DtButton` or `DtLink` props.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-link-styling-classes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      anchorWithDBtn:
        '<a class="d-btn"> is deprecated. Use <dt-button href="…"> instead. ' +
        'Run `npx dialtone-migrate-link-rendering` to migrate.',
      routerLinkWithDBtn:
        '<router-link class="d-btn"> is deprecated. Use <dt-button :to="…"> instead. ' +
        'Run `npx dialtone-migrate-link-rendering` to migrate.',
      anchorWithDLink:
        '<a class="d-link"> is deprecated. Use <dt-link href="…"> instead. ' +
        'Run `npx dialtone-migrate-link-rendering` to migrate.',
      routerLinkWithDLink:
        '<router-link class="d-link"> is deprecated. Use <dt-link :to="…"> instead. ' +
        'Run `npx dialtone-migrate-link-rendering` to migrate.',
      dtLinkWithDTd:
        '<dt-link class="d-td-…"> is deprecated. Use the `underline` prop instead. ' +
        'Run `npx dialtone-migrate-link-rendering` to migrate.',
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const defineTemplateBodyVisitor = sourceCode.parserServices?.defineTemplateBodyVisitor;
    if (!defineTemplateBodyVisitor) return {};

    return defineTemplateBodyVisitor({
      VElement (node) {
        const rawName = node.rawName || node.name;
        // Normalize PascalCase Vue tags (RouterLink, DtLink) to kebab-case.
        const tagName = rawName.includes('-')
          ? rawName.toLowerCase()
          : rawName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        if (!RELEVANT_TAGS.has(tagName)) return;

        const result = getStaticClassValue(node);
        if (!result) return;
        const tokens = tokenize(result.value);

        for (const check of TAG_TOKEN_CHECKS) {
          if (check.tag !== tagName) continue;
          if (check.test(tokens)) context.report({ node: result.attr, messageId: check.messageId });
        }
      },
    });
  },
};
