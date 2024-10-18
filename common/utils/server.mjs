/**
 * Contains utilities that will not work on a browser,
 * can use node related imports
 */

import { readdirSync } from 'node:fs';

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
    getValidFileList
}