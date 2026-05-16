import { defineComponent, h } from 'vue';
import variantsFactory from '@variants/variants.js';

const variants = variantsFactory();

const FALLBACK = { props: {}, slots: { default: () => 'Label' } };

// Slot value may be plain text, pure markup, or mixed — always compile via
// runtime template so the same path handles all three.
function makeSlotFn (value) {
  if (typeof value !== 'string' || value === '') return null;
  return () => h(defineComponent({ name: 'SlotContent', template: value }));
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
  const variant = variants[exportName]?.default;
  if (!variant) return FALLBACK;
  return translateVariant(variant);
}
