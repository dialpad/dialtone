/**
 * Verification harness — mounts the REAL DtButton so getComputedStyle reads the
 * component as it actually renders, not a synthetic <button> with classes on it.
 * A synthetic button keeps the UA `appearance` and misses the reset, which makes
 * every colour reading wrong.
 */
import { createApp, reactive, h } from 'vue';
import * as dialtoneVue from '@dialpad/dialtone-vue';
import { DtIconClose } from '@dialpad/dialtone-icons/vue3';
// Theme first: it defines the --dt-* custom properties. Without it every
// `calc(var(--dt-…))` in the component rules is invalid and silently dropped,
// and the button reports UA defaults.
// Theme first: it defines the --dt-* custom properties. Without it every
// `calc(var(--dt-…))` in the component rules is invalid and silently dropped,
// and the button reports UA defaults.
import '../../../dialtone-css/lib/dist/dialtone-default-theme.css';
// Dark-mode values live ONLY in the layered token CSS, scoped to
// [data-dt-mode="light"|"dark"]. The default theme file defines the light
// palette on :root and carries no dark variable block at all, so without these
// two imports setting data-dt-mode="dark" changes nothing and a "dark" reading
// is silently the light palette. Both files are attribute-scoped, so they are
// inert until the attribute is set and cannot disturb light-mode runs.
import '../../../dialtone-tokens/dist/css/layered/tokens-base-colors.css';
import '../../../dialtone-tokens/dist/css/layered/tokens-dp-colors.css';
import '../../../dialtone-css/lib/dist/dialtone.css';

const state = reactive({ component: 'DtButton', props: {}, label: 'Button', slots: [], rootClass: null });

/**
 * Turn a config's slot spec into vnodes.
 *
 * One spec is { component, props, text }; an array is several, which is what a list, a tab
 * group or a segmented control needs. Nesting is by `children`, so a tab that holds an icon
 * is expressible without a second mechanism.
 *
 * A named-but-missing component throws. Falling back to something plausible is exactly how
 * DtNotice's action slot spent weeks holding a close icon where a button belongs: it
 * rendered, so nothing failed, and what got baked into Figma was not the component.
 */
function renderSpec (spec, name) {
  if (Array.isArray(spec)) return spec.flatMap((one, i) => renderSpec(one, name + '.' + i));
  if (typeof spec === 'string') return [spec];
  const Slotted = dialtoneVue[spec.component];
  if (!Slotted) throw new Error(`slotContent for "${name}" names ${spec.component}, which dialtone-vue does not export`);
  const inner = spec.children ? { default: () => renderSpec(spec.children, name + '>') }
    : (spec.text ? { default: () => spec.text } : undefined);
  return [h(Slotted, { 'data-slot': name, ...(spec.props || {}) }, inner)];
}

