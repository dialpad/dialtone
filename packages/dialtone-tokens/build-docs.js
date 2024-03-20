import fs from 'fs';
import keywordsJson from './keywords.json' assert { type: 'json' };

// stores the documentation data for all tokens. This is output to file.
const docTokens = {};

// Recurse through style dictionary object and pick out
// bottom level token values.
export function buildDocs (platformName, theme, currentObj) {
  if (currentObj === null || typeof currentObj !== 'object') {
    return null;
  }

  if (!docTokens[theme]) docTokens[theme] = {};
  const tokenName = currentObj.name;
  const tokenValue = currentObj.value;
  const tokenDescription = currentObj?.description;
  const tokenPath = currentObj?.path;

  if (tokenValue && tokenPath) {
    const tokenKey = tokenPath.join('/');

    docTokens[theme][tokenKey] = {
      ...docTokens[theme][tokenKey],
      [platformName]: {
        name: formatTokenName(platformName, tokenName),
        value: tokenValue,
        description: tokenDescription,
        keywords: getTokenKeywords(tokenPath),
      },
    };
    return null;
  }

  for (const key in currentObj) {
    if (!Object.prototype.hasOwnProperty.call(currentObj, key)) { continue; }
    buildDocs(platformName, theme, currentObj[key]);
  }
}

/**
 * Gets the keywords from the keywords.json file
 * for the token category / subcategory
 * @param {Array} tokenPath The path that has first the category, then the subcategory (optional), then the name
 * @returns {Array|undefined} Array with the keywords, or undefined if there are none
 */
function getTokenKeywords (tokenPath) {
  const keywords = [];
  const keywordsCategory = keywordsJson[tokenPath[0]];
  const keywordsSubcategory = keywordsCategory && tokenPath[1] && keywordsCategory[tokenPath[1]];
  if (keywordsCategory) {
    if (keywordsCategory.keywords) keywords.push(...keywordsCategory.keywords);
  }
  if (keywordsSubcategory) {
    if (keywordsSubcategory.keywords) keywords.push(...keywordsSubcategory.keywords);
  }
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
