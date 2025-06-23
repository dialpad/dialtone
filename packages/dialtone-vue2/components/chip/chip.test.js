import { createLocalVue, mount } from '@vue/test-utils';
import EmptyComponentFixture from '@/tests/fixtures/component.vue';
import { DtChip } from '@/components/chip';

const MOCK_DEFAULT_TEXT = 'TEXT';

const baseProps = {
  closeButtonProps: {
    ariaLabel: 'close',
  },
};
const baseSlots = {};

let mockProps = {};
let mockSlots = {};
const testContext = {};
describe('DtChip Tests', () => {
  let wrapper;
  let chip;
  let icon;
  let avatar;
  let label;
  let remove;

  const updateWrapper = () => {
    wrapper = mount(DtChip, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    chip = wrapper.find('[data-qa="dt-chip"]');
    icon = wrapper.find('[data-qa="dt-chip-icon"]');
    avatar = wrapper.find('[data-qa="dt-chip-avatar"]');
    label = wrapper.find('[data-qa="dt-chip-label"]');
    remove = wrapper.find('[data-qa="dt-chip-close"]');
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

      it('should render remove button', () => {
        expect(remove.exists()).toBeTruthy();
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

      it('default interactive', () => {
        expect(chip.element.tagName).toBe('BUTTON');
      });

      it('chip should have aria-labelledby', () => {
        expect('aria-labelledby' in chip.attributes()).toBeTruthy();
      });

      it('button should have aria-label', () => {
        expect(remove.attributes('aria-label')).toBe('close');
      });
    });

    describe('When interactive is false', () => {
      it('should not be interactive', () => {
        mockProps = { interactive: false };

        updateWrapper();

        expect(chip.element.tagName).toBe('SPAN');
      });
    });

    describe('When hide close button', () => {
      it('should not render remove button', () => {
        mockProps = { hideClose: true };

        updateWrapper();

        expect(remove.exists()).toBe(false);
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
  });

  describe('Interactivity Tests', () => {
    describe('When close button is clicked', () => {
      it('should emit close event', async () => {
        await remove.trigger('click');

        expect('close' in wrapper.emitted()).toBeTruthy();
      });
    });

    describe('When delete is pressed on a chip', () => {
      it('should emit close event', async () => {
        await chip.trigger('keyup', { code: 'DELETE' });

        expect('close' in wrapper.emitted()).toBeTruthy();
      });
    });
  });
});
