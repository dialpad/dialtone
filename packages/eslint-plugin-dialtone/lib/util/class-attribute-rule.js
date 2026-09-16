/**
 * Helpers for ESLint rules that autofix deprecated CSS utility classes in
 * Vue template class attributes.
 */
'use strict';

// Token-boundary anchors. `\b` treats `-` as a non-word char, so `\bd-h16\b`
// would match inside `foo-d-h16` — use whitespace/start/end instead.
const START = '(?<=^|\\s)';
const END = '(?=$|\\s)';

function buildDetectRegex (regexes) {
  return new RegExp(regexes.map(r => r.source).join('|'));
}

/**
 * Returns a `create` function for a rule that detects and autofixes deprecated
 * class names in `class` attributes on Vue template nodes. Preserves the
 * attribute's quoting style (double, single, or unquoted).
 */
function createClassAttributeRule ({ detect, rewrite, messageId }) {
  return (context) => {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const defineTemplateBodyVisitor = sourceCode.parserServices?.defineTemplateBodyVisitor;
    if (!defineTemplateBodyVisitor) return {};

    return defineTemplateBodyVisitor({
      VAttribute (node) {
        if (node.key.name !== 'class') return;
        const classes = node.value?.value;
        if (!classes || !detect.test(classes)) return;

        context.report({
          node,
          messageId,
          fix (fixer) {
            const rewritten = rewrite(classes);
            if (rewritten === classes) return null;
            const firstChar = sourceCode.getText(node.value)[0];
            const quote = firstChar === '"' || firstChar === '\'' ? firstChar : '';
            return fixer.replaceText(node.value, `${quote}${rewritten}${quote}`);
          },
        });
      },
    });
  };
}

module.exports = { START, END, buildDetectRegex, createClassAttributeRule };
