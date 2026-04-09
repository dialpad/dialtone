import { mount } from '@vue/test-utils';
import DtBadge from './badge.vue';
import { BADGE_TYPE_MODIFIERS, BADGE_KIND_MODIFIERS, BADGE_DECORATION_MODIFIERS } from './badge_constants';

const MOCK_SLOT_TEXT = 'Default slot text';
const MOCK_PROP_TEXT = 'Prop text';

const baseProps = {};
const baseSlots = {};

let mockProps = {};
let mockSlots = {};

describe('DtBadge Tests', () => {
  let wrapper;
  let badge;

  const updateWrapper = () => {
    wrapper = mount(DtBadge, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    badge = wrapper.find('[data-qa="dt-badge"]');
  };

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

      describe('When type is positive', () => {
        it('should have correct type', async () => {
          await wrapper.setProps({ type: 'positive' });

          expect(badge.classes(BADGE_TYPE_MODIFIERS.positive)).toBe(true);
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
          await vi.dynamicImportSettled();
        });

        it('should have correct type', async () => {
          expect(badge.classes(BADGE_TYPE_MODIFIERS.ai)).toBe(true);
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

    describe('When a startIcon slot is provided', () => {
      beforeEach(() => {
        mockSlots = { startIcon: '<dt-icon name="plus" />' };

        updateWrapper();
      });

      it('should render the left icon wrapper', () => {
        expect(wrapper.find('.d-badge__icon-left').exists()).toBe(true);
      });
    });

    describe('When an endIcon slot is provided', () => {
      beforeEach(() => {
        mockSlots = { endIcon: '<dt-icon name="plus" />' };

        updateWrapper();
      });

      it('should render the right icon wrapper', () => {
        expect(wrapper.find('.d-badge__icon-right').exists()).toBe(true);
      });
    });

    describe('Backward compatibility', () => {
      describe('When leftIcon slot is provided (deprecated)', () => {
        beforeEach(() => {
          mockSlots = { leftIcon: '<dt-icon name="plus" />' };

          updateWrapper();
        });

        it('should render the left icon wrapper', () => {
          expect(wrapper.find('.d-badge__icon-left').exists()).toBe(true);
        });
      });

      describe('When rightIcon slot is provided (deprecated)', () => {
        beforeEach(() => {
          mockSlots = { rightIcon: '<dt-icon name="plus" />' };

          updateWrapper();
        });

        it('should render the right icon wrapper', () => {
          expect(wrapper.find('.d-badge__icon-right').exists()).toBe(true);
        });
      });

      describe('When both startIcon and leftIcon slots are provided', () => {
        it('should render the new startIcon content and suppress the deprecated leftIcon', () => {
          mockSlots = {
            startIcon: '<span>new</span>',
            leftIcon: '<span>old</span>',
          };

          updateWrapper();

          const leftIconWrapper = wrapper.find('.d-badge__icon-left');

          expect(leftIconWrapper.exists()).toBe(true);
          expect(leftIconWrapper.text()).toContain('new');
          expect(leftIconWrapper.text()).not.toContain('old');
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
