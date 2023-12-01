import { createLocalVue, mount } from '@vue/test-utils';
import DtCodeblock from './codeblock.vue';

const baseProps = {
  text: '',
};

let mockProps = {};
const testContext = {};
describe('DtCodeblock Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtCodeblock, {
      propsData: { ...baseProps, ...mockProps },
      localVue: testContext.localVue,
    });
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should exist', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render preformatted code block', () => {
      const preElement = wrapper.find('pre');

      expect(preElement.exists()).toBe(true);

      const codeElement = preElement.find('code');

      expect(codeElement.exists()).toBe(true);
    });

    describe('When text prop is set', () => {
      it('should render preformatted text in codeblock', async () => {
        const text = 'function someFunction() {\n  return 1;\n}';

        await wrapper.setProps({ text });

        const codeElement = wrapper.find('code');

        expect(codeElement.text()).toEqual(text);
      });
    });
  });
});
