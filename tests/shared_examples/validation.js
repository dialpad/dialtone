import { assert } from 'chai';

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

export default {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
};
