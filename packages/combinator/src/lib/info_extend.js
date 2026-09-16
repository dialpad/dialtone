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
  normalizeDocValues(member);
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

function normalizeDocValues (member) {
  if (!member.values) return;
  member.values = member.values.map(value => normalizeDocValue(value, member.types));
}

// Only boolean-typed enums are normalized — 'true'/'false' become booleans and the
// quoted 'mixed' sentinel is unwrapped so DtToggle routes to a segmented control.
// Skipping everything else leaves string enums and numeric token strings ('200') intact.
// (parseDocValue/JSON5 isn't reused here precisely because it would coerce '200' to a number.)
function normalizeDocValue (value, types = []) {
  if (typeof value !== 'string' || !types.includes('boolean')) return value;

  if (value === 'true') return true;
  if (value === 'false') return false;
  if (isQuotedString(value)) return value.slice(1, -1);

  return value;
}

function isQuotedString (value) {
  return (
    (value.startsWith('\'') && value.endsWith('\'')) ||
    (value.startsWith('"') && value.endsWith('"'))
  );
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
