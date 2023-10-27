import fs from 'fs';

// stores the documentation data for all tokens. This is output to file.
let docTokens = {}

// Recurse through style dictionary object and pick out
// bottom level token values.
export function buildDocs(platformName, theme, currentObj) {
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
      }
    }
    return null;
  }

  for (const key in currentObj) {
    if (!currentObj.hasOwnProperty(key))
      continue;
    buildDocs(platformName, theme, currentObj[key]);
  }
}

function formatTokenName(platformName, tokenName) {
  if (platformName === 'css/variables') {
    return `var(--${tokenName})`;
  }
  return tokenName;
}

export function writeDocs() {
  const DOC_OUTPUT_PATH = './dist/doc.json';
  fs.writeFile(DOC_OUTPUT_PATH, JSON.stringify(docTokens, null, 2), err => {
    if (err) {
      throw err
    }
    console.info(`Token documentation data written to ${DOC_OUTPUT_PATH}`)
  });
}
