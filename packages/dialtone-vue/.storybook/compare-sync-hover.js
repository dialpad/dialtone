// Hover styles for the compare sync agent (compare-sync-agent.js). A replayed pointer fires every event of hovering,
// but the browser's own :hover follows the real pointer only, so the frame that mirrors the other wouldn't show a hover
// style. While sync is on, this module copies each style rule that has a :hover into a stylesheet of its own, with
// :hover rewritten to an attribute, and the agent sets that attribute on the elements the replayed pointer is over: the
// element and all its ancestors, which is where :hover applies.
//
// The page's own sheets are never touched. The copy is a constructed sheet in document.adoptedStyleSheets, so taking it
// out puts everything back. Being adopted, it comes after every sheet of the page in the cascade: a copied rule can win
// over a later rule of the same specificity that would have won over the real hover. Only :hover: :active, :focus,
// :focus-visible and :focus-within are left as they are.

/** The attribute that stands for :hover. An attribute, not a class: Vue and React rewrite `class` when they render. */
export const HOVER_ATTRIBUTE = 'data-dt-sync-hover';
const MARKER = `[${HOVER_ATTRIBUTE}]`;

// Selectors. A small tokenizer, so that ":hover" inside a string, an attribute selector or an escape (`.a\:hover`, a
// class named "a:hover") is never taken for the pseudo-class.

const HOVER = /:hover/i;
const HEX = /[0-9a-f]/i;
const SPACE = /\s/;
const NAME = /[-\w\u0080-￿]/;
// Pseudo-elements CSS 2 wrote with one colon.
const LEGACY_ELEMENTS = new Set(['before', 'after', 'first-line', 'first-letter']);
// Pseudo-classes whose arguments are alternatives, any of which matches the element itself, and those that also take
// relative selectors (:has), any of which matches around it.
const LISTS = new Set(['is', 'where', 'matches', '-webkit-any', '-moz-any']);
const ANY_OF = new Set([...LISTS, 'has']);

// Where an escape starting at `i` ends: a backslash and one character, or up to six hex digits and one space.
const escapeEnd = (text, i) => {
  let end = i + 1;
  if (!HEX.test(text[end] ?? '')) return Math.min(end + 1, text.length);
  while (end < text.length && end < i + 7 && HEX.test(text[end])) end++;
  return SPACE.test(text[end] ?? '') ? end + 1 : end;
};

const stringEnd = (text, i) => {
  let end = i + 1;
  while (end < text.length && text[end] !== text[i]) end += text[end] === '\\' ? 2 : 1;
  return Math.min(end + 1, text.length);
};

const bracketEnd = (text, i) => {
  let end = i + 1;
  while (end < text.length && text[end] !== ']') {
    if (text[end] === '\\') end = escapeEnd(text, end);
    else if (text[end] === '"' || text[end] === '\'') end = stringEnd(text, end);
    else end++;
  }
  return Math.min(end + 1, text.length);
};

const nameEnd = (text, i) => {
  let end = i;
  while (end < text.length && (NAME.test(text[end]) || text[end] === '\\')) {
    end = text[end] === '\\' ? escapeEnd(text, end) : end + 1;
  }
  return end;
};

function tokenize (text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    let end = i + 1;
    let type = 'text';
    if (char === ':') {
      const element = text[i + 1] === ':';
      const start = i + (element ? 2 : 1);
      end = nameEnd(text, start);
      const name = text.slice(start, end).toLowerCase();
      tokens.push({ type: 'pseudo', text: text.slice(i, end), name, element: element || LEGACY_ELEMENTS.has(name) });
      i = end;
      continue;
    }
    if (char === '\\') end = escapeEnd(text, i);
    else if (char === '"' || char === '\'') end = stringEnd(text, i);
    else if (char === '[') end = bracketEnd(text, i);
    else if (SPACE.test(char)) {
      while (end < text.length && SPACE.test(text[end])) end++;
      type = 'space';
    } else if ('(),'.includes(char)) type = char;
    else if ('>+~'.includes(char)) type = 'combinator';
    else if (char === '|' && text[i + 1] === '|') {
      end = i + 2;
      type = 'combinator';
    }
    tokens.push({ type, text: text.slice(i, end) });
    i = end;
  }
  return tokens;
}

