// Dialtone Migration Helper — DOM-structure version swap engine.
//
// Exposed as globalThis.__dtStructure = { enable(rules), disable() }.
// Called by content.js when the dtStructure storage flag changes.
//
// Direction: next → stable (reverse of the Dialtone migration guide).
// Rules are declared in rules.js (loaded before this file in manifest.json).
//
// Architecture mirrors the dtOverride pattern in content.js: a registry tracks
// every mutation so disable() reverts to the exact pre-enable DOM. A
// MutationObserver re-applies rules to newly added nodes while enabled, so
// framework-rendered components are transformed without re-toggling.

(() => {
  'use strict';

  // Registry of { el, newEl, inverses[] } — source of truth for revert.
  // `el`    — the original element (preserved while swapped out for renameTag).
  // `newEl` — the replacement element after renameTag (null for non-tag-rename rules).
  // `inverses` — ordered list of inverse op descriptors to replay on disable().
  const registry = [];

  // Active rules array (set by enable, cleared by disable).
  let activeRules = null;

  // MutationObserver instance.
  let observer = null;

  // Guard flags to prevent infinite loops and overlapping apply passes.
  // `applying`  — true during an apply pass; prevents re-entry from own mutations.
  // `pendingRaf` — rAF id set synchronously when the callback schedules a frame;
  //               cleared inside the frame. Prevents stacking when many mutations
  //               arrive before the first rAF fires.
  let applying = false;
  let pendingRaf = 0;

  // Candidates accumulate here across every mutation batch that arrives before
  // the scheduled frame fires — so a burst that lands while a frame is already
  // pending is merged in, not dropped. Drained and reset when the frame runs.
  let pendingCandidates = [];
  let pendingSeen = new Set();
  function addPendingCandidate(el) {
    if (!pendingSeen.has(el)) {
      pendingSeen.add(el);
      pendingCandidates.push(el);
    }
  }

  // ── Op executors ────────────────────────────────────────────────────────────
  // Each returns { inverses: [...], nextEl } where nextEl supports op-chaining
  // through renameTag (subsequent ops in the same rule apply to nextEl).

  function execOp(el, op) {
    switch (op.type) {
      case 'replaceClass': {
        // Prefix-aware: replaces all classes starting with op.from with op.to + suffix.
        const snapshot = [...el.classList];
        let changed = false;
        for (const cls of snapshot) {
          if (cls.startsWith(op.from)) {
            el.classList.remove(cls);
            el.classList.add(op.to + cls.slice(op.from.length));
            changed = true;
          }
        }
        if (!changed) return { inverses: [], nextEl: el };
        // Revert by replaying the exact pre-change class list, not a prefix
        // swap-back — a swap-back can't reconstruct an element that already
        // carried both the old and new class name at once.
        return { inverses: [{ type: '_restoreClassList', classes: snapshot }], nextEl: el };
      }

      case 'addClass':
        if (!el.classList.contains(op.cls)) {
          el.classList.add(op.cls);
          return { inverses: [{ type: 'removeClass', cls: op.cls }], nextEl: el };
        }
        return { inverses: [], nextEl: el };

      case 'removeClass':
        if (el.classList.contains(op.cls)) {
          el.classList.remove(op.cls);
          return { inverses: [{ type: 'addClass', cls: op.cls }], nextEl: el };
        }
        return { inverses: [], nextEl: el };

      case 'setAttr': {
        const prev = el.getAttribute(op.name);
        el.setAttribute(op.name, op.value);
        const inv = prev === null
          ? { type: 'removeAttr', name: op.name }
          : { type: 'setAttr', name: op.name, value: prev };
        return { inverses: [inv], nextEl: el };
      }

      case 'removeAttr': {
        const prev = el.getAttribute(op.name);
        if (prev !== null) {
          el.removeAttribute(op.name);
          return { inverses: [{ type: 'setAttr', name: op.name, value: prev }], nextEl: el };
        }
        return { inverses: [], nextEl: el };
      }

      case 'renameTag': {
        // Create new element, copy all attributes, move all children, swap in DOM.
        // Records parent + nextSibling so revert can deterministically re-insert
        // the original element at the exact original position.
        const parent = el.parentNode;
        // Guard: el was removed from DOM between observer callback and rAF execution.
        if (!parent) return { inverses: [], nextEl: el };
        const nextSibling = el.nextSibling;
        const newEl = document.createElement(op.to);
        for (const attr of [...el.attributes]) newEl.setAttribute(attr.name, attr.value);
        while (el.firstChild) newEl.appendChild(el.firstChild);
        parent.insertBefore(newEl, el);
        el.remove();
        return {
          inverses: [{ type: '_renameTagRevert', originalEl: el, newEl, parent, nextSibling }],
          nextEl: newEl,
        };
      }

      case 'unwrap': {
        // Remove this element from the DOM, lifting all its children to the parent
        // at the same position. Inverse re-wraps the children back inside the element.
        const parent = el.parentNode;
        if (!parent) return { inverses: [], nextEl: el };
        const nextSibling = el.nextSibling;
        const children = [...el.childNodes];
        for (const child of children) parent.insertBefore(child, el);
        el.remove();
        return {
          inverses: [{ type: '_unwrapRevert', el, parent, nextSibling, children }],
          nextEl: el,
        };
      }

      case 'removeElement': {
        // Remove this element from the DOM entirely. Inverse re-inserts it at the
        // original position.
        const parent = el.parentNode;
        if (!parent) return { inverses: [], nextEl: el };
        const nextSibling = el.nextSibling;
        el.remove();
        return {
          inverses: [{ type: '_removeElementRevert', el, parent, nextSibling }],
          nextEl: el,
        };
      }

      default:
        return { inverses: [], nextEl: el };
    }
  }

  // ── Rule application ─────────────────────────────────────────────────────────

  // Apply all ops in a rule to `el`, threading renameTag replacements forward.
  function applyRuleToEl(el, rule) {
    let current = el;
    const allInverses = [];
    for (const op of rule.ops) {
      const { inverses, nextEl } = execOp(current, op);
      allInverses.push(...inverses);
      current = nextEl;
    }
    registry.push({ el, newEl: current !== el ? current : null, inverses: allInverses });
  }

  // Apply all rules to `candidates` (array of elements).
  // Skips elements already in the registry (already transformed).
  function applyRulesToCandidates(rules, candidates) {
    for (const rule of rules) {
      for (const el of candidates) {
        if (!el.isConnected || !el.matches) continue;
        try {
          if (!el.matches(rule.match)) continue;
        } catch {
          continue; // unsupported selector
        }
        // Skip if already tracked (el itself or its post-renameTag replacement).
        if (registry.some((r) => r.el === el || r.newEl === el)) continue;
        applyRuleToEl(el, rule);
      }
    }
  }

  // Full-document scan: collect all elements, apply all rules.
  function applyRulesToDocument(rules) {
    const all = [...document.querySelectorAll('*')];
    applyRulesToCandidates(rules, all);
  }

  // ── Revert ───────────────────────────────────────────────────────────────────

  function revertAll() {
    // Replay registry in reverse order; within each entry replay inverses reversed.
    for (let i = registry.length - 1; i >= 0; i--) {
      const { el, newEl, inverses } = registry[i];
      // Elements to apply non-renameTag inverses to: the replacement element if
      // there was a renameTag; otherwise the original.
      const target = newEl || el;

      for (let j = inverses.length - 1; j >= 0; j--) {
        const inv = inverses[j];

        if (inv.type === '_renameTagRevert') {
          const { originalEl, newEl: ne, parent, nextSibling } = inv;
          if (!parent.isConnected) {
            console.warn('[dt-structure] renameTag revert: parent detached — skipping');
            continue;
          }
          // Move children from replacement back to original.
          while (ne.firstChild) originalEl.appendChild(ne.firstChild);
          // Re-insert original at the recorded position (safe fallback: append).
          const anchor = nextSibling && nextSibling.parentNode === parent ? nextSibling : null;
          parent.insertBefore(originalEl, anchor);
          ne.remove();
        } else if (inv.type === '_unwrapRevert') {
          const { el: wrapEl, parent, nextSibling, children } = inv;
          if (!parent.isConnected) {
            console.warn('[dt-structure] unwrap revert: parent detached — skipping');
            continue;
          }
          for (const child of children) wrapEl.appendChild(child);
          const anchor = nextSibling && nextSibling.parentNode === parent ? nextSibling : null;
          parent.insertBefore(wrapEl, anchor);
        } else if (inv.type === '_removeElementRevert') {
          const { el: removedEl, parent, nextSibling } = inv;
          if (!parent.isConnected) {
            console.warn('[dt-structure] removeElement revert: parent detached — skipping');
            continue;
          }
          const anchor = nextSibling && nextSibling.parentNode === parent ? nextSibling : null;
          parent.insertBefore(removedEl, anchor);
        } else if (inv.type === '_restoreClassList') {
          if (!target.isConnected) continue;
          target.className = inv.classes.join(' ');
        } else {
          if (!target.isConnected) continue;
          execOp(target, inv);
        }
      }
    }
    registry.length = 0;
  }

  // ── MutationObserver ─────────────────────────────────────────────────────────

  // Derive attribute names from all `[attr...]` patterns in rule match selectors.
  // Used to build a tight attributeFilter so only relevant attribute changes fire
  // the observer callback on live React/Vue apps.
  function deriveAttributeFilter(rules) {
    const attrs = new Set();
    const re = /\[([a-zA-Z][a-zA-Z0-9-]*)/g;
    for (const rule of rules) {
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(rule.match)) !== null) attrs.add(m[1]);
    }
    return [...attrs];
  }

  function scheduleReapply(mutationsList) {
    // Ignore mutations produced by our own apply pass — collecting them would loop.
    if (applying) return;

    // Merge this batch's candidates into the shared pending set. Batches that
    // arrive while a frame is already scheduled accumulate here rather than
    // early-returning, so nothing added before the rAF fires is dropped.
    for (const m of mutationsList) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue; // elements only
        addPendingCandidate(node);
        for (const child of node.querySelectorAll('*')) addPendingCandidate(child);
      }
      if (m.type === 'attributes' && m.target.nodeType === 1) {
        addPendingCandidate(m.target);
      }
    }
    if (!pendingCandidates.length || pendingRaf) return;

    // Only one frame is ever in flight; later batches merge into pendingCandidates
    // above. Set pendingRaf synchronously so intervening callbacks don't stack rAFs.
    pendingRaf = requestAnimationFrame(() => {
      pendingRaf = 0;
      const batch = pendingCandidates;
      pendingCandidates = [];
      pendingSeen = new Set();
      applying = true;
      applyRulesToCandidates(activeRules, batch);
      applying = false;
    });
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  globalThis.__dtStructure = {
    get remapCount() { return registry.length; },

    enable(rules) {
      // If already on (e.g. theme change), start fresh.
      if (activeRules) this.disable();

      activeRules = rules;

      applying = true;
      applyRulesToDocument(rules);
      applying = false;

      const attrFilter = deriveAttributeFilter(rules);
      observer = new MutationObserver(scheduleReapply);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        ...(attrFilter.length && { attributes: true, attributeFilter: attrFilter }),
      });
    },

    disable() {
      if (!activeRules) return; // idempotent

      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (pendingRaf) {
        cancelAnimationFrame(pendingRaf);
        pendingRaf = 0;
      }
      pendingCandidates = [];
      pendingSeen = new Set();

      // Revert doesn't need the applying guard (observer is disconnected).
      revertAll();
      activeRules = null;
    },
  };
})();
