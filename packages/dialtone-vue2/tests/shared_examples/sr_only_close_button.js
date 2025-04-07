import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';

export const itBehavesLikeVisuallyHiddenCloseButtonExists = (wrapper, state = true) => {
  const buttonExists = wrapper.findComponent(SrOnlyCloseButton).exists();
  expect(state ? buttonExists : !buttonExists).toBe(true);
};

export default {
  itBehavesLikeVisuallyHiddenCloseButtonExists,
};
