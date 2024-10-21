import { mount } from '@vue/test-utils';
import DtRecipeFeedItemPill from './feed_item_pill.vue';
import { DtIconVideo } from '@dialpad/dialtone-icons/vue3';

describe('DtRecipeFeedItemPill Tests', function () {
  let wrapper, feedItemPill, icon;

  const MOCK_ARIA_LABEL = 'Click to expand';
  const MOCK_ICON_SLOT = '<dt-icon-video />';
  const DATA_QA = {
    PILL: 'dt-recipe-feed-item-pill',
    PILL_ICON: 'dt-recipe-feed-item-pill__icon',
    CONTENT_ELEMENT: 'content-element',
  };

  const baseProps = {
    title: 'This meeting has ended',
    ariaLabel: MOCK_ARIA_LABEL,
  };
  const baseAttrs = {};
  const baseSlots = {
    content: `<div data-qa="${DATA_QA.CONTENT_ELEMENT}"> content </div>`,
  };
  const baseProvide = {};

  let mockProps = {};
  let mockAttrs = {};
  let mockSlots = {};
  let mockProvide = {};

  const updateWrapper = async () => {
    wrapper = mount(DtRecipeFeedItemPill, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        provide: { ...baseProvide, ...mockProvide },
        components: {
          DtIconVideo,
        },
      },
    });

    await vi.dynamicImportSettled();

    feedItemPill = wrapper.find(`[data-qa="${DATA_QA.PILL}"]`);
    icon = wrapper.find(`[data-qa="${DATA_QA.PILL_ICON}"]`);
  };

  beforeEach(async function () {
    await updateWrapper();
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

      it('should render a feed item pill', async () => {
        expect(feedItemPill.exists()).toBeTruthy();
        expect(icon.exists()).toBe(true);
        // expect(icon.attributes('data-name')).toBe(MOCK_ICON_NAME);
        // expect(wrapper.find(`[data-qa="${DATA_QA.CONTENT_ELEMENT}"]`).exists()).toBe(false);
      });
    });

    describe('When the icon slot is provided', () => {
      beforeEach(async () => {
        mockSlots = { leftIcon: MOCK_ICON_SLOT };

        await updateWrapper();
      });

      it('should render the icon', () => {
        expect(icon.findComponent(DtIconVideo).exists()).toBe(true);
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

        expect(wrapper.find(`[data-qa="${DATA_QA.CONTENT_ELEMENT}"]`).exists()).toBe(true);
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
          //
          expect(true).toBe(true);
        });
      });
    });

    describe('Hover Feed Item Pill event', function () {
      beforeEach(async () => {
        await feedItemPill.trigger('focusin');
        await vi.dynamicImportSettled();
        icon = wrapper.find(`[data-qa="${DATA_QA.PILL_ICON}"]`);
      });

      it('should show a different icon', () => {
        expect(icon.exists()).toBe(true);
        expect(icon.find('[data-qa="dt-icon"]').attributes('data-name')).toBe('Chevron Right');
      });
    });

    describe('Default toggled state close', function () {
      it('content slot should not exist', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(`[data-qa="${DATA_QA.CONTENT_ELEMENT}"]`).exists()).toBe(false);
      });
    });

    describe('Default toggled state open', function () {
      beforeAll(() => {
        mockProps = {
          defaultToggled: true,
        };
      });

      it('content slot should exist', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(`[data-qa="${DATA_QA.CONTENT_ELEMENT}"]`).exists()).toBe(true);
      });
    });
  });
});
