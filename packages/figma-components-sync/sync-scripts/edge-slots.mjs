/**
 * EDGE SLOTS, SEEN BY THE CHECKS.
 *
 * A config with `edgeSlots` builds each variant as root > [Leading (Slot), content, Trailing
 * (Slot)], with the padding moved off the root (see generic-builder.js). The browser has no such
 * wrapper, so every check that pairs the browser's tree with Figma's would pair root > label with
 * root > content > label and report the difference on every node.
 *
 * `flattenEdgeSlots` folds the built shape back into the flat one the DOM has: the wrapper's
 * children become the root's, and the root's padding and gap become what they add up to (the
 * spacer plus the wrapper's inline padding; the wrapper's vertical padding and gap). The checks
 * then run unchanged on a faithful picture of what Figma will lay out. `edgeSlotFindings` is the
 * other half: it checks the structure itself, which the flat picture hides.
 *
 * Only the DEFAULT state is flattened — both slots holding their spacer, which is what the
 * browser renders with neither slot. A slot holding anything else is returned untouched, so the
 * mismatch shows up as findings rather than being folded away.
 */

const SLOT_NAMES = ['Leading (Slot)', 'Trailing (Slot)'];
const num = (v) => (typeof v === 'number' ? v : 0);
/**
 * The padding an EMPTY slot stands for: its own width (its minimum), when its only child is the
 * placeholder. Null for a slot holding anything else.
 */
const spacerWidth = (slot) => {
  const kids = slot.children || [];
  if (kids.length !== 1 || kids[0].name !== 'padding') return null;
  const b = slot.absoluteBoundingBox;
  return b ? b.width : null;
};

/** The flat node, or the original when it is not in the edge-slot shape. */
export function flattenEdgeSlots (node) {
  const kids = node.children || [];
  const wrapper = kids.find(c => c.type === 'FRAME' && c.name === 'content');
  const lead = kids.find(c => c.type === 'SLOT' && c.name === SLOT_NAMES[0]);
  const trail = kids.find(c => c.type === 'SLOT' && c.name === SLOT_NAMES[1]);
  if (!wrapper || !lead || !trail) return node;
  const lw = spacerWidth(lead), tw = spacerWidth(trail);
  if (lw == null || tw == null) return node;

  const bound = { ...(node.boundVariables || {}) };
  for (const f of ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'itemSpacing']) delete bound[f];
  const wb = wrapper.boundVariables || {};
  for (const f of ['paddingTop', 'paddingBottom', 'itemSpacing']) if (wb[f]) bound[f] = wb[f];

  // The wrapper's children take the wrapper's place; anything else on the root (the loading
  // spinner, placed against the root) stays where it is, so the order is the DOM's order.
  const children = [];
  for (const c of kids) {
    if (c === wrapper) children.push(...(wrapper.children || []));
    else if (c !== lead && c !== trail) children.push(c);
  }
  return {
    ...node,
    children,
    paddingLeft: num(node.paddingLeft) + lw + num(wrapper.paddingLeft),
    paddingRight: num(node.paddingRight) + tw + num(wrapper.paddingRight),
    paddingTop: num(node.paddingTop) + num(wrapper.paddingTop),
    paddingBottom: num(node.paddingBottom) + num(wrapper.paddingBottom),
    itemSpacing: num(wrapper.itemSpacing),
    boundVariables: bound,
  };
}

/**
 * The structure the flat picture hides: two slots, a wrapper, a spacer in each slot, the slots
 * stretching the full height, and the wrapper's inline padding equal to the slot gap.
 *
 * @returns [{ path, field, want, got }]
 */
export function edgeSlotFindings (node, edgeSlots) {
  const out = [];
  const add = (field, want, got) => out.push({ path: 'root', field: `edgeSlots:${field}`, want, got });
  const kids = node.children || [];
  const slots = kids.filter(c => c.type === 'SLOT');
  const wrapper = kids.find(c => c.type === 'FRAME' && c.name === 'content');
  if (!wrapper) return [{ path: 'root', field: 'edgeSlots:content', want: 'a content wrapper', got: 'none' }];
  if (slots.map(s => s.name).join('|') !== SLOT_NAMES.join('|')) add('slots', SLOT_NAMES.join(' + '), slots.map(s => s.name).join(' + ') || 'none');
  const order = kids.map(c => c.name);
  if (order[0] !== SLOT_NAMES[0] || order[order.length - 1] !== SLOT_NAMES[1]) add('order', 'leading, content, trailing', order.join(', '));
  for (const s of slots) {
    if (spacerWidth(s) == null) add(`${s.name} default`, 'one padding placeholder', `${(s.children || []).length} child(ren)`);
    if (s.layoutSizingVertical && s.layoutSizingVertical !== 'FILL') add(`${s.name} height`, 'FILL', s.layoutSizingVertical);
    // What a designer drops in is centred on the height, as `align-items: center` does.
    if (s.counterAxisAlignItems !== 'CENTER') add(`${s.name} alignment`, 'CENTER', s.counterAxisAlignItems || 'MIN');
    // The padding lives here; a slot without it would be 0.01px wide and the button would shrink.
    if (!(num(s.minWidth) > 0)) add(`${s.name} minWidth`, '> 0', s.minWidth);
  }
  const gapAfter = num(wrapper.itemSpacing) + edgeSlots.gap;
  // Equal to the gap, or below it where the normal padding is smaller than the gap (the builder
  // clamps and says so); never above it, which would add space the code does not have.
  for (const f of ['paddingLeft', 'paddingRight']) {
    const got = num(wrapper[f]);
    if (got > gapAfter + 0.01 || got <= 0) add(`content ${f}`, `0 < x <= ${gapAfter}`, got);
  }
  if (node.clipsContent !== true) add('clipsContent', true, node.clipsContent);
  return out;
}
