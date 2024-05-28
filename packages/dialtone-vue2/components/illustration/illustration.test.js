import DtIllustration from './illustration.vue';
import { mount } from '@vue/test-utils';

const baseProps = { name: 'mind' };

let mockProps = {};

describe('DtIllustration Tests', () => {
  let wrapper;
  let illustration;

  const updateWrapper = async () => {
    wrapper = mount(DtIllustration, {
      propsData: { ...baseProps, ...mockProps },
    });
    await vi.dynamicImportSettled();

    illustration = wrapper.find('[data-qa="dt-illustration"]');
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
      expect(illustration.classes().includes('d-illustration--mind')).toBe(true);
    });
  });
});
