import { mount } from '@vue/test-utils';
import DtFeedItemRow from './feed_item_row.vue';

const baseProps = {
  displayName: 'Dwight Schrute',
  time: '4:54 PM',
  shortTime: '4:54',
};

describe('DtFeedItemRow tests', () => {
  // Wrappers
  let wrapper;

  // child wrappers
  let headerWrapper;
  let avatarImgWrapper;
  let leftTimeWrapper;
  let contentWrapper;
  let reactionsWrapper;
  let menuWrapper;

  // Test Environment
  let slots;
  let props;

  const _mountWrapper = () => {
    wrapper = mount(DtFeedItemRow, {
      props,
      slots,
    });
  };

  // Helpers
  const _setChildWrappers = () => {
    avatarImgWrapper = wrapper.find('[data-qa="feed-item-row-avatar-img"]');
    headerWrapper = wrapper.find('[data-qa="feed-item-row-header"]');
    leftTimeWrapper = wrapper.find('[data-qa="feed-item-row-left-time"]');
    contentWrapper = wrapper.find('[data-qa="feed-item-row-content"]');
    reactionsWrapper = wrapper.find('[data-qa="feed-item-row-reactions"]');
    menuWrapper = wrapper.find('[data-qa="feed-item-row-menu"]');
  };

  // Test Setup
  beforeEach(function () {
    props = baseProps;
    _mountWrapper();
  });

  // Test Teardown
  afterEach(() => {
    props = baseProps;
    slots = {};
  });

  describe('Presentation Tests', () => {
    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );

    describe('When showHeader is true', () => {
      beforeEach(() => {
        props = {
          ...baseProps,
          showHeader: true,
        };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render avatar', () => {
        expect(headerWrapper.exists()).toBe(true);
      });

      it('should not render left time', () => {
        expect(leftTimeWrapper.exists()).toBe(false);
      });

      describe('showHeader is toggled to false, left time', () => {
        beforeEach(() => {
          props = {
            ...baseProps,
            showHeader: false,
          };
          _mountWrapper();
          _setChildWrappers();
        });

        it('should not be visible when isActive is false', () => {
          expect(leftTimeWrapper.isVisible()).toBe(false);
        });

        it('should be visible and rendered when isActive is true', async () => {
          await wrapper.setProps({ isActive: true });
          expect(leftTimeWrapper.isVisible()).toBe(true);
        });
      });
    });

    describe('When avatar url is provided', () => {
      beforeEach(() => {
        props = {
          ...baseProps,
          showHeader: true,
          avatarImageUrl: 'https://i1.sndcdn.com/avatars-000181324408-652e57-t500x500.jpg',
        };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should have avatar img', () => {
        expect(avatarImgWrapper.exists()).toBe(true);
      });
    });

    describe('When default slot content is provided', () => {
      const TEST_CONTENT = 'Test default content';
      beforeEach(() => {
        slots = {
          default: TEST_CONTENT,
        };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render default content in the slot provided', () => {
        expect(contentWrapper.text()).toBe(TEST_CONTENT);
      });
    });

    describe('When reactions slot is provided', () => {
      const REACTION_CONTENT = 'reactions here';
      beforeEach(() => {
        slots = {
          reactions: REACTION_CONTENT,
        };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render reactions slot', () => {
        expect(reactionsWrapper.text()).toBe(REACTION_CONTENT);
      });
    });

    describe('When menu slot is provided', () => {
      beforeEach(() => {
        props = {
          ...baseProps,
          isActive: false,
        };
        slots = {
          menu: 'menu',
        };

        _mountWrapper();
        _setChildWrappers();
      });

      it('menu should not be visible when isActive is false', () => {
        expect(menuWrapper.isVisible()).toBe(false);
      });

      it('menu should be visible isActive is true', async () => {
        await wrapper.setProps({ isActive: true });
        expect(wrapper.exists()).toBe(true);
      });
    });

    describe('When isActive is false,', () => {
      // Test Setup
      beforeEach(() => {
        props = {
          ...baseProps,
          isActive: false,
        };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should not add highlight background to the feed row', () => {
        expect(wrapper.classes('d-bgc-secondary-opaque')).toBe(false);
      });

      it('should add highlight background to the feed row when isActive is toggled', async () => {
        await wrapper.setProps({ isActive: true });
        expect(wrapper.classes('d-bgc-secondary-opaque')).toBe(true);
      });
    });
  });
});
