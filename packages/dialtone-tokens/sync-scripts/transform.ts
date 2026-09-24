import fs from 'fs';

const modules = ['base'];
const variables = ['space', 'size', 'radius', 'border'];

/**
 * Folds a directory of Figma-exported token files back into the Style
 * Dictionary sources.
 *
 * Every read happens here rather than at module scope. The caller creates the
 * directory at runtime, so reading it while the module loads meant importing
 * this file threw `ENOENT` before `main()` had a chance to write anything —
 * which is exactly what happened once the committed `figma_tokens/` directory
 * was removed.
 *
 * The directory is a parameter for the same reason: the caller accepts
 * `--output`, and a hard-coded path silently read a different directory to the
 * one just written.
 */
export const transformFigmaToSD = (baseDirPath = './figma_tokens') => {
  if (!fs.existsSync(baseDirPath)) {
    console.log(`No ${baseDirPath} directory, nothing to fold back into the token sources`);
    return;
  }

  const files = fs.readdirSync(baseDirPath);
  const rootFileName = files.find((fileName) => fileName.split('.')[0] === 'root');
  if (!rootFileName) {
    console.log(`No root file in ${baseDirPath}, nothing to fold back into the token sources`);
    return;
  }

  const defaultBase = JSON.parse(fs.readFileSync('./tokens/base/default.json', 'utf8'));
  const parsedRoot = JSON.parse(fs.readFileSync(`${baseDirPath}/${rootFileName}`, 'utf8'));

  files
    .filter((fileName) => modules.includes(fileName.split('.')[0]))
    .forEach((fileName) => {
      const parsedFile = JSON.parse(fs.readFileSync(`${baseDirPath}/${fileName}`, 'utf8'));
      const values = extractValues(parsedFile, parsedRoot);
      if (fileName.split('.')[0] === 'base') {
        fs.writeFileSync('./tokens/base/default.json', JSON.stringify({ ...defaultBase, ...values }));
        console.log(`Updated tokens/base/default.json`);
      }
    });
};

const extractValues = (values: JSON, parsedRoot) => {
  const result = {};
  Object.keys(values).forEach(variable => {
    if (variables.includes(variable)) {
      result[variable] = { ...extractValues(values[variable], parsedRoot) };
      return result;
    }

    const value = values[variable]?.$value;
    const parsedValue = replaceValue(variable, value, parsedRoot);
    result[variable] = {
      value: parsedValue,
      type: values[variable]?.$customType ?? values[variable]?.$type,
      description: values[variable]?.$description,
    };
    return result;
  });
  return result;
};

const replaceValue = (variableName: string, valueKey: string, parsedRoot) => {
  if (!/\{[\w-]+\}/.test(valueKey)) return valueKey;
  const key = valueKey.replace(/[{}]/g, '');
  const value = parsedRoot[key].$value;

  if (variableName.endsWith('-percent') || parsedRoot[key].$description === '%') return `${value}%`;
  else return `${value}px`;
};

export default {
  transformFigmaToSD,
};
