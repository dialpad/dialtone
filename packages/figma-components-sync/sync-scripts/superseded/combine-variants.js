/**
 * Combine every loose COMPONENT on a page into one variant set.
 *
 * A SEPARATE step, not part of generic-builder.js, for two reasons: a large
 * component is built in shards and can only be combined once the last shard has
 * landed, and this call needs no payload — keeping it separate keeps a 500KB build
 * payload out of a call that does not use it.
 *
 * Pasted into `use_figma` with `const PAGE = '<name>';` prepended.
 */
const page = figma.root.children.find(p => p.name === PAGE);
if (!page) throw new Error(`no page named ${PAGE}`);
await figma.setCurrentPageAsync(page);

const loose = page.children.filter(c => c.type === 'COMPONENT');
const existing = page.children.filter(c => c.type === 'COMPONENT_SET');
if (!loose.length) {
  return { combined: 0, sets: existing.map(s => ({ id: s.id, name: s.name, variants: s.children.length })) };
}
// combineAsVariants derives the property names from the "prop=value, prop=value"
// component names the builder writes, so the axis names carry over untouched.
const set = figma.combineAsVariants(loose, page);
set.name = PAGE;
set.x = 0; set.y = 0;
return {
  combined: loose.length,
  setId: set.id,
  setName: set.name,
  variants: set.children.length,
  properties: Object.keys(set.componentPropertyDefinitions || {}),
};
