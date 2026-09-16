/**
 * Simulate modifyFileContents behavior from helpers.mjs.
 * For each expression, apply the regex replace with function replacer.
 * Pass filepath to support transform expressions that check file extension.
 */
export function applyConfig (config, input, filepath = 'test.txt') {
  let result = input;
  for (const expr of config.expressions) {
    if (typeof expr.transform === 'function') {
      result = expr.transform(result, filepath);
    } else {
      result = result.replace(expr.from, (match) => {
        return match.replace(expr.from, expr.to);
      });
    }
  }
  return result;
}
