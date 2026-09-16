import { mount } from '@vue/test-utils';

import { DtNoticeAction } from '@/components/Notice';

// Constants
const baseProps = {
  showClose: true,
};

const baseSlotsData = {
  default: 'this is the action slot content',
};

describe('DtNoticeAction tests', () => {
  let wrapper;

  const props = baseProps;
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
    closeButton = wrapper.find('[data-qa="dt-notice-action-close-button"]');
    srOnlyCloseButton = wrapper.find('[data-qa="dt-sr-only-close-button"]');
  };

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

    describe('When showClose is true', () => {
      it('Close button is displayed', () => {
        expect(closeButton.exists()).toBe(true);
      });
    });

    describe('When showClose is false', () => {
      beforeEach(async () => {
        _setWrappers();
        await wrapper.setProps({ showClose: false });
        _setChildWrappers();
      });

      it('Close button is not displayed', () => {
        expect(closeButton.exists()).toBe(false);
      });

      it('should contain a visually hidden close button', async () => {
        expect(srOnlyCloseButton.exists()).toBe(true);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When showClose is true', () => {
      describe('When close button is clicked', () => {
        beforeEach(async () => {
          await closeButton.trigger('click');
        });
        it('emits event', () => {
          expect(wrapper.emitted('close')).toBeTruthy();
        });
      });
    });

    describe('When showClose is false', () => {
      beforeEach(async () => {
        await wrapper.setProps({ showClose: false });
        _setChildWrappers();
        await srOnlyCloseButton.trigger('click');
      });

      it('emits event', () => {
        expect(wrapper.emitted('close')).toBeTruthy();
      });
    });
  });
});
