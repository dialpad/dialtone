import * as dialtoneIcons from '@dialpad/dialtone-icons';
import { pascalCaseToKebabCase } from '@/common/utils';

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
  return Object.keys(dialtoneIcons).map(name => pascalCaseToKebabCase(name));
}

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
  createTemplateFromVueFile,
  getIconNames,
};
