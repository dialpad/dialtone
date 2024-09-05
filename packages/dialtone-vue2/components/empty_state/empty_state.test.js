import DtEmptyState from './empty_state.vue';
import { mount } from '@vue/test-utils';
import { DtIllustration } from '@/components/illustration';
import { DtIcon } from '@/components/icon';

const MOCK_HEADER_TEXT = 'Nothing to see here';
const MOCK_BODY_TEXT = 'Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque.';
const MOCK_BODY_SLOT = '<h2>Custom body slot</h2>';
const MOCK_ICON_SLOT = '<dt-icon name="accessibility" />';
const MOCK_ILLUSTRATION_SLOT = '<dt-illustration name="mind" />';

const baseProps = {
  headerText: MOCK_HEADER_TEXT,
  bodyText: MOCK_BODY_TEXT,
};

const baseSlots = { body: MOCK_BODY_SLOT };

let mockProps = {};
let mockSlots = {};

describe('DtIllustration Tests', () => {
  let wrapper;
  let illustration;
  let icon;
  let headerText;
  let bodyText;
  let bodySlot;

  const updateWrapper = async () => {
    wrapper = mount(DtEmptyState, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      components: {
        DtIllustration,
        DtIcon,
      },
    });

    await vi.dynamicImportSettled();

    illustration = wrapper.find('[data-qa="dt-illustration"]');
    icon = wrapper.find('[data-qa="dt-icon"]');
    headerText = wrapper.find('.d-empty-state__header-text');
    bodyText = wrapper.find('.d-empty-state__body-text');
    bodySlot = wrapper.find('h2');
  };

  beforeEach(async () => {
    await updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the header text', () => {
      expect(headerText.text()).toBe(MOCK_HEADER_TEXT);
    });

    it('Should render the body text', () => {
      expect(bodyText.text()).toBe(MOCK_BODY_TEXT);
    });

    it('Should render the custom body slot', () => {
      expect(bodySlot.html()).toBe(MOCK_BODY_SLOT);
    });

    it('Should render size classes in wrapper', () => {
      expect(wrapper.classes().includes('d-empty-state', 'd-empty-state--size-lg')).toBe(true);
    });

    it('Should render correct headline classes in header text', () => {
      expect(headerText.classes().includes('d-headline--xxl')).toBe(true);
    });

    it('Should render correct body classes in body text', () => {
      expect(bodyText.classes().includes('d-body--md')).toBe(true);
    });
  });

  describe('Interactivity Tests', () => {
    describe('On size change', () => {
      it('Should update size classes in wrapper', () => {
        mockProps = { size: 'md' };

        updateWrapper();

        expect(wrapper.classes().includes('d-empty-state--size-md')).toBe(true);
      });

      it('Should update headline classes in header text', () => {
        mockProps = { size: 'md' };

        updateWrapper();

        headerText = wrapper.find('.d-empty-state__header-text');

        expect(headerText.classes().includes('d-headline--xl')).toBe(true);
      });

      it('Should update body classes in body text', () => {
        mockProps = { size: 'md' };

        updateWrapper();

        bodyText = wrapper.find('.d-empty-state__body-text');

        expect(bodyText.classes().includes('d-body--sm')).toBe(true);
      });
    });

    describe('With illustration and icon provided', () => {
      beforeEach(() => {
        mockSlots = {
          illustration: MOCK_ILLUSTRATION_SLOT,
          icon: MOCK_ICON_SLOT,
        };
      });

      it('Should render illustration component on `lg` size and not icon', () => {
        mockProps = { size: 'lg' };

        updateWrapper();

        illustration = wrapper.find('[data-qa="dt-illustration"]');
        icon = wrapper.find('[data-qa="dt-icon"]');

        expect(illustration.exists()).toBe(true);
        expect(icon.exists()).toBe(false);
      });

      it('Should render illustration component on `md` size and not icon', () => {
        mockProps = { size: 'md' };

        updateWrapper();

        illustration = wrapper.find('[data-qa="dt-illustration"]');
        icon = wrapper.find('[data-qa="dt-icon"]');

        expect(illustration.exists()).toBe(true);
        expect(icon.exists()).toBe(false);
      });

      it('Should render icon component on `sm` size and not illustration', () => {
        mockProps = { size: 'sm' };

        updateWrapper();

        illustration = wrapper.find('[data-qa="dt-illustration"]');
        icon = wrapper.find('[data-qa="dt-icon"]');

        expect(illustration.exists()).toBe(false);
        expect(icon.exists()).toBe(true);
        expect(icon.attributes('data-name')).toBe('Accessibility');
      });
    });

    describe('With icon provided but not illustration', () => {
      beforeEach(() => {
        mockSlots = {
          icon: MOCK_ICON_SLOT,
        };
      });

      it('Should render icon component on `lg` size', () => {
        mockProps = { size: 'lg' };

        updateWrapper();

        illustration = wrapper.find('[data-qa="dt-illustration"]');
        icon = wrapper.find('[data-qa="dt-icon"]');

        expect(illustration.exists()).toBe(false);
        expect(icon.exists()).toBe(true);
      });

      it('Should render icon component on `md` size', () => {
        mockProps = { size: 'md' };

        updateWrapper();

        illustration = wrapper.find('[data-qa="dt-illustration"]');
        icon = wrapper.find('[data-qa="dt-icon"]');

        expect(illustration.exists()).toBe(false);
        expect(icon.exists()).toBe(true);
      });

      it('Should render icon component on `sm` size', () => {
        mockProps = { size: 'sm' };

        updateWrapper();

        illustration = wrapper.find('[data-qa="dt-illustration"]');
        icon = wrapper.find('[data-qa="dt-icon"]');

        expect(illustration.exists()).toBe(false);
        expect(icon.exists()).toBe(true);
      });
    });
  });

  describe('Validation Tests', () => {
    describe('With no bodyText or body slot provided', () => {
      it('Should console.error', () => {
        const message = `DtEmptyState: You should provide either bodyText or content on body slot.`;

        let consoleError = vi.spyOn(console, 'error').mockClear();

        mockProps = { bodyText: undefined };
        mockSlots = { body: '' };

        updateWrapper();

        expect(consoleError).toHaveBeenCalledWith(message);

        consoleError = null;
        console.error.mockRestore();
      });
    });
  });
});
