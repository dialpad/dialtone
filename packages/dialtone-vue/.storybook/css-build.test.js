import { build } from 'vite';
import storybookConfig from './main.js';

describe('Storybook CSS build', () => {
  it('Should preserve split-button CSS when minifying with an es2020 JavaScript target', async () => {
    const css = `
      .d-btn {
        color: oklch(70% 0.3 30);
      }
      .d-split-btn__start:not(.d-btn--outlined) {
        border-inline-end: 0;
      }
      .d-split-btn__start.d-btn--primary {
        border-inline-end: 0;
        border-start-end-radius: 0;
        border-end-end-radius: 0;
      }
    `;
    const entry = 'virtual:split-button.css';
    const config = await storybookConfig.viteFinal({
      configFile: false,
      logLevel: 'silent',
      plugins: [{
        name: 'split-button-css-fixture',
        resolveId: id => id === entry ? entry : null,
        load: id => id === entry ? css : null,
      }],
      build: {
        target: 'es2020',
        write: false,
        rolldownOptions: { input: entry },
      },
    });
    const result = await build(config);
    const stylesheet = result.output.find(output => output.fileName.endsWith('.css'));

    expect(stylesheet).toBeDefined();
    expect(stylesheet.source).toContain('border-start-end-radius:0');
    expect(stylesheet.source).toContain('border-end-end-radius:0');
    expect(stylesheet.source).toContain('oklch(');
    expect(stylesheet.source).not.toMatch(/\blab\(/);
  });
});
