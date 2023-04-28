import { mount } from '@vue/test-utils';
import DtLink from './link.vue';
import {
  LINK_KIND_MODIFIERS,
  DANGER,
  SUCCESS,
  WARNING,
  MUTED,
  INVERTED,
} from './link_constants';
import { itBehavesLikeHasCorrectClass } from '../../tests/shared_examples/classes';

// Constants
const baseProps = {
  href: '#',
};

describe('DtLink tests', () => {
  // Wrappers
  let wrapper;
  let nativeLink;

  // Environment
  const props = baseProps;
  const slots = { default: 'Slotted Link' };

  // Helpers
  const _setWrappers = () => {
    nativeLink = wrapper.find('[data-qa="dt-link"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtLink, {
      props,
      slots,
    });
    _setWrappers();
  };

  const itBehavesLikeHasCorrectKindClass = kind => {
    it('should have correct class', async () => {
      await wrapper.setProps({ kind });
      itBehavesLikeHasCorrectClass(nativeLink, LINK_KIND_MODIFIERS[kind]);
    });
  };

  // Setup
  beforeEach(() => {
    _mountWrapper();
  });

  describe('Presentation Tests', () => {
    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );
    it(
      'should render the native anchor',
      () => { expect(nativeLink.exists()).toBe(true); },
    );

    describe('When a default slot is provided', () => {
      it(
        'should render the provided data',
        () => { expect(nativeLink.text()).toEqual(slots.default); },
      );
    });

    describe('When kind is danger', () => { itBehavesLikeHasCorrectKindClass(DANGER); });

    describe('When kind is inverted', () => { itBehavesLikeHasCorrectKindClass(INVERTED); });

    describe('When kind is success', () => { itBehavesLikeHasCorrectKindClass(SUCCESS); });

    describe('When kind is warning', () => { itBehavesLikeHasCorrectKindClass(WARNING); });

    describe('When kind is muted', () => { itBehavesLikeHasCorrectKindClass(MUTED); });
  });
});
