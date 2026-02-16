module.exports = ({
  warnOnly = false,
  allowlist = [
    /^:root\b/,           // Allow :root selectors (CSS custom properties)
    /^html\b/,            // Allow html element
    /^body\b/,            // Allow body element
    /^\*/,                // Allow universal selector
    /^:where\(/,          // Allow :where() functional pseudo-class
    /^::?[-\w]+$/,        // Allow pseudo-elements and pseudo-classes by themselves
  ],
} = {}) => {
  const options = { warnOnly, allowlist };

  return {
    postcssPlugin: 'postcss-validate-layers',
    Once(root) {
      const unlayeredRules = [];
      const validLayers = ['dialtone.reset', 'dialtone.base', 'dialtone.components', 'dialtone.utilities'];

      root.walkRules(rule => {
        // Skip @font-face, @keyframes, etc - these are at-rules, not rules
        if (rule.parent.type === 'atrule' && ['font-face', 'keyframes'].includes(rule.parent.name)) {
          return;
        }

        // Check for comment-based exception: /* layer-exception */
        const prevNode = rule.prev();
        if (prevNode && prevNode.type === 'comment' && prevNode.text.trim() === 'layer-exception') {
          return;
        }

        // Check if selector matches allowlist patterns
        const isAllowlisted = options.allowlist.some(pattern => {
          if (pattern instanceof RegExp) {
            return pattern.test(rule.selector);
          }
          return rule.selector === pattern;
        });

        if (isAllowlisted) {
          return;
        }

        // Check if rule is inside an @layer
        let parent = rule.parent;
        let inLayer = false;

        while (parent) {
          if (parent.type === 'atrule' && parent.name === 'layer') {
            if (validLayers.includes(parent.params)) {
              inLayer = true;
              break;
            }
          }
          parent = parent.parent;
        }

        // Check for Dialtone classes outside layers
        if (!inLayer && rule.selector.match(/\.(d-|dt-)/)) {
          unlayeredRules.push({
            selector: rule.selector,
            line: rule.source?.start?.line,
          });
        }
      });

      if (unlayeredRules.length > 0) {
        const message = `Found ${unlayeredRules.length} Dialtone selectors outside @layer blocks:\n` +
          unlayeredRules.slice(0, 10).map(r => `  ${r.selector} (line ${r.line})`).join('\n') +
          (unlayeredRules.length > 10 ? `\n  ... and ${unlayeredRules.length - 10} more` : '');

        if (options.warnOnly) {
          console.warn('\x1b[33m%s\x1b[0m', `⚠️  ${message}`);
        } else {
          throw new Error(message);
        }
      }
    },
  };
};
module.exports.postcss = true;
