/**
 * Prepare a Dialtone icon SVG for import as a Figma component.
 *
 * Three things have to be decided per icon, and each was decided by measurement:
 *
 * 1. IS IT THEMEABLE? `packages/dialtone-icons/gulpfile.cjs` rewrites a fixed list of
 *    literal fills to `currentColor` when it builds the Vue components. That list IS the
 *    definition of "this icon takes its colour from context", so it is parsed from the
 *    gulpfile rather than copied here — a copy would drift the first time Dialtone adds a
 *    colour, and nothing would say so.
 *
 * 2. CAN IT BE FLATTENED? Flattening to a single vector is what makes an instance-swap
 *    usable: Figma maps overrides across a swap BY LAYER NAME, so one vector named `Icon`
 *    in every icon means a per-variant colour override survives the designer picking a
 *    different icon. But `figma.flatten` UNIONS a clip mask into the artwork instead of
 *    applying it — `alert-circle` flattened to a solid black square, and the structural
 *    result said `1 Icon:VECTOR` and looked perfectly correct. Only the raster caught it.
 *
 * 3. IS THE CLIP REAL? Of 139 icons with a clipPath, 136 are a full-box no-op — a mask
 *    the size of the viewBox, clipping nothing. Those are stripped, which makes flattening
 *    safe. Three are real clips (microsoft-teams, call-abandoned, send) and are left
 *    structured rather than flattened.
 */

import { readFileSync } from 'fs';

/** The literal fills the Vue build treats as themeable. Parsed, never copied. */
export function themeableFills (gulpfilePath) {
  const src = readFileSync(gulpfilePath, 'utf8');
  const rules = [...src.matchAll(/replace\(' fill="([^"]+)"',\s*' fill="currentColor"'\)/g)].map(m => m[1]);
  if (!rules.length) {
    throw new Error(`parsed no fill->currentColor rules from ${gulpfilePath} — the recolour `
      + `contract moved, and guessing it would silently mis-classify every icon`);
  }
  return [...rules, 'currentColor'];
}

const VIEWBOX = /viewBox="0 0 ([\d.]+) ([\d.]+)"/;

/** Is this clipPath body a mask the size of the whole viewBox — i.e. clipping nothing? */
function isNoOpClip (body, vw, vh) {
  const r = /<rect[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"/.exec(body);
  if (r) return Math.abs(+r[1] - vw) < 0.01 && Math.abs(+r[2] - vh) < 0.01;
  const p = /<path[^>]*\sd="\s*M0 0h([\d.]+)v([\d.]+)H0z?\s*"/i.exec(body);
  if (p) return Math.abs(+p[1] - vw) < 0.01 && Math.abs(+p[2] - vh) < 0.01;
  return false;
}

/**
 * @returns {{svg, width, height, mono, flatten, strippedClips, realClips}}
 */
export function prepareIcon (raw, themeable) {
  const vb = VIEWBOX.exec(raw);
  if (!vb) throw new Error('icon has no "0 0 w h" viewBox');
  const [vw, vh] = [Number(vb[1]), Number(vb[2])];

  let svg = raw.replace(/\s+/g, ' ').trim();

  // Strip the no-op clips, and only those. A real clip carries meaning and stays.
  let strippedClips = 0, realClips = 0;
  const clips = [...svg.matchAll(/<clipPath[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/clipPath>/g)];
  for (const [whole, id, body] of clips) {
    if (!isNoOpClip(body, vw, vh)) { realClips++; continue; }
    svg = svg.split(whole).join('');
    // and the references to it, or Figma resolves clip-path to nothing and may drop content
    svg = svg.replace(new RegExp(`\\s*clip-path="url\\(#${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)"`, 'g'), '');
    strippedClips++;
  }
  svg = svg.replace(/<defs>\s*<\/defs>/g, '');

  // Themeable = every painted fill is one the Vue build would turn into currentColor.
  // Fills inside <defs> are masks and gradients: they paint nothing themselves, and
  // counting them classified 136 monochrome icons as multi-colour.
  const painted = svg.replace(/<defs>[\s\S]*?<\/defs>/g, '');
  const fills = [...painted.matchAll(/fill="([^"]+)"/g)].map(m => m[1]).filter(v => v !== 'none');
  const uniq = [...new Set(fills)];
  const mono = uniq.length > 0 && uniq.every(v => themeable.includes(v));

  // `currentColor` is not a colour Figma can import; give it a concrete one. Which colour
  // does not matter — the consuming variant overrides the fill, and a bare instance gets
  // the library's default binding.
  svg = svg.replace(/fill="currentColor"/g, 'fill="#000000"');

  return { svg, width: vw, height: vh, mono, flatten: mono && realClips === 0, strippedClips, realClips };
}
