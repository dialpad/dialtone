/**
 * Update an existing variant set IN PLACE, instead of deleting it and building a new one.
 *
 * ITS OWN FILE, like slot-properties.js: build-plugin.mjs inlines it into the generated plugin, and
 * keeping it out of a template literal means prose here is just prose. No backticks and no
 * dollar-brace anywhere in this file for the same reason.
 *
 * WHY. A rebuild gives every set, every variant and every component property a new id and a new
 * key. That is harmless while nobody uses the library, and breaks every instance in a consumer file
 * the moment someone does: the instances point at components that no longer exist. In place keeps
 * the set, each variant component and the component properties, so a library update reaches the
 * instances instead of orphaning them.
 *
 * WHAT IS KEPT (measured on a throwaway set): the set's and each variant's id and key, the
 * component property ids, an instance's link to its component, its property overrides (label text,
 * toggles, instance swaps), and the content a designer dropped into a native slot. WHAT IS NOT: an
 * override made directly on a layer, such as a colour set on a nested frame, because the layers are
 * the new build's. That is the known cost of this approach, and it is why the layers are replaced
 * only where the build changed them.
 *
 * HOW. The build makes every variant as a loose component, exactly as before. Each one then
 * donates its children and its own settings to the existing variant with the same name and is
 * discarded. A variant the build adds is moved into the set, and one it no longer makes is removed.
 */

/**
 * The settings of a variant's own frame. Order matters: the layout mode first, the size before the
 * sizing modes (a resize turns a hugging axis fixed), the paints before the styles that replace
 * them. Each is copied only when it differs, and one that cannot be set is counted, not fatal.
 */
const IN_PLACE_FIELDS = [
  'layoutMode', 'layoutWrap', 'layoutPositioning',
  'width', 'height',
  'primaryAxisSizingMode', 'counterAxisSizingMode', 'primaryAxisAlignItems', 'counterAxisAlignItems',
  'counterAxisAlignContent', 'itemSpacing', 'counterAxisSpacing', 'itemReverseZIndex',
  'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
  'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
  'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', 'cornerSmoothing',
  'clipsContent', 'opacity', 'blendMode', 'isMask',
  'fills', 'strokes', 'strokeAlign', 'strokeTopWeight', 'strokeBottomWeight', 'strokeLeftWeight',
  'strokeRightWeight', 'strokesIncludedInLayout', 'dashPattern', 'strokeCap', 'strokeJoin',
  'strokeMiterLimit', 'effects',
  'fillStyleId', 'strokeStyleId', 'effectStyleId',
];

/** The number-valued fields a variable can be bound to; paints and effects carry their own binding. */
function inPlaceIsBoundField (value) {
  return value && !Array.isArray(value) && typeof value === 'object' && value.id;
}

async function swapVariantContents (old, fresh) {
  const failed = [];
  // Where each absolutely positioned child sits in the new build. Moving a child into a component of a
  // different size lets a centre constraint shift it (measured: Button's spinner and icons), so the
  // component takes its new size FIRST, and these are written back after the children arrive.
  const placed = [];
  for (const c of fresh.children) {
    if (c.layoutPositioning === 'ABSOLUTE') placed.push([c, c.x, c.y]);
  }
  for (const c of [...old.children]) c.remove();

  // Unbind first: a field still bound to a variable would take the new value as an override.
  const oldBound = old.boundVariables || {};
  for (const k of Object.keys(oldBound)) {
    if (!inPlaceIsBoundField(oldBound[k])) continue;
    try { old.setBoundVariable(k, null); } catch (e) { failed.push('unbind ' + k); }
  }
  for (const k of IN_PLACE_FIELDS) {
    if (!(k in fresh)) continue;
    try {
      if (k === 'width') {
        if (fresh.width !== old.width || fresh.height !== old.height) old.resize(fresh.width, fresh.height);
      } else if (k !== 'height' && JSON.stringify(old[k]) !== JSON.stringify(fresh[k])) {
        old[k] = fresh[k];
      }
    } catch (e) { failed.push(k); }
  }
  for (const c of [...fresh.children]) old.appendChild(c);
  for (const [c, x, y] of placed) {
    try { c.x = x; c.y = y; } catch (e) { failed.push('position ' + c.name); }
  }
  const freshBound = fresh.boundVariables || {};
  for (const k of Object.keys(freshBound)) {
    if (!inPlaceIsBoundField(freshBound[k])) continue;
    try {
      const v = await figma.variables.getVariableByIdAsync(freshBound[k].id);
      if (v) old.setBoundVariable(k, v);
    } catch (e) { failed.push('bind ' + k); }
  }
  return failed;
}

