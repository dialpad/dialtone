import { useEffectEvent, useLayoutEffect, useMemo, useRef } from 'react';
import { ClickScrollPlugin, OverlayScrollbars } from 'overlayscrollbars';

/** How the scrollbar shows itself: `v-dt-scrollbar:<mode>`'s arg, or the value's `showScrollbar`. */
export type ScrollbarShowMode = 'always' | 'enter' | 'scroll' | 'move';

/** A scrollbar offset length: a number is pixels. */
export type ScrollbarOffsetLength = string | number | null | undefined;

export interface ScrollbarOffset {
  /** Offset for both block-start (aka top) and block-end (aka bottom), unless those are set. */
  block?: ScrollbarOffsetLength;
  /** Offset for both inline-start (aka left) and inline-end (aka right), unless those are set. */
  inline?: ScrollbarOffsetLength;
  blockStart?: ScrollbarOffsetLength;
  blockEnd?: ScrollbarOffsetLength;
  inlineStart?: ScrollbarOffsetLength;
  inlineEnd?: ScrollbarOffsetLength;
}

/** What `v-dt-scrollbar` accepts as its binding value. */
export interface ScrollbarOptions {
  /** When the scrollbar shows. Overrides the arg. Defaults to `'enter'`. */
  showScrollbar?: ScrollbarShowMode;
  /** Insets the scrollbar track from the element's sides. */
  offset?: ScrollbarOffset | null;
  /** Space-separated classes added to the block-axis (aka vertical) scrollbar. */
  blockClasses?: string;
  /** Space-separated classes added to the inline-axis (aka horizontal) scrollbar. */
  inlineClasses?: string;
}

/** The directive's `:arg`, as a hook option. */
export interface UseScrollbarHookOptions {
  /** `v-dt-scrollbar:always` → `{ arg: 'always' }`. The value's `showScrollbar` wins over it. */
  arg?: ScrollbarShowMode;
}

type AutoHide = 'never' | 'leave' | 'scroll' | 'move';

type ScrollbarInstance = ReturnType<typeof OverlayScrollbars>;

interface ScrollbarConfig {
  showScrollbar: ScrollbarShowMode | undefined;
  offset: ScrollbarOffset | null;
  blockClasses: string | undefined;
  inlineClasses: string | undefined;
}

/** One `useScrollbar` call on the element. */
interface Owner {
  config: ScrollbarConfig;
}

/** What the directive keeps for an element: its instance, and the classes it has added to the scrollbars. */
interface Registration {
  os: ScrollbarInstance;
  owners: Owner[];
  appliedBlockClasses: string | undefined;
  appliedInlineClasses: string | undefined;
}

const VALID_SHOW_SCROLLBAR = new Set<string>(['always', 'enter', 'scroll', 'move']);

const OFFSET_SIDES = ['block-start', 'block-end', 'inline-start', 'inline-end'];

const registrations = new WeakMap<HTMLElement, Registration>();

function resolveShowScrollbar (showScrollbar: string | undefined): AutoHide {
  const mode = showScrollbar ?? 'enter';
  if (!VALID_SHOW_SCROLLBAR.has(mode)) {
    console.info(`[v-dt-scrollbar] Unknown showScrollbar value "${mode}". Valid values: ${[...VALID_SHOW_SCROLLBAR].join(', ')}. Falling back to "enter".`);
    return 'leave'; // 'enter' resolved
  }
  // 'always' → OS 'never' (always visible); 'enter' → OS 'leave' (show on enter, hide on leave)
  if (mode === 'always') return 'never';
  if (mode === 'enter') return 'leave';
  return mode as AutoHide;
}

function toCssLength (val: string | number) {
  return typeof val === 'number' ? `${val}px` : val;
}

function setProp (el: HTMLElement, prop: string, val: ScrollbarOffsetLength) {
  if (val != null) el.style.setProperty(prop, toCssLength(val));
  else el.style.removeProperty(prop);
}

function applyOffset (el: HTMLElement, offset: ScrollbarOffset | null) {
  if (!offset) {
    for (const s of OFFSET_SIDES) el.style.removeProperty(`--dt-scrollbar-offset-${s}`);
    return;
  }
  setProp(el, '--dt-scrollbar-offset-block-start', offset.blockStart ?? offset.block);
  setProp(el, '--dt-scrollbar-offset-block-end', offset.blockEnd ?? offset.block);
  setProp(el, '--dt-scrollbar-offset-inline-start', offset.inlineStart ?? offset.inline);
  setProp(el, '--dt-scrollbar-offset-inline-end', offset.inlineEnd ?? offset.inline);
}

const splitClasses = (classes: string) => classes.split(' ').filter(Boolean);

function applyScrollbarClasses (reg: Registration, config: ScrollbarConfig) {
  const { scrollbarVertical, scrollbarHorizontal } = reg.os.elements();
  if (reg.appliedBlockClasses) scrollbarVertical.scrollbar.classList.remove(...splitClasses(reg.appliedBlockClasses));
  if (reg.appliedInlineClasses) {
    scrollbarHorizontal.scrollbar.classList.remove(...splitClasses(reg.appliedInlineClasses));
  }
  if (config.blockClasses) scrollbarVertical.scrollbar.classList.add(...splitClasses(config.blockClasses));
  if (config.inlineClasses) scrollbarHorizontal.scrollbar.classList.add(...splitClasses(config.inlineClasses));
  reg.appliedBlockClasses = config.blockClasses;
  reg.appliedInlineClasses = config.inlineClasses;
}

