import { mount } from '@vue/test-utils';
import EmptyComponentFixture from '@/tests/fixtures/component.vue';
import { DtChip } from '@/components/Chip';
import {
  CHIP_CLOSE_BUTTON_SIZE_MODIFIERS,
  CHIP_EMPHASIS_MODIFIERS,
  CHIP_SIZE_MODIFIERS,
  CHIP_VARIANT_MODIFIERS,
} from './ChipConstants';

const MOCK_DEFAULT_TEXT = 'TEXT';
const MOCK_LOCALIZED_REMOVE_BUTTON_ARIA_LABEL = 'Remove chip';

const baseProps = {};
const baseSlots = {};

let mockProps = {};
let mockSlots = {};
describe('DtChip Tests', () => {
  let wrapper;
  let chip;
  let icon;
  let avatar;
  let label;
  let remove;

  const updateWrapper = () => {
    wrapper = mount(DtChip, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    chip = wrapper.find('[data-qa="dt-chip"]');
    icon = wrapper.find('[data-qa="dt-chip-icon"]');
    avatar = wrapper.find('[data-qa="dt-chip-avatar"]');
    label = wrapper.find('[data-qa="dt-chip-label"]');
    remove = wrapper.find('[data-qa="dt-chip-close"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      beforeEach(() => {
        mockSlots = { default: MOCK_DEFAULT_TEXT };

        updateWrapper();
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render chip', () => {
        expect(chip.exists()).toBeTruthy();
      });

      it('should not render remove button by default', () => {
        expect(remove.exists()).toBe(false);
      });

      it('should render label', () => {
        expect(label.exists()).toBeTruthy();
      });

      it('should display the correct text', () => {
        expect(label.text()).toBe(MOCK_DEFAULT_TEXT);
      });

      it('should not render icon', () => {
        expect(icon.exists()).toBe(false);
      });

      it('should not render avatar', () => {
        expect(avatar.exists()).toBe(false);
      });

      it('default interactive is false, renders as span', () => {
        expect(chip.element.tagName).toBe('SPAN');
      });

      it('chip should have aria-labelledby', () => {
        expect('aria-labelledby' in chip.attributes()).toBeTruthy();
      });

    });

    describe('When size is omitted', () => {
      it('should render the 300 size class', () => {
        expect(chip.classes()).toContain(CHIP_SIZE_MODIFIERS[300]);
      });
    });

    describe('When size is numeric', () => {
      it.each([100, 200, 300, 400, 500, 600, 700])('should render the size %s class', (size) => {
        mockProps = { size };

        updateWrapper();

        expect(chip.classes()).toContain(CHIP_SIZE_MODIFIERS[size]);
      });
    });

    describe('When the chip has a close button', () => {
      it.each([100, 300, 600])('should size the close button for chip size %s', (size) => {
        mockProps = { size, showClose: true, interactive: true };

        updateWrapper();

        expect(remove.classes()).toContain(CHIP_CLOSE_BUTTON_SIZE_MODIFIERS[size]);
      });
    });

    describe('When variant is people', () => {
      it('should render correct variant class', () => {
        mockProps = { variant: 'people' };

        updateWrapper();

        expect(chip.classes()).toContain(CHIP_VARIANT_MODIFIERS.people);
      });
    });

    describe('When emphasis is strong', () => {
      it('should render correct emphasis class', () => {
        mockProps = { emphasis: 'strong' };

        updateWrapper();

        expect(chip.classes()).toContain(CHIP_EMPHASIS_MODIFIERS.strong);
      });
    });

    describe('When emphasis is subtle and interactive', () => {
      it('should render base emphasis fallback', () => {
        mockProps = { emphasis: 'subtle', interactive: true };

        updateWrapper();

        expect(chip.classes()).not.toContain(CHIP_EMPHASIS_MODIFIERS.subtle);
      });
    });

    describe('When interactive is false', () => {
      it('should not be interactive', () => {
        mockProps = { interactive: false };

        updateWrapper();

        expect(chip.element.tagName).toBe('SPAN');
      });
    });

    describe('When showClose is false', () => {
      it('should not render remove button', () => {
        mockProps = { showClose: false };

        updateWrapper();

        expect(remove.exists()).toBe(false);
      });
    });

    describe('When showClose is true and interactive is false', () => {
      it('should not render remove button', () => {
        mockProps = { showClose: true, interactive: false };

        updateWrapper();

        expect(remove.exists()).toBe(false);
      });
    });

    describe('When showClose is true and interactive is true', () => {
      beforeEach(() => {
        mockProps = { showClose: true, interactive: true };

        updateWrapper();
      });

      it('should render remove button', () => {
        expect(remove.exists()).toBeTruthy();
      });

      it('button should have localized aria-label', () => {
        expect(remove.attributes('aria-label')).toBe(MOCK_LOCALIZED_REMOVE_BUTTON_ARIA_LABEL);
      });
    });

    describe('When removeButtonAriaLabel is provided', () => {
      it('should render custom close aria-label', () => {
        mockProps = { showClose: true, interactive: true, removeButtonAriaLabel: 'Remove person' };

        updateWrapper();

        expect(remove.attributes('aria-label')).toBe('Remove person');
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true, showClose: true, interactive: true };

        updateWrapper();
      });

      it('should apply disabled styles to chip', () => {
        expect(chip.classes()).toContain('d-chip--disabled');
      });

      it('should set aria-disabled and tabindex on chip', () => {
        expect(chip.attributes('aria-disabled')).toBe('true');
        expect(chip.attributes('tabindex')).toBe('-1');
      });

      it('should set aria-disabled and tabindex on remove button', () => {
        expect(remove.attributes('aria-disabled')).toBe('true');
        expect(remove.attributes('tabindex')).toBe('-1');
      });

      it('should not emit click', async () => {
        await chip.trigger('click');

        expect(wrapper.emitted('click')).toBeUndefined();
      });

      it('should not emit close when backspace is pressed', async () => {
        await chip.trigger('keydown', { key: 'Backspace' });

        expect(wrapper.emitted('close')).toBeUndefined();
      });

      it('should not emit close when the remove button is clicked', async () => {
        await remove.trigger('click');

        expect(wrapper.emitted('close')).toBeUndefined();
      });
    });

    describe('When the startIcon slot is toggled after mount', () => {
      it('should add and remove the start icon wrapper', async () => {
        const Parent = {
          components: { DtChip },
          props: { showStart: Boolean },
          template: '<dt-chip><template v-if="showStart" #startIcon><span>S</span></template>Label</dt-chip>',
        };
        const parent = mount(Parent, { props: { showStart: false } });
        const startSelector = '[data-qa="dt-chip-icon"]';

        expect(parent.find(startSelector).exists()).toBe(false);

        await parent.setProps({ showStart: true });
        expect(parent.find(startSelector).exists()).toBe(true);

        await parent.setProps({ showStart: false });
        expect(parent.find(startSelector).exists()).toBe(false);
      });
    });

    describe('When a deprecated slot is used and the chip re-renders', () => {
      it('should warn only once per instance', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockSlots = { default: MOCK_DEFAULT_TEXT, icon: EmptyComponentFixture };
        updateWrapper();
        await wrapper.setProps({ size: 300 });
        await wrapper.setProps({ size: 100 });

        const iconWarnings = warn.mock.calls.filter(([message]) => message.includes('icon slot is deprecated'));

        expect(iconWarnings).toHaveLength(1);
        warn.mockRestore();
      });
    });

    describe('When show avatar', () => {
      it('should render avatar', () => {
        mockSlots = { avatar: EmptyComponentFixture };

        updateWrapper();

        expect(avatar.exists()).toBeTruthy();
      });
    });

    describe('With icon slot', () => {
      it('should render icon', () => {
        mockSlots = { icon: EmptyComponentFixture };

        updateWrapper();

        expect(icon.exists()).toBeTruthy();
      });
    });

    describe('With startIcon and deprecated icon slots', () => {
      it('should render startIcon and suppress the deprecated icon', () => {
        mockSlots = { startIcon: '<span>start</span>', icon: '<span>icon</span>' };

        updateWrapper();

        const start = wrapper.find('[data-qa="dt-chip-icon"]');
        expect(start.text()).toBe('start');
      });
    });

    describe('With startAvatar slot', () => {
      it('should render the start avatar wrapper', () => {
        mockSlots = { startAvatar: '<span>avatar</span>' };

        updateWrapper();

        expect(wrapper.find('[data-qa="dt-chip-avatar"]').text()).toBe('avatar');
      });
    });

    describe('With endIcon slot', () => {
      it('should render the end icon wrapper with its class', () => {
        mockSlots = { endIcon: '<span>end</span>' };
        mockProps = { endIconClass: 'custom-end' };

        updateWrapper();

        const end = wrapper.find('[data-qa="dt-chip-end-icon"]');
        expect(end.text()).toBe('end');
        expect(end.classes()).toContain('custom-end');
      });
    });

    describe('With leading and trailing slots', () => {
      it('should render freeform content in the leading and trailing containers', () => {
        mockSlots = { leading: '<span>lead</span>', trailing: '<span>trail</span>' };
        mockProps = { leadingClass: 'custom-leading', trailingClass: 'custom-trailing' };

        updateWrapper();

        const leading = wrapper.find('[data-qa="dt-chip-leading"]');
        const trailing = wrapper.find('[data-qa="dt-chip-trailing"]');

        expect(leading.text()).toBe('lead');
        expect(leading.classes()).toEqual(expect.arrayContaining(['d-chip__leading', 'custom-leading']));
        expect(trailing.text()).toBe('trail');
        expect(trailing.classes()).toEqual(expect.arrayContaining(['d-chip__trailing', 'custom-trailing']));
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When close button is clicked', () => {
      it('should emit close event', async () => {
        mockProps = { showClose: true, interactive: true };

        updateWrapper();

        await remove.trigger('click');

        expect('close' in wrapper.emitted()).toBeTruthy();
      });
    });

    describe('When delete is pressed on a chip', () => {
      it('should emit close event', async () => {
        mockProps = { showClose: true, interactive: true };

        updateWrapper();

        await chip.trigger('keydown', { code: 'DELETE' });

        expect('close' in wrapper.emitted()).toBeTruthy();
      });

      it('should emit close event without a visible close button', async () => {
        mockProps = { interactive: true };

        updateWrapper();

        await chip.trigger('keydown', { code: 'DELETE' });

        expect('close' in wrapper.emitted()).toBeTruthy();
      });
    });

    describe('When backspace is pressed on a chip', () => {
      it('should emit close event', async () => {
        mockProps = { showClose: true, interactive: true };

        updateWrapper();

        await chip.trigger('keydown', { key: 'Backspace' });

        expect('close' in wrapper.emitted()).toBeTruthy();
      });
    });

    describe('When interactive is false', () => {
      it('should not emit click', async () => {
        await chip.trigger('click');

        expect('click' in wrapper.emitted()).toBe(false);
      });
    });
  });
});
