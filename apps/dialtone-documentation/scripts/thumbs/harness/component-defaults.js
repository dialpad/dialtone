/**
 * Resolves render config for the thumb harness by reading the Combinator's
 * per-component variants files. Single source of truth for what a component's
 * default rendering looks like — when the team updates a variant, our thumb
 * picks it up automatically.
 *
 * Resolution order:
 *   1. LOCAL_OVERRIDES wins (components without variants files, or where
 *      the variants file doesn't produce a useful thumbnail)
 *   2. Pick named variant from Combinator (defaults to 'default', overridable
 *      via THUMB_VARIANTS[exportName].variant)
 *   3. Apply propOverrides from THUMB_VARIANTS (e.g. force overlay open state)
 */

import { defineComponent, h } from 'vue';
import variantsFactory from '@variants/variants.js';
import { LOCAL_OVERRIDES } from './local-overrides.js';
import { THUMB_VARIANTS } from './thumb-variants.js';

const variants = variantsFactory();

const FALLBACK = { props: {}, slots: { default: () => 'Label' } };

// Variant slot values can be plain text ('Place call'), pure markup
// ('<dt-button>Save</dt-button>'), or mixed ('Message body with <dt-link>…</dt-link>.').
// Vue's runtime compiler handles all three the same way, so we always compile
// rather than gating on a startsWith('<') check that misses leading-text cases.
const _slotFnCache = new Map();
function makeSlotFn (value) {
  if (typeof value !== 'string' || value === '') return null;
  if (_slotFnCache.has(value)) return _slotFnCache.get(value);
  // Ephemeral component compiled from a slot template string; generic name is fine.
  const fn = () => h(defineComponent({ name: 'SlotContent', template: value }));
  _slotFnCache.set(value, fn);
  return fn;
}

function extractProps (variantProps) {
  const props = {};
  for (const [name, cfg] of Object.entries(variantProps)) {
    if (cfg?.initialValue !== undefined) props[name] = cfg.initialValue;
  }
  return props;
}

function extractSlots (variantSlots) {
  const slots = {};
  for (const [name, cfg] of Object.entries(variantSlots)) {
    const fn = makeSlotFn(cfg?.initialValue);
    if (fn) slots[name] = fn;
  }
  return slots;
}

function translateVariant (variant) {
  return {
    props: extractProps(variant.props || {}),
    slots: extractSlots(variant.slots || {}),
  };
}

export function getDefaultConfig (exportName) {
  if (LOCAL_OVERRIDES[exportName]) return LOCAL_OVERRIDES[exportName];

  const overrides = THUMB_VARIANTS[exportName] ?? {};
  const variantName = overrides.variant ?? 'default';
  const variant = variants[exportName]?.[variantName];
  if (!variant) return FALLBACK;

  const cfg = translateVariant(variant);
  if (overrides.propOverrides) {
    cfg.props = { ...cfg.props, ...overrides.propOverrides };
  }
  return cfg;
}
