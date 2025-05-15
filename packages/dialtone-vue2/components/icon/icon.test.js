import DtIcon from './icon.vue';
import { mount } from '@vue/test-utils';
import { useI18N } from '@dialpad/i18n-vue2';
const { $t } = useI18N();

const MOCK_LOCALIZED_ARIA_LABEL = $t('DIALTONE_ICON_ACCESSIBILITY');

const baseProps = { name: 'accessibility' };

let mockProps = {};

describe('DtIcon Tests', () => {
  let wrapper;
  let icon;

  const updateWrapper = async () => {
    wrapper = mount(DtIcon, {
      propsData: { ...baseProps, ...mockProps },
    });
    await vi.dynamicImportSettled();

    icon = wrapper.find('[data-qa="dt-icon"]');
  };

  beforeEach(async () => {
    await updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the accessibility icon', () => {
      expect(wrapper).toBeDefined();
      expect(icon.classes().includes('d-icon--accessibility')).toBe(true);
    });

    describe('When size prop is not set', () => {
      it('Should have default class', () => {
        expect(icon.classes().includes('d-icon--size-500')).toBe(true);
      });
    });

    describe('When size prop is set', () => {
      it('Should have correct class', async () => {
        mockProps = { size: '800' };

        await updateWrapper();

        expect(icon.classes().includes('d-icon--size-800')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('sets aria-hidden to false', () => {
      expect(icon.attributes()['aria-hidden']).toBe('false');
    });

    it('sets aria-label to localized string', () => {
      expect(icon.attributes()['aria-label']).toBe(MOCK_LOCALIZED_ARIA_LABEL);
    });
  });
});
