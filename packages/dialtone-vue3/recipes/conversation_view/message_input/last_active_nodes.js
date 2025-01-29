/* eslint-disable complexity */
/**
 * This function was taken from this thread and modified to work in pure JS:
 * https://github.com/ueberdosis/tiptap/issues/1058#issuecomment-778254557
 *
 * description: This helper, lastActiveNodes, finds the last (furthest from the root document)
 * matching types in your selection (ignoring nesting), you can give it either a list of args
 * similar to isActive or a group name, calling it like below. It will return a list of node
 * type names that are the last ones active in the selection, if the selection is 'empty'
 * (just the cursor) the returned list will only have at most one name.
 * This lets you build a UI for lists that works the same as most word processors.
 *
 * @param {Object} state the tiptap editor instance state
 * @param {*} typesOrGroup node types or node group name to consider
 * @returns {Array} node(s) that are the farthest from the root that matches the given type or group
 */
export default function lastActiveNodes (state, typesOrGroup) {
  if (!state) return [];

  const { from, to } = state.selection;
  let types;

  if (typeof typesOrGroup === 'string') {
    // types is a name of a node group
    types = Object.entries(state.schema.nodes)
      .filter(([name, nodeType]) => nodeType.groups.includes(typesOrGroup))
      .map(([name, nodeType]) => {
        return {
          type: nodeType,
        };
      });
  } else {
    // types is a list of LastActiveNodeItemOption
    types = typesOrGroup;
    for (const item of types) {
      item.type = item.type ? getNodeType(item.type, state.schema) : null;
    }
  }

  let lastNode = null;
  let lastMatchedType = null;
  const matchedTypes = new Set();
  const notFoundTypes = new Set(types);

  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (notFoundTypes.size === 0) return false;
    if (!node.isText) {
      const matchedType = types.filter((item) => {
        if (!item.type) {
          return true;
        }
        if (typeof item.type === 'string') return false; // Typeguard, shouldn't happen
        return node.type.name === item.type.name;
      })
        .find(item => {
          if (!item.attributes) return true;
          return objectIncludes(node.attrs, item.attributes);
        });
      if (matchedType) {
        if (lastMatchedType && lastNode && (lastNode !== parent)) {
          notFoundTypes.delete(lastMatchedType);
          matchedTypes.add(lastMatchedType);
        }
        lastMatchedType = matchedType;
      }
      lastNode = node;
    }
  });

  if (lastMatchedType) {
    matchedTypes.add(lastMatchedType);
  }

  return [...matchedTypes.values()].map((item) => {
    if (item.key) {
      return item.key;
    } else if (typeof item.type === 'string') {
      return item.type;
    } else if (item.type?.name) {
      return item.type.name;
    } else {
      return '';
    }
  });
}

function getNodeType (nameOrType, schema) {
  if (typeof nameOrType === 'string') {
    if (!schema.nodes[nameOrType]) {
      throw Error(
        `There is no node type named '${nameOrType}'. Maybe you forgot to add the extension?`,
      );
    }

    return schema.nodes[nameOrType];
  }

  return nameOrType;
}

export function objectIncludes (
  object1,
  object2,
  options,
) {
  const keys = Object.keys(object2);

  if (!keys.length) {
    return true;
  }

  return keys.every(key => {
    if (options.strict) {
      return object2[key] === object1[key];
    }

    if (Object.prototype.toString.call(object2[key]) === '[object RegExp]') {
      return object2[key].test(object1[key]);
    }

    return object2[key] === object1[key];
  });
}
