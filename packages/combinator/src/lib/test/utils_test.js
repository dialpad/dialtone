import supportedComponents from '/src/supported_components.json';
import * as dialtone from '@dialpad/dialtone-vue';
import { mount } from '@vue/test-utils';

export const ADD_BUTTON_SELECTOR = '[aria-label="Add value"]';
export const REMOVE_BUTTON_SELECTOR = '[aria-label="Remove value"]';

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
