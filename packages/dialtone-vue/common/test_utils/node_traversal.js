/**
 * Utility functions for traversing and searching nodes in editor JSON structures
 */

/**
 * Traverses a node tree and calls a callback function for each node
 * @param {Object} node - The node to traverse
 * @param {Function} callback - Function to call for each node
 */
export function traverseNode(node, callback) {
  callback(node);
  if (node.content) {
    node.content.forEach(childNode => traverseNode(childNode, callback));
  }
}

/**
 * Traverses an array of nodes (typically the root content array)
 * @param {Array} nodes - Array of nodes to traverse
 * @param {Function} callback - Function to call for each node
 */
export function traverseNodes(nodes, callback) {
  if (nodes && Array.isArray(nodes)) {
    nodes.forEach(node => traverseNode(node, callback));
  }
}

/**
 * Finds a node matching a condition in the node tree
 * @param {Array} nodes - Array of nodes to search
 * @param {Function} predicate - Function that returns true when the desired node is found
 * @returns {Object|null} The found node or null
 */
export function findNode(nodes, predicate) {
  let foundNode = null;

  traverseNodes(nodes, (node) => {
    if (!foundNode && predicate(node)) {
      foundNode = node;
    }
  });

  return foundNode;
}

/**
 * Finds a variable node by its ID
 * @param {Array} nodes - Array of nodes to search
 * @param {string} variableId - The ID of the variable to find
 * @returns {Object|null} The variable node or null
 */
export function findVariable(nodes, variableId) {
  return findNode(nodes, node =>
    node.type === 'variable' && node.attrs?.id === variableId,
  );
}

/**
 * Finds all nodes matching a condition
 * @param {Array} nodes - Array of nodes to search
 * @param {Function} predicate - Function that returns true for nodes to include
 * @returns {Array} Array of matching nodes
 */
export function findAllNodes(nodes, predicate) {
  const foundNodes = [];

  traverseNodes(nodes, (node) => {
    if (predicate(node)) {
      foundNodes.push(node);
    }
  });

  return foundNodes;
}

/**
 * Finds all variable nodes in the node tree
 * @param {Array} nodes - Array of nodes to search
 * @returns {Array} Array of variable nodes
 */
export function findAllVariables(nodes) {
  return findAllNodes(nodes, node => node.type === 'variable');
}

/**
 * Counts nodes matching a condition
 * @param {Array} nodes - Array of nodes to search
 * @param {Function} predicate - Function that returns true for nodes to count
 * @returns {number} Count of matching nodes
 */
export function countNodes(nodes, predicate) {
  let count = 0;

  traverseNodes(nodes, (node) => {
    if (predicate(node)) {
      count++;
    }
  });

  return count;
}

/**
 * Counts variable nodes in the node tree
 * @param {Array} nodes - Array of nodes to search
 * @returns {number} Count of variable nodes
 */
export function countVariables(nodes) {
  return countNodes(nodes, node => node.type === 'variable');
}

/**
 * Checks if a variable with a specific ID exists
 * @param {Array} nodes - Array of nodes to search
 * @param {string} variableId - The ID of the variable to check
 * @returns {boolean} True if the variable exists
 */
export function variableExists(nodes, variableId) {
  return findVariable(nodes, variableId) !== null;
}