const BOUNDARIES = new Set(['(', ')', ',', 'combinator']);

// Whitespace between two compound selectors is the descendant combinator; next to a parenthesis, a comma or another
// combinator it is only spacing.
const isDescendant = (tokens, i) => i > 0 && i < tokens.length - 1 &&
  !BOUNDARIES.has(tokens[i - 1].type) && !BOUNDARIES.has(tokens[i + 1].type);

const alternative = () => ({ text: '', positive: false, negative: false, unsupported: false, deep: false, subject: false });

// Rewrites a selector list, from token `start` to its closing parenthesis (or the end), inside `negated` :not()s. For
// each alternative: whether it has a :hover that isn't negated (positive) or one that is (negative), one on a
// pseudo-element, which no attribute stands for (unsupported), and whether its compound selectors other than the last
// (deep), or the last (subject), have a positive one.
function rewriteList (tokens, start, negated) {
  const alternatives = [];
  let current = alternative();
  // The compound selector being read: whether it has a pseudo-element, and a positive :hover.
  let pseudoElement = false;
  let hovered = false;
  const endCompound = () => {
    current.deep ||= hovered;
    hovered = false;
    pseudoElement = false;
  };
  let i = start;
  for (; i < tokens.length && tokens[i].type !== ')'; i++) {
    const token = tokens[i];
    if (token.type === ',') {
      current.subject = hovered;
      alternatives.push(current);
      current = alternative();
      hovered = false;
      pseudoElement = false;
    } else if (token.type === 'combinator' || (token.type === 'space' && isDescendant(tokens, i))) {
      endCompound();
      current.text += token.text;
    } else if (token.type === '(' || (token.type === 'pseudo' && tokens[i + 1]?.type === '(')) {
      const isFunction = token.type === 'pseudo';
      const inner = rewriteList(tokens, i + (isFunction ? 2 : 1), negated !== (isFunction && token.name === 'not'));
      i = inner.end;
      for (const flag of ['positive', 'negative', 'unsupported']) {
        current[flag] ||= inner.alternatives.some(each => each[flag]);
      }
      if (isFunction && token.element) pseudoElement = true;
      const hoverInside = inner.alternatives.some(each => each.positive);
      const anyOf = hoverInside && !negated && !token.element && ANY_OF.has(token.name);
      // `:is(.active, :hover)`: its copy would match `.active` without the attribute, which the original rule already
      // does, but later in the cascade. Requiring the attribute too leaves only what the hover adds.
      const onSubject = anyOf && LISTS.has(token.name) &&
        inner.alternatives.every(each => !each.positive || (each.subject && !each.deep));
      // That can't be done when a hover isn't on the element itself (`:is(.a:hover .c, .b)`, `:has(> :hover, .b)`), so
      // there the alternatives without a hover can't match instead (`.b:not(*)`). They stay in the list, as its
      // specificity is that of its most specific alternative, and `:not(*)` adds none.
      const texts = inner.alternatives.map(each => (anyOf && !onSubject && !each.positive
        ? `${each.text.trimEnd()}:not(*)`
        : each.text));
      current.text += `${isFunction ? `${token.text}(` : '('}${texts.join(',')})`;
      if (!hoverInside) continue;
      if (onSubject) {
        current.text += `:where(${MARKER})`;
        hovered = true;
      } else {
        current.deep = true;
      }
    } else if (token.type === 'pseudo' && !token.element && token.name === 'hover') {
      if (negated) current.negative = true;
      else {
        current.positive = true;
        hovered = true;
      }
      current.unsupported ||= pseudoElement;
      current.text += MARKER;
    } else {
      if (token.type === 'pseudo' && token.element) pseudoElement = true;
      current.text += token.text;
    }
  }
  current.subject = hovered;
  alternatives.push(current);
  return { alternatives, end: i };
}

/**
 * A selector list's alternatives, each :hover rewritten to the hover attribute (`:not(:hover)` to its absence), in
 * two groups. `hovered`: those with a :hover that isn't negated, the only ones whose copy can match what the original
 * doesn't. Their copy matches only where the hover is: inside :is() or :has(), an alternative without one either
 * requires the attribute too or can't match at all. `others`: the rest, which a copy needs only as the parent of a
 * nested rule. An alternative with :hover on a pseudo-element (`::-webkit-scrollbar-thumb:hover`) is in neither: the
 * attribute can't stand for that.
 * @param {string} selectorText
 * @returns {{ hovered: string[], others: string[] }}
 */
export function rewriteHoverSelector (selectorText) {
  if (!HOVER.test(selectorText)) return { hovered: [], others: [selectorText] };
  const hovered = [];
  const others = [];
  for (const each of rewriteList(tokenize(selectorText), 0, false).alternatives) {
    if (!each.unsupported) (each.positive ? hovered : others).push(each.text.trim());
  }
  return { hovered, others };
}

// Rules. The copy of a sheet holds its rules that have a :hover, each inside the same at-rules as the original (so a
// rule in `@media (hover: hover)` or `@layer dialtone.components` stays there), with its declarations as they are.

const kindOf = rule => rule?.constructor?.name ?? '';

// The grouping at-rules whose rules are copied, and how each one's prelude is written back.
const PRELUDES = {
  CSSMediaRule: rule => `@media ${rule.media.mediaText}`,
  CSSSupportsRule: rule => `@supports ${rule.conditionText}`,
  CSSContainerRule: rule => `@container ${rule.conditionText}`,
  CSSLayerBlockRule: rule => (rule.name ? `@layer ${rule.name}` : '@layer'),
  CSSStartingStyleRule: () => '@starting-style',
};

const rewriteAll = (selectorText) => {
  const { hovered, others } = rewriteHoverSelector(selectorText);
  return [...hovered, ...others].join(', ');
};

const wrap = (prelude, css) => (css ? `${prelude}{${css}}` : '');

// The copies of a list of rules. `inHover`: inside the copy of a rule whose selector has a :hover, where every nested
// rule applies only to hovered elements, so all of them are copied. A generator, so a build can stop between rules
// and go on in the next idle time; it yields once per style rule.
function * copyList (rules, inHover, stats) {
  let css = '';
  for (let i = 0; i < rules.length; i++) css += yield * copyRule(rules[i], inHover, stats);
  return css;
}

function * copyRule (rule, inHover, stats) {
  const kind = kindOf(rule);
  if (kind === 'CSSStyleRule') return yield * copyStyleRule(rule, inHover, stats);
  if (kind === 'CSSNestedDeclarations') return inHover ? rule.style.cssText : '';
  if (Object.prototype.hasOwnProperty.call(PRELUDES, kind)) {
    return wrap(PRELUDES[kind](rule), yield * copyList(rule.cssRules, inHover, stats));
  }
  if (kind === 'CSSScopeRule') {
    // A scope without a root is its style element's parent, which a copy in an adopted sheet doesn't have.
    if (!rule.start) return '';
    // A scope whose root needs a hover (`@scope (.card:hover)`) holds only hovered elements' rules.
    const hoveredRoot = rewriteHoverSelector(rule.start).hovered.length > 0;
    const prelude = ['@scope', `(${rewriteAll(rule.start)})`, rule.end && `to (${rewriteAll(rule.end)})`];
    return wrap(prelude.filter(Boolean).join(' '), yield * copyList(rule.cssRules, inHover || hoveredRoot, stats));
  }
  if (kind === 'CSSImportRule') return yield * copyImport(rule, inHover, stats);
  // Keyframes, font faces, @page, @property, layer statements…: nothing a hover changes.
  return '';
}

function * copyStyleRule (rule, inHover, stats) {
  yield;
  stats.scanned++;
  // Nested rules (CSS nesting) are the rule's own cssRules.
  const children = rule.cssRules ?? [];
  if (!inHover && !children.length && !HOVER.test(rule.selectorText)) return '';
  const { hovered, others } = rewriteHoverSelector(rule.selectorText);
  const copy = (selectors, declarations, nested) => {
    stats.rules++;
    return `${selectors.join(', ')}{${declarations}${nested}}`;
  };
  if (inHover) {
    const selectors = [...hovered, ...others];
    return selectors.length ? copy(selectors, rule.style.cssText, yield * copyList(children, true, stats)) : '';
  }
  let css = '';
  if (hovered.length) css += copy(hovered, rule.style.cssText, yield * copyList(children, true, stats));
  // The others only as the parents of nested rules that have a hover of their own.
  if (others.length && children.length) css += wrap(others.join(', '), yield * copyList(children, false, stats));
  return css;
}

// An imported sheet's rules, inside the media, supports and layer the import gave it.
function * copyImport (rule, inHover, stats) {
  let rules;
  try {
    rules = rule.styleSheet?.cssRules;
  } catch {
    rules = null;
  }
  if (!rules) {
    stats.skipped++;
    return '';
  }
  let css = yield * copyList(rules, inHover, stats);
  if (typeof rule.layerName === 'string') css = wrap(rule.layerName ? `@layer ${rule.layerName}` : '@layer', css);
  if (rule.supportsText) css = wrap(`@supports ${rule.supportsText}`, css);
  if (rule.media?.mediaText) css = wrap(`@media ${rule.media.mediaText}`, css);
  return css;
}

const newStats = () => ({ rules: 0, scanned: 0, skipped: 0 });

/**
 * The hover copies of a list of rules, as CSS text, and how many style rules were copied and looked at.
 * @param {CSSRuleList | CSSRule[]} rules
 * @returns {{ css: string, rules: number, scanned: number, skipped: number }}
 */
export function copyHoverRules (rules) {
  const stats = newStats();
  const run = copyList(rules, false, stats);
  let step = run.next();
  while (!step.done) step = run.next();
  return { css: step.value, ...stats };
}

// How long one slice of a build may run when the browser gives no idle time (a timed-out idle callback, or the
// setTimeout fallback), and at most: below the 50ms of a long task, with room for the frame's own work.
const MIN_SLICE = 4;
const MAX_SLICE = 12;
// Style rules handled between two looks at the clock.
const CHECK_EVERY = 64;
// How long the page's style elements have to be still before the copy is rebuilt.
const SETTLE = 150;
// How often marking checks for rules added without a new element (insertRule).
const STALE_CHECK = 500;
// How many times a sheet whose rules change while it's being copied is copied again before the build moves on.
const MAX_COPIES = 3;

const isSheetElement = node => node.nodeType === 1 &&
  (node.localName === 'style' || (node.localName === 'link' && /(^|\s)stylesheet(\s|$)/i.test(node.rel ?? '')));

const holdsSheets = node => isSheetElement(node) ||
  (node.nodeType === 1 && node.firstElementChild !== null && node.querySelector('style, link') !== null);

// A mutation that can change the page's style sheets: a style or stylesheet link added or removed, a style element's
// text changed, or a media, disabled, rel or href attribute of one.
const changesSheets = (record) => {
  if (record.type === 'characterData') return record.target.parentNode?.localName === 'style';
  if (record.type === 'attributes') return isSheetElement(record.target);
  if (record.target.localName === 'style') return true;
  return [...record.addedNodes, ...record.removedNodes].some(holdsSheets);
};

/**
 * The hover emulation of one document. Inert until start(); stop() takes out the sheet and every attribute.
 * @param {object} options
 * @param {Window} options.win
 * @param {(callback: (deadline: IdleDeadline) => void) => () => void} [options.requestIdle] Runs a slice of a build
 *   in idle time; returns a cancel function.
 * @param {(callback: () => void, ms: number) => () => void} [options.wait] Runs a callback later; returns a cancel
 *   function.
 * @param {(stats: object) => void} [options.log] Told about every build: rules copied, sheets read and skipped, time.
 */
export function createHoverEmulation ({
  win,
  requestIdle = (callback) => {
    if (typeof win.requestIdleCallback === 'function') {
      const id = win.requestIdleCallback(callback, { timeout: 1000 });
      return () => win.cancelIdleCallback(id);
    }
    const id = win.setTimeout(() => callback({ didTimeout: true, timeRemaining: () => 0 }), 1);
    return () => win.clearTimeout(id);
  },
  wait = (callback, ms) => {
    const id = win.setTimeout(callback, ms);
    return () => win.clearTimeout(id);
  },
  log = stats => win.console.debug(
    `[compare sync] hover styles: ${stats.rules} rules copied from ${stats.sheets} style sheets ` +
    `(${stats.scanned} style rules read, ${stats.skipped} unreadable sheets skipped) in ${stats.ms.toFixed(1)} ms ` +
    `of work over ${stats.slices} idle slices`,
  ),
} = {}) {
  const doc = win.document;
  const isSupported = () => 'adoptedStyleSheets' in doc &&
    typeof win.CSSStyleSheet?.prototype?.replaceSync === 'function';
  const now = () => win.performance?.now() ?? Date.now();
  // Each sheet's copy, kept while the sheet is the same object with as many rules: a style element whose text changes
  // gets a new sheet; insertRule adds a rule. Without the sheet's media, which can change on its own (a `media`
  // attribute) and is put around the copy each time it's used.
  const copies = new WeakMap();
  let running = false;
  let sheet = null;
  let observer = null;
  let cancelBuild = null;
  let cancelSettle = null;
  // The sheets the current copy was made from, to tell when they changed.
  let source = [];
  let lastCheck = -Infinity;
  // The elements with the attribute, and the list they were marked from.
  let marked = new Set();
  let markedFrom = null;

  // The page's sheets, each with its rules, or null for one a script can't read (another origin's).
  const readSheets = () => [...doc.styleSheets].filter(each => !each.disabled).map((each) => {
    try {
      return { sheet: each, rules: each.cssRules };
    } catch {
      return { sheet: each, rules: null };
    }
  });

  // A sheet's copy, made in slices: between two, the page can add or remove rules (insertRule), which shifts the live
  // list being read. So the copy reads a snapshot of the list, and one whose list changed meanwhile is made again: a
  // copy describes one version of the sheet. One still changing after MAX_COPIES is kept, but as stale (length -1), so
  // the next look at the sheets (checkSheets) makes it again.
  function * copySheet (rules) {
    for (let attempt = 1; ; attempt++) {
      const list = Array.from(rules);
      const own = newStats();
      const css = yield * copyList(list, false, own);
      const unchanged = rules.length === list.length && list.every((rule, i) => rules[i] === rule);
      if (unchanged || attempt === MAX_COPIES) return { length: unchanged ? list.length : -1, css, ...own };
    }
  }

  function * build () {
    const stats = { ...newStats(), sheets: 0 };
    const parts = [];
    const read = readSheets();
    for (const { sheet: each, rules } of read) {
      if (!rules) {
        stats.skipped++;
        continue;
      }
      stats.sheets++;
      let copy = copies.get(each);
      if (!copy || copy.length !== rules.length) {
        copy = yield * copySheet(rules);
        copies.set(each, copy);
      }
      // A sheet for some media only (`<link media="print">`) is copied for that media only, the one it has now.
      const media = each.media?.mediaText;
      parts.push(media && media !== 'all' ? wrap(`@media ${media}`, copy.css) : copy.css);
      stats.rules += copy.rules;
      stats.scanned += copy.scanned;
      stats.skipped += copy.skipped;
    }
    return { css: parts.join('\n'), stats, read: read.map(({ sheet: each }) => each) };
  }

  const apply = (css) => {
    sheet ??= new win.CSSStyleSheet();
    sheet.replaceSync(css);
    if (!doc.adoptedStyleSheets.includes(sheet)) doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
  };

  // Builds the copy in slices of idle time, then adopts it. A build already running starts over, keeping the copies
  // of the sheets it finished.
  const startBuild = () => {
    cancelBuild?.();
    cancelBuild = null;
    if (!running) return;
    const run = build();
    let work = 0;
    let slices = 0;
    const slice = (deadline) => {
      cancelBuild = null;
      const started = now();
      const budget = Math.min(Math.max(deadline.didTimeout ? 0 : deadline.timeRemaining() - 1, MIN_SLICE), MAX_SLICE);
      let step = run.next();
      for (let count = 1; !step.done; count++) {
        if (count % CHECK_EVERY === 0 && now() - started >= budget) break;
        step = run.next();
      }
      if (step.done) {
        try {
          apply(step.value.css);
        } catch (error) {
          win.console.warn('[compare sync] hover styles not applied', error);
        }
      }
      work += now() - started;
      slices++;
      if (!step.done) {
        cancelBuild = requestIdle(slice);
        return;
      }
      source = step.value.read;
      log({ ...step.value.stats, ms: work, slices });
    };
    cancelBuild = requestIdle(slice);
  };

  // Rebuilds once the page's style elements have been still for SETTLE ms.
  const settle = () => {
    cancelSettle?.();
    cancelSettle = null;
    if (!running) return;
    cancelSettle = wait(() => {
      cancelSettle = null;
      startBuild();
    }, SETTLE);
  };

  // Whether a sheet came or went, or got rules, since the copy: insertRule (CSS-in-JS) changes no element.
  const isStale = () => {
    const read = readSheets();
    return read.length !== source.length || read.some(({ sheet: each, rules }, i) =>
      each !== source[i] || (rules !== null && copies.get(each)?.length !== rules.length));
  };

  // Rebuilds if the sheets changed without an element changing, at most every STALE_CHECK ms and not while a build
  // is due anyway.
  const checkSheets = () => {
    if (cancelBuild || cancelSettle || now() - lastCheck < STALE_CHECK) return;
    lastCheck = now();
    if (isStale()) startBuild();
  };

  const onMutations = (records) => {
    if (!records.some(changesSheets)) return;
    // A stylesheet link's rules arrive after it's added.
    for (const record of records) {
      for (const node of record.addedNodes ?? []) {
        if (node.localName === 'link') node.addEventListener('load', settle, { once: true });
      }
    }
    settle();
  };

  /** Builds the copy in idle time and keeps it up to date with the page's sheets. */
  const start = () => {
    if (running || !isSupported()) return;
    running = true;
    observer = new win.MutationObserver(onMutations);
    observer.observe(doc, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['media', 'disabled', 'rel', 'href'],
    });
    startBuild();
  };

  /**
   * Sets the attribute on exactly these elements (the replayed pointer's element and its ancestors), and on the
   * control of a label among them, as :hover does.
   * @param {Element[]} elements
   */
  const mark = (elements) => {
    if (!running) return;
    // The same elements as last time (the pointer moved within one): their marks stand, but the page's rules may not.
    if (elements === markedFrom) {
      if (marked.size) checkSheets();
      return;
    }
    markedFrom = elements;
    const next = new Set();
    for (const element of elements) {
      next.add(element);
      if (element.localName === 'label' && element.control) next.add(element.control);
    }
    for (const element of marked) {
      if (!next.has(element)) element.removeAttribute(HOVER_ATTRIBUTE);
    }
    for (const element of next) {
      if (!marked.has(element)) element.setAttribute(HOVER_ATTRIBUTE, '');
    }
    marked = next;
    if (next.size) checkSheets();
  };

  /** Takes the attribute off every element. */
  const clear = () => {
    for (const element of marked) element.removeAttribute(HOVER_ATTRIBUTE);
    marked = new Set();
    markedFrom = null;
  };

  /** Takes out the attributes and the sheet, and stops watching the page. */
  const stop = () => {
    if (!running) return;
    clear();
    running = false;
    observer.disconnect();
    observer = null;
    cancelBuild?.();
    cancelSettle?.();
    cancelBuild = null;
    cancelSettle = null;
    if (sheet) doc.adoptedStyleSheets = doc.adoptedStyleSheets.filter(each => each !== sheet);
    source = [];
    lastCheck = -Infinity;
  };

  return { start, mark, clear, stop };
}
