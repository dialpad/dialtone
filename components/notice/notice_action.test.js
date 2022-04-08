import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';

import DtNoticeAction from './notice_action';
import DtButton from '../button/button';

// Constants
const baseProps = {
  hideClose: false,
  closeButtonProps: { ariaLabel: 'Close' },
};

const baseSlotsData = {
  default: 'this is the action slot content',
};

describe('DtNoticeAction tests', function () {
  let wrapper;

  let props = baseProps;
  const slotsData = baseSlotsData;

  let closeButton;

  const _setWrappers = () => {
    wrapper = shallowMount(DtNoticeAction, {
      props: props,
      slots: slotsData,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    closeButton = wrapper.findComponent(DtButton);
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
      beforeEach(function () {
        props = {
          ...baseProps,
          hideClose: true,
        };
        _setWrappers();
      });
      it('Close button is not displayed', function () {
        assert.isFalse(closeButton.exists());
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
  });
});
