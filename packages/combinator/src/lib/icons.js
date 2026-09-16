import iconNames from '@dialpad/dialtone-icons/icons.js';

export { iconNames };

/**
 * Returns true if the member represents an icon slot.
 *
 * @param {object} member
 * @returns {boolean}
 */
export function isIconSlot (member) {
  const name = member.name;
  return name === 'icon' || name.endsWith('Icon') || name.endsWith('Icons');
}

/**
 * Converts an icon name to a Vue template string.
 * If the slot has a size binding, includes :size="iconSize".
 *
 * @param {string} iconName - e.g. "phone"
 * @param {boolean} isScoped - whether the slot provides bindings
 * @returns {string} e.g. "<dt-icon-phone :size=\"iconSize\" />"
 */
export function iconNameToTemplate (iconName, isScoped) {
  const tag = `dt-icon-${iconName}`;
  return isScoped
    ? `<${tag} :size="iconSize" />`
    : `<${tag} />`;
}

/**
 * Extracts the icon name from a template string.
 *
 * @param {string} template - e.g. "<dt-icon-phone />" or "<dt-icon-phone :size=\"iconSize\" />"
 * @returns {string|null} e.g. "phone", or null if not recognized
 */
export function templateToIconName (template) {
  if (!template) return null;
  const match = template.match(/<dt-icon-([a-z0-9-]+)/);
  return match ? match[1] : null;
}

/**
 * Determines if a slot has scoped bindings (icon-size or size).
 *
 * @param {Array} bindings
 * @returns {boolean}
 */
export function hasIconSizeBinding (bindings) {
  if (!bindings?.length) return false;
  return bindings.some(b => {
    const name = b.name ?? b;
    return name === 'icon-size' || name === 'iconSize' || name === 'size';
  });
}
