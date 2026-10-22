import { mount } from '@vue/test-utils';
import DtBadge from './Badge.vue';
import {
  BADGE_VARIANT_MODIFIERS,
  BADGE_EMPHASIS_MODIFIERS,
  BADGE_SIZE_MODIFIERS,
  BADGE_TYPE_MODIFIERS,
  BADGE_GROUPS,
  BADGE_DECORATION_MODIFIERS,
} from './BadgeConstants';

const MOCK_SLOT_TEXT = 'Default slot text';
const MOCK_PROP_TEXT = 'Prop text';

const baseProps = { kind: 'status' };

const kindFor = (variant) => Object.keys(BADGE_GROUPS).find(group => BADGE_GROUPS[group].variants.includes(variant));
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

    describe('When a label is provided via prop', () => {
      beforeEach(async () => {
        mockProps = { label: MOCK_PROP_TEXT, text: 'Deprecated text' };

        updateWrapper();
      });

      it('should render label before deprecated text', () => {
        expect(badge.text()).toBe(MOCK_PROP_TEXT);
      });
    });

    describe('When slot content and label are provided', () => {
      beforeEach(async () => {
        mockProps = { label: MOCK_PROP_TEXT };
        mockSlots = { default: MOCK_SLOT_TEXT };

        updateWrapper();
      });

      it('should render slot content before label', () => {
        expect(badge.text()).toBe(MOCK_SLOT_TEXT);
      });
    });

    describe('When a variant is provided via prop', () => {
      it('should have correct variant', async () => {
        await wrapper.setProps({ variant: 'positive', type: 'critical' });

        expect(badge.classes(BADGE_VARIANT_MODIFIERS.positive)).toBe(true);
        expect(badge.classes(BADGE_VARIANT_MODIFIERS.critical)).toBe(false);
      });
    });

    describe('When variant is passed as undefined', () => {
      it('should fall back to the legacy type', () => {
        mockProps = { variant: undefined, type: 'critical' };

        updateWrapper();

        expect(badge.classes(BADGE_VARIANT_MODIFIERS.critical)).toBe(true);
      });
    });

    describe('When variant is explicitly neutral', () => {
      it('should win over the legacy type', () => {
        mockProps = { variant: 'neutral', type: 'critical' };

        updateWrapper();

        expect(badge.classes(BADGE_VARIANT_MODIFIERS.neutral)).toBe(true);
        expect(badge.classes(BADGE_VARIANT_MODIFIERS.critical)).toBe(false);
      });
    });

    describe('When label is passed as undefined', () => {
      it('should fall back to the legacy text', () => {
        mockProps = { label: undefined, text: MOCK_PROP_TEXT };

        updateWrapper();

        expect(badge.text()).toBe(MOCK_PROP_TEXT);
      });
    });

    describe('When a deprecated prop is used and the badge re-renders', () => {
      it('should warn only once per instance', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockProps = { text: MOCK_PROP_TEXT };
        updateWrapper();
        await wrapper.setProps({ size: 300 });
        await wrapper.setProps({ size: 100 });

        const textWarnings = warn.mock.calls.filter(([message]) => message.includes('text is deprecated'));

        expect(textWarnings).toHaveLength(1);
        warn.mockRestore();
      });
    });

    describe('When the startIcon slot is toggled after mount', () => {
      it('should add and remove the start icon wrapper', async () => {
        const Parent = {
          components: { DtBadge },
          props: { showStart: Boolean },
          template: '<dt-badge><template v-if="showStart" #startIcon><span>S</span></template>Label</dt-badge>',
        };
        const parent = mount(Parent, { props: { showStart: false } });
        const startSelector = '[data-qa="dt-badge-start-icon"]';

        expect(parent.find(startSelector).exists()).toBe(false);

        await parent.setProps({ showStart: true });
        expect(parent.find(startSelector).exists()).toBe(true);

        await parent.setProps({ showStart: false });
        expect(parent.find(startSelector).exists()).toBe(false);
      });
    });

    describe('When size is 500', () => {
      it('should have the size 500 class', () => {
        mockProps = { size: 500 };

        updateWrapper();

        expect(badge.classes(BADGE_SIZE_MODIFIERS[500])).toBe(true);
      });
    });

    describe('When kind is omitted', () => {
      it('should render a neutral status badge without warning', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const bare = mount(DtBadge, { props: { label: 'Draft' } });

        expect(bare.find('[data-qa="dt-badge"]').classes(BADGE_VARIANT_MODIFIERS.neutral)).toBe(true);
        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
      });

      it('should warn when the variant belongs to another group', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mount(DtBadge, { props: { variant: 'count', label: '9' } });

        expect(warn.mock.calls.some(([message]) => String(message).includes('does not belong to the status group'))).toBe(true);
        warn.mockRestore();
      });
    });

    describe('When a group is declared with kind', () => {
      it.each([
        ['status', 'critical'],
        ['counter', 'mention'],
        ['release', 'pre-release'],
        ['lifecycle', 'published'],
      ])('should render the %s group variant %s', (kind, variant) => {
        mockProps = { kind, variant };

        updateWrapper();

        expect(badge.classes(BADGE_VARIANT_MODIFIERS[variant])).toBe(true);
      });

      it.each([
        ['status', 'neutral'],
        ['counter', 'count'],
        ['release', 'pre-release'],
        ['lifecycle', 'draft'],
      ])('should use the default variant of the %s group (%s) when variant is omitted', (kind, variant) => {
        mockProps = { kind };

        updateWrapper();

        expect(badge.classes(BADGE_VARIANT_MODIFIERS[variant])).toBe(true);
      });

      it('should render the group default when the variant belongs to another group', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockProps = { kind: 'status', variant: 'count' };
        updateWrapper();

        expect(badge.classes(BADGE_VARIANT_MODIFIERS.neutral)).toBe(true);
        expect(badge.classes(BADGE_VARIANT_MODIFIERS.count)).toBe(false);
        warn.mockRestore();
      });

      it('should treat a null variant as unset', () => {
        mockProps = { kind: 'release', variant: null };
        updateWrapper();

        expect(badge.classes(BADGE_VARIANT_MODIFIERS['pre-release'])).toBe(true);
      });

      it('should warn once when the variant does not belong to the group', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockProps = { kind: 'status', variant: 'pre-release' };
        updateWrapper();
        await wrapper.setProps({ size: 300 });

        expect(warn.mock.calls.filter(([message]) => message.includes('does not belong to'))).toHaveLength(1);
        warn.mockRestore();
      });
    });

    describe('When emphasis is subtle', () => {
      it.each(['pre-release', 'release'])(
        'should render the outlined style for the release variant %s',
        (variant) => {
          mockProps = { kind: kindFor(variant), variant, emphasis: 'subtle' };

          updateWrapper();

          expect(badge.classes(BADGE_EMPHASIS_MODIFIERS.subtle)).toBe(true);
          expect(badge.classes(BADGE_EMPHASIS_MODIFIERS.strong)).toBe(false);
        },
      );

      it.each(['info', 'count', 'draft'])('should fall back to base and warn once for the %s variant', async (variant) => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockProps = { kind: kindFor(variant), variant, emphasis: 'subtle' };
        updateWrapper();
        await wrapper.setProps({ size: 300 });

        expect(badge.classes(BADGE_EMPHASIS_MODIFIERS.subtle)).toBe(false);
        expect(warn.mock.calls.filter(([message]) => message.includes('emphasis="subtle"'))).toHaveLength(1);
        warn.mockRestore();
      });
    });

    describe('When emphasis is clear', () => {
      it('should not be supported by any group', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockProps = { kind: 'release', variant: 'pre-release', emphasis: 'clear' };
        updateWrapper();

        expect(warn.mock.calls.filter(([message]) => message.includes('emphasis="clear"'))).toHaveLength(1);
        warn.mockRestore();
      });
    });

    describe('When the variant is mention', () => {
      it('should prefix the number with a text @ by default', () => {
        mockProps = { kind: 'counter', variant: 'mention', label: '2' };

        updateWrapper();

        const start = wrapper.find('[data-qa="dt-badge-start-icon"]');

        expect(start.exists()).toBe(true);
        expect(start.text()).toBe('@');
        expect(badge.text()).toBe('@2');
      });

      it('should use the startIcon slot instead of the text @ when provided', () => {
        mockProps = { kind: 'counter', variant: 'mention', label: '2' };
        mockSlots = { startIcon: '<span data-qa="mention-icon">i</span>' };

        updateWrapper();

        const start = wrapper.find('[data-qa="dt-badge-start-icon"]');

        expect(start.find('[data-qa="mention-icon"]').exists()).toBe(true);
        expect(start.text()).not.toContain('@');
      });

      it('should still show the @ when the startIcon slot renders nothing', () => {
        mockProps = { kind: 'counter', variant: 'mention', label: '2' };
        mockSlots = { startIcon: '<!-- empty -->' };

        updateWrapper();

        expect(wrapper.find('[data-qa="dt-badge-start-icon"]').text()).toBe('@');
      });

      it('should not render an @ for other variants', () => {
        mockProps = { kind: 'counter', variant: 'count', label: '2' };

        updateWrapper();

        expect(wrapper.find('[data-qa="dt-badge-start-icon"]').exists()).toBe(false);
      });
    });

    describe('When emphasis is omitted', () => {
      it.each([
        ['neutral', false],
        ['pre-release', true],
        ['release', true],
        ['draft', false],
        ['saved', false],
        ['published', true],
      ])('should default the %s variant to strong emphasis: %s', (variant, isStrong) => {
        mockProps = { kind: kindFor(variant), variant };

        updateWrapper();

        expect(badge.classes(BADGE_EMPHASIS_MODIFIERS.strong)).toBe(isStrong);
      });
    });

    describe('When variant is pre-release and emphasis is omitted', () => {
      it('should default to strong emphasis', async () => {
        await wrapper.setProps({ kind: 'release', variant: 'pre-release' });

        expect(badge.classes(BADGE_EMPHASIS_MODIFIERS.strong)).toBe(true);
      });
    });

    describe('When emphasis is provided via prop', () => {
      it('should override legacy outlined prop', async () => {
        await wrapper.setProps({ emphasis: 'base', outlined: true });

        expect(badge.classes('d-badge--outlined')).toBe(false);
      });
    });

    describe('When size is provided via prop', () => {
      it('should have correct size', async () => {
        await wrapper.setProps({ size: 300 });

        expect(badge.classes(BADGE_SIZE_MODIFIERS[300])).toBe(true);
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

    describe('When a leading slot is provided', () => {
      beforeEach(() => {
        mockSlots = { leading: '<span>lead</span>' };
        mockProps = { leadingClass: 'custom-leading' };

        updateWrapper();
      });

      it('should render the content in the leading container with its class', () => {
        const leading = wrapper.find('[data-qa="dt-badge-leading"]');

        expect(leading.text()).toBe('lead');
        expect(leading.classes()).toContain('d-badge__leading');
        expect(leading.classes()).toContain('custom-leading');
      });

      it('should not render the icon wrappers', () => {
        expect(wrapper.find('[data-qa="dt-badge-start-icon"]').exists()).toBe(false);
      });
    });

    describe('When a trailing slot is provided', () => {
      beforeEach(() => {
        mockSlots = { trailing: '<span>trail</span>' };
        mockProps = { trailingClass: 'custom-trailing' };

        updateWrapper();
      });

      it('should render the content in the trailing container with its class', () => {
        const trailing = wrapper.find('[data-qa="dt-badge-trailing"]');

        expect(trailing.text()).toBe('trail');
        expect(trailing.classes()).toContain('d-badge__trailing');
        expect(trailing.classes()).toContain('custom-trailing');
      });
    });

    describe('When another badge is passed to the trailing slot', () => {
      it('should render it inside the trailing container', () => {
        wrapper = mount(DtBadge, {
          props: { kind: 'counter', variant: 'count', label: '99' },
          slots: { trailing: '<dt-badge kind="counter" variant="mention" label="2" />' },
          global: { components: { DtBadge } },
        });

        const nested = wrapper.find('[data-qa="dt-badge-trailing"] [data-qa="dt-badge"]');

        expect(nested.exists()).toBe(true);
        expect(nested.classes(BADGE_VARIANT_MODIFIERS.mention)).toBe(true);
      });
    });

    describe('When a startIcon slot is provided', () => {
      beforeEach(() => {
        mockSlots = { startIcon: '<dt-icon name="plus" />' };

        updateWrapper();
      });

      it('should render the left icon wrapper', () => {
        expect(wrapper.find('[data-qa="dt-badge-start-icon"]').exists()).toBe(true);
      });
    });

    describe('When an endIcon slot is provided', () => {
      beforeEach(() => {
        mockSlots = { endIcon: '<dt-icon name="plus" />' };

        updateWrapper();
      });

      it('should render the right icon wrapper', () => {
        expect(wrapper.find('[data-qa="dt-badge-end-icon"]').exists()).toBe(true);
      });
    });

    describe('Backward compatibility', () => {
      describe('When leftIcon slot is provided (deprecated)', () => {
        beforeEach(() => {
          mockSlots = { leftIcon: '<dt-icon name="plus" />' };

          updateWrapper();
        });

        it('should render the left icon wrapper', () => {
          expect(wrapper.find('[data-qa="dt-badge-start-icon"]').exists()).toBe(true);
        });
      });

      describe('When rightIcon slot is provided (deprecated)', () => {
        beforeEach(() => {
          mockSlots = { rightIcon: '<dt-icon name="plus" />' };

          updateWrapper();
        });

        it('should render the right icon wrapper', () => {
          expect(wrapper.find('[data-qa="dt-badge-end-icon"]').exists()).toBe(true);
        });
      });

      describe('When both startIcon and leftIcon slots are provided', () => {
        it('should render the new startIcon content and suppress the deprecated leftIcon', () => {
          mockSlots = {
            startIcon: '<span>new</span>',
            leftIcon: '<span>old</span>',
          };

          updateWrapper();

          const leftIconWrapper = wrapper.find('[data-qa="dt-badge-start-icon"]');

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
