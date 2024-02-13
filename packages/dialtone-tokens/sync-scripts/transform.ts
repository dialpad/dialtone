import fs from "fs";

const baseDirPath = './figma_tokens';
const modules = ['base'];
const variables = ['space', 'size', 'radius', 'border']
const defaultBase = JSON.parse(fs.readFileSync(`./tokens/base/default.json`, 'utf8'));

export const transformFigmaToSD = () => {
  const files = fs.readdirSync(baseDirPath);
  const filteredModuleFileNames = files.filter((fileName) => modules.includes(fileName.split('.')[0]));
  const rootFileName = files.filter((fileName) => fileName.split('.')[0] === 'root');
  const parsedRoot = JSON.parse(fs.readFileSync(`${baseDirPath}/${rootFileName}`, 'utf8'));

  filteredModuleFileNames.forEach((fileName) => {
    const parsedFile = JSON.parse(fs.readFileSync(`${baseDirPath}/${fileName}`, 'utf8'));
    const values = extractValues(parsedFile, parsedRoot);
    if (fileName.split('.')[0] === 'base') {
      fs.writeFileSync('./tokens/base/default.json', JSON.stringify({...defaultBase, ...values}));
      console.log(`Updated tokens/base/default.json`);
    }
  })
}

const extractValues = (values, root) => {
  const result = {};
  Object.keys(values).forEach(variable => {
    if (variables.includes(variable)) {
      result[variable] = {...extractValues(values[variable], root)};
      return result;
    }

    const value = values[variable]?.$value
    const parsedValue = replaceValue(value, root);
    result[variable] = {
      value: parsedValue,
      type: values[variable]?.$customType ?? values[variable]?.$type,
    };
  })
  return result;
}

const replaceValue = (value, root) => {
  if (!/\{[\w-]+\}/.test(value)) return value;
  const key = value.replace(/[{}]/g, '');

  return root[key].$value + (root[key].$description || 'px');
}

export default {
  transformFigmaToSD
}
