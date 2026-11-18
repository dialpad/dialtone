import { getDoclets } from 'vue-docgen-api';

function declaredBindings (node, siblings) {
  for (const sibling of siblings.slice(0, siblings.indexOf(node)).reverse()) {
    if (sibling.type === 2 && !sibling.content.trim()) continue;
    if (sibling.type !== 3) break;
    const tags = getDoclets(sibling.content).tags || [];
    if (tags.some(tag => tag.title === 'slot')) return tags.filter(tag => tag.title === 'binding');
  }
  return [];
}

// vue-docgen can drop declared bindings beside inferred ones on a spread slot.
export function preserveDeclaredSlotBindings (documentation, node, siblings) {
  if (node.tag !== 'slot') return;
  if (node.props.some(prop => prop.type === 7 && prop.arg?.content === 'name')) return;
  const declared = declaredBindings(node, siblings);
  if (!declared.length) return;
  const name = node.props.find(prop => prop.type === 6 && prop.name === 'name');
  const slot = documentation.getSlotDescriptor(name?.value?.content || 'default');
  const declaredNames = new Set(declared.map(binding => binding.name));
  slot.bindings = [...new Map([
    ...(slot.bindings || []).map(binding => {
      const camelName = binding.name.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
      const name = declaredNames.has(camelName) ? camelName : binding.name;
      return [name, { ...binding, name }];
    }),
    ...declared.map(binding => [binding.name, binding]),
  ]).values()];
}