/**
 * Do the new build's variant properties (Size, State, ...) match the existing set's? A new or
 * removed AXIS changes what every variant is called, so that set is rebuilt from scratch instead.
 */
function inPlaceSameAxes (set, loose) {
  try {
    const defs = set.componentPropertyDefinitions || {};
    const have = Object.keys(defs).filter(k => defs[k].type === 'VARIANT').map(k => k.toLowerCase()).sort();
    const want = loose[0].name.split(', ').map(s => s.split('=')[0].toLowerCase()).sort();
    return have.length === want.length && have.every((k, i) => k === want[i]);
  } catch (e) { return false; }
}

/**
 * Swap the new build's variants into an existing set. `loose` are the components the build made,
 * already laid out, in the order the dropdown should list them.
 */
async function updateSetInPlace (set, loose) {
  const existing = new Map();
  for (const c of set.children) if (c.type === 'COMPONENT') existing.set(c.name, c);
  const order = loose.map(n => n.name);
  const failed = [];
  const added = [], removed = [];
  let updated = 0;
  for (const n of loose) {
    const x = n.x, y = n.y;
    const old = existing.get(n.name);
    if (!old) {
      set.appendChild(n);
      n.x = x; n.y = y;
      added.push(n.name);
      continue;
    }
    for (const f of await swapVariantContents(old, n)) failed.push(n.name + ': ' + f);
    old.x = x; old.y = y;
    n.remove();
    existing.delete(n.name);
    updated++;
  }
  for (const [name, old] of existing) { old.remove(); removed.push(name); }
  // The layer order is the order of a property's options in the dropdown.
  const byName = new Map();
  for (const c of set.children) byName.set(c.name, c);
  for (let i = 0; i < order.length; i++) {
    const c = byName.get(order[i]);
    if (c && set.children[i] !== c) set.insertChild(i, c);
  }
  let w = 1, h = 1;
  for (const c of set.children) { w = Math.max(w, c.x + c.width); h = Math.max(h, c.y + c.height); }
  set.resize(Math.ceil(w), Math.ceil(h));
  return { updated, added, removed, failed };
}

/**
 * A stand-in for the set that adds a component property only when the set has no property of that
 * name, so applySlotProperties can run on an existing set and bind the new layers to the properties
 * that are already there (their ids are what an instance's overrides hang on). Anything else it
 * reads off the real set.
 */
function reusingProperties (set) {
  const byName = {};
  const defs = set.componentPropertyDefinitions || {};
  // A variant property is not one the build adds, and it can share a name with one that is: DtInput's
  // Description axis and its Description text. Only the properties the build adds are reused.
  for (const k of Object.keys(defs)) if (defs[k].type !== 'VARIANT') byName[k.split('#')[0]] = k;
  const used = new Set();
  return {
    used,
    addComponentProperty (name, type, value) {
      const k = byName[name];
      if (k) {
        if (defs[k].type !== type) throw new Error('property "' + name + '" is ' + defs[k].type + ', the build wants ' + type);
        used.add(k);
        return k;
      }
      const made = set.addComponentProperty(name, type, value);
      byName[name] = made;
      used.add(made);
      return made;
    },
  };
}
