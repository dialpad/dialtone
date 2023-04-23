import Vue from 'vue';

let consoleErrorSpy;

export const initializeSpy = () => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockClear();
};

export const cleanSpy = () => {
  consoleErrorSpy = null;
  console.error.mockRestore();
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
  it(
    'should not raise any warnings',
    () => { expect(Vue.util.warn.notCalled).toBe(true); }
  );
};

export const itBehavesLikeRaisesSingleVueWarning = (message) => {
  it(
    'should raise a single warning',
    () => { expect(Vue.util.warn.calledOnce).toBe(true); }
  );
  it('should have expected warning message', () => {
    expect(Vue.util.warn.mock.calls[0][0]).toBe(message);
  });
};

export const itBehavesLikeRaisesValidationError = (message) => {
  it(
    'should raise a validation error',
    () => { expect(consoleErrorSpy.calledWith(message)).toBe(true); }
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
