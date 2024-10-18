import { readdirSync } from 'fs';

let UNIQUE_ID_COUNTER = 0;
export function getUniqueString (prefix = 'dt') {
  return `${prefix}${UNIQUE_ID_COUNTER++}`;
}

const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout;
export function flushPromises () {
  return new Promise((resolve) => {
    scheduler(resolve);
  });
}

/**
 * Transform a string from kebab-case to PascalCase
 * @param string
 * @returns {string}
 */
export function kebabCaseToPascalCase (string) {
  return string?.toLowerCase()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Scans recursively through the provided path
 * and gets the valid contained Vue components and recipes.
 * @param {PathLike} folder
 * @returns {PathLike[]}
 */
export function getValidFileList (folder) {
  const parentFolderName = folder.split('/').pop();
  const excludedFolderNamesRegex = /(extensions|modules|decorators)$/;
  const validFileNamesRegex = new RegExp(`^${parentFolderName}\\.vue$`);

  return readdirSync(folder, { withFileTypes: true })
    .filter((item) => (
      (item.isDirectory() && !excludedFolderNamesRegex.test(item.name)) ||
      validFileNamesRegex.test(item.name)
    ))
  .reduce((files, item) => {
    if (item.isDirectory()) files = [...files, ...getValidFileList(`${folder}/${item.name}`)]
    else files.push(`${folder}/${item.name}`);

    return files;
  }, []);
}

export default {
  getUniqueString,
  kebabCaseToPascalCase,
  flushPromises,
  getValidFileList
};
