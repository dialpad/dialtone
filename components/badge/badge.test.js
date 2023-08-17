import { createLocalVue, mount } from '@vue/test-utils';
import DtBadge from './badge.vue';
import { BADGE_TYPE_MODIFIERS, BADGE_KIND_MODIFIERS, BADGE_DECORATION_MODIFIERS } from './badge_constants';

const MOCK_SLOT_TEXT = 'Default slot text';
const MOCK_PROP_TEXT = 'Prop text';

const baseProps = {};
const baseSlots = {};

let mockProps = {};
let mockSlots = {};
const testContext = {};

describe('DtBadge Tests', () => {
  let wrapper;
  let badge;
  let iconLeftWrapper;
  let iconLeft;

  const updateWrapper = () => {
    wrapper = mount(DtBadge, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    badge = wrapper.find('[data-qa="dt-badge"]');
    iconLeftWrapper = wrapper.find('.d-badge__icon-left');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When the badge renders', () => {
      it('should exist', () => {
        expect(wrapper.exists()).toBeTruthy();
      });
    });

    describe('When a text is provided via slot', () => {
      beforeEach(async () => {
        mockSlots = { default: MOCK_SLOT_TEXT };

        updateWrapper();
      });

      it('should render the badge', () => {
        expect(badge.exists()).toBe(true);
      });

      it('should display the correct text', () => {
        expect(badge.text()).toBe(MOCK_SLOT_TEXT);
      });
    });

    describe('When a text is provided via prop', () => {
      beforeEach(async () => {
        mockProps = { text: MOCK_PROP_TEXT };

        updateWrapper();
      });

      it('should render the badge', () => {
        expect(badge.exists()).toBe(true);
      });

      it('should display the correct text', () => {
        expect(badge.text()).toBe(MOCK_PROP_TEXT);
      });
    });

    describe('When a type is provided via prop', () => {
      describe('When type is info', () => {
        it('should have correct type', async () => {
          await wrapper.setProps({ type: 'info' });

          expect(badge.classes(BADGE_TYPE_MODIFIERS.info)).toBe(true);
        });
      });

      describe('When type is success', () => {
        it('should have correct type', async () => {
          await wrapper.setProps({ type: 'success' });

          expect(badge.classes(BADGE_TYPE_MODIFIERS.success)).toBe(true);
        });
      });

      describe('When type is warning', () => {
        it('should have correct type', async () => {
          await wrapper.setProps({ type: 'warning' });

          expect(badge.classes(BADGE_TYPE_MODIFIERS.warning)).toBe(true);
        });
      });

      describe('When type is critical', () => {
        it('should have correct type', async () => {
          await wrapper.setProps({ type: 'critical' });

          expect(badge.classes(BADGE_TYPE_MODIFIERS.critical)).toBe(true);
        });
      });

      describe('When type is ai', () => {
        beforeEach(async () => {
          mockProps = { type: 'ai' };

          updateWrapper();
        });

        it('should have correct type', async () => {
          await wrapper.setProps({ type: 'ai' });

          expect(badge.classes(BADGE_TYPE_MODIFIERS.ai)).toBe(true);
        });

        it('renders ai icon in iconLeft slot by default', () => {
          iconLeft = iconLeftWrapper.findComponent({ name: 'DtIcon' });

          expect(iconLeft.attributes('data-name') === 'Dialpad Ai').toBe(true);
        });
      });
    });

    describe('When a kind is provided via prop', () => {
      describe('When kind is count', () => {
        it('should have correct kind', async () => {
          await wrapper.setProps({ kind: 'count' });

          expect(badge.classes(BADGE_KIND_MODIFIERS.count)).toBe(true);
        });
      });
    });

    describe('When a decoration is provided via prop', () => {
      describe('When decoration is black-900', () => {
        it('should have correct decoration', async () => {
          await wrapper.setProps({ decoration: 'black-900' });

          const decorativeSpan = wrapper.find('.d-badge__decorative');

          expect(decorativeSpan.exists()).toBeTruthy();
          expect(badge.classes(BADGE_DECORATION_MODIFIERS['black-900'])).toBe(true);
        });
      });

      describe('When decoration is red-400', () => {
        it('should have correct decoration', async () => {
          await wrapper.setProps({ decoration: 'red-400' });

          const decorativeSpan = wrapper.find('.d-badge__decorative');

          expect(decorativeSpan.exists()).toBeTruthy();
          expect(badge.classes(BADGE_DECORATION_MODIFIERS['red-400'])).toBe(true);
        });
      });

      describe('When decoration is purple-400', () => {
        it('should have correct decoration', async () => {
          await wrapper.setProps({ decoration: 'purple-400' });

          const decorativeSpan = wrapper.find('.d-badge__decorative');

          expect(decorativeSpan.exists()).toBeTruthy();
          expect(badge.classes(BADGE_DECORATION_MODIFIERS['purple-400'])).toBe(true);
        });
      });

      describe('When decoration is gold-300', () => {
        it('should have correct decoration', async () => {
          await wrapper.setProps({ decoration: 'gold-300' });

          const decorativeSpan = wrapper.find('.d-badge__decorative');

          expect(decorativeSpan.exists()).toBeTruthy();
          expect(badge.classes(BADGE_DECORATION_MODIFIERS['gold-300'])).toBe(true);
        });
      });
    });
  });
});
