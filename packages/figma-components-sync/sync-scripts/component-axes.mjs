/**
 * Component coordinate spaces, shared by the verifier, the spec builder and the
 * provenance audit. Axes come from the PROP API (component-documentation.json plus
 * the .vue props block), never from <Name>Constants.js, whose keys are CSS modifier
 * names and not prop values.
 */
const BUILT_IN = {
  button: {
    component: 'DtButton', label: 'Button', page: 'Button', figmaSetId: '589:35574',
    /**
     * ICONS ARE BOOLEAN PROPERTIES; THE CIRCULAR BUTTON IS ITS OWN SET (`button_icon`).
     *
     * Button's icons used to be variant axes (startIcon, endIcon), because `button.less` cuts the
     * x-padding by 2px a side when an icon is present and no component property can change a
     * frame's padding. That was exact, and it made the set 4,160 variants, past the point where
     * Figma warns about performance (1,000).
     *
     * Now the set is built MERGED: one variant per combination of the remaining axes, with the
     * icons behind "Start Icon" / "End Icon" toggles. The padding is fixed at the NO-ICON value
     * (`slotSpacingDrift` below), so the default state is exact and an icon state is 2px wider per
     * side than the code. That is a recorded divergence, listed in every run, not an unnoticed one.
     * The circular, icon-only button (no label, one icon) has nothing to toggle and is a different
     * design surface, so it is its own set, `DtButtonIcon`.
     */
    merged: true,
    slotPass: ['startIcon', 'endIcon'],
    // Property -> the largest difference (px) between the empty and the icon-filled render that is
    // accepted. Measured: see the `drift` lines build-spec prints. Anything larger is still refused.
    slotSpacingDrift: { paddingLeft: 2, paddingRight: 2, itemSpacing: 2 },
    axes: {
      kind: ['default','muted','critical','positive','inverted'],
      importance: ['clear','outlined','primary'],
      size: [100,200,300,400,500],
      // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
      state: ['default','hover','active','focus','disabled'],
      loading: [false,true],
    },
    // muted/primary is rejected by the component; hover and active are not
    // reachable while loading because the button is pointer-events:none.
    // Icons are NOT excluded while loading: measured, both render — the spinner sits
    // alongside them rather than replacing them.
    invalid: c => (c.kind === 'muted' && c.importance === 'primary')
      || (c.loading === true && ['hover','active'].includes(c.state)),
    variantName: c => `kind=${c.kind}, importance=${c.importance}, size=${c.size}, state=${c.state}, `
      + `loading=${c.loading}`,
    props: c => ({
      kind: c.kind, importance: c.importance, size: Number(c.size),
      ...(c.state === 'active' ? { active: true } : {}),
      ...(c.state === 'disabled' ? { disabled: true } : {}),
      ...(c.loading ? { loading: true } : {}),
    }),
    // No slots in the ordinary render: the merged build's second render fills `slotPass`.
    slots: () => [],
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

/**
 * VARIANT PROPERTY NAMES ARE HUMAN-FRIENDLY IN FIGMA, CODE-STYLE EVERYWHERE ELSE.
 *
 * A config's axes and `variantName` use the Vue prop names (`showClose`, `linkKind`), which is
 * what the browser side needs. In Figma those become the labels a designer reads in the
 * properties panel, so they are Title Case with spaces, as in the docs-site Combinator
 * ("Link Kind", "Assertive On Focus"). Done ONCE, here, by wrapping `variantName`, because that
 * function is the single authority the builder, the verifier, the identity audit and the swap
 * targets all use to name or find a variant: renaming at the Figma end only would have each of
 * them looking for a name nobody wrote. Values are left alone (`default`, `true`, `100`).
 */
export const humanKey = (key) => key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());
export const humaniseVariantName = (name) =>
  name.replace(/(^|, )([A-Za-z][A-Za-z0-9]*)=/g, (m, pre, key) => `${pre}${humanKey(key)}=`);

const ALL = { ...BUILT_IN, ...discovered };
for (const cfg of Object.values(ALL)) {
  const authored = cfg.variantName
    || (c => Object.keys(cfg.axes).map(a => `${a}=${c[a]}`).join(', '));
  cfg.variantName = c => humaniseVariantName(authored(c));
}
export const COMPONENTS = ALL;
