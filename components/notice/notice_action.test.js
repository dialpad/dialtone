import { createLocalVue, mount } from '@vue/test-utils';

import DtNoticeAction from './notice_action.vue';
import DtButton from '../button/button.vue';
import SrOnlyCloseButton from '../../common/sr_only_close_button.vue';
import { cleanSpy, initializeSpy } from '@/tests/shared_examples/validation';
import { itBehavesLikeVisuallyHiddenCloseLabelIsNull } from '@/tests/shared_examples/sr_only_close_button';

// Constants
const basePropsData = {
  hideClose: false,
  closeButtonProps: { ariaLabel: 'Close' },
  visuallyHiddenCloseLabel: 'Close',
};

const baseSlotsData = {
  default: 'this is the action slot content',
};

describe('DtNoticeAction tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  let wrapper;

  const propsData = basePropsData;
  const slotsData = baseSlotsData;

  let closeButton;
  let srOnlyCloseButton;

  const _setWrappers = () => {
    wrapper = mount(DtNoticeAction, {
      propsData,
      slots: slotsData,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    closeButton = wrapper.findComponent(DtButton);
    srOnlyCloseButton = wrapper.findComponent(SrOnlyCloseButton);
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    _setWrappers();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default slot content', () => {
      it('Should render notice action', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('Default slot renders correctly as action text/html', () => {
        const root = wrapper.find('.d-notice__actions');
        expect(root.text()).toBe(slotsData.default);
      });

      it('Should not render sr-only close button', () => {
        expect(srOnlyCloseButton.exists()).toBe(false);
      });
    });

    describe('When hideClose is false', () => {
      it('Close button is displayed', () => {
        expect(closeButton.exists()).toBe(true);
      });
    });

    describe('When closeButtonProps is passed', () => {
      it('Adds props to button', () => {
        expect(closeButton.attributes()['aria-label']).toBe('Close');
      });
    });

    describe('When hideClose is true', () => {
      beforeEach(async () => {
        _setWrappers();
        await wrapper.setProps({ hideClose: true });
        _setChildWrappers();
      });

      it('Close button is not displayed', () => {
        expect(closeButton.exists()).toBe(false);
      });
    });

    describe('When visuallyHiddenClose is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ visuallyHiddenClose: true });
        _setChildWrappers();
      });

      it('should contain a visually hidden close button', async () => {
        expect(srOnlyCloseButton.exists()).toBe(true);
      });

      describe('When visuallyHiddenCloseLabel is null', () => {
        beforeEach(async () => {
          initializeSpy();
          await wrapper.setProps({ visuallyHiddenCloseLabel: null });
        });

        afterEach(() => {
          cleanSpy();
        });

        itBehavesLikeVisuallyHiddenCloseLabelIsNull();
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When hideClose is false', () => {
      describe('When close button is clicked', () => {
        beforeEach(async () => {
          closeButton.vm.$emit('click');
        });
        it('emits event', () => {
          expect(wrapper.emitted('close')).toBeTruthy();
        });
      });
    });

    describe('When sr-only close button is enabled and activated', () => {
      beforeEach(async () => {
        await wrapper.setProps({ visuallyHiddenClose: true });
        _setChildWrappers();
        await srOnlyCloseButton.trigger('click');
      });

      it('emits event', () => {
        expect(wrapper.emitted('close')).toBeTruthy();
      });
    });
  });
});
