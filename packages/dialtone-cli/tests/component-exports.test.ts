import { describe, expect, test } from 'vitest';
import { parseComponentExports } from '../src/component-exports.js';

describe('published component entry export verification', () => {
  test('supports the import/export-only ESM grammar used by published Vue entries', () => {
    const entry = `import local from './button.js';
import './barrel.js';
import { DtText, Panel as pane } from './parts.js';
import { default as fallback } from './fallback.js';
export { local as DtButton, local as ButtonAlias, DtText, pane as DtResizablePanel, fallback as default };
//# sourceMappingURL=dialtone-vue.js.map`;
    expect(parseComponentExports(entry)).toEqual(['DtButton', 'ButtonAlias', 'DtText', 'DtResizablePanel', 'default']);
  });

  test.each([
    "// export { internal as KitchenSinkView };",
    "/* import internal from './internal.js';\nexport { internal as KitchenSinkView }; */",
    "const text = 'export { internal as KitchenSinkView };';",
    "import local from './part.js'; export { missing as DtText };",
    "export * from './parts.js';",
    "import local from './part.js'; export { local as DtText }; throw new Error('execute');",
    "import button from './a.js'; import button from './b.js'; export { button as DtButton };",
    "import { one as button, two as button } from './a.js'; export { button as DtButton };",
    "import a from './a.js'; import b from './b.js'; export { a as DtButton, b as DtButton };",
    "import class from './a.js'; export { class as DtButton };",
    "import { default as class } from './a.js'; export { class as DtButton };",
    "import * as await from './a.js'; export { await as DtButton };",
    "import arguments from './a.js'; export { arguments as DtButton };",
    String.raw`import button from './\8.js'; export { button as DtButton };`,
    String.raw`import './\9.js'; import button from './a.js'; export { button as DtButton };`,
  ])('unsupported or malformed entry is unverified: %s', entry => {
    expect(parseComponentExports(entry)).toBeNull();
  });
});
