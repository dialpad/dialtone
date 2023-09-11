import { mount } from '@vue/test-utils';
import DtItemLayout from './item_layout.vue';

const baseSlots = {};

let mockSlots = {};

describe('DtItemLayout tests', () => {
  let wrapper;
  let leftWrapper;
  let rightWrapper;
  let subtitleWrapper;
  let bottomWrapper;

  const updateWrapper = () => {
    wrapper = mount(DtItemLayout, {
      slots: { ...baseSlots, ...mockSlots },
    });

    leftWrapper = wrapper.find('[data-qa="dt-item-layout-left-wrapper"]');
    rightWrapper = wrapper.find('[data-qa="dt-item-layout-right-wrapper"]');
    subtitleWrapper = wrapper.find('[data-qa="dt-item-layout-subtitle-wrapper"]');
    bottomWrapper = wrapper.find('[data-qa="dt-item-layout-bottom-wrapper"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When none of the slot contents are provided', () => {
      it('should not render the left slot wrapper', () => {
        expect(leftWrapper.exists()).toBe(false);
      });

      it('should not render the right slot wrapper', () => {
        expect(rightWrapper.exists()).toBe(false);
      });

      it('should not render the subtitle slot wrapper', () => {
        expect(subtitleWrapper.exists()).toBe(false);
      });

      it('should not render the bottom slot wrapper', () => {
        expect(bottomWrapper.exists()).toBe(false);
      });
    });

    describe('When left content is provided', () => {
      beforeEach(() => {
        mockSlots = { left: 'left' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(leftWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('left')).toBe(true);
      });
    });

    describe('When right content is provided', () => {
      beforeEach(() => {
        mockSlots = { right: 'right' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(rightWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('right')).toBe(true);
      });
    });

    describe('When subtitle content is provided', () => {
      beforeEach(() => {
        mockSlots = { subtitle: 'subtitle' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(subtitleWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('subtitle')).toBe(true);
      });
    });

    describe('When bottom content is provided', () => {
      beforeEach(() => {
        mockSlots = { bottom: 'bottom' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(bottomWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('bottom')).toBe(true);
      });
    });

    describe('When selected content is provided', () => {
      beforeEach(() => {
        mockSlots = { selected: 'selected' };

        updateWrapper();
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('selected')).toBe(true);
      });
    });
  });
});
