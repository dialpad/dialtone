import { HOVER_ATTRIBUTE, copyHoverRules, createHoverEmulation, rewriteHoverSelector } from './compare-sync-hover.js';

const M = `[${HOVER_ATTRIBUTE}]`;

// A rule as a browser's CSSOM gives it, for what jsdom can't parse: layers, scopes, nesting, @starting-style.
const as = (kind, props) => ({ constructor: { name: kind }, ...props });
const style = (selectorText, cssText = '', cssRules = []) => as('CSSStyleRule', { selectorText, style: { cssText }, cssRules });
const declarations = cssText => as('CSSNestedDeclarations', { style: { cssText } });
const layer = (name, cssRules) => as('CSSLayerBlockRule', { name, cssRules });
const media = (mediaText, cssRules) => as('CSSMediaRule', { media: { mediaText }, cssRules });

const pathOf = (element) => {
  const path = [];
  for (let node = element; node; node = node.parentElement) path.push(node);
  return path;
};

describe('Compare sync hover styles', () => {
  afterEach(() => {
    delete window.CSSStyleSheet.prototype.replaceSync;
    vi.restoreAllMocks();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  describe('rewriteHoverSelector', () => {
    it.each([
      ['a :hover', '.a:hover', [`.a${M}`], []],
      ['a :hover in capitals', 'A:HOVER', [`A${M}`], []],
      ['only the alternatives with a :hover', '.a:hover, .b', [`.a${M}`], ['.b']],
      ['a list without one, as it is', '.a, .b', [], ['.a, .b']],
      ['a :hover before a pseudo-element', 'a:hover::before', [`a${M}::before`], []],
      ['a :hover before a combinator', 'a:hover > b + c ~ d', [`a${M} > b + c ~ d`], []],
      ['a :hover on two compounds', '.x:hover .y:hover', [`.x${M} .y${M}`], []],
      ['the nesting selector\'s', '&:hover', [`&${M}`], []],
      ['a :hover among :is() alternatives, which also requires the attribute',
        '.i:is(.active, :hover, :focus-visible)', [`.i:is(.active, ${M}, :focus-visible):where(${M})`], []],
      ['a :hover in :where()', ':where(.w:hover)', [`:where(.w${M}):where(${M})`], []],
      // The attribute can't be required of an element whose ancestor is hovered: the alternatives without a hover
      // can't match instead, and keep the list's specificity, its most specific alternative's (#b's here).
      ['a :hover in :is() on an ancestor, whose other alternatives can\'t match',
        ':is(.a:hover .c, .b)', [`:is(.a${M} .c, .b:not(*))`], []],
      ['the same, keeping an alternative\'s specificity and spacing',
        ':is(.a:hover .c , #b , .d:not(:hover))', [`:is(.a${M} .c , #b:not(*), .d:not(${M}):not(*))`], []],
      ['a :hover in :where() on an ancestor', ':where(.a:hover .c, .b)', [`:where(.a${M} .c, .b:not(*))`], []],
      ['a :hover in :has()', '.a:has(> :hover)', [`.a:has(> ${M})`], []],
      ['a :hover in :has(), whose other alternatives can\'t match', '.a:has(> :hover, .b)', [`.a:has(> ${M}, .b:not(*))`], []],
      ['a :hover in a negated :is(), as it is', ':not(:is(.a:hover .c, .b))', [], [`:not(:is(.a${M} .c, .b))`]],
      ['a negated :hover, as the attribute\'s absence', '.i:not(:hover)', [], [`.i:not(${M})`]],
      ['a negated :hover in a list', ':not(.x:hover, .y)', [], [`:not(.x${M}, .y)`]],
      ['a negated :hover after a :hover', '.a:hover .b:not(:hover)', [`.a${M} .b:not(${M})`], []],
      ['a :hover negated twice', ':not(:not(:hover))', [`:not(:not(${M}))`], []],
      ['":hover" in an attribute selector\'s string', '[title=":hover"]', [], ['[title=":hover"]']],
      ['a :hover after one', '.q[data-x=\'a:hover\']:hover', [`.q[data-x='a:hover']${M}`], []],
      ['an escaped colon', '.h\\:hover', [], ['.h\\:hover']],
      ['a hex-escaped colon', '.h\\3A hover', [], ['.h\\3A hover']],
      ['a longer name', 'a:hovered', [], ['a:hovered']],
      ['a :hover on a pseudo-element, which the attribute can\'t stand for',
        '.s::-webkit-scrollbar-thumb:hover, .t:hover', [`.t${M}`], []],
      ['the other user-action pseudo-classes, as they are',
        '.a:focus:hover, .a:active, .a:focus-visible, .a:focus-within',
        [`.a:focus${M}`], ['.a:active', '.a:focus-visible', '.a:focus-within']],
    ])('rewrites %s', (_, selector, hovered, others) => {
      expect(rewriteHoverSelector(selector)).toEqual({ hovered, others });
    });
  });

  describe('copyHoverRules', () => {
    const rulesOf = (css) => {
      const element = document.createElement('style');
      element.textContent = css;
      document.head.append(element);
      return element.sheet.cssRules;
    };

    it('copies the rules with a :hover, inside the same media, supports and container rules, and nothing else', () => {
      const copy = copyHoverRules(rulesOf(`
        .a { color: red }
        .a:hover, .b { color: blue }
        @media (hover: hover) { .m:hover { color: green } .n { color: gray } }
        @media print { .p { color: black } }
        @supports (display: grid) { .s:hover { color: teal } }
        @container card (min-width: 10px) { .c:hover { color: navy } }
        @keyframes k { from { opacity: 0 } }
        @font-face { font-family: f; src: url(f.woff) }
        [title=":hover"] { color: pink }
      `));

      expect(copy.css).toBe([
        `.a${M}{color: blue;}`,
        `@media (hover: hover){.m${M}{color: green;}}`,
        `@supports (display: grid){.s${M}{color: teal;}}`,
        `@container card (min-width: 10px){.c${M}{color: navy;}}`,
      ].join(''));
      expect(copy).toMatchObject({ rules: 4, scanned: 8, skipped: 0 });
    });

    it('keeps layers, nested ones and anonymous ones, and @starting-style', () => {
      const copy = copyHoverRules([
        as('CSSLayerStatementRule', { nameList: ['dialtone.base', 'dialtone.components'] }),
        layer('dialtone.components', [style('.b:hover', 'color: blue;'), style('.c', 'color: red;')]),
        layer('', [style('.d:hover', 'color: green;')]),
        layer('a', [layer('b', [style('.e:hover', 'color: gray;')])]),
        layer('empty', [style('.f', 'color: red;')]),
        as('CSSStartingStyleRule', { cssRules: [style('.g:hover', 'opacity: 0;')] }),
      ]);

      expect(copy.css).toBe([
        `@layer dialtone.components{.b${M}{color: blue;}}`,
        `@layer{.d${M}{color: green;}}`,
        `@layer a{@layer b{.e${M}{color: gray;}}}`,
        `@starting-style{.g${M}{opacity: 0;}}`,
      ].join(''));
    });

    it('keeps a scope, copies all of one whose root needs a hover, and none of one without a root', () => {
      const copy = copyHoverRules([
        as('CSSScopeRule', { start: '.card', end: null, cssRules: [style(':scope:hover', 'color: blue;'), style('.x', 'color: red;')] }),
        as('CSSScopeRule', { start: '.card:hover', end: '.inner', cssRules: [style('.x', 'color: red;')] }),
        as('CSSScopeRule', { start: null, end: null, cssRules: [style(':scope:hover', 'color: green;')] }),
      ]);

      expect(copy.css).toBe(`@scope (.card){:scope${M}{color: blue;}}@scope (.card${M}) to (.inner){.x{color: red;}}`);
    });

    it('copies a nested rule\'s hover inside its parent, without the parent\'s own declarations', () => {
      const copy = copyHoverRules([
        style('.g', 'color: red;', [style('&:hover', 'color: blue;')]),
        style('.n', 'color: red;', [style('& .o', 'color: blue;')]),
        style('.p', '', [media('(hover: hover)', [style('&:hover', 'color: blue;'), declarations('color: red;')])]),
      ]);

      expect(copy.css).toBe(`.g{&${M}{color: blue;}}.p{@media (hover: hover){&${M}{color: blue;}}}`);
    });

    it('copies all of a hovered rule\'s nested rules, and its parents\' other alternatives with nested hovers', () => {
      const copy = copyHoverRules([
        style('.h:hover', 'color: red;', [style('& .i', 'color: blue;'), declarations('outline: 0;')]),
        style('.j:hover, .k', 'color: red;', [style('& .l:hover', 'color: blue;'), style('& .m', 'color: gray;')]),
        style('.q:not(:hover)', 'color: red;', [style('& .r:hover', 'color: blue;')]),
      ]);

      expect(copy.css).toBe([
        `.h${M}{color: red;& .i{color: blue;}outline: 0;}`,
        `.j${M}{color: red;& .l${M}{color: blue;}& .m{color: gray;}}.k{& .l${M}{color: blue;}}`,
        `.q:not(${M}){& .r${M}{color: blue;}}`,
      ].join(''));
    });

    it('copies an imported sheet inside its media, supports and layer, and skips one it can\'t read', () => {
      const copy = copyHoverRules([
        as('CSSImportRule', {
          media: { mediaText: 'screen' },
          supportsText: '(display: grid)',
          layerName: 'vendor',
          styleSheet: { cssRules: [style('.r:hover', 'color: red;')] },
        }),
        as('CSSImportRule', {
          media: { mediaText: '' },
          supportsText: null,
          layerName: null,
          styleSheet: {
            get cssRules () {
              throw new DOMException('Cannot access rules', 'SecurityError');
            },
          },
        }),
      ]);

      expect(copy.css).toBe(`@media screen{@supports (display: grid){@layer vendor{.r${M}{color: red;}}}}`);
      expect(copy.skipped).toBe(1);
    });
  });

  describe('createHoverEmulation', () => {
    // A document in a frame, with the constructable sheets jsdom doesn't have: a sheet keeps the text it was given.
    function emulated ({ constructable = true } = {}) {
      const iframe = document.createElement('iframe');
      document.body.append(iframe);
      const win = iframe.contentWindow;
      const doc = win.document;
      doc.body.innerHTML = `
        <div id="outer"><label id="label" for="box">Label <span id="text">text</span></label></div>
        <input id="box" type="checkbox"><p id="other">Other</p>`;
      if (constructable) {
        Object.defineProperty(doc, 'adoptedStyleSheets', { configurable: true, writable: true, value: [] });
        win.CSSStyleSheet.prototype.replaceSync = function (text) {
          this.text = text;
        };
      }
      const idle = [];
      const timers = [];
      const logs = [];
      const queue = list => (callback) => {
        list.push(callback);
        return () => list.includes(callback) && list.splice(list.indexOf(callback), 1);
      };
      const emulation = createHoverEmulation({
        win,
        requestIdle: queue(idle),
        wait: queue(timers),
        log: stats => logs.push(stats),
      });
      const byId = id => doc.getElementById(id);
      return {
        win,
        doc,
        emulation,
        logs,
        byId,
        idle,
        timers,
        runIdle: () => {
          while (idle.length) idle.shift()({ didTimeout: false, timeRemaining: () => 50 });
        },
        runTimers: () => timers.splice(0).forEach(callback => callback()),
        // MutationObserver's callbacks are microtasks.
        mutations: () => new Promise(resolve => setTimeout(resolve)),
        addStyle: (css, attributes = {}) => {
          const element = doc.createElement('style');
          Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
          element.textContent = css;
          doc.head.append(element);
          return element;
        },
        copy: () => doc.adoptedStyleSheets.map(sheet => sheet.text).filter(Boolean),
        marked: () => [...doc.querySelectorAll(`[${HOVER_ATTRIBUTE}]`)].map(element => element.id || element.localName),
        chain: id => pathOf(byId(id)),
      };
    }

    it('builds nothing until started, then copies in idle time and adopts the copy after the page\'s own', () => {
      const page = emulated();
      page.addStyle('.a:hover { color: blue } .b { color: red }');
      const own = new page.win.CSSStyleSheet();
      page.doc.adoptedStyleSheets = [own];

      expect(page.idle).toEqual([]);
      page.emulation.start();
      expect(page.doc.adoptedStyleSheets).toEqual([own]);
      page.runIdle();

      expect(page.doc.adoptedStyleSheets[0]).toBe(own);
      expect(page.copy()).toEqual([`.a${M}{color: blue;}`]);
      expect(page.logs).toEqual([{ rules: 1, scanned: 2, skipped: 0, sheets: 1, ms: expect.any(Number), slices: 1 }]);
    });

    it('skips a sheet it can\'t read and says how many it skipped', () => {
      const page = emulated();
      page.addStyle('.a:hover { color: blue }');
      const locked = page.addStyle('.b:hover { color: red }');
      Object.defineProperty(locked.sheet, 'cssRules', {
        get () {
          throw new DOMException('Cannot access rules', 'SecurityError');
        },
      });

      page.emulation.start();
      page.runIdle();

      expect(page.copy()).toEqual([`.a${M}{color: blue;}`]);
      expect(page.logs[0]).toMatchObject({ sheets: 1, skipped: 1 });
    });

    it('copies a sheet for some media only inside that media, and leaves out a disabled one', () => {
      const page = emulated();
      // jsdom's sheets have no media list; a browser's has the style element's media.
      const { sheet } = page.addStyle('.p:hover { color: black }', { media: 'print' });
      Object.defineProperty(sheet, 'media', { value: { mediaText: 'print' } });
      page.addStyle('.d:hover { color: red }').sheet.disabled = true;

      page.emulation.start();
      page.runIdle();

      expect(page.copy()).toEqual([`@media print{.p${M}{color: black;}}`]);
    });

    it('rebuilds for a sheet whose media changed, reusing the copy of its rules', async () => {
      const page = emulated();
      const element = page.addStyle('.p:hover { color: black }', { media: 'screen' });
      // jsdom's sheets have no media list; a browser's follows the style element's media attribute.
      Object.defineProperty(element.sheet, 'media', { get: () => ({ mediaText: element.getAttribute('media') }) });
      page.emulation.start();
      page.runIdle();
      const read = vi.fn(() => '.p:hover');
      Object.defineProperty(element.sheet.cssRules[0], 'selectorText', { get: read });

      element.setAttribute('media', 'print');
      await page.mutations();
      page.runTimers();
      page.runIdle();

      expect(page.copy()).toEqual([`@media print{.p${M}{color: black;}}`]);
      expect(read).not.toHaveBeenCalled();
    });

    it('copies a sheet again when rules are added to it between two slices of the copy', () => {
      const page = emulated();
      const rules = Array.from({ length: 100 }, (_, i) => `.r${i}:hover { color: red }`);
      const { sheet } = page.addStyle(rules.join('\n'));
      // Each look at the clock is 100ms later: a slice stops after its first CHECK_EVERY rules.
      let time = 0;
      vi.spyOn(page.win.performance, 'now').mockImplementation(() => (time += 100));
      page.emulation.start();

      page.idle.shift()({ didTimeout: false, timeRemaining: () => 50 });
      sheet.insertRule('.ins:hover { color: blue }', 0);
      page.runIdle();
      const copied = page.copy()[0].match(/\.(r\d+|ins)/g);
      // The copy stays current: a later look at the sheets finds nothing to do.
      page.emulation.mark(page.chain('other'));

      expect(copied).toEqual(['.ins', ...rules.map((_, i) => `.r${i}`)]);
      expect(page.idle).toEqual([]);
    });

    it('picks up a style element added, changed or removed later, once the page settles, reusing the others\' copies', async () => {
      const page = emulated();
      const first = page.addStyle('.a:hover { color: blue }');
      page.emulation.start();
      page.runIdle();
      const read = vi.fn(() => '.a:hover');
      Object.defineProperty(first.sheet.cssRules[0], 'selectorText', { get: read });

      const late = page.addStyle('.late:hover { color: green }');
      await page.mutations();
      expect(page.timers).toHaveLength(1);
      page.runTimers();
      page.runIdle();
      expect(page.copy()).toEqual([`.a${M}{color: blue;}\n.late${M}{color: green;}`]);
      expect(read).not.toHaveBeenCalled();

      late.textContent = '.later:hover { color: teal }';
      await page.mutations();
      page.runTimers();
      page.runIdle();
      expect(page.copy()).toEqual([`.a${M}{color: blue;}\n.later${M}{color: teal;}`]);

      late.remove();
      await page.mutations();
      page.runTimers();
      page.runIdle();
      expect(page.copy()).toEqual([`.a${M}{color: blue;}`]);
    });

    it('doesn\'t rebuild for a change that isn\'t a style sheet\'s', async () => {
      const page = emulated();
      page.emulation.start();
      page.runIdle();

      page.doc.body.append(page.doc.createElement('div'));
      page.byId('box').disabled = true;
      await page.mutations();

      expect(page.timers).toEqual([]);
    });

    it('picks up a rule added with insertRule, which changes no element, when the pointer next moves', () => {
      const page = emulated();
      const { sheet } = page.addStyle('.a:hover { color: blue }');
      page.emulation.start();
      page.runIdle();

      sheet.insertRule('.ins:hover { color: red }', sheet.cssRules.length);
      page.emulation.mark(page.chain('other'));
      page.runIdle();

      expect(page.copy()).toEqual([`.a${M}{color: blue;}.ins${M}{color: red;}`]);
    });

    it('picks up a rule added with insertRule while the pointer moves within the same element, rewriting no marks', () => {
      const page = emulated();
      const { sheet } = page.addStyle('.a:hover { color: blue }');
      let time = 0;
      vi.spyOn(page.win.performance, 'now').mockImplementation(() => time);
      page.emulation.start();
      page.runIdle();
      const chain = page.chain('text');
      page.emulation.mark(chain);

      sheet.insertRule('.ins:hover { color: red }', sheet.cssRules.length);
      const written = vi.spyOn(page.win.Element.prototype, 'setAttribute');
      time += 1000;
      page.emulation.mark(chain);
      page.runIdle();

      expect(page.copy()).toEqual([`.a${M}{color: blue;}.ins${M}{color: red;}`]);
      expect(written).not.toHaveBeenCalled();
    });

    it('marks the element, its ancestors and a label\'s control, and moves the marks with the pointer', () => {
      const page = emulated();
      page.emulation.start();
      page.runIdle();

      page.emulation.mark(page.chain('text'));
      expect(page.marked()).toEqual(['html', 'body', 'outer', 'label', 'text', 'box']);

      page.emulation.mark(page.chain('other'));
      expect(page.marked()).toEqual(['html', 'body', 'other']);

      page.emulation.clear();
      expect(page.marked()).toEqual([]);
    });

    it('takes every mark and the sheet out on stop, leaving the page as it was, and stops watching it', async () => {
      const page = emulated();
      page.addStyle('.a:hover { color: blue }');
      const own = new page.win.CSSStyleSheet();
      page.doc.adoptedStyleSheets = [own];
      const html = page.doc.documentElement.outerHTML;
      page.emulation.start();
      page.runIdle();
      page.emulation.mark(page.chain('text'));

      page.emulation.stop();
      page.addStyle('.b:hover { color: red }').remove();
      await page.mutations();
      page.emulation.mark(page.chain('other'));

      expect(page.doc.documentElement.outerHTML).toBe(html);
      expect(page.doc.adoptedStyleSheets).toEqual([own]);
      expect(page.timers).toEqual([]);
      expect(page.idle).toEqual([]);
    });

    it('cancels a build still waiting for idle time on stop', () => {
      const page = emulated();
      page.addStyle('.a:hover { color: blue }');
      page.emulation.start();

      page.emulation.stop();

      expect(page.idle).toEqual([]);
      expect(page.doc.adoptedStyleSheets).toEqual([]);
    });

    it('does nothing where a document can\'t adopt a sheet', () => {
      const page = emulated({ constructable: false });
      page.addStyle('.a:hover { color: blue }');

      page.emulation.start();
      page.emulation.mark(page.chain('text'));

      expect(page.idle).toEqual([]);
      expect(page.marked()).toEqual([]);
    });
  });
});
