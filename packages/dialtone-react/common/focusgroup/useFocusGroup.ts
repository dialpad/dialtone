import { useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import type { FocusgroupAxis, FocusgroupConfig } from './focusgroup_constants';
import {
  configsEqual,
  parseConfigQuietly,
  resolveSelector,
  resolveSkipDisabled,
  warnUnknownToken,
  type FocusgroupValue,
} from './focusgroup_utils';

/** The `detail` of the `dt-focusgroup-move` event the container dispatches when the hook moves focus. */
export interface FocusgroupMoveDetail {
  item: HTMLElement;
  index: number;
  previousItem: HTMLElement;
  previousIndex: number;
}

declare global {
  interface HTMLElementEventMap {
    'dt-focusgroup-move': CustomEvent<FocusgroupMoveDetail>;
  }
}

/** What the directive keeps for an attached element. */
interface FocusgroupState {
  config: FocusgroupConfig;
  selector: string;
  skipDisabled: boolean;
  isRTL: boolean;
  lastFocusedIndex: number;
  _internalMove: boolean;
  onKeydown: ((event: KeyboardEvent) => void) | null;
  onFocusin: ((event: FocusEvent) => void) | null;
  onFocusout: ((event: FocusEvent) => void) | null;
}

/** One `useFocusGroup` call on the element. */
interface Owner {
  config: FocusgroupConfig;
}

interface Registration {
  state: FocusgroupState;
  owners: Owner[];
}

// Vue's directive keeps its state per element in a WeakMap; so does the hook, so that hooks on one element share it.
const registrations = new WeakMap<HTMLElement, Registration>();

// The keys of dialtone-vue's EVENT_KEYNAMES (common/constants) the directive uses.
const EVENT_KEYNAMES = {
  arrowup: 'ArrowUp',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
  arrowdown: 'ArrowDown',
  home: 'Home',
  end: 'End',
} as const;

type AttachedRef = RefObject<{ el: HTMLElement; config: FocusgroupConfig } | null>;

// Whether attaching `config` to `el` should warn about missing items: not when this hook last attached the same, which
// is StrictMode replaying the attach.
function shouldWarn (attachedRef: AttachedRef, el: HTMLElement, config: FocusgroupConfig) {
  const last = attachedRef.current;
  attachedRef.current = { el, config };
  return !last || last.el !== el || !configsEqual(last.config, config);
}

// ── Item discovery ──────────────────────────────────────────

function getItems (el: HTMLElement, selector: string) {
  return Array.from(el.querySelectorAll<HTMLElement>(selector))
    .filter(item => {
      if (item.hasAttribute('data-dt-focusgroup-skip')) return false;
      if (item.closest('[hidden]')) return false;
      // Exclude items inside collapsed containers (e.g., DtCollapsible),
      // but only if the aria-hidden ancestor is inside this focusgroup container
      const hiddenAncestor = item.closest('[aria-hidden="true"]');
      if (hiddenAncestor && el.contains(hiddenAncestor)) return false;
      return true;
    });
}

function isDisabled (item: HTMLElement) {
  return (item as HTMLElement & { disabled?: unknown }).disabled === true ||
    item.getAttribute('aria-disabled') === 'true';
}

// ── Navigation ──────────────────────────────────────────────

function findNext (items: HTMLElement[], fromIndex: number, direction: number, loop: boolean, skipDisabled: boolean) {
  const len = items.length;
  // Clamp fallback to valid range (fromIndex can be -1 or len for Home/End)
  const fallback = Math.max(0, Math.min(fromIndex, len - 1));
  for (let i = 1; i <= len; i++) {
    const index = loop
      ? (fromIndex + i * direction + len) % len
      : fromIndex + i * direction;

    if (index < 0 || index >= len) return fallback;
    if (skipDisabled && isDisabled(items[index])) continue;
    return index;
  }
  return fallback;
}

// Maps arrow keys to [axis, ltr-direction]. RTL reverses horizontal direction.
const ARROW_KEY_MAP: Record<string, [Exclude<FocusgroupAxis, 'both'>, number]> = {
  [EVENT_KEYNAMES.arrowright]: ['horizontal', 1],
  [EVENT_KEYNAMES.arrowleft]: ['horizontal', -1],
  [EVENT_KEYNAMES.arrowdown]: ['vertical', 1],
  [EVENT_KEYNAMES.arrowup]: ['vertical', -1],
};

function resolveDirection (key: string, axis: FocusgroupAxis, isRTL: boolean) {
  const mapping = Object.hasOwn(ARROW_KEY_MAP, key) ? ARROW_KEY_MAP[key] : undefined;
  if (!mapping) return null;

  const [keyAxis, ltrDir] = mapping;
  const axisAllowed = axis === 'both' || axis === keyAxis;
  if (!axisAllowed) return null;

  return (keyAxis === 'horizontal' && isRTL) ? -ltrDir : ltrDir;
}

// ── Tabindex management ─────────────────────────────────────

function setRovingTabindex (items: HTMLElement[], focusedIndex: number) {
  items.forEach((item, i) => {
    item.setAttribute('tabindex', i === focusedIndex ? '0' : '-1');
  });
}

function firstEnabledIndex (items: HTMLElement[], skipDisabled: boolean) {
  if (!skipDisabled) return 0;
  const enabledIndex = items.findIndex(item => !isDisabled(item));
  return enabledIndex !== -1 ? enabledIndex : 0;
}

// ── Focus movement ──────────────────────────────────────────

function moveTo (
  el: HTMLElement,
  state: FocusgroupState,
  items: HTMLElement[],
  currentIndex: number,
  targetIndex: number,
) {
  setRovingTabindex(items, targetIndex);
  state._internalMove = true;
  items[targetIndex].focus();
  queueMicrotask(() => { state._internalMove = false; });
  state.lastFocusedIndex = targetIndex;
  el.dispatchEvent(new CustomEvent<FocusgroupMoveDetail>('dt-focusgroup-move', {
    bubbles: true,
    detail: {
      item: items[targetIndex],
      index: targetIndex,
      previousItem: items[currentIndex],
      previousIndex: currentIndex,
    },
  }));
}

// ── Core handlers ───────────────────────────────────────────

function resolveHomeEnd (key: string, items: HTMLElement[], skipDisabled: boolean) {
  if (key === EVENT_KEYNAMES.home) return findNext(items, -1, 1, false, skipDisabled);
  if (key === EVENT_KEYNAMES.end) return findNext(items, items.length, -1, false, skipDisabled);
  return null;
}

function handleKeydown (event: KeyboardEvent, el: HTMLElement, state: FocusgroupState) {
  const items = getItems(el, state.selector);
  if (!items.length) return;

  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  if (currentIndex === -1) return;

  // Home / End — always preventDefault to avoid page scroll
  const homeEndIndex = resolveHomeEnd(event.key, items, state.skipDisabled);
  if (homeEndIndex !== null) {
    event.preventDefault();
    if (homeEndIndex !== currentIndex) moveTo(el, state, items, currentIndex, homeEndIndex);
    return;
  }

  // Arrow keys — always preventDefault when axis matches to prevent page scroll
  const direction = resolveDirection(event.key, state.config.axis, state.isRTL);
  if (direction === null) return;
  event.preventDefault();

  const nextIndex = findNext(items, currentIndex, direction, state.config.loop, state.skipDisabled);
  if (nextIndex !== currentIndex) {
    moveTo(el, state, items, currentIndex, nextIndex);
  }
}

function handleFocusin (event: FocusEvent, el: HTMLElement, state: FocusgroupState) {
  // Skip when focus was moved by the directive itself (avoid double work)
  if (state._internalMove) return;

  const items = getItems(el, state.selector);
  const index = items.indexOf(event.target as HTMLElement);
  if (index !== -1) {
    state.lastFocusedIndex = index;
    setRovingTabindex(items, index);
  }
}

function handleFocusout (event: FocusEvent, el: HTMLElement, state: FocusgroupState) {
  if (state.config.memory) return;
  // relatedTarget is where focus is going — if still inside, ignore
  if (event.relatedTarget && el.contains(event.relatedTarget as Node)) return;
  // Focus left the container — reset tabindex to first enabled item
  const items = getItems(el, state.selector);
  if (items.length) {
    const resetIndex = firstEnabledIndex(items, state.skipDisabled);
    setRovingTabindex(items, resetIndex);
    state.lastFocusedIndex = resetIndex;
  }
}

// ── Lifecycle ───────────────────────────────────────────────

// The directive's `mounted`, and its `updated` once the config has changed.
function attach (el: HTMLElement, config: FocusgroupConfig, warnIfEmpty: boolean): FocusgroupState {
  const selector = resolveSelector(el, config);
  const skipDisabled = resolveSkipDisabled(el, config);
  // getComputedStyle is the source of truth; the closest('[dir]') fallback covers DOM implementations that don't
  // compute direction.
  const isRTL = getComputedStyle(el).direction === 'rtl' || el.closest('[dir]')?.getAttribute('dir') === 'rtl';

  const state: FocusgroupState = {
    config,
    selector,
    skipDisabled,
    isRTL,
    lastFocusedIndex: 0,
    _internalMove: false,
    onKeydown: null,
    onFocusin: null,
    onFocusout: null,
  };

  // Set initial tabindex
  const items = getItems(el, selector);
  if (!items.length && warnIfEmpty) {
    const role = el.getAttribute('role');
    console.warn(
      `[DtFocusgroupDirective] No items found for selector "${selector}"` +
      (role ? ` (inferred from role="${role}")` : '') +
      '. Check that items match the selector, or provide an explicit selector via ' +
      'v-dt-focusgroup="{ selector: \'...\' }".',
    );
  }
  if (items.length) {
    setRovingTabindex(items, firstEnabledIndex(items, skipDisabled));
  }

  // Bind handlers
  state.onKeydown = (event) => handleKeydown(event, el, state);
  state.onFocusin = (event) => handleFocusin(event, el, state);
  state.onFocusout = (event) => handleFocusout(event, el, state);

  el.addEventListener('keydown', state.onKeydown);
  el.addEventListener('focusin', state.onFocusin);
  el.addEventListener('focusout', state.onFocusout);

  return state;
}

// The directive's `unmounted`, and the teardown before `updated` attaches again.
function cleanup (state: FocusgroupState, el: HTMLElement) {
  if (state.onKeydown) el.removeEventListener('keydown', state.onKeydown);
  if (state.onFocusin) el.removeEventListener('focusin', state.onFocusin);
  if (state.onFocusout) el.removeEventListener('focusout', state.onFocusout);
  state.onKeydown = null;
  state.onFocusin = null;
  state.onFocusout = null;
}

// Puts `config` on the element, attaching again only when it differs from the config attached, as `updated` does.
function apply (el: HTMLElement, reg: Registration, config: FocusgroupConfig, warnIfEmpty: boolean) {
  if (configsEqual(reg.state.config, config)) return;
  cleanup(reg.state, el);
  reg.state = attach(el, config, warnIfEmpty);
}

/**
 * dialtone-vue's `v-dt-focusgroup` directive as a hook: declarative roving tabindex for composite widgets.
 *
 * Implements the Open UI focusgroup pattern. Manages arrow-key navigation, tabindex, looping, memory, and
 * disabled-item handling. Focus only — activation/selection is the consumer's responsibility. When the hook moves
 * focus, `el` dispatches a bubbling `dt-focusgroup-move` CustomEvent whose `detail` is a {@link FocusgroupMoveDetail}.
 *
 * `el` is kept in state with a callback ref, so the hook follows the element: a new element is attached afresh, as on
 * the directive's `mounted`, and losing one removes the listeners, as on `unmounted`. A change of config attaches
 * again, as on `updated`, which also resets the roving tabindex to the first item.
 *
 * @example
 * const [el, setEl] = useState<HTMLElement | null>(null);
 *
 * // Token syntax (Open UI style): v-dt-focusgroup="'horizontal'"
 * useFocusGroup(el, 'horizontal');
 * // <div ref={setEl} role="toolbar" aria-label="Formatting">
 *
 * // Object syntax: v-dt-focusgroup="{ axis: 'vertical', loop: false }"
 * useFocusGroup(el, { axis: 'vertical', loop: false });
 *
 * // Selection follows focus via the dt-focusgroup-move event
 * useEffect(() => {
 *   if (!el) return undefined;
 *   const onMove = (event: CustomEvent<FocusgroupMoveDetail>) => selectTab(event.detail.item);
 *   el.addEventListener('dt-focusgroup-move', onMove);
 *   return () => el.removeEventListener('dt-focusgroup-move', onMove);
 * }, [el]);
 *
 * @see https://open-ui.org/components/scoped-focusgroup.explainer/
 */
export function useFocusGroup (el: HTMLElement | null, value?: FocusgroupValue): void {
  const { config: parsed, unknownTokens } = parseConfigQuietly(value);
  const { axis, loop, memory, selector, skipDisabled } = parsed;
  // The directive compares configs by value before attaching again, however its binding is made.
  const config = useMemo<FocusgroupConfig>(
    () => ({ axis, loop, memory, selector, skipDisabled }),
    [axis, loop, memory, selector, skipDisabled],
  );

  // Vue warns about unknown tokens as it parses the binding. The hook parses during render, so it warns from an effect,
  // once per change of the unknown tokens, which StrictMode's replay doesn't repeat.
  const unknownTokensKey = unknownTokens.join(' ');
  const warnedTokensRef = useRef('');
  useEffect(() => {
    if (warnedTokensRef.current === unknownTokensKey) return;
    warnedTokensRef.current = unknownTokensKey;
    if (unknownTokensKey) unknownTokensKey.split(' ').forEach(warnUnknownToken);
  }, [unknownTokensKey]);

  const ownerRef = useRef<Owner | null>(null);
  // The element and config this hook last attached, so StrictMode's replay of the same attach doesn't warn twice.
  const attachedRef: AttachedRef = useRef(null);
  // Called only from the effect below, so it reads the config of the render that attached the element.
  const currentConfig = useEffectEvent(() => config);

  // Layout effects, as Vue's directive hooks run before the browser paints: the roving tabindex is in place at once.

  // The directive's `mounted` and `unmounted`. Vue can't put the directive on one element twice, but two hooks can: the
  // element then keeps the config set last by the hooks still on it, until the last of them lets go of it.
  useLayoutEffect(() => {
    if (!el) return undefined;
    const host = el;
    const owner: Owner = { config: currentConfig() };

    let reg = registrations.get(host);
    if (!reg) {
      reg = { state: attach(host, owner.config, shouldWarn(attachedRef, host, owner.config)), owners: [] };
      registrations.set(host, reg);
    } else if (!configsEqual(reg.state.config, owner.config)) {
      apply(host, reg, owner.config, shouldWarn(attachedRef, host, owner.config));
    }
    reg.owners.push(owner);
    ownerRef.current = owner;

    return () => {
      ownerRef.current = null;
      const held = registrations.get(host);
      if (!held) return;
      held.owners = held.owners.filter((o) => o !== owner);
      if (held.owners.length === 0) {
        cleanup(held.state, host);
        registrations.delete(host);
      } else {
        apply(host, held, held.owners[held.owners.length - 1].config, false);
      }
    };
  }, [el]);

  // The directive's `updated`. It doesn't run on mount, where the effect above has just attached this config.
  useLayoutEffect(() => {
    const owner = ownerRef.current;
    if (!el || !owner || owner.config === config) return;
    const reg = registrations.get(el);
    if (!reg) return;

    owner.config = config;
    reg.owners = [...reg.owners.filter((o) => o !== owner), owner];
    if (!configsEqual(reg.state.config, config)) apply(el, reg, config, shouldWarn(attachedRef, el, config));
  }, [el, config]);
}