const app = createApp({
  render () {
    const C = dialtoneVue[state.component];
    if (!C) return null;
    // Slot content matters: a component's anatomy changes when a slot is filled,
    // and those nodes are what become Figma instance-swap properties.
    // A config's `label: ''` means "this component renders its own text". Passing an
    // EMPTY default slot is not the same as passing none: Vue sees slot content, so the
    // component's own fallback never runs. DtFilterPill's `label` prop rendered nothing
    // and all 32 variants were a bare chevron; DtSelectMenu's default slot IS its
    // <option> list, so all 80 variants were an empty <select> (B-104). Both passed
    // every check, because both sides agreed about a component rendering almost nothing.
    const slots = {};
    /**
     * A CONTAINER'S CONTENT IS COMPONENTS, NOT A STRING.
     *
     * `label` fills the default slot with text, which is the whole content model for a
     * Button or a Badge and none of it for a container. DtTextList wants DtTextListItem
     * children, DtSegmentedControl wants DtSegmentedControlItem, DtTabGroup wants DtTab —
     * and an empty container has no geometry worth syncing, so these components could not
     * be measured at all.
     *
     * So a slot spec is now one child, or an array of them, and `default` is a slot name
     * like any other. Text still wins where text is what the component holds.
     */
    if ((state.slotContent || {}).default) {
      slots.default = () => renderSpec(state.slotContent.default, 'default');
    } else if (state.label !== '' && state.label != null) {
      slots.default = () => state.label;
    }
    // Slot content must be a REAL icon, not a fixed-size box. Button and Badge pass
    // an `icon-size` slot prop and the icon sizes itself from it, so a hardcoded
    // 16px span reports the wrong geometry — it made every icon-bearing button read
    // 2px taller than Figma. A plain span also ignores --icon-size entirely.
    for (const name of state.slots) {
      /**
       * NOT EVERY SLOT WANTS AN ICON.
       *
       * Every named slot used to receive a DtIconClose, whatever it was for. DtNotice and
       * DtBanner have an `action` slot that takes a BUTTON, so what got measured — and what
       * would have been baked into the Figma set as the thing a designer swaps — was a close
       * icon sitting where a button belongs. It rendered, so nothing failed; it was simply
       * not the component.
       *
       * A config can now say what a slot holds:
       *   slotContent: { action: { component: 'DtButton', props: {…}, text: 'Action' } }
       * An unspecified slot still gets the icon, which is right for the icon slots that
       * make up most of them.
       */
      const spec = (state.slotContent || {})[name];
      if (spec && (spec.component || Array.isArray(spec))) {
        slots[name] = () => renderSpec(spec, name);
        continue;
      }
      // Must carry real content: components gate slots on hasSlotContent(),
      // which treats an empty element as no slot at all.
      // hasSlotContent() does slot(props).some(...) — it requires an ARRAY of
      // vnodes, not a single vnode, or the slot reads as empty.
      slots[name] = (slotProps) => [h(DtIconClose, {
        'data-slot': name,
        size: slotProps && slotProps.iconSize ? slotProps.iconSize : '200',
      })];
    }
    // Vue treats a slots object passed to h() as stable and will not re-render it
    // when only the slot set changes — key on the slot set to force a remount.
    slots.$stable = false;
    // Some components carry no spacing of their own and rely on the consumer for it —
    // DtToggle has zero gap between label and switch until a class supplies one, and
    // every Dialtone doc example supplies one. Rendering without it would depict a
    // component nobody ships.
    return h(C, {
      ...state.props,
      ...(state.rootClass ? { class: state.rootClass } : {}),
      id: 'subject',
      key: state.slots.join('|') + '|' + (state.rootClass || ''),
    }, slots);
  },
});

Object.entries(dialtoneVue).forEach(([name, comp]) => {
  if (name.endsWith('Directive') && typeof comp?.install === 'function') app.use(comp);
  else if (name.startsWith('Dt') && typeof comp === 'object' && comp !== null) app.component(name, comp);
});

app.mount('#root');

// Exposed so tooling can ask what this harness can actually render instead of guessing at
// export names. Read-only; nothing in the pipeline depends on it.
window.__dt = Object.fromEntries(Object.keys(dialtoneVue)
  .filter(k => /^Dt/.test(k) && typeof dialtoneVue[k] === 'object' && dialtoneVue[k] !== null)
  .map(k => [k, true]));

// Driven from Playwright.
window.__setMode = (mode) => {
  if (mode) document.documentElement.setAttribute('data-dt-mode', mode);
  else document.documentElement.removeAttribute('data-dt-mode');
  void document.documentElement.offsetWidth;
  return document.documentElement.getAttribute('data-dt-mode');
};

window.__setProps = async (component, props, opts = {}) => {
  state.component = component;
  state.props = props;
  if (opts.label !== undefined) state.label = opts.label;
  state.slots = opts.slots || [];
  state.slotContent = opts.slotContent || {};
  state.rootClass = opts.rootClass || null;
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  // Any root element counts. The old check looked for .d-btn/button/a, which is
  // false for a <span> component like Badge — callers then read stale anatomy.
  return !!document.querySelector('#root > *');
};

