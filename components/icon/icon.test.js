import { createLocalVue, mount } from '@vue/test-utils';
import { assert } from 'chai';
import DtIcon from './icon.vue';

const basePropsData = {
  name: 'accessibility',
};

describe('DtIcon Tests', function () {
  let wrapper;
  let icon;

  const _setWrappers = () => {
    wrapper = mount(DtIcon,
      {
        propsData: basePropsData,
        localVue: this.localVue,
      });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    icon = wrapper.findComponent(DtIcon);
  };

  before(function () {
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    _setWrappers();
  });

  describe('Presentation Tests', function () {
    it('Should render the accessibility icon', function () {
      assert.exists(wrapper, 'wrapper exists');
      assert.isTrue(icon.exists());
      assert.isTrue(icon.classes('d-icon--accessibility'));
    });

    describe('When size prop is not set', function () {
      it('Should have default class', function () {
        assert.isTrue(icon.classes('d-icon--size-500'));
      });
    });

    describe('When size prop is set', function () {
      beforeEach(async function () {
        await wrapper.setProps({ size: '800' });
      });

      it('Should have correct class', function () {
        assert.isTrue(icon.classes('d-icon--size-800'));
      });
    });
  });

  describe('Interactivity Tests', function () {
    //
  });

  describe('Extendability Tests', function () {
    //
  });

  describe('Accessibility Tests', function () {
    describe('When ariaLabel prop is set', function () {
      beforeEach(async function () {
        await wrapper.setProps({ ariaLabel: 'icon description' });
        _setChildWrappers();
      });
      it('sets the aria-label attribute', function () {
        assert.strictEqual(icon.attributes('aria-label'), 'icon description');
      });
      it('sets aria-hidden to false', function () {
        assert.strictEqual(icon.attributes('aria-hidden'), 'false');
      });
    });
  });
});
