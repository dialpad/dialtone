const postcss = require('postcss');
const defaultBreakpoints = [
  { prefix: 'sm\\:', mediaQuery: '(max-width: 480px)' },
  { prefix: 'md\\:', mediaQuery: '(max-width: 640px)' },
  { prefix: 'lg\\:', mediaQuery: '(max-width: 960px)' },
  { prefix: 'xl\\:', mediaQuery: '(max-width: 1264px)' },
];

function processBreakpoints (root, breakpoints) {
  return breakpoints.map((breakpoint) => {
    if (breakpoint && breakpoint !== Object(breakpoint)) {
      console.error('(Dialtone PostCSS Responsify) - Breakpoint must be of type Object.');
    }

    const processedBreakpoint = Object.assign({}, breakpoint);

    let atRule;
    /* search current rules to see if one exists */
    root.walkAtRules('media', rule => {
      if (rule.params !== processedBreakpoint.mediaQuery) return;
      atRule = rule;
    });

    if (!atRule) {
      atRule = postcss.atRule({
        name: 'media',
        params: processedBreakpoint.mediaQuery,
      });
    }

    processedBreakpoint.atRule = atRule;
    return processedBreakpoint;
  });
}

function processClasses (classes) {
  return classes.map(className => {
    return typeof className === 'object' ? _validateRegex(className) : _validateString(className);
  });
}

function _prefixRule (rule, breakpoints, classes) {
  rule.selectors.forEach(selector => {
    const isInClasses = classes.some(classNameRegex => classNameRegex.test(selector));
    if (!isInClasses) return;

    breakpoints.forEach(breakpoint => {
      const prefixLength = breakpoint.prefix.length;
      const selectorStart = selector.slice(1, prefixLength + 1);
      const isAlreadyPrefixed = selectorStart === breakpoint.prefix;
      if (isAlreadyPrefixed) return;
      const responsiveRule = rule.clone({ selector: `.${breakpoint.prefix}${selector.substring(1)}` });
      breakpoint.atRule.append(responsiveRule);
    });
  });
}
function _escapeRegex (string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function _validateRegex (regex) {
  const className = regex.toString();
  if (!className.startsWith('/\\.')) return false;
  return regex;
}

function _validateString (string) {
  if (!string.startsWith('.')) return false;
  string = _escapeRegex(string) + '$';
  return new RegExp(string);
}

module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-responsive-variations',
    Once (root) {
      const breakpoints = opts.breakpoints || defaultBreakpoints;
      const classes = opts.classes || [];
      const processedBreakpoints = processBreakpoints(root, breakpoints);
      const processedClasses = processClasses(classes);

      root.walkRules(rule => {
        _prefixRule(rule, processedBreakpoints, processedClasses);
      });

      if (processedBreakpoints && processedBreakpoints[0].atRule.nodes) {
        root.append(processedBreakpoints.map(breakpoint => breakpoint.atRule));
      }
    },
  };
};

module.exports.postcss = true;
