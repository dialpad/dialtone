/**
 * GENERIC Figma builder — walks a payload from encode-build.mjs.
 *
 * Not run directly: its body is pasted into a `use_figma` call with
 * `const D = <payload>;` prepended. Kept here so the logic is versioned and reviewed
 * once rather than rewritten per component, which is where bespoke builders kept
 * introducing defects the verifier then had to find.
 *
 * Every hard-won platform rule is encoded here:
 *   B-9   the literal under a bound paint must be the RESOLVED colour, never a
 *         placeholder, or an unresolved binding paints black
 *   B-7   setEffectStyleIdAsync must be awaited
 *   B-10  createFrame carries a default opaque fill; clear it
 *   B-33  a variable bound to `opacity` is read as a PERCENTAGE — never bind it
 *   D-11  a CSS border adds to an auto-sized box but a Figma stroke does not, so the
 *         border width is folded into padding on hug frames only
 */

/**
 * MULTI-SHARD. A large component cannot be pasted into one `use_figma` call (the
 * sandbox has no `fetch`, so payloads travel inline), and one call per shard meant
 * dozens of round trips for Radio and Avatar. The body is now a function over one
 * shard, and the caller passes however many fit in a single call.
 *
 * Pasted into `use_figma` with `const SHARDS = [{ D, CLEAR, INDEX_OFFSET }, …];`
 * prepended. SLICE_START/SLICE_END default to the whole shard.
 */
