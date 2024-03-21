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
        keywords: getTokenKeywords(keywordsJson, tokenPath),
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
 * @param {Object} obj Object with the token information
 * @param {Array} tokenPath The path that has first the category, then the subcategory (optional), then the name
 * @param {Array} keywords Array with the keywords. Is completed by recursively looping through obj
 * @returns {Array|undefined} Array with the keywords, or undefined if there are none
 */
function getTokenKeywords (obj, tokenPath, keywords = []) {
  if (tokenPath.legth === 0 || !obj) return;
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
