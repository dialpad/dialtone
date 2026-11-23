import * as mainEntry from '../index.js';

// formatPhoneNumber lives on its own subpath (`@dialpad/dialtone/vue3/phone`) so apps that hold the
// whole main entry don't ship libphonenumber-js and its country data.
const loadedModules = vi.hoisted(() => []);

vi.mock('libphonenumber-js', () => {
  loadedModules.push('libphonenumber-js');
  return {};
});
vi.mock('libphonenumber-js/min', () => {
  loadedModules.push('libphonenumber-js/min');
  return {};
});

describe('main entry', () => {
  it('does not export formatPhoneNumber', () => {
    expect(mainEntry).not.toHaveProperty('formatPhoneNumber');
  });

  it('does not load libphonenumber-js', () => {
    expect(loadedModules).toEqual([]);
  });
});
