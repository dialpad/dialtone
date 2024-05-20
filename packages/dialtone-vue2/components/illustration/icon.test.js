import DtIcon from './illustration.vue';
import { mount } from '@vue/test-utils';

const baseProps = { name: 'mind' };

let mockProps = {};

describe('DtIllustration Tests', () => {
  let wrapper;
  let icon;

  const updateWrapper = async () => {
    wrapper = mount(DtIcon, {
      propsData: { ...baseProps, ...mockProps },
    });
    await vi.dynamicImportSettled();

    icon = wrapper.find('[data-qa="dt-illustration"]');
  };

  beforeEach(async () => {
    await updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the mind illustration', () => {
      expect(wrapper).toBeDefined();
      expect(icon.classes().includes('d-illustration--mind')).toBe(true);
    });
  });
});
