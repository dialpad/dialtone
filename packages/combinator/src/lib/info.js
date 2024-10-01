import { controlMap } from '@/src/lib/control';
import { extendBinding, extendEvent, extendMember } from '@/src/lib/info_extend';
import clone from 'just-clone';

/**
 * Gets component data from the documentation and processing on it
 * to return a 'info' and 'defaults' object.
 *
 * The 'info' object contains all the post-processed documentation data.
 * The 'defaults' object contains a map of default values for each member in 'info'.
 *
 * @param {object} component - The target component.
 * @param {object} documentation - The component documentation.
 * @returns {Array} A newly instantiated info object.
 */
export function getComponentInfo (component, documentation) {
  const info = clone(documentation.find(componentInfo => componentInfo.displayName === component.name));
  extendInfo(info, component);
  return info;
}

/**
 * Delegates the data processing for different member groups.
 *
 * The data processing extends the documentation for each member of a member group.
 * Processing can be customized for each member group by passing in custom handlers
 * to the `processMembers(members, ...handlers)` function.
 *
 * Example:
 * info.events = processMembers(info.events, extendEvent);
 *   Each event member will have the custom `extendEvent(...)` function applied to it.
 *
 * If applicable defaults are set after the member group is fully extended.
 *
 * @param {object} info - The unprocessed info object.
 * @param {object} component - The target component.
 */
function extendInfo (info, component) {
  if (!info) {
    return;
  }

  renameModelProp(info);

  const attributes = getAttributes(info);

  if (info.slots) {
    info.slots = processMembers(info.slots);
  }

  if (info.props) {
    const defaultCache = getComponentDefaults(component);
    info.props = processMembers(info.props, binding => extendBinding(binding, defaultCache));
  }

  if (attributes) {
    info.attributes = processMembers(attributes);
  }

  if (info.events) {
    info.events = processMembers(info.events, extendEvent);
  }
}

/**
 * Renames the prop that contains the custom 'model' tag to its original name.
 *
 * @param {object} info - The unprocessed info object.
 */
function renameModelProp (info) {
  const model = info.props?.find(componentProp => {
    const tags = componentProp.tags;
    return tags
      ? 'model' in tags
      : false;
  });
  if (model) {
    model.name = model.tags.model[0]?.description;
  }
}

/**
 * Gets attribute members by finding custom attribute 'property' tags.
 * Creates a member object for each with name, type and default value.
 *
 * @param {object} info - The unprocessed info object.
 * @returns {Array} - Array of attribute members.
 */
function getAttributes (info) {
  const properties = info.tags.property;

  if (!properties) {
    return null;
  }

  return properties.filter(property => {
    return property.description === 'attribute';
  }).map(property => {
    const type = property.type.name.toLowerCase();
    const defaultValue = controlMap[type].default();
    return {
      name: property.name,
      type: {
        name: type,
      },
      initialValue: defaultValue,
      defaultValue,
    };
  });
}

/**
 * Processes a member group by extending each member with the `extendMember(member)` function.
 * Custom processing can be done on each member by passing a processing function as a parameter.
 *
 * Example:
 * `processMembers(info.events, extendEvent)`
 *
 * Each event member will be processed with the default `extendMember(member)` function and also have the
 * custom `extendEvent(member)` function applied after.
 *
 * Multiple processor functions can be passed in after the 'members' parameter.
 * They are invoked in the order they are passed in.
 *
 * @param {Array} members - The member group to process.
 * @param {Function} processors - The optional, additional member processing functions.
 * @returns {Array} The processed member group.
 */
function processMembers (members, ...processors) {
  return members?.map(member => {
    extendMember(member);
    processors.forEach(processor => {
      processor(member);
    });
    return member;
  });
}

/**
 * Gets all the default values for each possible member of a component.
 *
 * @param {object} component - The target component.
 * @returns {object} Default value map.
 */
function getComponentDefaults (component) {
  /**
   * Get all objects containing members to search for default values.
   * Contains all the base props and props for each mixin.
   *
   * @type {Array}
   */
  const componentSearchObjects = [
    component.props,
    ...(component.mixins?.map(mixin => mixin.props) ?? []),
    ...(component.extends?.mixins?.map(mixin => mixin.props) ?? []),
  ].filter(obj => obj);

  /**
   * Searches each member in each object and returns an object of key-value
   * pairs for each member and its default value respectively.
   */
  return {
    ...Object.fromEntries(componentSearchObjects.filter(path => path).map(path => {
      return Object.entries(path).map(([entryKey, entryValue]) => {
        const entryDefault = entryValue.default;
        return [
          entryKey,
          entryValue.type !== Function && typeof entryDefault === 'function'
            ? entryDefault()
            : entryDefault,
        ];
      });
    }).flat()),
  };
}
