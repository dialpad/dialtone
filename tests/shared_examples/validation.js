import { assert } from 'chai';
import sinon from 'sinon';

let consoleErrorSpy;

export const initializeSpy = () => {
  consoleErrorSpy = sinon.spy(console, 'error');
};

export const cleanSpy = () => {
  consoleErrorSpy = null;
  console.error.restore();
};

export function itBehavesLikePassesCustomPropValidation (prop, value) {
  it('passes custom prop validation', function () {
    assert.strictEqual(prop.validator(value), true);
  });
}

export function itBehavesLikeFailsCustomPropValidation (prop, value) {
  it('fails custom prop validation', function () {
    assert.strictEqual(prop.validator(value), false);
  });
}

export const itBehavesLikeDoesNotRaiseAnyVueWarnings = () => {
  it('should not raise any warnings', function () { assert.isTrue(console.warn.notCalled); });
};

export const itBehavesLikeRaisesSingleVueWarning = (message) => {
  it('should raise a single warning', function () { assert.isTrue(console.warn.calledOnce); });
  it('should have expected warning message', function () {
    assert.strictEqual(console.warn.firstCall.args[0], message);
  });
};

export const itBehavesLikeRaisesVueWarning = (message) => {
  it('contains expected warning message', function () {
    assert.isTrue(console.warn.calledWith(message));
  });
};

export const itBehavesLikeRaisesValidationError = (message) => {
  it('should raise a validation error', function () { assert.isTrue(consoleErrorSpy.calledWith(message)); });
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
