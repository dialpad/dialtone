const postcss = require('postcss');
const defaultBreakpoints = [
  { prefix: 'c-xs\\:', query: '(min-width: 320px)' },
  { prefix: 'c-sm\\:', query: '(min-width: 480px)' },
  { prefix: 'c-md\\:', query: '(min-width: 640px)' },
  { prefix: 'c-lg\\:', query: '(min-width: 960px)' },
  { prefix: 'c-xl\\:', query: '(min-width: 1264px)' },
];

function processBreakpoints (root, breakpoints) {
  return breakpoints.map((breakpoint) => {
    if (breakpoint && breakpoint !== Object(breakpoint)) {
      console.error('(Dialtone PostCSS Container Variations) - Breakpoint must be of type Object.');
    }

    const processedBreakpoint = Object.assign({}, breakpoint);

    let atRule;
    /* search current rules to see if one exists */
    root.walkAtRules('container', rule => {
      if (rule.params !== processedBreakpoint.query) return;
      atRule = rule;
    });

    if (!atRule) {
      atRule = postcss.atRule({
        name: 'container',
        params: processedBreakpoint.query,
      });
    }

    processedBreakpoint.atRule = atRule;
    return processedBreakpoint;
  });
}

function processClasses (classes) {
  return classes
    .map(className => {
      return typeof className === 'object' ? _validateRegex(className) : _validateString(className);
    })
    .filter(Boolean); // Remove false values from validation
}

function _prefixRule (rule, breakpoints, classes) {
  let hadMatch = false;
  rule.selectors.forEach(selector => {
    const isInClasses = classes.some(classNameRegex => classNameRegex.test(selector));
    if (!isInClasses) return;

    hadMatch = true;
    breakpoints.forEach(breakpoint => {
      const prefixLength = breakpoint.prefix.length;
      const selectorStart = selector.slice(1, prefixLength + 1);
      const isAlreadyPrefixed = selectorStart === breakpoint.prefix;
      if (isAlreadyPrefixed) return;
      const containerRule = rule.clone({ selector: `.${breakpoint.prefix}${selector.substring(1)}` });
      breakpoint.atRule.append(containerRule);
    });
  });
  return hadMatch;
}

function _escapeRegex (string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function _validateRegex (regex) {
  // RegExp objects are already valid, just return them
  // They should match CSS selectors starting with .
  return regex;
}

function _validateString (string) {
  if (!string.startsWith('.')) return false;
  string = _escapeRegex(string) + '$';
  return new RegExp(string);
}

module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-container-variations',
    Once (root) {
      const breakpoints = opts.breakpoints || defaultBreakpoints;
      const classes = opts.classes || [];
      const processedBreakpoints = processBreakpoints(root, breakpoints);
      const processedClasses = processClasses(classes);

      root.walkRules(rule => {
        _prefixRule(rule, processedBreakpoints, processedClasses);
      });

      const atRules = processedBreakpoints
        .filter(breakpoint => breakpoint.atRule.nodes?.length)
        .map(breakpoint => breakpoint.atRule);

      if (!atRules?.length) return;

      root.append(atRules);
    },
  };
};

module.exports.postcss = true;
