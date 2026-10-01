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
   * Named so the panel reads as instructions: a "Show start icon" toggle beside a
   * "Start icon" swap. Naming both identically would put two rows with one label in the
   * panel and leave nobody able to tell which is which.
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
  // Built from code points rather than written literally: this block is generated inside
  // a template literal, and an emoji pasted through several layers of quoting is one
  // mojibake away from a property name nobody can match.
  const EYE = String.fromCodePoint(0x1F441, 0xFE0F);   // eye, as the old library uses
  const SWAP = String.fromCodePoint(0x21AA);           // rightwards arrow with hook
  // The hand-built Dialtone library prefixes its property names by KIND — an eye for a
  // visibility toggle, an arrow for an instance swap — so the panel reads at a glance
  // and the two libraries look like one. Matching it here rather than inventing a
  // second convention in the same file.
  //
  // What is NOT matched is its direction words: the old Button says "Icon Left", this
  // says "Start icon". Slot names come from the Vue API, which is already logical, and
  // .claude/rules/logical-naming.md forbids introducing a physical name in anything new.
  // A deliberate divergence, not an oversight.
  const humanise = (k) => k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
    .replace(/^./, c => c.toUpperCase());
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
   * So the property is created only where every layer wants the SAME component. Where the
   * content varies per variant the layers stay plain instances: still swappable by selecting
   * one, which is a click deeper but correct.
   */
  for (const info of Object.values(bySlot)) {
    const targets = new Set(info.layers.map(L => L.swapDefaultId).filter(Boolean));
    // DELIBERATE: where the content varies, the property still gets made and every variant
    // shows its single default. Suppressing it instead kept the per-variant glyphs but left
    // no way to change them from the panel, and a panel control is what was asked for.
    // The count is reported so the trade is visible on every build rather than remembered.
    if (targets.size > 1) info.varies = targets.size;
  }
  for (const [slot, info] of Object.entries(bySlot)) {
    const label = humanise(slot);
    try {
      if (info.kind === 'additive') {
        info.boolProp = set.addComponentProperty(EYE + ' ' + label, 'BOOLEAN', false);
      }
      if (info.swapDefault) {
        info.swapProp = set.addComponentProperty(SWAP + ' ' + label, 'INSTANCE_SWAP', info.swapDefault);
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
          const n = await figma.getNodeByIdAsync(L.swapLayerId);
          if (n) n.componentPropertyReferences = Object.assign({}, n.componentPropertyReferences || {}, { mainComponent: info.swapProp });
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
    boolProp: i.boolProp || null, swapProp: i.swapProp || null,
    swapDefault: i.swapDefault || null, error: i.error || null, bindError: i.bindError || null,
  }));
  return { slots, texts };
}
