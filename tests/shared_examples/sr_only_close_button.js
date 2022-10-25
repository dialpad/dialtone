import { assert } from 'chai';
import SrOnlyCloseButton from '@/common/sr_only_close_button';
import { itBehavesLikeRaisesValidationError } from '@/tests/shared_examples/validation';

export const itBehavesLikeVisuallyHiddenCloseButtonExists = (wrapper, state = true) => {
  const buttonExists = wrapper.findComponent(SrOnlyCloseButton).exists();
  assert.isTrue(state ? buttonExists : !buttonExists);
};

export const itBehavesLikeVisuallyHiddenCloseLabelIsNull = () => {
  const message = `If visuallyHiddenClose prop is true, the component includes
           a visually hidden close button and you must set the visuallyHiddenCloseLabel prop.`;

  itBehavesLikeRaisesValidationError(message);
};

export default {
  itBehavesLikeVisuallyHiddenCloseButtonExists,
};
