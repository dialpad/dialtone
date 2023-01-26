import { assert } from 'chai';
import { mount } from '@vue/test-utils';

import DtNoticeAction from './notice_action';
import DtButton from '../button/button';
import SrOnlyCloseButton from '../../common/sr_only_close_button';
import { cleanSpy, initializeSpy } from '@/tests/shared_examples/validation';
import { itBehavesLikeVisuallyHiddenCloseLabelIsNull } from '@/tests/shared_examples/sr_only_close_button';

// Constants
const baseProps = {
  hideClose: false,
  closeButtonProps: { ariaLabel: 'Close' },
  visuallyHiddenCloseLabel: 'Close',
};

const baseSlotsData = {
  default: 'this is the action slot content',
};

describe('DtNoticeAction tests', function () {
  let wrapper;

  let props = baseProps;
  const slotsData = baseSlotsData;

  let closeButton;
  let srOnlyCloseButton;

  const _setWrappers = () => {
    wrapper = mount(DtNoticeAction, {
      props,
      slots: slotsData,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    closeButton = wrapper.findComponent(DtButton);
    srOnlyCloseButton = wrapper.findComponent(SrOnlyCloseButton);
  };

  beforeEach(function () {
    _setWrappers();
  });

  afterEach(function () {
    props = baseProps;
  });

  describe('Presentation Tests', function () {
    describe('When rendered with default slot content', function () {
      it('Should render notice action', function () {
        assert.isTrue(wrapper.exists());
      });

      it('Default slot renders correctly as action text/html', function () {
        const root = wrapper.find('.d-notice__actions');
        assert.strictEqual(root.text(), slotsData.default);
      });

      it('Should not render sr-only close button', function () {
        assert.isFalse(srOnlyCloseButton.exists());
      });
    });

    describe('When hideClose is false', function () {
      it('Close button is displayed', function () {
        assert.isTrue(closeButton.exists());
      });
    });

    describe('When closeButtonProps is passed', function () {
      it('Adds props to button', function () {
        assert.strictEqual(closeButton.attributes()['aria-label'], 'Close');
      });
    });

    describe('When hideClose is true', function () {
      beforeEach(async function () {
        _setWrappers();
        await wrapper.setProps({ hideClose: true });
      });

      it('Close button is not displayed', function () {
        assert.isFalse(closeButton.exists());
      });
    });

    describe('When visuallyHiddenClose is true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ visuallyHiddenClose: true });
        _setChildWrappers();
      });

      it('should contain a visually hidden close button', async function () {
        assert.isTrue(srOnlyCloseButton.exists());
      });

      describe('When visuallyHiddenCloseLabel is null', function () {
        beforeEach(async function () {
          initializeSpy();
          await wrapper.setProps({ visuallyHiddenCloseLabel: null });
        });

        afterEach(function () {
          cleanSpy();
        });

        itBehavesLikeVisuallyHiddenCloseLabelIsNull();
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('When hideClose is false', function () {
      describe('When close button is clicked', function () {
        beforeEach(async function () {
          closeButton.vm.$emit('click');
        });
        it('emits event', function () {
          assert.isOk(wrapper.emitted('close'));
        });
      });
    });

    describe('When sr-only close button is enabled and activated', function () {
      beforeEach(async function () {
        await wrapper.setProps({ visuallyHiddenClose: true });
        _setChildWrappers();
        await srOnlyCloseButton.trigger('click');
      });

      it('emits event', function () {
        assert.isOk(wrapper.emitted('close'));
      });
    });
  });
});
