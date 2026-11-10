/**
 * Slots whose content the config declares as a swappable exemplar (`slotContent(...).swapTo`).
 *
 * Combo-independent: a slot either is an exemplar or is not, so the first combo answers it.
 * Shared by the values pass and the identity audit, because both must skip the same slots:
 * an exemplar is a real instance of another component, styled as that component is, not a
 * copy of what was measured in context.
 */
/**
 * A config's slot content with every list spread out under the names the harness gives its members:
 * `default: [a, b]` is `default.0` and `default.1`, which is what each member's `data-slot` says. A group
 * holds several children (DtSegmentedControl's items), and each can declare its own `swapTo`.
 */
export function flatSlotContent (slotContent) {
  const out = {};
  for (const [slot, spec] of Object.entries(slotContent || {})) {
    if (Array.isArray(spec)) spec.forEach((one, i) => { out[slot + '.' + i] = one; });
    else out[slot] = spec;
  }
  return out;
}

export function exemplarSlots (cfg) {
  const slots = new Set();
  if (cfg && cfg.slotContent) {
    try {
      const probe = Object.fromEntries(Object.keys(cfg.axes).map(a => [a, cfg.axes[a][0]]));
      for (const [slot, spec] of Object.entries(flatSlotContent(cfg.slotContent(probe)))) {
        if (spec && spec.swapTo) slots.add(slot);
      }
    } catch (e) {
      // Quietly declaring no exemplars would make the checks treat a swap slot as ordinary content.
      console.warn(`exemplarSlots: could not probe ${cfg.component} slotContent (${e && e.message}); treating it as declaring none`);
    }
  }
  return slots;
}
