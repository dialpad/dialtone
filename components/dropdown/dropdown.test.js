import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtDropdown from './dropdown.vue';
import sinon from 'sinon';

// Constants
const basePropsData = {
  open: true,
};

const baseSlots = {
  anchor: '<a href="#" id="anchor">Link</a>',
  list: `<ul id="list">
    <li role="menuitem">1</li>
    <li role="menuitem">2</li>
    <li role="menuitem">3</li>
  </ul>`,
};

describe('Dialtone Vue Dropdown Tests', function () {
  // Wrappers
  let wrapper;
  let anchorElement;
  let listWrapper;

  // Environment
  let propsData = basePropsData;
  let slots = baseSlots;
  let scopedSlots = {};
  let listeners;
  let selectStub;
  let escapeStub;
  let highlightStub;

  // Helpers
  const _setChildWrappers = () => {
    anchorElement = wrapper.find('#anchor');
    listWrapper = wrapper.find('[data-qa="dt-dropdown-list-wrapper"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtDropdown, {
      propsData,
      slots,
      scopedSlots,
      listeners,
      localVue: this.localVue,
      stubs: {
        transition: false,
      },
    });
    _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    slots = baseSlots;
    scopedSlots = {};
    listeners = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    // Test setup
    beforeEach(function () {
      _setWrappers();
    });

    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });

    describe('When a list is provided', function () {
      it('should render the list wrapper', function () { assert.isTrue(listWrapper.exists()); });
      it('should render the anchor', function () { assert.isTrue(anchorElement.exists()); });
      it('should render the list', function () { assert.isTrue(wrapper.find('#list').exists()); });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When the dropdown is not open', function () {
      // Test setup
      beforeEach(function () {
        propsData = {
          ...basePropsData,
          open: false,
        };
        _setWrappers();
      });

      it('aria-expanded should be "false"', function () {
        assert.isTrue(anchorElement.attributes('aria-expanded') === 'false');
      });
    });

    describe('When the dropdown is open', function () {
      // Test setup
      beforeEach(function () {
        scopedSlots = {
          anchor: `<a href="#" id="anchor" v-bind="props.attrs">Link</a>`,
        };
        _setWrappers();
      });

      it('aria-expanded should be "true"', function () {
        _setWrappers();
        assert.isTrue(anchorElement.attributes('aria-expanded') === 'true');
      });
    });
  });

  describe('Interactivity Tests', function () {
    // Test setup
    beforeEach(function () {
      selectStub = sinon.stub();
      escapeStub = sinon.stub();
      highlightStub = sinon.stub();
      listeners = { select: selectStub, escape: escapeStub, highlight: highlightStub };
      _setWrappers();
    });

    describe('When the dropdown is open and "Enter" key is pressed but no item is highlighted', function () {
      beforeEach(async function () {
        await wrapper.setData({ highlightIndex: -1 });
        await wrapper.trigger('keydown.enter');
      });

      it('should not emit select event', function () { assert.isUndefined(wrapper.emitted().select); });
      it('should not call listener', function () { assert.isFalse(selectStub.called); });
    });

    describe('When the dropdown is open and "Enter" key is pressed when an item is highlighted', function () {
      beforeEach(async function () {
        await wrapper.setData({ highlightIndex: 1 });
        await wrapper.trigger('keydown.enter');
      });

      it('should emit select event', function () { assert.equal(wrapper.emitted().select.length, 1); });
      it('should call listener', function () { assert.isTrue(selectStub.called); });
    });

    describe('When the dropdown is closed and "Enter" key is pressed', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: false });
        await wrapper.trigger('keydown.enter');
      });

      it('should not emit select event', function () { assert.isUndefined(wrapper.emitted().select); });
      it('should not call listener', function () { assert.isFalse(selectStub.called); });
    });

    describe('When "Esc" key is pressed', function () {
      beforeEach(async function () {
        await wrapper.trigger('keydown.esc');
      });

      it('should call listener', function () { assert.isTrue(escapeStub.called); });
      it('should emit escape event', function () { assert.equal(wrapper.emitted().escape.length, 1); });
    });

    describe('When the highlightIndex changes', function () {
      beforeEach(async function () {
        wrapper.vm.setHighlightIndex(1);
        await wrapper.vm.$nextTick();
      });

      it('should call listener', function () { assert.isTrue(highlightStub.called); });
      it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 1); });
    });

    describe('When mouseleave is detected on the list wrapper', function () {
      // Test Setup
      beforeEach(async function () {
        await listWrapper.trigger('mouseleave');
      });

      it('should reset the highlightIndex', function () { assert.equal(wrapper.vm.highlightIndex, -1); });
    });
  });
});
