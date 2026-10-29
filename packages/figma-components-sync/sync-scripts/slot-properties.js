/**
 * Attach the component properties that make a slot usable, and bind them to their layers.
 *
 * ITS OWN FILE, on purpose. This code used to live inline in a template literal inside
 * build-plugin.mjs, and a BACKTICK in one of its comments terminated that template and
 * broke the generator — the fifth time this file has been bitten that way (a dollar-brace
 * did it three times before). Extracting it removes the whole class of trap: prose here is
 * just prose. build-plugin.mjs inlines it the same way it inlines generic-builder.js and
 * icon-builder.js, so it stays versioned and fingerprinted.
 *
 * Called AFTER combineAsVariants, because component properties live on the SET.
 */
async function applySlotProperties (set, slotLayers, textLayers) {
  /**
   * SLOT PROPERTIES. This is what makes a slot usable rather than merely present.
   *
   * Added to the SET, not to each variant: one property covers all of them, which is
   * both what Figma supports and what a designer expects — toggling "Show start icon"
   * should not have to be repeated per size.
   *
   * Named like the hand-built DtBadge and DtChip: a "Start icon" toggle beside a
   * "Start icon choice" swap. The two rows share a stem but not a label, so nobody has to
   * tell which is which.
   *
   * NOTE: no backticks anywhere in this block. It is generated INSIDE a template
   * literal, so a backtick here ends the template and the generator stops parsing —
   * the same trap as the dollar-brace warned about in probeSpreadWrite, which is now
   * the fourth time this file has bitten that way.
   *
   * A REPLACEMENT slot gets no toggle. The component draws its own default and the
   * swap replaces it; a toggle there would offer to hide something the component
   * actually renders.
   */
  // Plain names, matching the hand-built DtBadge and DtChip: a visibility toggle is
  // "Start icon", an instance swap is "Start icon choice". The earlier eye and arrow
  // prefixes copied the old library, which is being replaced by that convention.
  //
  // Direction words stay logical: slot names come from the Vue API, and
  // .claude/rules/logical-naming.md forbids introducing a physical name in anything new.
  const humanise = slotLabel;
  const bySlot = {};
  for (const L of slotLayers) {
    bySlot[L.slot] = bySlot[L.slot] || { kind: L.kind, layers: [], swapDefault: null };
    bySlot[L.slot].layers.push(L);
    if (!bySlot[L.slot].swapDefault && L.swapDefaultId) bySlot[L.slot].swapDefault = L.swapDefaultId;
  }
  /**
   * A SWAP PROPERTY FORCES ONE VALUE ACROSS EVERY VARIANT BOUND TO IT.
   *
   * Measured the hard way. DtNotice's kind glyph differs per kind and its action button
   * differs with `important`; binding all 80 layers of each to one INSTANCE_SWAP made every
   * variant show the property's single default — 64 of 80 glyphs wrong (four of the five
   * kinds), and all 40 important notices showing a muted action button.
   *
   * It looked fine twice. An isolated add-bind-read test reported the values preserved, and a
   * REST read reported three of five kinds correct — because REST returns an instance's STORED
   * componentId, not the value it resolves to through a bound property. Only the plugin API,
   * read after the property was removed, matched what Figma actually renders.
   *
   * So where the content varies, ONE PROPERTY PER DEFAULT, each bound only to the layers that
   * want that default, named for the axis value that explains it: "Icon choice · critical".
   * That is how the hand-built DtChip does it per size, and it gives every variant its own
   * glyph while keeping a panel control. See splitByAxis for when this applies.
   *
   * When no single axis separates the defaults (the icon depends on a combination of axes),
   * the old trade stands: one property, one default, and the count is reported so the
   * trade is visible on every build rather than remembered.
   */
  for (const info of Object.values(bySlot)) {
    const ids = [...new Set(info.layers.map(L => L.swapDefaultId).filter(Boolean))];
    if (ids.length > 1) {
      const split = splitByAxis(info.layers, ids);
      if (split) info.swapGroups = split; else info.varies = ids.length;
    }
  }
  for (const [slot, info] of Object.entries(bySlot)) {
    const label = humanise(slot);
    try {
      if (info.kind === 'additive') {
        info.boolProp = set.addComponentProperty(label, 'BOOLEAN', false);
      }
      if (info.swapGroups) {
        info.swapProps = info.swapGroups.groups.map(g => ({
          g,
          prop: set.addComponentProperty(label + ' Choice · ' + g.values.join('/'), 'INSTANCE_SWAP', g.defaultId),
        }));
        info.swapProp = info.swapProps.map(x => x.prop).join(', ');
      } else if (info.swapDefault) {
        info.swapProp = set.addComponentProperty(label + ' Choice', 'INSTANCE_SWAP', info.swapDefault);
      }
    } catch (e) {
      info.error = (e && e.message) ? e.message : String(e);
    }
  }
  for (const [slot, info] of Object.entries(bySlot)) {
    if (info.error) continue;
    for (const L of info.layers) {
      try {
        if (info.boolProp && L.boolLayerId) {
          const n = await figma.getNodeByIdAsync(L.boolLayerId);
          if (n) n.componentPropertyReferences = Object.assign({}, n.componentPropertyReferences || {}, { visible: info.boolProp });
        }
        if (info.swapProp && L.swapLayerId) {
          // The property for THIS layer's default: one per group when the content varies.
          const mine = info.swapProps ? info.swapProps.find(x => x.g.defaultId === L.swapDefaultId) : null;
          const prop = info.swapProps ? (mine && mine.prop) : info.swapProp;
          const n = prop ? await figma.getNodeByIdAsync(L.swapLayerId) : null;
          if (n) n.componentPropertyReferences = Object.assign({}, n.componentPropertyReferences || {}, { mainComponent: prop });
        }
        // Named like the hand-built DtBadge and DtChip: the wrapper takes the slot's name and
        // the instance inside it is "icon". Layer names come from the DOM class otherwise, and
        // nothing looks a layer up by name.
        if (L.swapLayerId) {
          const inst = await figma.getNodeByIdAsync(L.swapLayerId);
          const wrap = inst && inst.parent;
          if (inst && wrap && wrap.type === 'FRAME' && wrap.children.length === 1) {
            wrap.name = humanise(slot);
            inst.name = 'icon';
          } else if (inst) {
            inst.name = humanise(slot);
          }
        }
      } catch (e) {
        info.bindError = (e && e.message) ? e.message : String(e);
      }
    }
  }
  /**
   * TEXT PROPERTIES. Without one, a label is a layer a designer has to enter the
   * instance to edit; with one it is a field on the panel, which is what the hand-built
   * Button does (Label#19528:0 bound to `characters`).
   *
   * One property per NAME across the whole set, so retyping the label does not have to
   * be repeated per variant.
   */
  const byText = {};
  for (const L of textLayers) {
    byText[L.prop] = byText[L.prop] || { layers: [], defaultText: L.defaultText };
    byText[L.prop].layers.push(L);
  }
  for (const [name, info] of Object.entries(byText)) {
    try {
      info.prop = set.addComponentProperty(name, 'TEXT', info.defaultText || ' ');
    } catch (e) { info.error = (e && e.message) ? e.message : String(e); continue; }
    for (const L of info.layers) {
      try {
        const n = await figma.getNodeByIdAsync(L.layerId);
        if (n) n.componentPropertyReferences = Object.assign({}, n.componentPropertyReferences || {}, { characters: info.prop });
      } catch (e) { info.bindError = (e && e.message) ? e.message : String(e); }
    }
  }
  const texts = Object.entries(byText).map(([name, i]) => ({
    name, prop: i.prop || null, layers: i.layers.length,
    defaultText: i.defaultText, error: i.error || null, bindError: i.bindError || null,
  }));

  const slots = Object.entries(bySlot).map(([slot, i]) => ({
    slot, kind: i.kind, layers: i.layers.length, varies: i.varies || 0,
    swapAxis: i.swapGroups ? i.swapGroups.axis : null,
    swapCount: i.swapProps ? i.swapProps.length : (i.swapProp ? 1 : 0),
    boolProp: i.boolProp || null, swapProp: i.swapProp || null,
    swapDefault: i.swapDefault || null, error: i.error || null, bindError: i.bindError || null,
  }));
  return { slots, texts };
}