// The directive's `mounted`.
function create (el: HTMLElement, config: ScrollbarConfig): Registration {
  OverlayScrollbars.plugin(ClickScrollPlugin);
  const autoHide = resolveShowScrollbar(config.showScrollbar);
  const noDelay = autoHide === 'never' || autoHide === 'leave'; // OS values, already resolved
  // @property inside a shadow DOM stylesheet doesn't register globally.
  // Without global registration Chrome's WAAPI can't interpolate
  // --os-scroll-percent as a number and the scrollbar thumb never moves.
  try {
    CSS.registerProperty({
      name: '--os-scroll-percent',
      syntax: '<number>',
      inherits: true,
      initialValue: '0',
    });
  } catch (error) {
    // Chrome throws InvalidModificationError when the property is already
    // registered — that's the expected case on non-web-component pages
    // where overlayscrollbars.css is loaded globally. Anything else is a
    // real failure and should not be silently swallowed.
    if (!(error instanceof DOMException) || error.name !== 'InvalidModificationError') {
      throw error;
    }
  }

  const os = OverlayScrollbars({
    target: el,
    elements: {
      viewport: el.children[0] as HTMLElement,
    },
  }, {
    scrollbars: {
      autoHide,
      clickScroll: true,
      autoHideDelay: noDelay ? 0 : 1300,
    },
  });
  el.setAttribute('data-overlayscrollbars-initialize', 'true');
  el.classList.add('d-scrollbar');
  applyOffset(el, config.offset);
  const reg: Registration = { os, owners: [], appliedBlockClasses: undefined, appliedInlineClasses: undefined };
  applyScrollbarClasses(reg, config);
  return reg;
}

// The directive's `updated`.
function update (el: HTMLElement, reg: Registration, config: ScrollbarConfig) {
  const autoHide = resolveShowScrollbar(config.showScrollbar);
  const noDelay = autoHide === 'never' || autoHide === 'leave'; // OS values, already resolved
  reg.os.options({
    scrollbars: {
      autoHide,
      autoHideDelay: noDelay ? 0 : 1300,
    },
  });
  applyOffset(el, config.offset);
  applyScrollbarClasses(reg, config);
}

/**
 * dialtone-vue's `v-dt-scrollbar` directive as a hook: an OverlayScrollbars scrollbar on `el`, whose first child is
 * the scrolling viewport. Adds the `d-scrollbar` class and `data-overlayscrollbars-initialize` attribute to `el`.
 *
 * `el` is kept in state with a callback ref, so the scrollbar follows the element: a new element gets a new instance,
 * as on the directive's `mounted`, and losing one destroys its instance, as on `unmounted`. Like Vue's `unmounted`, that
 * leaves the class, attribute and offset properties on the element.
 *
 * @example
 * const [el, setEl] = useState<HTMLElement | null>(null);
 * // <div ref={setEl}><div>…scrolling content…</div></div>
 *
 * // v-dt-scrollbar
 * useScrollbar(el);
 *
 * // v-dt-scrollbar:always
 * useScrollbar(el, undefined, { arg: 'always' });
 *
 * // v-dt-scrollbar="{ showScrollbar: 'scroll', offset: { block: '2rem' } }"
 * useScrollbar(el, { showScrollbar: 'scroll', offset: { block: '2rem' } });
 */
export function useScrollbar (
  el: HTMLElement | null,
  value?: ScrollbarOptions | null,
  options?: UseScrollbarHookOptions,
): void {
  const showScrollbar = value?.showScrollbar ?? options?.arg;
  const { blockClasses, inlineClasses } = value ?? {};
  // The directive's `updated` runs when its binding changes, however its object is made: compare by value.
  const offsetKey = JSON.stringify(value?.offset ?? null);
  const config = useMemo<ScrollbarConfig>(
    () => ({ showScrollbar, offset: JSON.parse(offsetKey) as ScrollbarOffset | null, blockClasses, inlineClasses }),
    [showScrollbar, offsetKey, blockClasses, inlineClasses],
  );

  const ownerRef = useRef<Owner | null>(null);
  // Called only from the effect below, so it reads the config of the render that attached the element.
  const currentConfig = useEffectEvent(() => config);

  // Layout effects, as Vue's directive hooks run before the browser paints: the scrollbar replaces the native one at
  // once, with no flash of it.

  // The directive's `mounted` and `unmounted`. Vue can't put the directive on one element twice, but two hooks can: the
  // element then keeps one instance, until the last of them lets go of it.
  useLayoutEffect(() => {
    if (!el) return undefined;
    const host = el;
    const owner: Owner = { config: currentConfig() };

    let reg = registrations.get(host);
    if (!reg) {
      reg = create(host, owner.config);
      registrations.set(host, reg);
    } else {
      update(host, reg, owner.config);
    }
    reg.owners.push(owner);
    ownerRef.current = owner;

    return () => {
      ownerRef.current = null;
      const held = registrations.get(host);
      if (!held) return;
      held.owners = held.owners.filter((o) => o !== owner);
      if (held.owners.length === 0) {
        held.os.destroy();
        registrations.delete(host);
      } else {
        // The element keeps the state the hooks still on it set last.
        update(host, held, held.owners[held.owners.length - 1].config);
      }
    };
  }, [el]);

  // The directive's `updated`. It doesn't run on mount, where the effect above has just applied this config.
  useLayoutEffect(() => {
    const owner = ownerRef.current;
    if (!el || !owner || owner.config === config) return;
    const reg = registrations.get(el);
    if (!reg) return;

    owner.config = config;
    reg.owners = [...reg.owners.filter((o) => o !== owner), owner];
    update(el, reg, config);
  }, [el, config]);
}
