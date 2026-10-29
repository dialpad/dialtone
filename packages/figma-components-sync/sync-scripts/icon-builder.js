/**
 * Build Dialtone's icons as Figma components. Inlined into plugin/code.js by
 * build-plugin.mjs, exactly like generic-builder.js — so it is versioned and fingerprinted
 * rather than pasted somewhere by hand.
 *
 * UPDATES IN PLACE, NEVER RECREATES. Once a Button variant holds an instance of
 * `general/check`, deleting and recreating that component orphans every instance of it.
 * So a rerun keeps the existing component node and swaps its CONTENTS: instances follow
 * their main component, so the artwork updates and every reference survives. The component
 * pipeline can clear its pages freely because nothing points at a component set's variants;
 * that is not true here, and it is the one structural difference between the two builders.
 *
 * The per-icon decisions (flatten or keep structured, themeable or full-colour) were made
 * upstream in icon-svg.mjs, where the measurements that settled them are recorded. This
 * only carries them out.
 */
async function buildIcons ({ D }) {
  const COLS = 20;
  const CELL = 40;
  /** A bare instance should look right without the consumer doing anything. */
  const DEFAULT_FILL_VAR = 'color/foreground/primary';

  let page = figma.root.children.find(p => p.name === D.page);
  if (!page) { page = figma.createPage(); page.name = D.page; }
  await figma.setCurrentPageAsync(page);

  const existing = new Map();
  for (const n of page.children) if (n.type === 'COMPONENT') existing.set(n.name, n);
  // Components are NEVER cleared (see the note above) — but anything else on this page is
  // scaffolding from a previous run, and leaving it makes the page progressively less
  // readable while looking like it might mean something.
  if (D.clear) for (const n of page.children.slice()) if (n.type !== 'COMPONENT') n.remove();

  const vars = await figma.variables.getLocalVariablesAsync();
  let fillVar = vars.find(v => v.name === DEFAULT_FILL_VAR && v.resolvedType === 'COLOR') || null;
  // A file that LINKS the tokens library owns none of its variables, so the local lookup above
  // finds nothing there and every themeable icon was left with a literal black fill ("fill(s)
  // bound to NOTHING"). The payload carries the published key; local stays the first choice.
  if (!fillVar && D.fillVarKey) {
    try { fillVar = await figma.variables.importVariableByKeyAsync(D.fillVarKey); } catch (e) { fillVar = null; }
  }

  const ids = {};
  let created = 0, updated = 0, unchanged = 0, bound = 0;
  /** Marks the description as ours, so a human-written description is never mistaken for one. */
  const HASH_PREFIX = 'dt-icon-content:';
  const failures = [];

  for (let i = 0; i < D.icons.length; i++) {
    const it = D.icons[i];
    try {
      const tmp = figma.createNodeFromSvg(it.svg);
      // B-99: the frame createNodeFromSvg returns keeps a default opaque fill, which
      // renders as a solid block behind the artwork.
      tmp.fills = [];

      if (it.flatten) {
        // ONE vector, ONE name. Figma maps instance overrides across a swap by layer name,
        // so this is what lets a per-variant icon colour survive the designer choosing a
        // different icon. Only safe because icon-svg.mjs stripped the no-op clip masks
        // first — flatten UNIONS a clip mask into the artwork rather than applying it, and
        // `alert-circle` flattened to a solid black square while every structural check
        // said `1 Icon:VECTOR`. The raster is what caught it.
        const v = figma.flatten(tmp.children.slice(), tmp);
        v.name = 'Icon';
      } else {
        for (const n of tmp.findAll(() => true)) if (n.type === 'VECTOR') n.name = 'Icon';
      }

      // So an instance resized to the consuming component's icon box scales its artwork
      // instead of pinning it to one corner.
      for (const n of tmp.findAll(() => true)) {
        if ('constraints' in n) n.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
      }
      if (it.mono && fillVar) {
        for (const n of tmp.findAll(x => x.type === 'VECTOR')) {
          const p = figma.variables.setBoundVariableForPaint(
            { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 1 }, 'color', fillVar);
          n.fills = [p];
          bound++;
        }
      }

      let comp = existing.get(it.name);
      if (comp) {
        /**
         * AN UNCHANGED ICON IS LEFT COMPLETELY ALONE.
         *
         * "Update in place" was not enough. Replacing a component's CHILDREN destroys every
         * instance override that pointed at them, because an override is keyed to a specific
         * child node — so rebuilding this library silently decoloured every icon instance in
         * the file. DtButton went from 0 findings to 4,480, and DtBadge's merged set to 112,
         * with nothing about either component having changed: their icons had simply fallen
         * back to the library's own `color/foreground/primary`.
         *
         * The content hash lives in the component's DESCRIPTION, because that is state the
         * plugin can read back out of the file on the next run. When it matches, nothing is
         * touched at all — no removal, no append, no resize — and every override survives.
         */
        if (comp.description === HASH_PREFIX + it.hash) {
          tmp.remove();
          unchanged++;
          ids[it.name] = comp.id;
          comp.x = (i % COLS) * CELL;
          comp.y = Math.floor(i / COLS) * CELL;
          continue;
        }
        for (const c of comp.children.slice()) c.remove();
        for (const c of tmp.children.slice()) comp.appendChild(c);
        comp.resize(it.w, it.h);
        comp.description = HASH_PREFIX + it.hash;
        tmp.remove();
        updated++;
      } else {
        comp = figma.createComponentFromNode(tmp);
        comp.name = it.name;
        comp.description = HASH_PREFIX + it.hash;
        existing.set(it.name, comp);
        created++;
      }
      comp.x = (i % COLS) * CELL;
      comp.y = Math.floor(i / COLS) * CELL;
      ids[it.name] = comp.id;
    } catch (e) {
      // One bad icon must not cost the other 616, but it must not vanish either.
      failures.push({ name: it.name, error: (e && e.message) ? e.message : String(e) });
    }
  }

  return { page: D.page, created, updated, unchanged, boundFills: bound,
           defaultFillVar: fillVar ? DEFAULT_FILL_VAR : null, ids, failures };
}
