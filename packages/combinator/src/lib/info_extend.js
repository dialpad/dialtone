import { paramCase } from 'change-case';
import { typeOfMemberValue } from '@/src/lib/utils';
import { capitalize } from 'vue';

/**
 * The default processing function that is applied to every member in a member group.
 *
 * Sets a predetermined default value and default type for a member.
 * Also adds a getter for a label value.
 *
 * @param {object} member - The extended member.
 */
export function extendMember (member) {
  if (member.type) {
    const typeString = member.type.name ?? member.type.names?.[0];
    delete member.type;
    if (typeString) {
      member.types = extractMemberTypes(typeString);
    }
  }
  if (member.name) {
    member.label = paramCase(member.name);
  }
  if (member.description) {
    member.description = capitalize(member.description);
  }
}

export function extendBinding (member, defaults) {
  const defaultValue = Object.entries(defaults).find(([name]) => {
    return name === member.name;
  })?.[1];

  const defaultType = typeOfMemberValue(defaultValue);

  delete member.defaultValue;
  if (defaultValue !== undefined) {
    member.initialValue = defaultValue;
    member.defaultValue = defaultValue;
  }

  if (defaultType) {
    member.defaultType = defaultType;
  }
}

/**
 * Splits a member type string into an array of type names.
 *
 * @param {string} typeString - The member type string.
 * @returns {Array} Array of types for member.
 */
function extractMemberTypes (typeString) {
  return typeString.split('|').map(type => type.trim().toLowerCase());
}

/**
 * Extends an event member.
 *
 * Event members use the custom 'type' tag so their type data
 * is stored differently than other members.
 *
 * This corrects the type data to the same format.
 *
 * @param {object} event - The event member.
 */
export function extendEvent (event) {
  const types = event.type?.names?.[0];
  delete event.type;
  if (types) {
    event.types = extractMemberTypes(types);
  }
}
