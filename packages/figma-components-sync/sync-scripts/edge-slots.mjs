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

/**
 * A frame that holds a negative inline margin as an OVERHANG (see `ov` in the builder): the frame
 * is the box the layout sees and its one absolutely-positioned child hangs over the edge. The
 * browser's element is the whole icon box, so the frame is given the child's box — the box the
 * code measures — and its position and width then compare as they always did.
 */
function unhang (c) {
  const kid = c.type === 'FRAME' && (c.children || []).length === 1 ? c.children[0] : null;
  if (!kid || kid.layoutPositioning !== 'ABSOLUTE' || !kid.absoluteBoundingBox || !c.absoluteBoundingBox) return c;
  return { ...c, absoluteBoundingBox: kid.absoluteBoundingBox };
}

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
    if (c === wrapper) children.push(...(wrapper.children || []).map(unhang));
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
  // The root clips to its corners, unless an absolute child sits outside its box (DtSegmentedControlItem's
  // divider, in the gap before it): clipped, that child would never be painted. Same rule as the builder.
  const box = node.absoluteBoundingBox;
  const outside = !!box && kids.some((k) => {
    const b = k.layoutPositioning === 'ABSOLUTE' ? k.absoluteBoundingBox : null;
    return b && (b.x < box.x - 0.01 || b.y < box.y - 0.01
      || b.x + b.width > box.x + box.width + 0.01 || b.y + b.height > box.y + box.height + 0.01);
  });
  if (node.clipsContent !== !outside) add('clipsContent', !outside, node.clipsContent);
  return out;
}

/**
 * A slot that holds several children, as those children in its place (`slotGroups`).
 *
 * The browser's group has its items as children; the Figma set holds them in one slot so any number can
 * be dropped in. The checks pair children one to one, and a slot with one child is already seen through
 * (see `compareNode`), so a slot with several is replaced by them here.
 */
export function flattenGroupedSlots (node) {
  const kids = [];
  for (const c of node.children || []) {
    const sub = flattenGroupedSlots(c);
    if (sub.type === 'SLOT' && (sub.children || []).length >= 2) kids.push(...sub.children);
    else kids.push(sub);
  }
  return { ...node, children: kids };
}

/** The reshaping of a set's Figma tree before it is compared with the render, or null when it needs none. */
export function figmaTransformFor (cfg) {
  const steps = [];
  if (cfg.edgeSlots) steps.push(flattenEdgeSlots);
  if (cfg.slotGroups) steps.push(flattenGroupedSlots);
  return steps.length ? (node) => steps.reduce((n, f) => f(n), node) : null;
}