// INDEX_OFFSET is still accepted because three importers pass it, but it no longer places
// anything: shards are kept apart by measuring the page (see baseY), which works when the
// variants differ in size and a global index does not.
async function buildShard ({ D, CLEAR, INDEX_OFFSET = 0, SLICE_START = 0, SLICE_END }) {
  // ─── lookups ────────────────────────────────────────────────────────────────
  const allVars = await figma.variables.getLocalVariablesAsync();
  const varByName = new Map(allVars.map(v => [v.name, v]));

  // This file links the Dialtone Design Tokens library rather than owning these
  // variables locally. D.tokKeys (from encode-build.mjs's REST lookup against the
  // library's own source file) carries the import key for exactly the names this
  // file can't resolve on its own — import and cache them the same way a local
  // variable is found, so every binding below stays a plain varByName lookup.
  for (const name of D.toks) {
    if (!name || varByName.has(name)) continue;
    const key = (D.tokKeys || {})[name];
    if (!key) continue;
    try {
      varByName.set(name, await figma.variables.importVariableByKeyAsync(key));
    } catch (e) { /* leave unresolved; reported by the missing-variables check below */ }
  }

  const missing = D.toks.filter(t => t && !varByName.has(t));
  if (missing.length) throw new Error('missing variables: ' + missing.join(', '));
  
  // Bindings deliberately skipped because the variable disagreed with the measured
  // value; surfaced in the shard result so a mis-attribution is never silent.
  const skippedBindings = [];
  // Effect styles whose NAME matched the token but whose numbers did not match the
  // measurement, and multi-layer shadows whose single token could not be attributed to
  // one layer. Both trade provenance for a correct render, so both must be visible.
  const styleRejected = [];
  const unattributedShadowTokens = [];
  // B-90: effects whose spread this runtime refused to store as written.
  const effectSpreadRepaired = [];
  const effectSpreadLost = [];

  /**
   * SYNTHESISE the variables for colours no token names (see encode-build's `dvars`).
   *
   * Done up front, so `paint()` below stays synchronous and every node can simply look
   * the variable up by name like any other. They live in their OWN collection, named so
   * nobody mistakes them for published Dialtone tokens, and each carries a description
   * saying what computed it and why it could not be bound.
   *
   * Idempotent: a re-run finds the existing variable and only writes a value that has
   * actually changed, so rebuilding does not churn the file.
   */
  const derivedReport = { created: 0, updated: 0, reused: 0, collection: null };
  if ((D.dvars || []).length) {
    const COLL = 'Dialtone Derived (synthesised by sync)';
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    let coll = collections.find(c => c.name === COLL);
    if (!coll) coll = figma.variables.createVariableCollection(COLL);
    /**
     * Both modes must exist and be NAMED, because the checks resolve a variable per mode
     * by mode name (verify-components.varValue) — an unnamed or missing mode would read
     * the default one while claiming to check the other. Falling back to `modes[0]` for a
     * missing 'Dark' would write both values to the SAME mode and lose the dark one
     * silently, so create it instead of tolerating its absence.
     */
    const ensureMode = (want) => {
      const found = coll.modes.find(x => x.name === want);
      if (found) return found.modeId;
      // A fresh collection has exactly one mode with a generated name; claim it first.
      if (coll.modes.length === 1 && !coll.modes.some(m => m.name === 'Light' || m.name === 'Dark')) {
        coll.renameMode(coll.modes[0].modeId, want);
        return coll.modes[0].modeId;
      }
      return coll.addMode(want);
    };
    const modeId = (want) => ensureMode(want);
    const lightMode = modeId('Light'), darkMode = modeId('Dark');
    const rgba = (a) => ({ r: a[0], g: a[1], b: a[2], a: a[3] });
    const same = (a, b) => !!a && !!b && typeof a.r === 'number'
      && ['r', 'g', 'b', 'a'].every(k => Math.abs((a[k] ?? 1) - (b[k] ?? 1)) < 0.001);

    for (const dv of D.dvars) {
      let v = varByName.get(dv.name);
      let fresh = false;
      if (!v || v.resolvedType !== 'COLOR') {
        v = figma.variables.createVariable(dv.name, coll, 'COLOR');
        fresh = true;
        derivedReport.created++;
      }
      const wantL = rgba(dv.light), wantD = rgba(dv.dark);
      const gotL = v.valuesByMode[lightMode], gotD = v.valuesByMode[darkMode];
      let changed = false;
      if (!same(gotL, wantL)) { v.setValueForMode(lightMode, wantL); changed = true; }
      if (!same(gotD, wantD)) { v.setValueForMode(darkMode, wantD); changed = true; }
      // Explicit scopes: the default ALL_SCOPES puts a synthesised colour in every
      // picker in the file, which is exactly what nobody wants from generated data.
      if (dv.scopes && dv.scopes.length) v.scopes = dv.scopes;
      if (dv.desc) v.description = dv.desc;
      if (!fresh) { if (changed) derivedReport.updated++; else derivedReport.reused++; }
      varByName.set(dv.name, v);
    }
    derivedReport.collection = coll.name;
  }

  /**
   * IMAGE imports, resolved ONCE per shard.
   *
   * `figma.createImage` returns a hash Figma stores centrally, so the bytes are fetched
   * and registered once and every avatar reuses the hash — doing it per node would upload
   * the same 193KB hundreds of times.
   *
   * The bytes come from the dev server rather than the payload: base64 of this image is
   * larger than the entire rest of a shard. That makes this the one builder capability the
   * `use_figma` path cannot have (no `fetch` in that sandbox), so a missing BASE degrades
   * to no image fill rather than throwing.
   */
  const imageHashes = new Map();
  const imageSkipped = [];
  if ((D.imgs || []).length) {
    const base = (typeof BASE !== 'undefined' && BASE) ? BASE : null;
    for (const src of D.imgs) {
      if (!base || typeof fetch !== 'function') { imageSkipped.push(`${src}: no fetch in this runtime`); continue; }
      try {
        const res = await fetch(base + '/assets/' + String(src).replace(/^\//, ''));
        if (!res.ok) { imageSkipped.push(`${src}: HTTP ${res.status}`); continue; }
        const buf = await res.arrayBuffer();
        imageHashes.set(src, figma.createImage(new Uint8Array(buf)).hash);
      } catch (e) {
        imageSkipped.push(`${src}: ${e && e.message ? e.message : e}`);
      }
    }
  }

  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();
  const WEIGHT = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular',
                   500: 'Medium', 600: 'Semibold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
  const FAMILY = 'SF Pro Text';
  const loaded = new Set();
  /**
   * The family the SPEC resolved, falling back to the default when Figma does not have it.
   *
   * Every text node used to be written in FAMILY regardless of what the CSS said, so
   * DtCodeblock's monospace label came out in SF Pro Text. The spec now resolves the family
   * through the same map the values pass checks against, so the two cannot drift.
   *
   * A missing font is a property of THIS Figma install, not of the payload, so it falls
   * back rather than failing the build — and is reported, because a silent fallback is a
   * component that quietly renders in the wrong face.
   */
  const fontFallbacks = [];
  async function useFont (weight, family) {
    const style = WEIGHT[weight] || 'Regular';
    const want = family || FAMILY;
    const k = want + '|' + style;
    if (!loaded.has(k)) {
      try {
        await figma.loadFontAsync({ family: want, style });
        loaded.add(k);
      } catch (e) {
        fontFallbacks.push(want + ' ' + style);
        const fb = { family: FAMILY, style };
        const fbk = FAMILY + '|' + style;
        if (!loaded.has(fbk)) { await figma.loadFontAsync(fb); loaded.add(fbk); }
        return fb;
      }
    }
    return { family: want, style };
  }
  
  const ALIGN = { 'flex-start': 'MIN', start: 'MIN', 'flex-end': 'MAX', end: 'MAX',
                  center: 'CENTER', 'space-between': 'SPACE_BETWEEN' };
  // Same order and names as cdp-provenance's, so a payload key means one thing everywhere.
  const CORNERS = ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'];
  const SIDE_WEIGHTS = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'];
  
  const paint = (spec) => {
    if (!spec) return null;
    const c = D.cols[spec[0]];
    const base = { type: 'SOLID', color: { r: c[0], g: c[1], b: c[2] }, opacity: c[3] };
    const tok = spec[1] >= 0 ? D.toks[spec[1]] : null;
    /**
     * A COLOUR VARIABLE MUST HOLD THE COLOUR THAT WAS MEASURED.
     *
     * `bindNum` has refused a numeric binding whose variable disagrees with the literal
     * since early on, and the paint side had no equivalent — so a misattributed token was
     * bound without question and the variable then overwrote the measured colour.
     *
     * DtAvatar's `__canvas-inner` measures a solid green and its provenance names
     * `color/neutral/transparent`: the cascade fold takes the last matching declaration
     * rather than the most specific one, so a `transparent` rule outranked the green that
     * actually painted. Binding it produced an invisible avatar canvas that no numeric
     * check could see, because every number was right.
     *
     * Refused and RECORDED, not silently dropped. The misattribution is a provenance bug
     * worth fixing at the source; this stops it reaching the canvas in the meantime.
     */
    if (tok) {
      const v = varByName.get(tok);
      if (!v) return base;
      /**
       * ONLY WHEN EVERY MODE IS A CONCRETE COLOUR.
       *
       * A variable's mode can hold an ALIAS to another variable rather than a colour, and a
       * semantic token routinely aliases in one mode and not the other. Filtering to the
       * concrete values and comparing against those compared the LIGHT measurement against
       * a DARK-only value and refused a binding that was perfectly correct: DtBadge's
       * bulletin label and 60 of DtButton's active backgrounds became baked literals, wrong
       * in dark mode — the exact failure this guard exists to prevent, caused by the guard.
       *
       * So a partially-aliased variable is not evidence of anything and is left alone. Only
       * a variable whose every mode is a colour, none of them the measured one, is refused —
       * which is still DtAvatar's case, the one that motivated this.
       */
      const modes = v.valuesByMode ? Object.values(v.valuesByMode) : [];
      const isRGBA = (m) => m && typeof m === 'object' && typeof m.r === 'number';
      const rgbas = modes.filter(isRGBA);
      const near = (a, b) => Math.abs(a - b) <= 0.004;
      const comparable = modes.length > 0 && rgbas.length === modes.length;
      const agrees = !comparable || rgbas.some(m => near(m.r, c[0]) && near(m.g, c[1])
        && near(m.b, c[2]) && near(m.a === undefined ? 1 : m.a, c[3]));
      if (!agrees) {
        const shown = rgbas.map(m => [m.r, m.g, m.b, m.a === undefined ? 1 : m.a]
          .map(x => Math.round(x * 100) / 100).join(',')).join(' | ');
        skippedBindings.push('paint · ' + tok + ': measured ' + c.map(x => Math.round(x * 100) / 100).join(',')
          + ' vs variable ' + shown);
        return base;
      }
      return figma.variables.setBoundVariableForPaint(base, 'color', v);
    }
    // No token, but a SYNTHESISED variable holding this colour in both modes. Binding it
    // is the only way a Figma paint can follow the mode at all — a literal here is
    // correct in light and wrong in dark, which was 504 of the last run's findings.
    const dv = spec.length > 2 && spec[2] >= 0 ? (D.dvars || [])[spec[2]] : null;
    const dvVar = dv ? varByName.get(dv.name) : null;
    if (dvVar) return figma.variables.setBoundVariableForPaint(base, 'color', dvVar);
    return base;
  };
  /**
   * THE SPINNER'S COMET-TAIL, as a real gradient — not a swapped-in static glyph.
   *
   * DtLoader's arc gets its look from a CSS `mask-image: conic-gradient(...)` that this
   * pipeline has no way to reproduce as a mask. Figma's ANGULAR gradient paint type is the
   * direct equivalent — no masking needed — applied to the arc's OWN measured geometry
   * (rather than substituting a different hand-authored icon-library glyph, the first fix
   * tried) so the stroke width always matches the track underneath it exactly, whatever the
   * measured geometry turns out to be.
   *
   * IMPORTANT, hard-won: the arc's raw path is NOT a full ring the way the track is — it
   * already has a real geometric gap baked in (confirmed via `vectorNetwork`: material spans
   * ~288° with a round-cap bulge at EACH end, not one continuous circle). Two earlier
   * attempts assumed a full ring and got the proportions backwards relative to this shape —
   * one left only ~135° solid, reading as mostly flat track; a second, still eyeballed, had
   * the fade spanning roughly half the ring. Neither was caught by a 48×48 thumbnail; both
   * needed a scaled-up render and the actual vertex angles to diagnose.
   *
   * These stops are NOT the CSS mask's degrees converted — an earlier pass tried that
   * (computing `(deg − 15) / 360` from the real `conic-gradient` values) and it was still
   * wrong on this vector: the gap ended up roughly twice as wide as it should be. Figma's
   * ANGULAR gradient apparently does not map position 0–1 onto a plain 0–360° sweep the same
   * way CSS's `conic-gradient` does for this shape, and chasing the exact reason stopped
   * being worth it once a value tuned directly in the Figma UI (not computed) looked right:
   * transparent at 0%, opaque for a 70%-of-the-turn plateau (20%→90%), a near-hard cut back
   * to transparent (90%→91%), then transparent through 100% (wrapping cleanly, since both
   * ends of the 0–1 range are transparent). If this ever needs re-tuning, tune it live in
   * Figma's own gradient editor against a real render and read the percentages back — do not
   * re-derive them from the CSS degrees again.
   *
   * The absolute ROTATION (where position 0 actually lands on screen for a given vector) was
   * not worth chasing either: the real spinner rotates continuously in use, so a few degrees
   * of static-pose rotation isn't visible the way a wrong width or wrong proportions are.
   *
   * The OPAQUE stops bind to the glyph colour's variable when there is one, so the spinner
   * follows a mode switch: the Plugin API's ColorStop carries `boundVariables`, which this
   * comment once claimed did not exist (the glyph stayed 37,35,32 in dark mode and the
   * verifier reported it, 8 findings). The transparent stops stay literal: a bound stop takes
   * the variable's own alpha, which would fill in the fade the gradient exists to draw.
   */
  const gradientFill = (ccSpec, bound) => {
    const c = D.cols[ccSpec[0]];
    const rgb = { r: c[0], g: c[1], b: c[2] };
    const stop = (position, a) => ({
      position, color: { ...rgb, a },
      ...(bound && a === 1 ? { boundVariables: { color: bound } } : {}),
    });
    return {
      type: 'GRADIENT_ANGULAR',
      gradientTransform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: [
        stop(0, 0), stop(0.20, 1), stop(0.90, 1), stop(0.91, 0), stop(1, 0),
      ],
    };
  };
  /**
   * Bind a numeric field to its token — but ONLY when the variable actually holds the
   * measured value.
   *
   * A bound variable OVERWRITES the literal underneath it, so binding a token whose
   * value disagrees silently changes the render. DtChip's `.d-chip__label` measures
   * `padding-right: 18` while the resolver attributed `spacing/75` (= 6): binding it
   * shrank the label by 12px, which then pushed the close button 10px outside the chip.
   * 136 paddingRight findings and 72 insetEnd findings were one cause.
   *
   * Matching ANY mode counts, because a token whose value legitimately differs per mode
   * is not a mis-attribution. Where nothing matches, keeping the literal is the failure
   * that preserves the render; the missing binding then shows up in audit-provenance as
   * "declared but unbound" rather than disappearing.
   */
  const numValues = (v) => (v && v.valuesByMode ? Object.values(v.valuesByMode) : []);
  const bindNum = (node, field, spec) => {
    if (!spec || spec[1] < 0) return;
    const v = varByName.get(D.toks[spec[1]]);
    if (!v) return;
    const vals = numValues(v).filter(x => typeof x === 'number');
    if (vals.length && !vals.some(x => Math.abs(x - spec[0]) <= 0.01)) {
      skippedBindings.push(`${node.name} · ${field}: literal ${spec[0]} vs ${D.toks[spec[1]]}=${vals.join('/')}`);
      return;
    }
    node.setBoundVariable(field, v);
  };
  
  /**
   * The effect style the shadow's own TOKEN names — or null.
   *
   * This used to return a `focus` style unconditionally, which was fine while focus
   * rings were the only shadows in play and wrong the moment anything else appeared:
   * Notice's subtle 1px inset border would have been painted as a blue focus ring.
   * No token means no basis for choosing a named style, so the raw layers are used.
   */
  /**
   * A style stands in for the measurement only if its NUMBERS also agree.
   *
   * Matching on the token name alone is not enough: Dialtone's `shadow/focus/inset`
   * style has spread 2, and DtButton uses that same token at spread 2 on most sizes and
   * spread 3 on the rest. Forty Button variants therefore rendered a 2px focus ring
   * where the browser draws 3px — with perfect provenance, which is exactly why the
   * identity pass was clean while the pixels were wrong. A style is a claim about
   * geometry as much as about colour, so check the geometry before adopting it and fall
   * back to a raw effect (whose colour is still bound to the token) when it disagrees.
   */
  function shadowStyle (spec, layer) {
    const tok = spec[1] >= 0 ? D.toks[spec[1]] : null;
    if (!tok) return null;
    const base = tok.replace(/\/color$/, '');
    const st = effectStyles.find(s => s.name === base) || null;
    if (!st || !layer) return st;   // no measurement to check it against
    const [inset, , x, y, blur, spread] = layer;
    const e = st.effects.length === 1 ? st.effects[0] : null;
    if (!e) return null;
    const agrees = e.type === (inset ? 'INNER_SHADOW' : 'DROP_SHADOW')
      && Math.abs((e.offset ? e.offset.x : 0) - (x || 0)) < 0.01
      && Math.abs((e.offset ? e.offset.y : 0) - (y || 0)) < 0.01
      && Math.abs((e.radius || 0) - (blur || 0)) < 0.01
      && Math.abs((e.spread || 0) - (spread || 0)) < 0.01;
    if (!agrees) {
      styleRejected.push(`${base}: style ${e.type} off ${e.offset ? e.offset.x + ',' + e.offset.y : '0,0'} `
        + `blur ${e.radius || 0} spread ${e.spread || 0}  vs measured spread ${spread || 0} blur ${blur || 0}`);
      return null;
    }
    return st;
  }
  
  // ─── node construction ──────────────────────────────────────────────────────
  /**
   * Slot layers found while building, so their component properties can be bound once the
   * variant set exists — properties live on the SET, which does not exist yet.
   */
  const slotLayers = [];
  /** TEXT nodes that become a component TEXT property, so a consumer can retype the label. */
  const textLayers = [];
  /** Icon ids the payload named that this file does not have — reported, never silent. */
  const iconInstanceFailed = [];
  /** Did each instance's fill override actually take? See the note at the write site. */
  const iconFillChecks = [];

  /**
   * instance id -> the component id it was created from.
   *
   * Recorded rather than read back from `instance.mainComponent`, which is deprecated in
   * favour of an async getter — and the id is already known here, at the only place an
   * instance is created. An INSTANCE_SWAP property needs it as its default value.
   */
  const instanceMain = {};
  let currentRow = null;

  /**
   * Apply the slot markers, in one place rather than at each of `buildNode`'s returns.
   *
   * An ADDITIVE slot starts HIDDEN: the variant's default state is what the base render
   * measured, and that render had no slot content. A REPLACEMENT point stays visible — the
   * component draws it by default and a swap replaces it, so hiding it would remove
   * something the component actually renders.
   *
   * The BOOLEAN binds to the slot ROOT (the wrapper), because hiding the wrapper takes the
   * whole thing out of auto-layout. The INSTANCE_SWAP binds to the INSTANCE inside it,
   * which is the only node that has a `mainComponent` to swap.
   */
  async function build (idx) {
    const d = D.nodes[idx];
    const node = await buildNode(idx);
    if (node && d.tp && node.type === 'TEXT') {
      textLayers.push({ prop: d.tp, layerId: node.id, defaultText: d.tx || '', row: currentRow });
    }
    if (node && (d.sl || d.sw)) {
      if (d.sl) node.visible = false;
      const inst = node.type === 'INSTANCE' ? node
        : (typeof node.findOne === 'function' ? node.findOne(n => n.type === 'INSTANCE') : null);
      slotLayers.push({
        slot: d.sl || d.sw,
        kind: d.sl ? 'additive' : 'replacement',
        row: currentRow,
        boolLayerId: d.sl ? node.id : null,
        // The slot's own node, for a native slot whose content is not an instance (see the
        // native-slot block where each component is created).
        rootId: node.id,
        swapLayerId: inst ? inst.id : null,
        swapDefaultId: inst ? (instanceMain[inst.id] || null) : null,
      });
    }
    return node;
  }

  async function buildNode (idx) {
    const d = D.nodes[idx];

    /**
     * `ic` MEANS "BE AN INSTANCE OF THIS COMPONENT" — for any node, not just an icon.
     *
     * This check used to live inside the SVG branch, so a slot whose content is a whole
     * COMPONENT resolved its target in the encoder and then had it silently ignored: the
     * action button was rebuilt as ordinary frames, no instance existed, and
     * `applySlotProperties` had nothing to attach a swap to — "NO PROPERTY CREATED", which
     * is exactly what the report said and exactly what it looked like when nothing had been
     * wired at all.
     *
     * Colour is only overridden where the payload carries one (`cc`, an inline SVG's
     * `currentColor`). A component instance brings its own colours from its own variant and
     * must not be repainted.
     */
    if (d.ic) {
      const main = await figma.getNodeByIdAsync(d.ic);
      if (main && main.type === 'COMPONENT') {
        const inst = main.createInstance();
        inst.name = d.n || 'instance';
        if (d.box && d.box[0] && d.box[1]) inst.resize(d.box[0], d.box[1]);
        /**
         * An icon instance carries a size TOKEN too.
         *
         * The width/height binding lived only in the frame branch, so `d-icon` — which is
         * an instance, not a frame — resized to a measured number and bound nothing.
         * DtLoader is made of nothing but icons, so it declared 32 size tokens, bound zero
         * of them, and the identity pass compared 0 bindings across 8 variants: the
         * zero-denominator guard is the only reason that read as a failure rather than a
         * pass.
         */
        if (d.width) bindNum(inst, 'width', d.width);
        if (d.height) bindNum(inst, 'height', d.height);
        if (d.cc) {
          const p = paint(d.cc);
          const vecs = inst.findAll(n => n.type === 'VECTOR');
          for (const v of vecs) v.fills = [p];
          const got = (vecs[0] && vecs[0].fills && vecs[0].fills[0]) || null;
          const same = !!got && !!p && got.color && p.color
            && Math.abs(got.color.r - p.color.r) < 0.002
            && Math.abs(got.color.g - p.color.g) < 0.002
            && Math.abs(got.color.b - p.color.b) < 0.002;
          iconFillChecks.push({ icon: d.ic, vectors: vecs.length, applied: !!same,
            wrote: p && p.color ? [p.color.r, p.color.g, p.color.b] : null,
            read: got && got.color ? [got.color.r, got.color.g, got.color.b] : null });
        }
        instanceMain[inst.id] = d.ic;
        return inst;
      }
      iconInstanceFailed.push(d.ic);
    }

    // Figma parses the real SVG source. Hand-coded path data was both laborious and
    // wrong — the checkmark and the X visibly differed from Dialtone's own glyphs —
    // and walking into the SVG leaked `defs`, `clipPath` and zero-size paths as frames.
    if (d.t === 'SVG') {
      // An icon that could not be resolved to a library component still renders — imported
      // whole, as before — it just cannot be swapped, which the encoder already reported.
      const node = figma.createNodeFromSvg(D.svgs[d.s]);
      node.name = d.n || 'glyph';
      if (d.box && d.box[0] && d.box[1]) node.resize(d.box[0], d.box[1]);
      /**
       * An imported SVG carries a size TOKEN too.
       *
       * The width/height binding was added to the frame branch and then to the instance
       * branch, and DtLoader's icons are neither: they are inline SVGs imported whole. So it
       * declared 32 size tokens, bound none of them, and the identity pass compared 0
       * bindings across 8 variants — twice, because the first fix went to the branch the
       * component does not use.
       *
       * Three branches create a sizeable node and each needed telling. That is the smell,
       * and it is recorded in the follow-ups rather than refactored mid-run.
       */
      if (d.width) bindNum(node, 'width', d.width);
      if (d.height) bindNum(node, 'height', d.height);
      // B-33: opacity is read as a PERCENTAGE when bound, so it is always a literal — same
      // rule the FRAME branch already follows. DtLoader's track ring needed exactly this: the
      // encoder now carries its opacity (see encode-build.mjs's SVG branch), but nothing here
      // ever applied it to the node.
      if (d.opacity) node.opacity = d.opacity[0];
      // An inline SVG fills from the element's `color`; carry that onto every vector
      // inside so a currentColor glyph is not left black.
      if (d.cc) {
        // `paint(d.cc)`, not `paint([d.cc[0], d.cc[1]])`: rebuilding the array dropped the
        // THIRD slot, which is the synthesised variable for a glyph colour CSS computes.
        // The measurement, the encoder and paint() were all correct; this line quietly
        // threw the index away, so Chip's disabled close icon stayed a baked light literal
        // and the fix looked like it had failed.
        const p = paint(d.cc);
        /**
         * B-99: two things went wrong on every imported glyph, and nothing could see it
         * until the glyph-colour comparison became reachable (B-97).
         *
         * 1. The guard was `v.fills.length` — recolour only vectors that ALREADY have a
         *    fill. `createNodeFromSvg` imports a `fill="currentColor"` path with no fill
         *    at all, so those vectors were skipped and left invisible: 240 of Radio's 320
         *    icons are a frame with one unfilled child.
         * 2. The imported FRAME keeps a default opaque fill, which is then the only paint
         *    in the glyph — a white square where the icon should be. B-10 clears this on
         *    frames the builder creates with createFrame; nothing cleared it here.
         *
         * A Dialtone glyph is a single-colour currentColor shape, so every vector gets the
         * colour whether or not it arrived with one, and the wrapper frame paints nothing.
         */
        node.fills = [];
        for (const v of node.findAll(n => 'fills' in n)) {
          if (v.type === 'FRAME' || v.type === 'GROUP') v.fills = [];
          else v.fills = [d.g ? gradientFill(d.cc, p.boundVariables && p.boundVariables.color) : p];
        }
      }
      return node;
    }
  
    if (d.t === 'TEXT') {
      const [size, weight, lhPct] = d.ty;
      const t = figma.createText();
      t.name = d.n;
      t.fontName = await useFont(weight, d.ty[3]);
      t.characters = d.tx || ' ';
      /**
       * A TEXT COMPONENT PROPERTY MUST RESIZE ITSELF WHEN ITS OWN CONTENT CHANGES.
       *
       * `figma.createText()` defaults to `textAutoResize: 'NONE'` — a FIXED box. That box is
       * sized correctly once, at creation, to fit `d.tx`, which is why every build so far has
       * looked right: nothing had edited the text yet. But `d.tp` marks this node as a bound
       * TEXT property (see `build()` below, and slot-properties.js), which a consumer DOES
       * retype in Figma — and `NONE` means the node never recomputes after that, so the new
       * characters simply overflow its frozen box while every ancestor, hugging a child size
       * that never changed, stays the same width too. DtButton's root pinned FIXED for an
       * unrelated reason first (the invisible-border fix above), and fixing that only
       * uncovered this: the text itself still didn't grow.
       *
       * `WIDTH_AND_HEIGHT`, not `HEIGHT`, because every `d.tp` label in this pipeline today is
       * a short, single-line, non-wrapping string (Button/Badge/Chip/Link/Toggle labels,
       * segmented-control/tab-group items) — confirmed by checking every `spec.label` this
       * project currently declares. A future WRAPPING text property (multi-line body copy at
       * a fixed width) would need `HEIGHT` instead; nothing today is that, so this is not yet
       * a case this builder has to distinguish.
       */
      if (d.tp) t.textAutoResize = 'WIDTH_AND_HEIGHT';
      // A style is applied only when one matches size AND weight AND line-height AND
      // FAMILY. A near-match would silently change the rendering — Button's labels are
      // Medium at sizes no style covers, so they carry raw typography instead.
      //
      // Family was missing from that list, and a Figma text style carries one: DtCodeblock's
      // label had SF Mono set correctly by `useFont` on the line above, and then a matching
      // 12/400/120 style overwrote it with SF Pro Text. The fix that gave the builder the
      // right family did nothing at all, and reported no fallback, because the family was
      // not wrong when it was set — it was replaced afterwards.
      const wantFamily = d.ty[3] || FAMILY;
      const st = textStyles.find(s => s.fontSize === size
        && s.fontName.style === (WEIGHT[weight] || 'Regular')
        && s.fontName.family === wantFamily
        && s.lineHeight.unit === 'PERCENT' && Math.round(s.lineHeight.value) === Math.round(lhPct));
      if (st) await t.setTextStyleIdAsync(st.id);
      else {
        t.fontSize = size;
        if (lhPct) t.lineHeight = { unit: 'PERCENT', value: lhPct };
      }
      if (d.td) t.textDecoration = d.td;
      if (d.textColor) t.fills = [paint(d.textColor)];
      return t;
    }
  
    const f = figma.createFrame();
    f.name = d.t === 'PSEUDO' ? d.pseudo : d.n;
    // Decided AFTER the effects are known: Figma does not render an INNER_SHADOW
    // on a frame that does not clip. Off by default so absolute children survive.
    f.clipsContent = false;
    f.fills = d.background ? [paint(d.background)] : [];   // B-10
    // An <img>: the pixels replace any background. `cover` crops to fill the box, which
    // is what an avatar does; anything else is FIT so nothing is silently cropped.
    if (d.im && d.im[0] >= 0) {
      const hash = imageHashes.get((D.imgs || [])[d.im[0]]);
      if (hash) f.fills = [{ type: 'IMAGE', scaleMode: d.im[1] ? 'FILL' : 'FIT', imageHash: hash }];
    }
  
    const [mode, align, justify, wrapFlag] = d.lay;
    // Hug is only meaningful when there is content to hug. An EMPTY auto-layout frame
    // snaps to Figma's 100x100 minimum — which is how an 8x8 decorative dot came out
    // 100x100 on the first generic build. A childless node is always fixed at the box
    // the browser measured.
    // Absolutely-positioned children — including a background-image glyph — contribute
    // nothing to auto-layout size, so they cannot be what a frame hugs.
    const layoutKids = (d.kids || []).filter(i => !D.nodes[i].abs);
    // CSS grid can STACK children in one cell; flex never does. Two children measured at
    // the same offset are overlaid, and an auto-layout frame flows them side by side
    // instead — which is how every loading Button grew a second spinner: `.d-loader` is
    // a 18x18 grid holding a track ring and an arc, both at (0,0). The payload already
    // said so; the hug decision just did not look. Where children overlap, coordinate
    // placement is the only faithful mapping (and is right even for the exotic case of
    // a flex row overlapped by negative margins, since the offsets are measured).
    /**
     * The children present in the DEFAULT state — everything except an ADDITIVE slot layer,
     * which is built hidden.
     *
     * Both decisions below are about the default state: whether the children OVERLAP, and
     * whether the measured box is what the content produces. A hidden layer can do
     * neither — Figma excludes it from auto-layout exactly as it was absent from the render
     * the box was measured in.
     *
     * Including them is why the first merged Badge came out `layoutMode: NONE`: a slot icon
     * carries its FILLED-render offset while the label keeps its BASE offset, so the two
     * appeared to overlap, coordinate placement was chosen as the faithful mapping, and
     * toggling the icon on revealed a layer sitting on top of the label instead of widening
     * the badge. A REPLACEMENT layer stays in — the component draws it by default, so it is
     * part of the default state.
     */
    const defaultKids = layoutKids.filter(i => !D.nodes[i].sl);
    const kidRects = defaultKids.map((i) => {
      const k = D.nodes[i];
      const r = k.rel || [0, 0];
      const b = k.box || [0, 0];
      return { x: r[0], y: r[1], w: b[0], h: b[1] };
    });
    const kidsOverlap = kidRects.some((a, i) => kidRects.some((b, j) => j > i
      && a.x < b.x + b.w - 0.01 && b.x < a.x + a.w - 0.01
      && a.y < b.y + b.h - 0.01 && b.y < a.y + a.h - 0.01));
    // `defaultKids`, not `layoutKids`: a frame whose only children are hidden slot layers
    // hugs NOTHING in its default state, and an empty auto-layout frame snaps to Figma's
    // 100x100 minimum.
    const hug = mode !== 'N' && defaultKids.length > 0 && !kidsOverlap;
    // The stroke's contribution to each axis, per side. No longer folded into padding (see
    // `pad` below), but still needed: the stroke counts toward the layout size, so the size
    // prediction has to include it — and on an asymmetric border the two axes differ.
    /**
     * EVERY DECLARED BORDER WIDTH COUNTS, PAINTED OR NOT.
     *
     * CSS reserves border-box space for a border whose colour is fully transparent exactly
     * as it does for an opaque one — only the paint disappears, not the width. This used to
     * gate on `d.borderColor` (dropped by build-spec whenever alpha < 0.005) and count 0 for
     * an invisible border, which was motivated by DtSegmentedControl's `importance: clear`
     * items: with no stroke painted, Figma's own hug naturally excludes the border from its
     * size, so the prediction had to agree with that to avoid a false "hug matches" verdict —
     * otherwise the hugged frame came out 2px smaller than the browser measured (200 height
     * and 40 width findings, D-7).
     *
     * That traded the bug away rather than fixing it: it made the *prediction* honest about
     * a frame with no stroke, but a frame with no stroke is itself the wrong output whenever
     * the border-reserved space is real — which pinned DtButton's own root FIXED instead of
     * letting it hug, so retyping its label in Figma left the text overflowing a box that
     * never resized. The actual fix is below, where the stroke is now always painted (fully
     * transparent when there is no border colour), so `strokesIncludedInLayout` gives the
     * border its real width whether or not anything is visible — which means this count no
     * longer has to pretend the border isn't there to stay honest.
     */
    const swOf = (k) => (d[k] ? d[k][0] : 0);
    const bwX = swOf('strokeLeftWeight') + swOf('strokeRightWeight');
    const bwY = swOf('strokeTopWeight') + swOf('strokeBottomWeight');

    /**
     * HUG ONLY WHERE HUGGING REPRODUCES THE MEASURED BOX.
     *
     * `hug` above asks whether auto-layout can express the children's ARRANGEMENT. It
     * never asked whether auto-layout can express the parent's SIZE, and CSS constantly
     * gives a box a size its content does not determine. Both directions were wrong on
     * Avatar: an icon avatar is an explicit 16px square around a 10px glyph, so hugging
     * collapsed the frame to 10 (804 findings, every content=icon variant); the `+3`
     * overlay is a 16px box whose text overflows to 25.59, so hugging grew it to 25.59.
     *
     * Figma sizes each axis separately, so the faithful mapping is not to abandon
     * auto-layout — it is to hug the axes the content really determines and FIX the ones
     * CSS pins. Keeping auto-layout also keeps the centring that puts the glyph in the
     * middle of the square, which coordinate placement would have to re-derive.
     *
     * The prediction uses the children's MEASURED boxes, so it asks a question about
     * CSS's own self-consistency and never about Figma's text shaping. Tolerance matches
     * the verifier's SIZE_EPS: a discrepancy it would tolerate is not worth pinning.
     */
    let fixW = false, fixH = false;
    const isRow = mode !== 'V';
    // How much of each padding is this node's OWN margin, folded in (encode-build slot 3).
    // The MARGIN fold: a node's own margin, turned into padding by build-spec. Distinct
    // from the stroke, which is counted in the layout rather than added to padding.
    const marginFoldOf = (spec) => (spec && spec.length > 2 ? spec[2] : 0);
    const foldW = marginFoldOf(d.paddingLeft) + marginFoldOf(d.paddingRight);
    const foldH = marginFoldOf(d.paddingTop) + marginFoldOf(d.paddingBottom);
    if (hug) {
      const gap = d.itemSpacing ? d.itemSpacing[0] : 0;
      const spanned = (sel) => kidRects.reduce((a, r) => a + sel(r), 0) + gap * Math.max(0, kidRects.length - 1);
      const widest = (sel) => kidRects.reduce((a, r) => Math.max(a, sel(r)), 0);
      const contentW = isRow ? spanned(r => r.w) : widest(r => r.w);
      const contentH = isRow ? widest(r => r.h) : spanned(r => r.h);
      // Figma's padding carries the folded border on both sides, so the content area it
      // leaves is box - padding - 2*border, exactly as CSS border-box computes it.
      // A FOLDED MARGIN must come back out of this sum. build-spec turns a node's own
      // margin into padding, so the payload's padding is `cssPadding + marginFold` while the
      // measured box contains neither. Leaving it in makes the prediction miss by exactly
      // that margin on every such node, which pins the axis and then resizes it to the
      // unfolded box: `d-notice__icon` should hug to 32x22 (a 20x20 glyph plus 12/2 of folded
      // margin) and came out 20x20. That was 240 width and 40 height findings on Notice, 480
      // on Banner, 960 on Radio.
      // `+ bwX` / `+ bwY`, because the stroke is now counted in the layout: the frame Figma
      // produces is padding + content + stroke, so the prediction has to include it for the
      // same reason it includes padding. Per axis, since an asymmetric border differs
      // between them.
      const padX = (d.paddingLeft ? d.paddingLeft[0] - marginFoldOf(d.paddingLeft) : 0)
        + (d.paddingRight ? d.paddingRight[0] - marginFoldOf(d.paddingRight) : 0) + bwX;
      const padY = (d.paddingTop ? d.paddingTop[0] - marginFoldOf(d.paddingTop) : 0)
        + (d.paddingBottom ? d.paddingBottom[0] - marginFoldOf(d.paddingBottom) : 0) + bwY;
      // `pw`/`ph`: CSS declared an explicit size on this axis. That is a direct answer
      // where the prediction below can only infer one, and it is the only way to catch a
      // frame whose CSS box is right but whose TEXT Figma shapes to a different height.
      /**
       * A TEXT CHILD HAS NO `box` IN THE PAYLOAD, AND THE MISMATCH THAT MAKES IS NOT REAL.
       *
       * encode-build's TEXT branch never sets `out.box` — a text node's Figma size comes
       * from font-shaping (`ty`/`tx`), not a measured CSS box the way a frame's does — so
       * `kidRects` reads it as `[0, 0]` (`k.box || [0, 0]`, above). A frame that hugs a bare
       * label therefore predicts `contentW = 0` regardless of the label's real width, the
       * comparison against the frame's own measured box always misses by more than 1px, and
       * `fixW`/`fixH` pin it FIXED at the size the ORIGINAL label happened to produce.
       *
       * DtButton's `base-button__label` is exactly this: a frame around nothing but the
       * Label text property. Retyping the label in Figma correctly grew the text itself
       * (`textAutoResize`, fixed above) and correctly grew DtButton's root (whose own child
       * is this frame, with a real measured box) — but this frame stayed pinned to the
       * ORIGINAL label's width, clipping every character past it.
       *
       * The frame's measured box already reflects whatever its real children (ANY of them,
       * one of which cannot be statically sized here) actually produced, so a text-bearing
       * frame is left alone — `d.pw`/`d.ph` can still pin it when CSS truly declares a fixed
       * size, but a text child's unknowable static width no longer counts as a mismatch.
       */
      const hasTextKid = defaultKids.some(i => D.nodes[i].t === 'TEXT');
      fixW = !!(d.box && d.box[0]) && (!!d.pw || (!hasTextKid && Math.abs((d.box[0] - padX) - contentW) > 1));
      fixH = !!(d.box && d.box[1]) && (!!d.ph || (!hasTextKid && Math.abs((d.box[1] - padY) - contentH) > 1));

      f.layoutMode = isRow ? 'HORIZONTAL' : 'VERTICAL';
      /**
       * WRAP, and the cross-axis gap that only exists with it.
       *
       * Never set until DtDescriptionList, whose `row` direction wraps each term/description
       * pair onto its own line: Figma laid all four out in one row and the 24px cross gap
       * had nowhere to go, so `counterAxisSpacing` compared 24 against 0 on every variant.
       *
       * Order matters — Figma rejects a counterAxisSpacing on a frame that is not wrapping,
       * so the flag goes on first.
       */
      // HORIZONTAL only — Figma rejects it outright: "Can only set layoutWrap = WRAP on
      // nodes with layoutMode === HORIZONTAL". A CSS column that wraps into columns has no
      // Figma equivalent at all, so build-spec does not emit a cross gap for one.
      if (wrapFlag === 'W' && f.layoutMode === 'HORIZONTAL') {
        f.layoutWrap = 'WRAP';
        if (d.counterAxisSpacing) {
          f.counterAxisSpacing = d.counterAxisSpacing[0];
          bindNum(f, 'counterAxisSpacing', d.counterAxisSpacing);
        }
      }
      f.primaryAxisSizingMode = (isRow ? fixW : fixH) ? 'FIXED' : 'AUTO';
      f.counterAxisSizingMode = (isRow ? fixH : fixW) ? 'FIXED' : 'AUTO';
      if (ALIGN[align]) f.counterAxisAlignItems = ALIGN[align];
      if (ALIGN[justify]) f.primaryAxisAlignItems = ALIGN[justify];
      /**
       * THE STROKE COUNTS TOWARD THE SIZE, because a CSS border does.
       *
       * A shrink-to-fit element under `box-sizing: border-box` measures content + padding +
       * border. Figma's `strokesIncludedInLayout: true` is that behaviour exactly, so the
       * outer box comes out right without anyone adjusting a number.
       *
       * This used to be false, paired with D-11's fold: the border was added to PADDING
       * instead, which reproduced the box but meant the padding could not be bound to its
       * token — Figma overwrites a literal beneath a binding, so a folded padding had to stay
       * a hard-coded number. That traded a maintainable variable for two pixels. Both are
       * gone: the flag does the work and every padding binds.
       *
       * Still set EXPLICITLY, because the two runtimes that run this code disagree on the
       * default — the desktop plugin gave true and `use_figma` gave false, 40/40 either way
       * across ten sets (B-82). A default is not a decision.
       */
      f.strokesIncludedInLayout = true;
    } else {
      f.layoutMode = 'NONE';
    }
  
    /**
     * PADDING IS THE PADDING, AND IT ALWAYS BINDS.
     *
     * No border fold. The stroke is counted in the layout instead (see above), so padding
     * carries only what CSS declares and can therefore be bound to the token that declared
     * it. The old fold wrote `cssPadding + borderWidth` as a literal, which is the shape
     * this project was asked to stop producing: a hard-coded 10 where the stylesheet says
     * `spacing/75`, correct today and stale the moment the token moves.
     */
    const pad = (side, spec) => {
      if (!spec) return;
      f[side] = spec[0];
      bindNum(f, side, spec);
    };
    pad('paddingTop', d.paddingTop); pad('paddingBottom', d.paddingBottom);
    pad('paddingLeft', d.paddingLeft); pad('paddingRight', d.paddingRight);
    // `column-gap` is reported by getComputedStyle even on a non-flex box, where it
    // paints nothing. Figma rejects itemSpacing on a frame that is not auto-layout, so
    // setting it from that inert value would throw mid-build.
    if (d.itemSpacing && hug) { f.itemSpacing = d.itemSpacing[0]; bindNum(f, 'itemSpacing', d.itemSpacing); }
  
    /**
     * EACH CORNER AND EACH SIDE ON ITS OWN.
     *
     * One radius and one width used to be written to all four, which is right for every
     * symmetrical component and wrong for the first asymmetrical one. DtSplitButton's halves
     * square their inner corners and drop their inner border: 115 corners came out rounded
     * that should have been square, and 140 frames carried a border down an edge that has
     * none.
     *
     * Figma takes each individually and binds each individually, so the token on a corner is
     * the token the stylesheet named for THAT corner. A deliberate zero is written as a
     * literal, because `border-inline-end: 0` is a literal.
     */
    for (const c of CORNERS) {
      if (!d[c]) continue;
      f[c] = d[c][0];
      bindNum(f, c, d[c]);
    }
    /**
     * A STROKE EVEN WHEN NOTHING WILL BE VISIBLE.
     *
     * `d.borderColor` is absent whenever build-spec dropped a fully transparent colour, but
     * the width is still real (see `swOf` above) and `strokesIncludedInLayout` only reserves
     * space for a stroke that EXISTS — so a hugging frame with no stroke object at all hugs
     * 2px smaller than the browser measured, same as DtButton's root did before this. A fully
     * transparent literal paints nothing while still giving the layout engine something to
     * include.
     */
    if (SIDE_WEIGHTS.some(k => d[k] && d[k][0] > 0)) {
      f.strokes = [d.borderColor ? paint(d.borderColor) : { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
      f.strokeAlign = 'INSIDE';
      // Assigned per side BEFORE binding: writing `strokeWeight` first would collapse the
      // four back to one, and Figma keeps the last write.
      for (const k of SIDE_WEIGHTS) {
        if (!d[k]) continue;
        f[k] = d[k][0];
        bindNum(f, k, d[k]);
      }
    }
    // B-33: opacity is a percentage when bound, so it is always a literal
    if (d.opacity) f.opacity = d.opacity[0];
    // Figma rejects a minimum on a frame that is not auto-layout ("Can only set
    // minWidth on auto layout nodes and their children"), and rightly: a FIXED frame
    // already carries an explicit width and height, so a floor is unexpressible and
    // redundant. Only a hugging frame has a size that a minimum can actually raise.
    // Bound, not just set: `min-inline-size: var(--dt-layout-...)` names the floor in the
    // same structural scale as a width, and a literal here is the same baked number the
    // width binding below exists to avoid.
    if (d.minWidth && hug) { f.minWidth = d.minWidth[0]; bindNum(f, 'minWidth', d.minWidth); }
    if (d.minHeight && hug) { f.minHeight = d.minHeight[0]; bindNum(f, 'minHeight', d.minHeight); }
  
    // Prefer a token-carrying effect STYLE; fall back to raw effects when the shadow
    // has more layers than any single style can express. A multi-part box-shadow
    // previously painted only its first layer.
    // Collect EVERY effect first, then apply once. Assigning `f.effects` after
  // setEffectStyleIdAsync detaches the style — which silently unlinked the focus-ring
  // style on every checkbox focus variant, found by rendering the two side by side.
  const rawEffects = [];
  let styleToApply = null;
  const bindEffectColor = (effect, tokIdx) => {
    if (tokIdx < 0) return effect;
    const v = varByName.get(D.toks[tokIdx]);
    if (!v || typeof figma.variables.setBoundVariableForEffect !== 'function') return effect;
    const bound = figma.variables.setBoundVariableForEffect(effect, 'color', v);
    /**
     * B-90: THIS CALL LOSES THE EFFECT'S GEOMETRY IN ONE RUNTIME.
     *
     * Measured inside the dev plugin itself: writing a literal effect keeps spread 3,
     * but `setBoundVariableForEffect` RETURNS an effect whose spread is 0 — so every
     * token-coloured shadow came out with no spread while the same code through
     * `use_figma` was correct (notice 1, radio 2, checkbox 2). 298 findings, no throw.
     *
     * The call's business is the colour, so restore the geometry from what was passed in.
     * A no-op wherever the runtime already preserves it.
     */
    return { ...bound, offset: effect.offset, radius: effect.radius, spread: effect.spread };
  };

  /**
   * Which layer of a multi-layer shadow does this one token belong to?
   *
   * Answered by colour: resolve the variable through any aliases, in EVERY mode (the
   * spec is measured in one mode, and the token's value in that mode is the one that
   * can match), and return the first layer whose measured colour it holds. -1 when
   * none does, which means the token cannot be attributed and nothing is bound —
   * strictly better than binding it to all of them, which is wrong for all but one.
   */
  const varColors = async (v, depth = 0) => {
    if (!v || depth > 4) return [];
    const out = [];
    for (const raw of Object.values(v.valuesByMode || {})) {
      if (raw && raw.type === 'VARIABLE_ALIAS') {
        out.push(...await varColors(await figma.variables.getVariableByIdAsync(raw.id), depth + 1));
      } else if (raw && typeof raw === 'object' && typeof raw.r === 'number') {
        out.push(raw);
      }
    }
    return out;
  };
  const layerOwningToken = async (tokIdx, layers) => {
    if (tokIdx < 0) return -1;
    const v = varByName.get(D.toks[tokIdx]);
    if (!v) return -1;
    const cols = await varColors(v);
    if (!cols.length) return -1;
    for (const [i, layer] of layers.entries()) {
      const c = D.cols[layer[1]];
      if (!c) continue;
      // Loose on alpha: a focus ring's colour token is opaque while the measured layer
      // can carry the element's own opacity.
      if (cols.some(x => Math.abs(x.r - c[0]) <= 0.02
        && Math.abs(x.g - c[1]) <= 0.02 && Math.abs(x.b - c[2]) <= 0.02)) return i;
    }
    return -1;
  };

  if (d.sh) {
    const layers = d.shl || [];
    const st = shadowStyle(d.sh, layers[0]);
    // A style can only stand in for a single-layer shadow with nothing else stacked
    // on top of it; otherwise the layers are emitted directly.
    if (st && layers.length <= 1 && !d.ol) styleToApply = st;
    else if (layers.length) {
      // The payload carries ONE token for the whole shadow but a measured colour PER
      // LAYER, and a bound variable overwrites the literal beneath it. Binding that one
      // token to every layer therefore repaints all of them in one colour: Chip's focus
      // ring is `0 0 0 1px <surface>, 0 0 0 3px <focus>`, and both rings came out the
      // 1px ring's colour — which also made the two effects indistinguishable to the
      // verifier's colour-based pairing, so the 3px ring's spread was compared against
      // the 1px ring's. Bind the token only to the layer whose measured colour the
      // variable actually holds; leave the others as literals and say so.
      // Each layer now carries its OWN colour token (payload slot 6), so there is
      // nothing to guess. The colour-matching fallback below is kept only for payloads
      // that predate per-layer tokens: it picks the single layer whose measured colour
      // the shadow-wide variable actually holds, and binds nothing when none does.
      const perLayer = layers.some(l => l.length > 6 && l[6] >= 0);
      const owner = perLayer ? -1
        : (layers.length === 1 ? 0 : await layerOwningToken(d.sh[1], layers));
      if (!perLayer && layers.length > 1 && owner < 0 && d.sh[1] >= 0) {
        unattributedShadowTokens.push(`${d.n} · ${D.toks[d.sh[1]]}: no layer matches the variable's colour`);
      }
      for (const [i, layer] of layers.entries()) {
        const [inset, cIdx, x, y, blur, spread] = layer;
        const own = layer.length > 6 ? layer[6] : -1;
        const tokIdx = perLayer ? own : (i === owner ? d.sh[1] : -1);
        const c = D.cols[cIdx];
        rawEffects.push(bindEffectColor({
          type: inset ? 'INNER_SHADOW' : 'DROP_SHADOW',
          color: { r: c[0], g: c[1], b: c[2], a: c[3] },
          offset: { x: x || 0, y: y || 0 }, radius: blur || 0, spread: spread || 0,
          visible: true, blendMode: 'NORMAL',
        }, tokIdx));
      }
    } else if (st) styleToApply = st;
  }
  // An outline with a NEGATIVE offset is drawn inside the box, so it is an inner
  // shadow of the outline's own width — not an outset shadow with spread 0, which
  // paints nothing at all.
  if (d.ol) {
    const c = D.cols[d.ol[0]];
    // PUSH, so the outline lands LAST. Figma composites the last effect in the array
    // on top — the opposite of CSS, where the first box-shadow is topmost. CSS paints
    // an `outline` above a `box-shadow`, so in Figma the outline goes at the end.
    // Verified by rendering: with the outline first, Figma showed the blue focus ring
    // where the browser shows the black outline. Nothing numeric compares effect
    // order, so only the side-by-side render could establish which way round it is.
    rawEffects.push(bindEffectColor({
      type: d.ol[3] ? 'INNER_SHADOW' : 'DROP_SHADOW',
      color: { r: c[0], g: c[1], b: c[2], a: c[3] },
      offset: { x: 0, y: 0 }, radius: 0, spread: d.ol[2],
      visible: true, blendMode: 'NORMAL',
    }, d.ol[1]));
  }
  if (styleToApply) await f.setEffectStyleIdAsync(styleToApply.id);   // B-7
  else if (rawEffects.length) {
    f.effects = rawEffects;
    /**
     * READ THE WRITE BACK — a backstop for the class of bug B-90 belongs to.
     *
     * B-90 itself is fixed at its source in `bindEffectColor`: the losing call was
     * `setBoundVariableForEffect`, not this assignment. This check stays because the
     * first version of it was WRONG in an instructive way — it took the intended spread
     * from `rawEffects`, which already holds the post-binding objects, so it compared 0
     * against 0 and reported nothing while 298 findings stood. The plugin's own runtime
     * probe is what exposed that, which is the argument for measuring inside the runtime
     * that matters rather than reasoning about it from outside.
     *
     * A spread-copy keeps the variable binding (measured on a real node), so a repair
     * costs no provenance. If it does not take, say so rather than leaving it to a
     * verifier three steps downstream.
     */
    const intended = rawEffects.map(e => e.spread || 0);
    const lost = () => f.effects.some((e, i) => Math.abs((e.spread || 0) - intended[i]) > 0.01);
    if (lost()) {
      f.effects = f.effects.map((e, i) => ({ ...e, spread: intended[i] }));
      if (lost()) {
        effectSpreadLost.push(`${d.n}: spread ${intended.join('/')} → `
          + `${f.effects.map(e => e.spread || 0).join('/')} and not repairable by re-assignment`);
      } else {
        effectSpreadRepaired.push(`${d.n}: spread ${intended.join('/')}`);
      }
    }
  }

  /**
   * FIGMA DOES NOT RENDER AN INNER_SHADOW ON A FRAME THAT DOES NOT CLIP.
   *
   * Proven by isolation: the same node with the same literal effect shows the ring
   * with clipsContent true and nothing at all with it false. This builder set
   * clipsContent = false on every frame, so EVERY inset ring painted nothing —
   * Notice's border, Banner's border, every focus ring, every outline — while the
   * effect data matched the browser exactly. No numeric comparison can see that;
   * only rendering both sides and looking can.
   *
   * Re-enabled precisely where an inset effect needs it AND clipping is a no-op: an
   * auto-layout frame contains its children by construction, and a fixed frame does
   * when every child fits inside its box.
   */
  const insetPresent = rawEffects.some(e => e.type === 'INNER_SHADOW')
    || !!(styleToApply && /inset/i.test(styleToApply.name));
  const childrenFit = (d.kids || []).every((ki) => {
    const k = D.nodes[ki];
    const r = k.rel || [0, 0];
    const kb = k.box || [0, 0];
    return r[0] >= -0.01 && r[1] >= -0.01
      && r[0] + kb[0] <= (d.box[0] || 0) + 0.01
      && r[1] + kb[1] <= (d.box[1] || 0) + 0.01;
  });
  f.clipsContent = insetPresent && (hug || childrenFit);

  /**
   * AND NOT ON A FRAME WITH NO FILL EITHER.
   *
   * Proven by isolation on a clear focus Button: no fill and a fully transparent fill (opacity
   * 0) both draw nothing, while a fill at 1%, 0.4%, 0.2% or 0.1% draws the whole ring. The
   * effect data matched the browser on all 1,040 focus variants and the numeric checks passed;
   * only the clear and outlined ones, which CSS paints no background on, had no ring on the
   * canvas. A near-invisible fill gives the shadow a shape to be drawn inside.
   *
   * 0.1%, below the 0.5% the checks read as "no background", so it is still reported as none.
   */
  if (insetPresent && !f.fills.some(p => p.visible !== false && (p.opacity === undefined || p.opacity > 0))) {
    f.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.001 }];
  }

  /**
   * CENTER CONSTRAINTS ARE APPLIED AFTER THIS FRAME HAS ITS REAL SIZE, NOT ITS DEFAULT.
   *
   * `figma.createFrame()` starts at Figma's default 100×100 before anything below resizes
   * it to `d.box`. A CENTER constraint recomputes a child's position from its distance to
   * the parent's CURRENT center the moment it is assigned — so setting it here, inside this
   * loop, measured the child against the 100×100 default rather than the real box: DtLoader
   * at size=100 (a 12×12 frame) got its 12×12 child centered against a 100×100 square and
   * landed at x=-44, nowhere near its own 12×12 parent. The MIN/MAX inset case doesn't share
   * this bug (an edge-pinned child doesn't move on a top-left-anchored resize), so only the
   * CENTER assignment is deferred — collected here, applied once the real resize below runs.
   */
  const centerConstraints = [];
  for (const kidIdx of d.kids || []) {
      const kid = await build(kidIdx);
      f.appendChild(kid);
      const kd = D.nodes[kidIdx];
      // A frame with layoutMode NONE places nothing for itself, so EVERY child needs
      // its measured offset — not just the absolutely-positioned ones. CSS block flow
      // stacks siblings; Figma's NONE layout does not, and they pile up at 0,0.
      if (kd.abs || f.layoutMode === 'NONE') {
        // layoutPositioning only exists inside an auto-layout parent; on a plain frame
        // the child is placed by x/y alone and setting it would throw.
        if (kd.abs && f.layoutMode !== 'NONE') kid.layoutPositioning = 'ABSOLUTE';
        // A zero offset is omitted from the payload rather than spelled out per node.
        const rel = kd.rel || [0, 0];
        kid.x = rel[0];
        kid.y = rel[1];
        // anchored from the inline-end edge? keep it there when the parent resizes
        if (kd.inset && kd.inset[1] && kd.inset[1] !== 'auto' && (!kd.inset[0] || kd.inset[0] === 'auto')) {
          kid.constraints = { horizontal: 'MAX', vertical: 'MIN' };
        } else if (kd.abs) {
          /**
           * A CHILD MEASURED CENTERED STAYS CENTERED WHEN THE PARENT RESIZES.
           *
           * Scoped to `kd.abs` only: a NONE-layout parent's non-absolute children (CSS grid
           * stacking two layers in one cell, say) trivially satisfy "centered" whenever they
           * exactly fill the parent — DtLoader's track and arc both do, on every size — and
           * have no business getting a live-recomputing constraint at all; they are already
           * exactly where they belong and should stay pinned there like any other flowed
           * child. Only a genuinely absolutely-positioned child (CSS `position: absolute`)
           * can have been centered via `justify-content`/`align-items: center` or `inset: 0`
           * with auto margins in the first place.
           *
           * Detected from the measured geometry alone (within the same 1px tolerance the hug
           * prediction uses elsewhere): a child whose own midpoint lands on the parent's
           * midpoint, on either axis, is centered on that axis and gets told so explicitly.
           */
          const pBox = d.box || [0, 0];
          const kBox = kd.box || [0, 0];
          const centered = (axis) => !!pBox[axis] && Math.abs((rel[axis] + kBox[axis] / 2) - pBox[axis] / 2) <= 1;
          const horizontal = centered(0) ? 'CENTER' : 'MIN';
          const vertical = centered(1) ? 'CENTER' : 'MIN';
          if (horizontal === 'CENTER' || vertical === 'CENTER') centerConstraints.push({ kid, horizontal, vertical });
        }
      }
    }
  
    // Resize AFTER the children are in place: on an auto-layout frame Figma recomputes
    // any AUTO axis from its content, so pinning a FIXED axis has to come last. Each
    // axis takes the measured box only where it was pinned; an AUTO axis keeps whatever
    // hugging produced, which is the whole point of leaving it AUTO.
    /**
     * A FOLDED MARGIN grows a hugging frame for free — padding plus content — but a PINNED
     * axis is resized to a number, and the measured box does not include the fold. So the
     * fold has to be added back here or it is simply lost: Banner's `d-notice__content` is
     * a flex child that grows (box 1156, content 152), so its width is correctly pinned —
     * and it came out 16px short, exactly the folded margin, on all 160 variants. The same
     * applies to a layout-NONE frame, where padding is inert entirely (B-94).
     */
    if (!hug) {
      f.resize((d.box[0] || 1) + foldW, (d.box[1] || 1) + foldH);
    } else if (fixW || fixH) {
      f.resize(fixW ? (d.box[0] || 1) + foldW : f.width,
               fixH ? (d.box[1] || 1) + foldH : f.height);
    }
    // Now that `f` holds its real size rather than createFrame's 100×100 default, a CENTER
    // constraint measures each child against the center that actually matters.
    for (const { kid, horizontal, vertical } of centerConstraints) kid.constraints = { horizontal, vertical };
    /**
     * THE STRUCTURAL SIZE, AS A VARIABLE.
     *
     * Dialtone names its box sizes — `inline-size: var(--dt-layout-25)` on a checkbox,
     * `var(--dt-icon-size-400)` on the toggle knob — and until now every one of them
     * arrived in Figma as a literal, because width and height were resized to a measured
     * number and nothing carried the token.
     *
     * AFTER the resize, and only on an axis this node actually pinned. Binding an axis
     * Figma is hugging would fix it at the variable's value, which is a size the component
     * never asked for; build-spec only emits these where the computed size already equals
     * the measured box, so the binding relabels the number rather than changing it.
     */
    // No read-back guard here: `bindNum` already refuses to bind a variable whose value
    // disagrees with the literal by more than 0.01 and records it in `skippedBindings`, so a
    // variable that would move the geometry never reaches the node in the first place.
    if (d.width && (!hug || fixW)) bindNum(f, 'width', d.width);
    if (d.height && (!hug || fixH)) bindNum(f, 'height', d.height);
    return f;
  }
  
  // ─── assemble ───────────────────────────────────────────────────────────────
  let page = figma.root.children.find(p => p.name === D.page);
  if (!page) { page = figma.createPage(); page.name = D.page; }
  await figma.setCurrentPageAsync(page);
  // CLEAR and SLICE_START are deliberately SEPARATE. Overloading SLICE_START to mean
  // "this is not the first shard" also skipped that shard's first row, silently losing
  // one variant per shard.
  if (CLEAR) for (const c of [...page.children]) c.remove();

  // Where this shard's flow starts. Measured from what is ALREADY on the page, before
  // building anything, because every frame this builder creates lands on the current
  // page as it is created — so reading it later would measure this shard against itself.
  // This replaces INDEX_OFFSET for layout purposes: a global index only keeps shards
  // apart while every item is the same size, which was never true.
  const baseY = CLEAR ? 0
    : page.children.reduce((m, c) => Math.max(m, c.y + c.height), 0) + 80;

  const made = [];
  const rows = D.rows.slice(SLICE_START, SLICE_END ?? D.rows.length);
  for (let i = 0; i < rows.length; i++) {
    const [combo, rootIdx] = rows[i];
    currentRow = (D.rowNames && D.rowNames[SLICE_START + i]) || String(SLICE_START + i);
    const slotsBefore = slotLayers.length;
    const root = await build(rootIdx);

    // Convert the built frame INTO a component rather than copying its properties onto
    // a fresh one. The hand-maintained copy that used to live here lost something new
    // every time the builder learned a property: clipsContent, then raw effects, then
    // minWidth/minHeight, and — worst — every numeric VARIABLE BINDING on the root,
    // because assigning `comp.paddingTop = root.paddingTop` copies the value and leaves
    // the binding behind. Badge's roots came out with boundVariables ["fills"] alone
    // while their child frames bound padding correctly, and the identity pass still
    // reported 393/393 because an unbound root token lands in the "declared but unbound"
    // bucket rather than a disagreement.
    // createComponentFromNode keeps the node itself, so there is nothing to forget.
    const comp = figma.createComponentFromNode(root);
    // The payload carries the name the CONFIG declared; the axisVals join is only a
    // fallback for older payloads. Re-deriving it here is what produced `decoration=`
    // on 30 Badge variants and left the set permanently errored.
    comp.name = (D.rowNames && D.rowNames[SLICE_START + i])
      || D.axisNames.map((a, k) => `${a}=${D.axisVals[k][combo[k]]}`).join(', ');

    /**
     * NATIVE SLOTS, created HERE and not after the variants are combined.
     *
     * Measured: `createSlot()` creates the component property too, and on a component that is
     * already in a set each variant gets a property of its own (4 variants, 4 properties).
     * On standalone components, same-named slots merge into ONE set property when combined.
     *
     * The slot goes INSIDE the wrapper that holds the exemplar, and the exemplar moves into
     * it as its default content. The wrapper is untouched, so its layout and token bindings
     * stay what the checks expect; the slot only adds a level.
     */
    for (const L of slotLayers.slice(slotsBefore)) {
      if (!(D.nativeSlots || []).includes(L.slot)) continue;
      // An exemplar instance when there is one, otherwise the slot's own node (plain content,
      // like a collapsible's text).
      const inst = await figma.getNodeByIdAsync(L.swapLayerId || L.rootId);
      const host = inst && inst.parent;
      if (!inst || !host) continue;
      // Read BEFORE moving: a FILL child keeps filling, so the slot around it must too.
      const sizeH = 'layoutSizingHorizontal' in inst ? inst.layoutSizingHorizontal : 'HUG';
      const sizeV = 'layoutSizingVertical' in inst ? inst.layoutSizingVertical : 'HUG';
      const slot = comp.createSlot();
      slot.name = slotLabel(L.slot) + ' (Slot)';
      host.insertChild(host.children.indexOf(inst), slot);
      slot.layoutMode = 'HORIZONTAL';
      slot.primaryAxisSizingMode = 'AUTO';
      slot.counterAxisSizingMode = 'AUTO';
      slot.fills = [];
      slot.appendChild(inst);
      if (sizeH === 'FILL') { slot.layoutSizingHorizontal = 'FILL'; inst.layoutSizingHorizontal = 'FILL'; }
      if (sizeV === 'FILL') { slot.layoutSizingVertical = 'FILL'; inst.layoutSizingVertical = 'FILL'; }
      // The exemplar is slot content now, not a swap target: no INSTANCE_SWAP for it.
      L.native = true;
      L.swapLayerId = null;
      L.swapDefaultId = null;
    }

    made.push(comp);
  }

  /**
   * LAY THE VARIANTS OUT IN A ROW FLOW, AFTER THEY ALL EXIST.
   *
   * Placing each component as it was built meant deriving the grid from the item being
   * placed: `strideX` came from that component's width and the row height from its own
   * height, so two variants in the same row sat at different y (65px apart for a short
   * button, 85 for a tall one) and drifted until they collided with the row below. The
   * 560-variant Button set was a field of overlapping buttons. The previous fixed 260px
   * grid had the opposite failure — it stacked Banner's 1280-wide variants — and the fix
   * for that made the grid geometry itself depend on the item, so no two differently
   * sized variants agreed on where the grid was.
   *
   * A row flow cannot overlap by construction: x advances by each item's real width, and
   * a row advances by the tallest item actually in it. And `combineAsVariants` does NOT
   * re-lay the set out — the comment here used to claim it did, but the positions this
   * code writes are the positions the finished set has, so this IS the presentation.
   */
  const GAP = 40, ROW_LIMIT = 2600;
  let flowX = 0, flowY = baseY, rowH = 0;
  for (const comp of made) {
    const w = Math.ceil(comp.width), h = Math.ceil(comp.height);
    if (flowX > 0 && flowX + w > ROW_LIMIT) { flowX = 0; flowY += rowH + GAP; rowH = 0; }
    comp.x = flowX;
    comp.y = flowY;
    flowX += w + GAP;
    if (h > rowH) rowH = h;
  }
  
  return { built: made.length, page: page.name, pageChildren: page.children.length,
           slotLayers, textLayers,
           iconInstanceFailed: [...new Set(iconInstanceFailed)].slice(0, 10),
           iconInstanceFailedCount: iconInstanceFailed.length,
           iconFills: { total: iconFillChecks.length,
                        applied: iconFillChecks.filter(c => c.applied).length,
                        noVectors: iconFillChecks.filter(c => !c.vectors).length,
                        examples: iconFillChecks.filter(c => !c.applied).slice(0, 3) },
           fontFallbacks: [...new Set(fontFallbacks)],
           skippedBindings: [...new Set(skippedBindings)].slice(0, 20),
           skippedBindingCount: skippedBindings.length,
           styleRejected: [...new Set(styleRejected)].slice(0, 20),
           styleRejectedCount: styleRejected.length,
           unattributedShadowTokens: [...new Set(unattributedShadowTokens)].slice(0, 20),
           unattributedShadowTokenCount: unattributedShadowTokens.length,
           derivedVars: derivedReport,
           imageSkipped: [...new Set(imageSkipped)].slice(0, 10),
           effectSpreadRepairedCount: effectSpreadRepaired.length,
           effectSpreadLost: [...new Set(effectSpreadLost)].slice(0, 10),
           effectSpreadLostCount: effectSpreadLost.length };
}

const results = [];
for (const shard of SHARDS) results.push(await buildShard(shard));
return results;
