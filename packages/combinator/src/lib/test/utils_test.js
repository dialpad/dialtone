import * as dialtone from '@dialpad/dialtone-vue';
import documentation from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import { mount } from '@vue/test-utils';
import { isSupportedComponent } from '@/src/lib/component_support';

export const ADD_BUTTON_SELECTOR = '[aria-label^="Add value"]';
export const REMOVE_BUTTON_SELECTOR = '[aria-label^="Remove value"]';

/**
 * Returns documented Dialtone Vue components that are not explicitly denied
 * by the Combinator support map.
 *
 * @returns {Array} Array of supported components
 */
export function getSupportedComponents () {
  return Object.values(dialtone).filter((exportValue) => {
    return isSupportedComponent(exportValue?.name, documentation);
  });
}

/**
 * Mounts a clearable control the way its test files do: attached to the document
 * (so focus assertions resolve) with a default 'Label' slot. Shared by the string,
 * number, slot, and segmented control tests, which otherwise duplicate this setup.
 *
 * @param {object} component - The control component to mount.
 * @param {object} [props] - Props to pass to the control.
 * @returns {import('@vue/test-utils').VueWrapper} The mounted wrapper.
 */
export function mountClearableControl (component, props = {}) {
  return mount(component, {
    attachTo: document.body,
    props,
    slots: { default: 'Label' },
  });
}
