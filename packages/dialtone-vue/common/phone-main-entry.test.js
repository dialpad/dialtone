import * as mainEntry from '../index.js';

// formatPhoneNumber lives on its own subpath (`@dialpad/dialtone/vue3/phone`) so apps that hold the
// whole main entry don't ship libphonenumber-js and its country data.
const libphonenumber = vi.hoisted(() => ({ loaded: false }));

vi.mock('libphonenumber-js/min', () => {
  libphonenumber.loaded = true;
  return {};
});

describe('main entry', () => {
  it('does not export formatPhoneNumber', () => {
    expect(mainEntry).not.toHaveProperty('formatPhoneNumber');
  });

  it('does not load libphonenumber-js', () => {
    expect(libphonenumber.loaded).toBe(false);
  });
});
