/**
 * @fileoverview Detects usage of deprecated `success`-named color utility classes
 * (`d-bgc-success*`, `d-bc-success*`, `d-fc-success*`) and recommends the
 * `positive`-named replacements. The foreground (`d-fc-success*`) variants are
 * already deprecated as part of the base-color cleanup but are still in active
 * use, so this rule covers them too.
 * @author Dialtone Team
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

// Anchor at token boundaries (start-of-string / whitespace / end). `\b` would
// happily slice through `d-bgc-success-strong-inverted-foo`, so we use explicit
// non-class-name lookarounds. A class-name char is `[A-Za-z0-9_-]`.
const TOKEN_START = '(?<![A-Za-z0-9_-])';
const TOKEN_END = '(?![A-Za-z0-9_-])';

// Suffixes that follow `success` in the deprecated namespace. Order longest
// first so alternation matches greedily where needed (regex matching is
// leftmost-first, but we still keep this ordered for clarity).
const SUCCESS_SUFFIXES = [
  '-subtle-opaque-inverted',
  '-strong-inverted',
  '-subtle-inverted',
  '-opaque-inverted',
  '-subtle-opaque',
  '-inverted',
  '-subtle',
  '-strong',
  '-opaque',
].join('|');

// Per-role detect regexes. Each matches `d-{role}-success` optionally followed
// by one of the known suffixes — and ONLY by one of the known suffixes (the
// trailing `TOKEN_END` rejects unrelated continuations like
// `d-bgc-success-foo`).
const BG_SUCCESS_RE = new RegExp(`${TOKEN_START}d-bgc-success(?:${SUCCESS_SUFFIXES})?${TOKEN_END}`);
const FG_SUCCESS_RE = new RegExp(`${TOKEN_START}d-fc-success(?:${SUCCESS_SUFFIXES})?${TOKEN_END}`);
const BORDER_SUCCESS_RE = new RegExp(`${TOKEN_START}d-bc-success(?:${SUCCESS_SUFFIXES})?${TOKEN_END}`);

// Generic detect for the script-string visitor (any role).
const ANY_SUCCESS_RE = new RegExp(`${TOKEN_START}d-(?:bgc|bc|fc)-success(?:${SUCCESS_SUFFIXES})?${TOKEN_END}`);

const DOCS_BACKGROUND = 'https://dialtone.dialpad.com/utilities/backgrounds/color.html';
const DOCS_FOREGROUND = 'https://dialtone.dialpad.com/utilities/typography/font-color.html';
const DOCS_BORDER = 'https://dialtone.dialpad.com/utilities/borders/color.html';

// Build per-role messages following the precedent of deprecated-base-color-classes
// (separate messageId per role family).
const MESSAGE_PREFIX = '`d-{role}-success-...` is deprecated. Use `d-{role}-positive-...` instead. Run `npx dialtone-migration-helper --config success-to-positive` to migrate automatically.';
const buildMessage = (role, docs) =>
  MESSAGE_PREFIX.replace(/\{role\}/g, role) + ` See the utility docs: ${docs}`;

function checkClassString (context, node, classes) {
  if (BG_SUCCESS_RE.test(classes)) {
    context.report({ node, messageId: 'deprecatedBackgroundSuccess' });
  }
  if (FG_SUCCESS_RE.test(classes)) {
    context.report({ node, messageId: 'deprecatedForegroundSuccess' });
  }
  if (BORDER_SUCCESS_RE.test(classes)) {
    context.report({ node, messageId: 'deprecatedBorderSuccess' });
  }
}

/**
 * Walk every Literal/TemplateElement string descendant of an expression node
 * (used for `:class="[...]"` / `:class="{...}"` / template-literal bindings).
 * Best-effort — fully dynamic class names (`d-bgc-' + variant`) cannot be
 * matched without runtime knowledge.
 */
function findStringLiterals (n, out) {
  if (!n || typeof n !== 'object') return;
  if (n.type === 'Literal' && typeof n.value === 'string') {
    out.push({ node: n, value: n.value });
  } else if (n.type === 'TemplateElement' && n.value && typeof n.value.cooked === 'string') {
    out.push({ node: n, value: n.value.cooked });
  }
  for (const key of Object.keys(n)) {
    if (key === 'parent') continue;
    const child = n[key];
    if (child && typeof child === 'object') {
      if (Array.isArray(child)) {
        for (const c of child) findStringLiterals(c, out);
      } else {
        findStringLiterals(child, out);
      }
    }
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        '`d-bgc-success*`, `d-bc-success*`, and `d-fc-success*` utility classes are deprecated. Use the `positive`-named replacements.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-success-color-classes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      deprecatedBackgroundSuccess: buildMessage('bgc', DOCS_BACKGROUND),
      deprecatedForegroundSuccess: buildMessage('fc', DOCS_FOREGROUND),
      deprecatedBorderSuccess: buildMessage('bc', DOCS_BORDER),
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const defineTemplateBodyVisitor = sourceCode.parserServices?.defineTemplateBodyVisitor;

    // Visitor that scans all string-typed AST nodes inside `<script>` or in
    // plain `.js`/`.ts` files for class-name strings containing the deprecated
    // tokens. This catches things like `:class="['d-bgc-success']"` (the array
    // literal lives in the script-side AST that vue-eslint-parser exposes via
    // the standard ESLint visitor) and `const c = 'd-bgc-success';`.
    const scriptVisitor = {
      Literal (node) {
        if (typeof node.value !== 'string') return;
        if (!ANY_SUCCESS_RE.test(node.value)) return;
        checkClassString(context, node, node.value);
      },
      TemplateElement (node) {
        const cooked = node.value && node.value.cooked;
        if (typeof cooked !== 'string') return;
        if (!ANY_SUCCESS_RE.test(cooked)) return;
        checkClassString(context, node, cooked);
      },
    };

    if (!defineTemplateBodyVisitor) {
      // Plain JS/TS file — no Vue template, only the script visitor applies.
      return scriptVisitor;
    }

    return defineTemplateBodyVisitor(
      // Template visitor — handles `class="..."` static attributes and the
      // string-literal halves of `:class="..."` dynamic bindings.
      {
        VAttribute (node) {
          // Static `class="..."` attribute.
          if (!node.directive && node.key.name === 'class' && node.value && typeof node.value.value === 'string') {
            checkClassString(context, node, node.value.value);
            return;
          }
          // Dynamic `:class="..."` / `v-bind:class="..."` binding.
          if (
            node.directive &&
            node.key.name &&
            node.key.name.name === 'bind' &&
            node.key.argument &&
            (node.key.argument.rawName === 'class' || node.key.argument.name === 'class') &&
            node.value &&
            node.value.expression
          ) {
            const literals = [];
            findStringLiterals(node.value.expression, literals);
            for (const { node: litNode, value } of literals) {
              if (ANY_SUCCESS_RE.test(value)) {
                checkClassString(context, litNode, value);
              }
            }
          }
        },
      },
      // ESLint visitor for the script half (i.e., the surrounding JS/TS that
      // vue-eslint-parser exposes through the regular AST traversal). Plain
      // `.js`/`.ts` files also fall through here.
      scriptVisitor,
    );
  },
};
