/**
 * Component coordinate spaces, shared by the verifier, the spec builder and the
 * provenance audit. Axes come from the PROP API (component-documentation.json plus
 * the .vue props block), never from <Name>Constants.js, whose keys are CSS modifier
 * names and not prop values.
 */
const BUILT_IN = {
  button: {
    component: 'DtButton', label: 'Button', page: 'Button', figmaSetId: '561:49545',
    /**
     * SLOT PRESENCE IS A VARIANT AXIS HERE, not a BOOLEAN component property.
     *
     * `button.less` reduces horizontal padding when an icon is present, so the optical
     * spacing stays even — every one of the 560 combinations differs, by 2px a side, and
     * some change `itemSpacing` too. No Figma component property can change a frame's
     * padding, so a single variant carrying its icons behind a toggle is wrong in one of the
     * two states whichever padding it is given. Measured as a merged set it produced 2,660
     * findings; the guard in build-spec now refuses that build outright.
     *
     * As an axis, each state is measured in its own right and is exact. Figma renders a
     * two-value variant property as a control that reads much like a toggle, so almost
     * nothing is lost in use — and the two SINGLE-icon combinations, which `slotPass` could
     * never produce because it fills every slot at once, exist for the first time.
     *
     * DtBadge keeps the BOOLEAN model: its padding does not respond to its icons, which the
     * merged pass confirms with 0 findings in both states.
     */
    axes: {
      kind: ['default','muted','critical','positive','inverted'],
      importance: ['clear','outlined','primary'],
      size: [100,200,300,400,500],
      // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
      state: ['default','hover','active','focus','disabled'],
      loading: [false,true],
      startIcon: [false, true],
      endIcon: [false, true],
      // Icon-only circular shape. Crossed with kind/importance like any other shape axis —
      // `isInvalidPropCombination`'s own two circle-specific rejections (ButtonConstants.js's
      // `INVALID_COMBINATION`) are added to `invalid` below; its third and fourth entries
      // are `kind: 'muted', importance: 'primary'` for BOTH circle values, already covered
      // by the existing muted/primary rule regardless of circle.
      circle: [false, true],
    },
    // muted/primary is rejected by the component; hover and active are not
    // reachable while loading because the button is pointer-events:none.
    // Icons are NOT excluded while loading: measured, both render — the spinner sits
    // alongside them rather than replacing them.
    invalid: c => (c.kind === 'muted' && c.importance === 'primary')
      || (c.loading === true && ['hover','active'].includes(c.state))
      || (c.circle === true && c.kind === 'default' && c.importance === 'primary')
      || (c.circle === true && c.kind === 'critical' && c.importance === 'outlined'),
    variantName: c => `kind=${c.kind}, importance=${c.importance}, size=${c.size}, state=${c.state}, `
      + `loading=${c.loading}, startIcon=${c.startIcon}, endIcon=${c.endIcon}, circle=${c.circle}`,
    props: c => ({
      kind: c.kind, importance: c.importance, size: Number(c.size), circle: c.circle,
      ...(c.state === 'active' ? { active: true } : {}),
      ...(c.state === 'disabled' ? { disabled: true } : {}),
      ...(c.loading ? { loading: true } : {}),
    }),
    // Which named slots this variant fills. The ordinary sweep reads this, so no second
    // build and no merge is involved at all.
    slots: c => [...(c.startIcon ? ['startIcon'] : []), ...(c.endIcon ? ['endIcon'] : [])],
    /**
     * WHILE LOADING, `.d-loader` IS AN INSTANCE OF A REAL COMPONENT — not re-measured anatomy.
     *
     * DtLoader's spinner look comes from a CSS `mask-image: conic-gradient(...)` cutting the
     * arc out of a solid ring, which nothing in this pipeline can reproduce (no concept of a
     * CSS mask). Rather than importing the two identical rings this measures and getting a
     * plain circle, `.d-loader` becomes an instance of DtLoader itself — built separately
     * (`configs/loader.mjs`), where the arc is a deliberate stand-in for an icon-library glyph
     * instead. DtLoader must be built BEFORE Button for this to resolve.
     *
     * `BUTTON_ICON_SIZES` (ButtonConstants.js) is the same map `loaderSize()` in button.vue
     * uses at runtime — Button's 100/200 both collapse to Loader's 200, there is no Loader
     * size below it.
     */
    anatomySwap: c => ({
      selector: 'd-loader',
      component: 'loader',
      variant: { size: { 100: 200, 200: 200, 300: 300, 400: 400, 500: 500 }[c.size] },
    }),
    // only these two need the CDP override; active/disabled are class-driven
    pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
    // No `slotPass`: slot presence is swept above, so the two-set path and the merged path
    // are both redundant here. The old sets (223:10810, 241:41867) are superseded.
  },
};

// Per-component configs live in ./configs/<name>.mjs so that several agents can add
// components in parallel without ever editing the same file. Each module default-
// exports a single config object and is discovered at runtime.
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const CONFIG_DIR = join(dirname(fileURLToPath(import.meta.url)), 'configs');
const discovered = {};
let files = [];
try { files = readdirSync(CONFIG_DIR).filter(f => f.endsWith('.mjs')); } catch { /* none yet */ }
for (const f of files.sort()) {
  const mod = await import(pathToFileURL(join(CONFIG_DIR, f)).href);
  const cfg = mod.default;
  if (!cfg || !cfg.component) throw new Error(`configs/${f} must default-export a config with a \`component\` field`);
  const key = cfg.key || f.replace(/\.mjs$/, '');
  if (BUILT_IN[key]) throw new Error(`configs/${f} collides with the built-in "${key}"`);
  discovered[key] = cfg;
}

export const COMPONENTS = { ...BUILT_IN, ...discovered };
