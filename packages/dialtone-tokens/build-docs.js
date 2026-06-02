import fs from 'fs';
import keywordsJson from './keywords.json' with { type: 'json' };

// stores the documentation data for all tokens. This is output to file.
const docTokens = {};
const deprecatedCompositionTokens = {};

// Recurse through style dictionary object and pick out
// bottom level token values.
// eslint-disable-next-line complexity
export function buildDocs (platformName, theme, currentObj) {
  // tokens marked as "source" should not be output.
  if (currentObj === null || typeof currentObj !== 'object' || currentObj.isSource === false) {
    return null;
  }

  if (!docTokens[theme]) docTokens[theme] = {};
  const tokenName = currentObj.name;
  const tokenValue = currentObj.value;
  const tokenDescription = currentObj?.description;
  const tokenPath = currentObj?.path;
  const isCompositionToken = currentObj?.isCompositionToken ?? undefined;
  const tokenDeprecated = currentObj?.$deprecated ?? currentObj?.deprecated ?? undefined;

  if (tokenValue && tokenPath) {
    const tokenKey = tokenPath.join('/');
    const formattedTokenName = formatTokenName(platformName, tokenName);
    rememberDeprecatedCompositionToken(theme, platformName, formattedTokenName, tokenPath, tokenDeprecated);
    const deprecated = tokenDeprecated ?? getDeprecatedCompositionToken(theme, formattedTokenName);

    docTokens[theme][tokenKey] = {
      ...docTokens[theme][tokenKey],
      [platformName]: {
        name: formattedTokenName,
        value: tokenValue,
        description: tokenDescription,
        keywords: getTokenKeywords(keywordsJson, tokenPath),
        isCompositionToken,
        deprecated,
      },
    };
    return null;
  }

  for (const key in currentObj) {
    if (!Object.prototype.hasOwnProperty.call(currentObj, key)) { continue; }
    buildDocs(platformName, theme, currentObj[key]);
  }
}

function rememberDeprecatedCompositionToken (theme, platformName, formattedTokenName, tokenPath, deprecated) {
  if (!deprecated || platformName !== 'css/variables' || tokenPath[0] !== 'shadow') return;

  const match = formattedTokenName.match(
    /^var\((--dt-shadow-.+?)(?:-\d+)?-(?:offset-x|offset-y|blur|spread|color|type)\)$/,
  );
  if (!match) return;

  deprecatedCompositionTokens[theme] ??= {};
  deprecatedCompositionTokens[theme][`var(${match[1]})`] = deprecated;
}

function getDeprecatedCompositionToken (theme, formattedTokenName) {
  return deprecatedCompositionTokens[theme]?.[formattedTokenName];
}

/**
 * Gets the keywords from the keywords.json file
 * for the token category / subcategory
 * @param {Object} obj Object with the token information
 * @param {Array} tokenPath The path that has first the category, then the subcategory (optional), then the name
 * @param {Array} keywords Array with the keywords. Is completed by recursively looping through obj
 * @returns {Array|undefined} Array with the keywords, or undefined if there are none
 */
function getTokenKeywords (obj, tokenPath, keywords = []) {
  if (tokenPath.length === 0 || !obj) return;
  const currentCategory = tokenPath[0];
  if (currentCategory && obj[currentCategory] && obj[currentCategory].keywords) {
    keywords.push(...obj[currentCategory].keywords);
  }
  tokenPath.shift();
  getTokenKeywords(obj[currentCategory], tokenPath, keywords);
  return keywords.length > 0 ? keywords : undefined;
}

function formatTokenName (platformName, tokenName) {
  if (platformName === 'css/variables') {
    return `var(--${tokenName})`;
  }
  return tokenName;
}

export function writeDocs () {
  const DOC_OUTPUT_PATH = './dist/doc.json';
  fs.writeFile(DOC_OUTPUT_PATH, JSON.stringify(docTokens, null, 2), err => {
    if (err) {
      throw err;
    }
    console.info(`Token documentation data written to ${DOC_OUTPUT_PATH}`);
  });
}
