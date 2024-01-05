import iconNames from '@dialpad/dialtone-icons/dist/icons.json';

/**
 * Will use a Vue SFC to render the template rather than a template string.
 * This is useful for more complex components that are hard to work with and
 * get messy when rendered via a template string. Will pass args and argTypes
 * into the component, so it is able to be live edited with storybook controls addon.
 * @param component this will get the component name
 * @param defaultTemplate we will mount in this component
 * @param argsData storybook control args
 * @returns {component} the template component with props and args added.
 */

export function createRenderConfig (component, defaultTemplate, argsData) {
  return {
    components: { [component.name]: defaultTemplate },
    props: [...Object.keys(component.props ?? {}), ...Object.keys(argsData)],
    setup (props) {
      return { props };
    },
    template: `<${component.name} v-bind="props" />`,
  };
}

/**
 * Gets the full list of icon component names from the dialtone package
 * @returns {string[]} icon component names
 */
export function getIconNames () {
  return [undefined, ...iconNames];
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
  getIconNames,
  createRenderConfig,
};
