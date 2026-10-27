/**
 * Slots whose content the config declares as a swappable exemplar (`slotContent(...).swapTo`).
 *
 * Combo-independent: a slot either is an exemplar or is not, so the first combo answers it.
 * Shared by the values pass and the identity audit, because both must skip the same slots:
 * an exemplar is a real instance of another component, styled as that component is, not a
 * copy of what was measured in context.
 */
export function exemplarSlots (cfg) {
  const slots = new Set();
  if (cfg && cfg.slotContent) {
    try {
      const probe = Object.fromEntries(Object.keys(cfg.axes).map(a => [a, cfg.axes[a][0]]));
      for (const [slot, spec] of Object.entries(cfg.slotContent(probe) || {})) {
        if (spec && spec.swapTo) slots.add(slot);
      }
    } catch { /* a config that cannot be probed declares no exemplars */ }
  }
  return slots;
}
