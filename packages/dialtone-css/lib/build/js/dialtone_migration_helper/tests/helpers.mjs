/**
 * Simulate modifyFileContents behavior from helpers.mjs (lines 158-160).
 * For each expression, apply the regex replace with function replacer.
 */
export function applyConfig (config, input) {
  let result = input;
  for (const expr of config.expressions) {
    result = result.replace(expr.from, (match) => {
      return match.replace(expr.from, expr.to);
    });
  }
  return result;
}
