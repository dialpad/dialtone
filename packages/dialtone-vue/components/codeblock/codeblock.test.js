import { mount } from '@vue/test-utils';
import DtCodeblock from './codeblock.vue';

const baseProps = {
  text: '',
};

let mockProps = {};
describe('DtCodeblock Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtCodeblock, {
      propsData: { ...baseProps, ...mockProps },
    });
  };

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

    describe('When bordered prop is true', () => {
      it('should add the bordered class to the pre element', async () => {
        await wrapper.setProps({ bordered: true });
        expect(wrapper.find('pre').classes()).toContain('d-codeblock--bordered');
      });
    });

    describe('When size prop is set', () => {
      it('should apply the size modifier class to the code element', async () => {
        await wrapper.setProps({ size: 'lg' });
        expect(wrapper.find('code').classes()).toContain('d-codeblock__code--lg');
      });
    });
  });
});
