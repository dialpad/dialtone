// Each distinct message is logged once, so a page with many identical badges doesn't repeat the same
// deprecation warning for every instance.
const warned = new Set();

export function warnOnce (message) {
  if (warned.has(message)) return;

  warned.add(message);
  console.warn(message);
}

// For tests, which assert on warnings that earlier tests may already have triggered.
export function resetBadgeWarnings () {
  warned.clear();
}
