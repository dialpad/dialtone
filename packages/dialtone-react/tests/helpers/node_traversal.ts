// dialtone-vue's common/test_utils/node_traversal.js: searches the editor's JSON (RichTextEditor and its Variable
// extension's tests).

export interface EditorNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: EditorNode[];
  [key: string]: unknown;
}

type Predicate = (node: EditorNode) => boolean;

/** Calls `callback` for the node and every node below it, depth first. */
export function traverseNode (node: EditorNode, callback: (node: EditorNode) => void): void {
  callback(node);
  node.content?.forEach(child => traverseNode(child, callback));
}

/** traverseNode over each node of an array (usually the root content). */
export function traverseNodes (nodes: EditorNode[] | null | undefined, callback: (node: EditorNode) => void): void {
  if (Array.isArray(nodes)) nodes.forEach(node => traverseNode(node, callback));
}

export function findNode (nodes: EditorNode[] | null | undefined, predicate: Predicate): EditorNode | null {
  let found: EditorNode | null = null;
  traverseNodes(nodes, (node) => {
    if (!found && predicate(node)) found = node;
  });
  return found;
}

export function findVariable (nodes: EditorNode[] | null | undefined, variableId: string): EditorNode | null {
  return findNode(nodes, node => node.type === 'variable' && node.attrs?.id === variableId);
}

export function findAllNodes (nodes: EditorNode[] | null | undefined, predicate: Predicate): EditorNode[] {
  const found: EditorNode[] = [];
  traverseNodes(nodes, (node) => {
    if (predicate(node)) found.push(node);
  });
  return found;
}

export function findAllVariables (nodes: EditorNode[] | null | undefined): EditorNode[] {
  return findAllNodes(nodes, node => node.type === 'variable');
}

export function countNodes (nodes: EditorNode[] | null | undefined, predicate: Predicate): number {
  return findAllNodes(nodes, predicate).length;
}

export function countVariables (nodes: EditorNode[] | null | undefined): number {
  return countNodes(nodes, node => node.type === 'variable');
}

export function variableExists (nodes: EditorNode[] | null | undefined, variableId: string): boolean {
  return findVariable(nodes, variableId) !== null;
}
