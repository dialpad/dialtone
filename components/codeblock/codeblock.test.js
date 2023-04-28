import { shallowMount } from '@vue/test-utils';
import DtCodeblock from './codeblock.vue';

// Constants
const baseProps = {
  text: '',
};

describe('DtCodeblock Tests', () => {
  // Wrappers
  let wrapper;

  // Environment
  let props = baseProps;

  const _setWrappers = () => {
    wrapper = shallowMount(DtCodeblock, { props });
  };

  // Teardown
  afterEach(function () {
    props = baseProps;
  });

  describe('Presentation Tests', () => {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */
    beforeEach(() => { _setWrappers(); });

    it('should exist', () => { expect(wrapper.exists()).toBe(true); });
    it('should render preformatted code block', () => {
      const preElement = wrapper.find('pre');
      expect(preElement.exists()).toBe(true);
      const codeElement = preElement.find('code');
      expect(codeElement.exists()).toBe(true);
    });

    describe('When text prop is set', () => {
      const text = 'function someFunction() {\n  return 1;\n}';
      beforeEach(async () => {
        await wrapper.setProps({ text });
      });
      it('should render preformatted text in codeblock', () => {
        const codeElement = wrapper.find('code');
        expect(codeElement.text()).toEqual(text);
      });
    });
  });
});