/**
 * "startIcon" becomes "Start icon". The one name a slot has in Figma: its property, and
 * the layer that holds it (see build() in generic-builder.js).
 */
/**
 * Does ONE variant axis explain why the layers of a slot default to different components?
 *
 * Reads each layer's row (the variant name, "kind=critical, important=false, ...") and looks
 * for an axis where every value maps to exactly one default. DtNotice's glyph is that case:
 * kind=critical is always the alert circle, kind=info always the info circle. The axis with
 * the fewest values wins, and each default is named by the values that lead to it.
 *
 * Returns null when no axis separates them, which means the icon depends on a combination of
 * axes and a single property per default would be wrong for some variants.
 */
function splitByAxis (layers, ids) {
  const rows = layers.filter(L => L.swapDefaultId).map(L => {
    const a = {};
    for (const part of String(L.row).split(', ')) {
      const i = part.indexOf('=');
      if (i > 0) a[part.slice(0, i)] = part.slice(i + 1);
    }
    return { id: L.swapDefaultId, a };
  });
  if (!rows.length) return null;
  let best = null;
  for (const axis of Object.keys(rows[0].a)) {
    const byValue = {};
    let usable = true;
    for (const r of rows) {
      const v = r.a[axis];
      if (v === undefined) { usable = false; break; }
      (byValue[v] = byValue[v] || new Set()).add(r.id);
    }
    if (!usable || !Object.values(byValue).every(s => s.size === 1)) continue;
    const count = Object.keys(byValue).length;
    if (!best || count < best.count) best = { axis, byValue, count };
  }
  if (!best) return null;
  const groups = ids
    .map(id => ({ defaultId: id, values: Object.entries(best.byValue).filter(([, s]) => s.has(id)).map(([v]) => v) }))
    .filter(g => g.values.length);
  return { axis: best.axis, groups };
}

function slotLabel (key) {
  // Title Case, like the variant properties ("Start Icon", "Link Kind"): these are the labels a
  // designer reads in the properties panel, and the panel mixed code-style and sentence-style
  // names before.
  return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase())
    .replace(/ ([a-z])/g, (m, c) => ' ' + c.toUpperCase());
}
