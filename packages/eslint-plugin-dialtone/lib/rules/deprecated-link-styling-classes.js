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

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect legacy d-btn / d-link / d-td-* class usage that should migrate to DtButton/DtLink props',
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
    if (!sourceCode.parserServices || !sourceCode.parserServices.defineTemplateBodyVisitor) {
      // Not a Vue file context; do nothing.
      return {};
    }
    return sourceCode.parserServices.defineTemplateBodyVisitor({
       
      VElement (node) {
        const rawName = node.rawName || node.name;
        // vue-eslint-parser lowercases the tag name in `name`; rawName preserves casing.
        const tagName = rawName.toLowerCase();

        const result = getStaticClassValue(node);
        if (!result) return;
        const tokens = tokenize(result.value);

        const hasDBtn = tokens.includes('d-btn');
        const hasDLink = tokens.includes('d-link');
        const hasDtd = tokens.some(t => D_TD_TOKEN_RE.test(t));

        if (tagName === 'a' && hasDBtn) {
          context.report({ node: result.attr, messageId: 'anchorWithDBtn' });
        }
        if (tagName === 'a' && hasDLink) {
          context.report({ node: result.attr, messageId: 'anchorWithDLink' });
        }
        if (tagName === 'router-link' && hasDBtn) {
          context.report({ node: result.attr, messageId: 'routerLinkWithDBtn' });
        }
        if (tagName === 'router-link' && hasDLink) {
          context.report({ node: result.attr, messageId: 'routerLinkWithDLink' });
        }
        if (tagName === 'dt-link' && hasDtd) {
          context.report({ node: result.attr, messageId: 'dtLinkWithDTd' });
        }
      },
    });
  },
};
