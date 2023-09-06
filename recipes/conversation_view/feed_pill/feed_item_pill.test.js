import { mount } from '@vue/test-utils';
import DtRecipeFeedItemPill from './feed_item_pill.vue';
import { beforeEach } from 'vitest';

describe('DtRecipeFeedItemPill Tests', function () {
  let wrapper, feedItemPill, icon;

  const MOCK_ARIA_LABEL = 'Click to expand';
  const MOCK_ICON_NAME = 'Video';

  const baseProps = {
    iconName: MOCK_ICON_NAME,
    title: 'This meeting has ended',
    ariaLabel: MOCK_ARIA_LABEL,
    buttonClass: '',
    toggleable: true,
  };
  const baseAttrs = {};
  const baseSlots = {
    content: '<div data-qa="content-element"> content </div>',
  };
  const baseProvide = {};

  let mockProps = {};
  let mockAttrs = {};
  let mockSlots = {};
  let mockProvide = {};

  const updateWrapper = () => {
    wrapper = mount(DtRecipeFeedItemPill, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        provide: { ...baseProvide, ...mockProvide },
      },
    });
    feedItemPill = wrapper.find('[data-qa="dt-feed-item-pill"]');
    icon = wrapper.find('[data-qa="dt-feed-item-pill-icon"]');
  };

  beforeEach(function () {
    updateWrapper();
  });

  afterEach(function () {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    mockProvide = {};
  });

  describe('Presentation Tests', function () {
    describe('Default render', function () {
      it('should exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render a feed item pill', () => {
        expect(feedItemPill.exists()).toBeTruthy();
        expect(icon.exists()).toBe(true);
        expect(icon.attributes('data-name')).toBe(MOCK_ICON_NAME);
        expect(wrapper.find('[data-qa="content-element"]').exists()).toBe(false);
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('Default Render', function () {
      it('should render a reaction button', () => {
        expect(feedItemPill.attributes('aria-label')).toBe(MOCK_ARIA_LABEL);
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('Toggle feed item pill', function () {
      it('Should emit a click event', async () => {
        await feedItemPill.trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="content-element"]').exists()).toBe(true);
      });

      describe('toggleable false', function () {
        beforeAll(() => {
          mockProps = {
            toggleable: false,
          };
        });

        it('should exist', () => {
          expect(wrapper.exists()).toBe(true);
        });

        it('should not respond to clicks', () => {
          expect(feedItemPill.exists()).toBeTruthy();
          expect(icon.exists()).toBe(true);
          expect(icon.attributes('data-name')).toBe(MOCK_ICON_NAME);
          expect(wrapper.find('[data-qa="content-element"]').exists()).toBe(false);
        });
      });
    });

    describe('Hover Feed Item Pill event', function () {
      beforeEach(async () => {
        await feedItemPill.trigger('focusin');
        icon = wrapper.find('[data-qa="dt-feed-item-pill-icon"]');
      });

      it('should show a different icon', () => {
        expect(icon.exists()).toBe(true);
        expect(icon.attributes('data-name')).toBe('Chevron Right');
      });
    });
  });
});
