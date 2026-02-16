const postcss = require('postcss');
const dialtoneGenerators = require('./dialtone-generators.cjs');

describe('dialtone-generators', () => {
  describe('When generating utilities', () => {
    it('wraps output in @layer dialtone.utilities', async () => {
      const input = `
        :root {
          --dt-color-foreground-primary: #000;
        }
      `;

      const result = await postcss([dialtoneGenerators()])
        .process(input, { from: undefined });

      expect(result.css).toContain('@layer dialtone.utilities');
    });

    it('places color utilities inside the layer', async () => {
      const input = `
        :root {
          --dt-color-foreground-primary: #000;
        }
      `;

      const result = await postcss([dialtoneGenerators()])
        .process(input, { from: undefined });

      expect(result.css).toMatch(/@layer dialtone\.utilities\s*\{[\s\S]*\.d-fc-primary[\s\S]*\}/);
    });

    it('places spacing utilities inside the layer', async () => {
      const input = `
        :root {
          --dt-size-400: 8px;
        }
      `;

      const result = await postcss([dialtoneGenerators()])
        .process(input, { from: undefined });

      expect(result.css).toMatch(/@layer dialtone\.utilities\s*\{[\s\S]*\.d-mt16[\s\S]*\}/);
    });

    it('does not create utilities before the layer declaration', async () => {
      const input = `
        :root {
          --dt-color-foreground-primary: #000;
        }
      `;

      const result = await postcss([dialtoneGenerators()])
        .process(input, { from: undefined });

      const beforeLayer = result.css.split('@layer dialtone.utilities')[0];
      expect(beforeLayer).not.toMatch(/\.(d-fc-|d-bgc-|d-mt|d-p\d)/);
    });

    it('preserves !important in color utilities', async () => {
      const input = `
        :root {
          --dt-color-foreground-primary: #000;
        }
      `;

      const result = await postcss([dialtoneGenerators()])
        .process(input, { from: undefined });

      expect(result.css).toMatch(/\.d-fc-primary\s*\{[^}]*!important[^}]*\}/);
    });

    it('preserves !important in spacing utilities', async () => {
      const input = `
        :root {
          --dt-size-400: 8px;
        }
      `;

      const result = await postcss([dialtoneGenerators()])
        .process(input, { from: undefined });

      expect(result.css).toMatch(/\.d-mt16\s*\{[^}]*!important[^}]*\}/);
    });
  });

  describe('When processing empty input', () => {
    it('does not add a layer when no utilities are generated', async () => {
      const input = `
        .some-class {
          color: blue;
        }
      `;

      const result = await postcss([dialtoneGenerators()])
        .process(input, { from: undefined });

      expect(result.css).not.toContain('@layer dialtone.utilities');
    });
  });
});
