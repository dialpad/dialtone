/**
 * Component coordinate spaces, shared by the verifier, the spec builder and the
 * provenance audit. Axes come from the PROP API (component-documentation.json plus
 * the .vue props block), never from <Name>Constants.js, whose keys are CSS modifier
 * names and not prop values.
 */
const BUILT_IN = {
  badge: {
    component: 'DtBadge', label: 'Badge', page: 'Badge', figmaSetId: '286:6666', figmaMergedSetId: '252:113178',
    axes: {
      type: ['default','info','positive','warning','critical','bulletin','ai'],
      kind: ['label','count'], subtle: [false,true], outlined: [false,true],
      decoration: ['','black-400','black-500','black-900','red-200','red-300','red-400',
        'purple-200','purple-300','purple-400','purple-500','blue-200','blue-300','blue-400',
        'green-300','green-400','green-500','gold-300','gold-400','gold-500',
        'magenta-200','magenta-300','magenta-400'],
    },
    invalid: c => (c.type === 'ai' && c.kind === 'count')
      || (c.subtle === true && c.type !== 'bulletin')
      || (c.decoration !== '' && (c.kind !== 'label' || c.type !== 'default')),
    variantName: c => `type=${c.type}, kind=${c.kind}, subtle=${c.subtle}, outlined=${c.outlined}, decoration=${c.decoration || 'none'}`,
    props: c => ({ type: c.type, kind: c.kind, subtle: c.subtle, outlined: c.outlined, ...(c.decoration ? { decoration: c.decoration } : {}) }),
    // Which slots a MERGED build fills for its second render. The nodes behind a BOOLEAN
    // component property default to false, so nothing else ever renders them (B-11).
    // `--merged` is what checks them, in both states.
    slotPass: ['startIcon', 'endIcon'],
    // DtBadge rejects `decoration` together with either icon slot, so the slot pass
    // has to exclude decorated variants on top of the ordinary invalid rules.
    slotInvalid: c => c.decoration !== '',
  },
  link: {
    component: 'DtLink', label: 'Link', page: 'Link', figmaSetId: '286:7009',
    axes: {
      tone: ['default','critical','warning','positive','info','muted','mention','unstyled'],
      inverted: [false, true],
      underline: [true, false],
      state: ['default','hover','active','focus'],
    },
    // `unstyled` returns early from getLinkClasses() with exactly
    // ['d-link--unstyled'], so inverted and underline have no effect and the base
    // .d-link:hover / :active rules cannot match it.
    invalid: c => (c.tone === 'unstyled' && (c.inverted === true || c.underline === false))
      || (c.tone === 'unstyled' && ['hover','active'].includes(c.state)),
    variantName: c => `tone=${c.tone}, inverted=${c.inverted}, underline=${c.underline}, state=${c.state}`,
    props: c => ({ tone: c.tone === 'default' ? '' : c.tone, inverted: c.inverted, underline: c.underline, href: '#' }),
    pseudo: c => (c.state === 'default' ? [] : c.state === 'focus' ? ['focus-visible'] : [c.state]),
  },
  toggle: {
    component: 'DtToggle', label: 'Toggle', page: 'Toggle', figmaSetId: '286:7394',
    axes: {
      // modelValue looks boolean but is TRI-state; 'mixed' drives
      // d-toggle--indeterminate and switches role to checkbox.
      modelValue: [false, true, 'mixed'],
      size: [200, 300],
      disabled: [false, true],
      // Booleans that gate real child elements. Kept as variant axes rather than
      // Figma component properties so the verifier actually covers both states —
      // a component property's non-default value is never swept (see B-11).
      showIcon: [true, false],
      showLabel: [true, false],
      state: ['default', 'focus'],
    },
    // a native <button disabled> cannot receive focus
    invalid: c => (c.disabled === true && c.state === 'focus'),
    variantName: c => `modelValue=${c.modelValue}, size=${c.size}, disabled=${c.disabled}, showIcon=${c.showIcon}, showLabel=${c.showLabel}, state=${c.state}`,
    props: c => ({ modelValue: c.modelValue, size: Number(c.size), disabled: c.disabled, showIcon: c.showIcon, showLabel: c.showLabel }),
    pseudo: c => (c.state === 'focus' ? ['focus-visible'] : []),
    // The focusable element is the inner <button class="d-toggle">, NOT the root
    // wrapper div. Forcing :focus-visible on the root made `.d-toggle:focus-visible`
    // never match, so the focus ring — which the CSS puts on `.d-toggle::after` —
    // was silently absent.
    stateTarget: '.d-toggle',
    // .d-toggle-wrapper is display:flex with NO gap of its own — measured, the label's
    // right edge and the track's left edge are the same coordinate. Every Dialtone doc
    // example passes a spacing class, so the library depicts that rather than a render
    // nobody ships. See D-15.
    rootClass: 'd-g-200',
  },
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
