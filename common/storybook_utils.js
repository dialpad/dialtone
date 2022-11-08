/**
 * Will use a Vue SFC to render the template rather than a template string.
 * This is useful for more complex components that are hard to work with and
 * get messy when rendered via a template string. Will pass args and argTypes
 * into the component so it is able to be live edited with storybook controls addon.
 * @param {object} args storybook control args
 * @param {object} argTypes storybook control argument settings
 * @param {component} templateComponent vue component template for rendering to storybook.
 *                                      Note this should not be the component itself,
 *                                      but rather the usage of that component.
 * @returns {component} the template component with props and args added.
 */
export const createTemplateFromVueFile = (args, argTypes, templateComponent) => {
  templateComponent.props = Object.keys(argTypes);
  templateComponent.args = args;
  return templateComponent;
};

/**
 * Gets the full list of icon component names from the dialtone package
 * @returns {string[]} icon component names
 */
export function getIconNames () {
  const requireContext = require.context(
    '../node_modules/@dialpad/dialtone/lib/dist/vue/icons',
    false,
    /[A-Z]\w+\.(vue|js)$/,
  );

  return ['', ...getComponentFilesFromDir(requireContext).map(item => item.componentName)];
}

/**
 * Gets the full list of dialtone SVG icon names from the dialtone package
 * Also sets the context to use Dialtone Vue icons without bundling them.
 * @returns {string[]} icon names
*/
export function getV7IconNames () {
  const requireContext = require.context(
    '../node_modules/@dialpad/dialtone/lib/dist/svg/v7',
    false,
    /[A-Z]\w+\.svg$/i,
  );

  return [...getComponentFilesFromDir(requireContext).map(item => item.componentName)];
}

/**
 * Extracts filename and component name from all files in a directory.
 * @param {object} requireContext - a requireContext containing the path of the
 * directory you would like to read files from
 * @returns {{fileName: string, componentName: string}[]} array of objects containing both the
 * filename and component name in PascalCase.
 */
export const getComponentFilesFromDir = (requireContext) => {
  const files = [];
  requireContext.keys().forEach(fileName => {
    // Get PascalCase name of component
    const componentName = fileName.split('/').pop().replace(/\.\w+$/, '');

    files.push({ fileName, componentName });
  });
  return files;
};

export const generateTemplate = (component,
  { props = [], excludeProps = [], customProps = [], childTemplate } = {}) => {
  if (!component) {
    console.warn('Generate template: Please provide a component');
    return '';
  }

  const { name, props: componentProps } = component;
  const finalProps = props.length ? props : Object.keys(componentProps);
  const normalizedName = name.split(/(?=[A-Z])/).join('-').toLowerCase();

  const startFragment = `<${normalizedName}`;

  const propFragments = finalProps
    .filter(prop => !excludeProps.includes(prop))
    .map(prop => `:${prop}="${prop}"`);

  const endFragment = childTemplate ? `>${childTemplate}</${normalizedName}>` : ' />';

  return [startFragment, ...propFragments, ...customProps, endFragment].join(' ');
};

export default {
  generateTemplate,
  getComponentFilesFromDir,
  createTemplateFromVueFile,
  getIconNames,
};
