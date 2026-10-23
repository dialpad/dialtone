import { mount } from '@vue/test-utils';
import DtCodeblock from './Codeblock.vue';

const baseProps = {
  text: '',
};

let mockProps = {};
describe('DtCodeblock Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtCodeblock, {
      props: { ...baseProps, ...mockProps },
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
      const preElement = wrapper.find('[data-qa="dt-codeblock"]');

      expect(preElement.exists()).toBe(true);
      expect(preElement.element.tagName).toBe('PRE');

      const codeElement = preElement.find('[data-qa="dt-codeblock-code"]');

      expect(codeElement.exists()).toBe(true);
      expect(codeElement.element.tagName).toBe('CODE');
    });

    describe('When text prop is set', () => {
      it('should render preformatted text in codeblock', async () => {
        const text = ' \nfunction someFunction() {\n  return 1;\n}\n ';

        await wrapper.setProps({ text });

        const preElement = wrapper.find('[data-qa="dt-codeblock"]');
        const codeElement = wrapper.find('[data-qa="dt-codeblock-code"]');

        expect(codeElement.element.textContent).toBe(text);
        expect(preElement.element.textContent).toBe(text);
      });
    });

    describe('When bordered prop is true', () => {
      it('should add the bordered class to the pre element', async () => {
        await wrapper.setProps({ bordered: true });
        expect(wrapper.find('[data-qa="dt-codeblock"]').classes()).toContain('d-codeblock--bordered');
      });
    });

    describe('When size prop is set', () => {
      it('should apply the size modifier class to the code element', async () => {
        await wrapper.setProps({ size: 'lg' });
        expect(wrapper.find('[data-qa="dt-codeblock-code"]').classes()).toContain('d-codeblock__code--lg');
      });
    });

    describe('When size prop is numeric', () => {
      it('should apply the correct size modifier class', async () => {
        await wrapper.setProps({ size: 400 });
        expect(wrapper.find('[data-qa="dt-codeblock-code"]').classes()).toContain('d-codeblock__code--lg');
      });
    });
  });
});