// Full anatomy: the tree AND per-node computed styles. The CSS says how each
// element is styled; only the DOM says where it sits, whether it exists in this
/**
 * Screen-reader-only elements paint nothing and must not become Figma nodes.
 *
 * Detected by behaviour rather than class name, because the pattern appears under
 * several names (.sr-only, and NoticeAction's own sr-only close button) and a
 * class-list check would silently miss any spelling nobody thought of.
 *
 * Module scope, and exported below, because `audit-provenance.mjs` builds its OWN
 * DOM tree — it needs a CSS selector per node for CDP lookups, which this tree does
 * not carry. That second tree must drop exactly the same nodes as this one. While it
 * had its own filter it kept DtKeyboardShortcut's sr-only span, so every child index
 * after it paired against the wrong Figma node and the audit compared a glyph's fill
 * to a span's background (B-103).
 */
const isSrOnly = (s, box) => {
  if (s.visibility === 'hidden' || s.display === 'none') return true;
  if (/inset\(\s*50%/.test(s.clipPath || '')) return true;
  if (/rect\(\s*0(px)?[,\s]/.test(s.clip || '')) return true;
  return s.position === 'absolute' && s.overflow === 'hidden'
    && box.width <= 1.5 && box.height <= 1.5;
};
/** The same rule, taking an element — for any consumer that has no computed style yet. */
window.__isSrOnly = (el) => isSrOnly(getComputedStyle(el), el.getBoundingClientRect());

// variant, and in what order. Parsing `__` selectors gives styling without structure.
window.__anatomy = () => {
  const root = document.querySelector('#root > *');
  if (!root) return null;
  const READ = ['backgroundColor','color','borderTopColor','borderTopWidth','borderTopLeftRadius',
    // All four corners and all four border widths. One corner and one width was enough while
    // every synced component was symmetrical; DtSplitButton's halves are not — each has
    // `border-inline-end: 0` and two zeroed corners — so a single reading described one
    // quarter of the geometry and the other three were assumed to match it.
    'borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius',
    'paddingTop','paddingRight','paddingBottom','paddingLeft','columnGap','rowGap',
    'borderLeftWidth','borderRightWidth','borderBottomWidth',
    // The colour of each side, for the same reason as the widths: a border drawn on one
    // edge has its colour on THAT edge, and border-top-color is then just the default.
    'borderRightColor','borderBottomColor','borderLeftColor',
    // A CSS margin is real spacing that Figma has no per-child equivalent for. It was
    // never captured, so Notice silently lost 28px between its icon and its content —
    // the box was right, the gap was gone, and nothing could see it.
    'marginTop','marginRight','marginBottom','marginLeft',
    'display','flexDirection','flexWrap','alignItems','justifyContent','position','boxShadow',
    // `outline` was exempted on the belief that Dialtone always paints focus with
    // box-shadow. Checkbox's checked focus ring is a real outline, so the exemption
    // was a claim about the design system that the design system does not honour.
    'outlineColor','outlineWidth','outlineStyle','outlineOffset','transform',
    'insetInlineStart','insetInlineEnd','insetBlockStart','insetBlockEnd',
    // The MAXIMA as well as the minima. A clamp is as capable of setting the used size as a
    // floor is: Chip's `> .d-icon { max-inline-size: var(--chip-icon-size) }` pulls a
    // declared 14px icon down to 12, and with only the minimum read, the 14px token was
    // credited with the 12px result on 300 properties.
    'width','height','minWidth','minHeight','maxWidth','maxHeight','fontSize','fontWeight','lineHeight','opacity','overflow',
    // Font FAMILY was never captured, so it was never compared, on any component.
    // The builder hardcodes one family; nothing would have said if that went wrong.
    'fontFamily',
    // Used to recognise screen-reader-only elements, which paint nothing but were
    // being emitted as real Figma nodes (Notice grew a phantom close button).
    'visibility','clipPath',
    // Checkbox draws its check and its dash as a data-URI SVG in `background-image`.
    // Reading only backgroundColor made checked, indeterminate and unchecked
    // byte-identical — three states rendering as one.
    'backgroundImage','backgroundPosition','backgroundSize',
    // A pseudo-element can paint nothing but text: FilterPill's `::before` is a
    // literal "=" glyph. Dropping content-only pseudos dropped that character.
    'content',
    // SVG shapes paint through `fill`, not background-color. The chip's close glyph
    // is `fill: currentColor`, so without this its colour is never compared.
    'fill','stroke'];

  /**
   * `url("data:image/svg+xml,…")` -> the decoded SVG source, or null.
   *
   * Matched on the QUOTE delimiter, not on a character class. Dialtone's inline
   * SVGs are written with single-quoted attributes (`width='14'`), so a class like
   * [^)"']+ stops at the first attribute and yields a truncated, unparseable
   * fragment — which is why the checkbox glyph read as absent rather than as broken.
   */
  const dataUriSvg = (bg) => {
    const m = /url\(\s*"(data:image\/svg\+xml[\s\S]*?)"\s*\)/.exec(bg || '')
           || /url\(\s*'(data:image\/svg\+xml[\s\S]*?)'\s*\)/.exec(bg || '')
           || /url\(\s*(data:image\/svg\+xml[^)]*)\)/.exec(bg || '');
    if (!m) return null;
    const uri = m[1];
    if (/;base64,/.test(uri)) { try { return atob(uri.split(';base64,')[1]); } catch { return null; } }
    const raw = uri.slice(uri.indexOf(',') + 1);
    // The payload is usually literal, not percent-encoded. decodeURIComponent throws
    // on a stray '%', and silently returning null there would drop a real glyph.
    try { return decodeURIComponent(raw); } catch { return raw; }
  };

  /**
   * Where a `background-image` glyph actually paints inside its box.
   *
   * Dialtone's checkbox uses `no-repeat / center center / auto`, so the glyph keeps
   * its INTRINSIC size and is centred — it does not stretch to the element. Resizing
   * the imported vector to the element box instead put a 14x14 checkmark into a 16x16
   * frame at the wrong scale and hard against the top-left corner.
   *
   * Anything this cannot resolve is returned as `unrepresentable` rather than guessed.
   */
  const glyphRect = (s, el, src) => {
    if (!src) return null;
    const iw = parseFloat((/width=['"]([\d.]+)/.exec(src) || [])[1]);
    const ih = parseFloat((/height=['"]([\d.]+)/.exec(src) || [])[1]);
    if (!iw || !ih) return { unrepresentable: 'svg declares no intrinsic width/height' };
    let w = iw, h = ih;
    const size = s.backgroundSize || 'auto';
    if (size !== 'auto') {
      const m = /^([\d.]+)px\s+([\d.]+)px$/.exec(size);
      if (!m) return { unrepresentable: `background-size: ${size}` };
      w = parseFloat(m[1]); h = parseFloat(m[2]);
    }
    // Placement is inside the PADDING box, and Figma positions a child from the
    // frame's own origin — so the border width is part of the offset.
    const bl = parseFloat(s.borderLeftWidth) || 0;
    const bt = parseFloat(s.borderTopWidth) || 0;
    const boxW = el.clientWidth || 0;
    const boxH = el.clientHeight || 0;
    const axis = (spec, free) => {
      if (/%$/.test(spec)) return (parseFloat(spec) / 100) * free;
      if (/px$/.test(spec)) return parseFloat(spec);
      return null;
    };
    const [px_, py_] = (s.backgroundPosition || '50% 50%').split(/\s+/);
    const x = axis(px_, boxW - w), y = axis(py_ === undefined ? px_ : py_, boxH - h);
    if (x === null || y === null) return { unrepresentable: `background-position: ${s.backgroundPosition}` };
    return { w, h, x: +(bl + x).toFixed(2), y: +(bt + y).toFixed(2) };
  };

  const walk = (el, depth = 0, selector = '#root > *', parentRect = null) => {
    const s = getComputedStyle(el);
    const style = {};
    for (const k of READ) style[k] = s[k];
    /**
     * The decoration PAINTED on this node's text, which is not the node's own computed value.
     *
     * CSS does not inherit text-decoration, it propagates it down to descendant text, so
     * DtLink's underline sits on the root and the label inside reads `none`. Reading each
     * node's own value saw no underline anywhere and ButtonLink shipped to Figma without one.
     * Walk up to the first ancestor that declares one (stopping at the mount point).
     */
    style.textDecorationLine = 'none';
    for (let e = el; e && e.id !== 'root'; e = e.parentElement) {
      const line = getComputedStyle(e).textDecorationLine;
      if (line && line !== 'none') { style.textDecorationLine = line; break; }
    }
    const box = el.getBoundingClientRect();
    // An <svg> is handed to Figma whole via createNodeFromSvg, so its internals are
    // never walked. Descending into it emitted `defs`, `clipPath` and zero-size
    // `path` nodes as real frames, and left the actual glyph outline to be hand-coded.
    const isSvg = el.tagName.toLowerCase() === 'svg';
    // A native <select> draws its interior itself: the options live in a UA popup, not in
    // the control's box, and each <option> measures 0x0. Walking into it emitted zero-size
    // TEXT nodes for content Chrome renders and Figma cannot. The options still have to be
    // PRESENT in the DOM — the UA sizes the control to its widest option, so without them
    // the box is simply the wrong width — but they are not children of anything paintable.
    // Same reasoning as the native date/time/file/color inputs that configs/input.mjs
    // excludes outright.
    const uaDrawn = el.tagName.toLowerCase() === 'select';
    // Pseudo-elements are real painted boxes that no DOM walk can see. The toggle
    // KNOB is `.d-toggle::after` — a component whose most important visual element
    // exists only here. Captured as synthetic children so Figma can carry them.
    const pseudos = [];
    // `content: "="` yields the computed string with its quotes retained.
    const lit0 = (c) => { const m = /^"([\s\S]*)"$/.exec(c || ''); return m ? m[1] : null; };
    for (const pe of ['::before', '::after']) {
      const ps = getComputedStyle(el, pe);
      if (!ps.content || ps.content === 'none' || ps.content === 'normal') continue;
      if (ps.display === 'none') continue;
      /**
       * A PSEUDO HELD AT `opacity: 0` IS NOT A NODE, and it has to stop being one HERE.
       *
       * DtTabGroup's list border is a positioned `::after` whose opacity is
       * `var(--tablist-border-opacity)` — 0 when borderless; DtSegmentedControl's item
       * dividers are the same. build-spec already refused to emit them, so Figma had no
       * such layer, while the checks walked this tree and still expected one: 80 childCount
       * findings on the segmented control and 30 on the tab group, all of them the checks
       * disagreeing with the build about a node neither should have had.
       *
       * Dropping it in the harness is what makes all three consumers — the spec, the values
       * pass and the identity audit — see the same tree. Exactly the B-103 lesson, where
       * two implementations of `isSrOnly` shifted child indices apart.
       *
       * NOT the same as DtButton's loading label, which is also `opacity: 0` and is kept:
       * that is a real element in flow holding the button's width open. This is a
       * pseudo-element that paints nothing and, being positioned, contributes no layout.
       */
      if (Number(ps.opacity) === 0 && !(lit0(ps.content) || '').trim()) continue;
      const pstyle = {};
      for (const k of READ) pstyle[k] = ps[k];
      // `content: "="` yields the computed string with its quotes retained. A
      // counter, an attr() or an image is not a literal and is left to the paint
      // checks rather than being emitted as text.
      const lit = /^"([\s\S]*)"$/.exec(ps.content);
      pseudos.push({
        pseudo: pe.replace('::', ''),
        style: pstyle,
        text: lit ? lit[1] : null,
        svg: dataUriSvg(ps.backgroundImage),
        box: { w: parseFloat(ps.width) || 0, h: parseFloat(ps.height) || 0 },
        inset: { blockStart: ps.insetBlockStart, inlineStart: ps.insetInlineStart },
      });
    }
    return {
      tag: el.tagName.toLowerCase(),
      classes: [...el.classList],   // el.className is SVGAnimatedString on SVG nodes
      // Which named slot this node came from, if any. The slot CONTENT carries the marker;
      // the wrapper the component renders around it does not exist at all when the slot is
      // empty, so the merge finds the wrapper by diffing the two renders and names it from
      // the marker somewhere inside. Without this the merged spec could see that a subtree
      // was inserted but not which component property should govern it.
      dataSlot: el.getAttribute ? (el.getAttribute('data-slot') || null) : null,
      // DtIcon stamps `data-name` with the Dialtone icon name ("Close", "Chevron Down").
      // That is the link from a measured node to a component in the Figma icon library, so
      // a slot layer can be an INSTANCE the designer can swap rather than a re-imported
      // SVG nothing can point at.
      dataName: el.getAttribute ? (el.getAttribute('data-name') || null) : null,
      depth,
      text: [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
        ? el.textContent.trim().slice(0, 40) : null,
      // The whole SVG source, so Figma can import the real outline instead of a
      // reconstruction. Also covers a data-URI glyph painted through background-image.
      svg: isSvg ? el.outerHTML : dataUriSvg(s.backgroundImage),
      // Only meaningful for a background-image glyph: an inline <svg> is its own box.
      svgRect: isSvg ? null : glyphRect(s, el, dataUriSvg(s.backgroundImage)),
      box: { w: +box.width.toFixed(2), h: +box.height.toFixed(2) },
      // Which edge the box is anchored to. `inset-inline-end` means the distance
      // from the RIGHT edge is what the CSS specifies — and that is the number to
      // compare, because a hug-contents width differs between Chrome and Figma's
      // text shaper, so the left offset is not a fixed quantity.
      inset: s.position === 'absolute' ? {
        inlineStart: s.insetInlineStart, inlineEnd: s.insetInlineEnd,
        blockStart: s.insetBlockStart, blockEnd: s.insetBlockEnd,
      } : null,
      // Parent-relative offset, so an absolutely-positioned element can be placed
      // exactly in Figma without re-deriving it from inset/transform declarations.
      rel: parentRect
        ? { x: +(box.x - parentRect.x).toFixed(2), y: +(box.y - parentRect.y).toFixed(2) }
        : { x: 0, y: 0 },
      style,
      // An <img>'s pixels come from a RESOURCE, not from any CSS property — which is
      // exactly why B-98 hid: no comparison read anything that differed, so an empty
      // Figma frame agreed with a rendered photograph. Carry the source so the builder
      // can import the bytes and the checks can compare something real.
      ...(el.tagName === 'IMG'
        ? { imgSrc: el.getAttribute('src') || null, objectFit: s.objectFit || 'fill' }
        : {}),
      // a unique selector so CDP can resolve the same node for matched-styles
      selector,
      pseudos,
      children: (isSvg || uaDrawn) ? [] : [...el.children]
        // nth-child is computed over ALL element children so the selector still
        // resolves the same node in CDP after sr-only ones are dropped.
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => !isSrOnly(getComputedStyle(c), c.getBoundingClientRect()))
        .map(({ c, i }) => walk(c, depth + 1, `${selector} > *:nth-child(${i + 1})`, box)),
    };
  };
  return walk(root);
};

window.__read = () => {
  const el = document.querySelector('#root .d-btn') || document.querySelector('#root > *');
  if (!el) return null;
  void el.offsetWidth;                       // force style recalc before reading
  const s = getComputedStyle(el);
  return {
    tag: el.tagName, className: el.className,
    backgroundColor: s.backgroundColor, color: s.color, borderColor: s.borderTopColor,
    borderWidth: s.borderTopWidth, borderRadius: s.borderTopLeftRadius,
    paddingTop: s.paddingTop, paddingLeft: s.paddingLeft,
    gap: s.columnGap, fontSize: s.fontSize, fontWeight: s.fontWeight,
    appearance: s.appearance,
  };
};
