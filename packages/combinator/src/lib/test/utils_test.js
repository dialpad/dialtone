// eslint-disable-next-line import/no-absolute-path
import supportedComponents from '/src/supported_components.json';
import * as dialtone from '@dialpad/dialtone-vue';

/**
 * Uses the names of supported components from the 'supported_components.json'
 * file and returns an array of matching Dialtone Vue component objects.
 *
 * @returns {Array} Array of supported components
 */
export function getSupportedComponents () {
  return Object.values(dialtone).filter((exportValue) => {
    return supportedComponents.includes(exportValue?.name);
  });
}
