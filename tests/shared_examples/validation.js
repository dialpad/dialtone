let consoleErrorSpy;
let consoleWarnSpy;

export const initializeSpy = () => {
  consoleErrorSpy = jest.spyOn(console, 'error');
  consoleWarnSpy = jest.spyOn(console, 'warn');
};

export const cleanSpy = () => {
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
};

export function itBehavesLikePassesCustomPropValidation (prop, value) {
  it('passes custom prop validation', () => {
    expect(prop.validator(value)).toBe(true);
  });
}

export function itBehavesLikeFailsCustomPropValidation (prop, value) {
  it('fails custom prop validation', () => {
    expect(prop.validator(value)).toBe(false);
  });
}

export const itBehavesLikeDoesNotRaiseAnyVueWarnings = () => {
  it('should not raise any warnings', function () { expect(console.warn).not.toHaveBeenCalled(); });
};

export const itBehavesLikeRaisesSingleVueWarning = (message) => {
  it('should have expected warning message', function () {
    expect(console.warn.mock.calls.length).toBeGreaterThan(0);
    expect(console.warn.mock.calls[0]).toContain(message);
  });
};

export const itBehavesLikeRaisesValidationError = (message) => {
  it(
    'should raise a validation error',
    () => {
      expect(console.error.mock.calls.length).toBeGreaterThan(0);
      expect(console.error.mock.calls[0]).toContain(message);
    },
  );
};

export default {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikeDoesNotRaiseAnyVueWarnings,
  itBehavesLikeRaisesSingleVueWarning,
  itBehavesLikeRaisesValidationError,
  initializeSpy,
  cleanSpy,
};
