import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import DtCodeblock from './codeblock.vue';

// Constants
const baseProps = {
  text: '',
};

describe('DtCodeblock Tests', function () {
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

  describe('Presentation Tests', function () {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */
    beforeEach(function () { _setWrappers(); });

    it('should exist', function () { assert.isTrue(wrapper.exists()); });
    it('should render preformatted code block', function () {
      const preElement = wrapper.find('pre');
      assert.isTrue(preElement.exists());
      const codeElement = preElement.find('code');
      assert.isTrue(codeElement.exists());
    });

    describe('When text prop is set', function () {
      const text = 'function someFunction() {\n  return 1;\n}';
      beforeEach(async function () {
        await wrapper.setProps({ text });
      });
      it('should render preformatted text in codeblock', function () {
        const codeElement = wrapper.find('code');
        assert.equal(codeElement.text(), text);
      });
    });
  });
});
