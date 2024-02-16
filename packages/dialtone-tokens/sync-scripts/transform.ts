import fs from 'fs';

const baseDirPath = './figma_tokens';
const modules = ['base'];
const variables = ['space', 'size', 'radius', 'border'];

const files = fs.readdirSync(baseDirPath);
const filteredModuleFileNames = files.filter((fileName) => modules.includes(fileName.split('.')[0]));
const rootFileName = files.filter((fileName) => fileName.split('.')[0] === 'root');

const defaultBase = JSON.parse(fs.readFileSync(`./tokens/base/default.json`, 'utf8'));
const parsedRoot = JSON.parse(fs.readFileSync(`${baseDirPath}/${rootFileName}`, 'utf8'));

export const transformFigmaToSD = () => {
  filteredModuleFileNames.forEach((fileName) => {
    const parsedFile = JSON.parse(fs.readFileSync(`${baseDirPath}/${fileName}`, 'utf8'));
    const values = extractValues(parsedFile);
    if (fileName.split('.')[0] === 'base') {
      fs.writeFileSync('./tokens/base/default.json', JSON.stringify({ ...defaultBase, ...values }));
      console.log(`Updated tokens/base/default.json`);
    }
  });
};

const extractValues = (values: JSON) => {
  const result = {};
  Object.keys(values).forEach(variable => {
    if (variables.includes(variable)) {
      result[variable] = { ...extractValues(values[variable]) };
      return result;
    }

    const value = values[variable]?.$value;
    const parsedValue = replaceValue(variable, value);
    result[variable] = {
      value: parsedValue,
      type: values[variable]?.$customType ?? values[variable]?.$type,
    };
    return result;
  });
  return result;
};

const replaceValue = (variableName: string, valueKey: string) => {
  if (!/\{[\w-]+\}/.test(valueKey)) return valueKey;
  const key = valueKey.replace(/[{}]/g, '');
  const value = parsedRoot[key].$value;

  if (variableName.endsWith('-percent')) return `${value}%`;
  else return `${value}px`;
};

export default {
  transformFigmaToSD,
};
